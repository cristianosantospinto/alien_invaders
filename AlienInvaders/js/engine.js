var Game = new function() {                                                                  
  var KEY_CODES = { 37:'left', 39:'right', 32 :'fire' };
  this.keys = {};
                   //key codes is letter on keyboard - type into google (e.g: 66=B)

  this.initialize = function(canvas_dom,level_data,sprite_data,callbacks) {
    this.canvas_elem = $(canvas_dom)[0];
    this.canvas = this.canvas_elem.getContext('2d');
    this.width = $(this.canvas_elem).attr('width');
    this.height= $(this.canvas_elem).attr('height');

    $(window).keydown(function(event) {
      if(KEY_CODES[event.keyCode]) Game.keys[KEY_CODES[event.keyCode]] = true;
    });

    $(window).keyup(function(event) {
      if(KEY_CODES[event.keyCode]) Game.keys[KEY_CODES[event.keyCode]] = false;
    });

    this.level_data = level_data;
    this.callbacks = callbacks;
    Sprites.load(sprite_data,this.callbacks['start']);
  };

  this.loadBoard = function(board) { Game.board = board; };

  this.loop = function() { 
    Game.board.step(30/1000); 
    Game.board.render(Game.canvas);
    setTimeout(Game.loop,10);
  };
    
    //make game fast, number after loop
};

var Sprites = new function() {
  this.map = { }; 

  this.load = function(sprite_data,callback) { //spriteData links rectangles of sprites to names
    this.map = sprite_data;
    this.image = new Image();
    this.image.onload = callback; //callback passes as a call back to the image onload method
    this.image.src = 'images/sprites.png';
  };
    
    //sprites is the images used
    

  this.draw = function(canvas,sprite,x,y,frame) { //'draw' draws everything together, takes as parameters the context, strings specifying name of sprite from spriteData, x & y to draw sprite, and optional frame for sprites with multiple frames
    var s = this.map[sprite]; 
    if(!frame) frame = 0;
    canvas.drawImage(this.image, s.sx + frame * s.w, s.sy, s.w, s.h, x,y, s.w, s.h);
  }; //map of sprite names to their locations make easier to draw the sprites on the screen
}
//every frame has to be same size and on the same line

var GameScreen = function GameScreen(text,text2,callback) {
  this.step = function(dt) {
    if(Game.keys['fire'] && callback) callback();
  }; 
   


  this.render = function(canvas) {
    canvas.clearRect(0,0,Game.width,Game.height);
    canvas.font = "bold 120px Avenir";              //size of main text
    var measure = canvas.measureText(text);  
    canvas.fillStyle = "#FFFFFF";
    canvas.fillText(text,Game.width/2 - measure.width/2,Game.height/2);
    canvas.font = "bold 30px Avenir";
    var measure2 = canvas.measureText(text2);
    canvas.fillText(text2,Game.width/2 - measure2.width/2,Game.height/2 + 70); //space height between text
      //var TitleScreen = function TitleScreen(title,subtitle,callback) {
        //  this.step = function(dt) {
          //    if(Game.keys['fire'] && callback) callback();
  };
};

var GameBoard = function GameBoard(level_number) {
  this.removed_objs = [];
  this.worms = 0;
  this.level = level_number;
  var board = this;
    
if (level_number == 1){$('#gameboard').css("background-image", "url(images/sprites.png)")};
    //if (level_number == 1){javascript goes in here} 
    //== means equals, = is
if (level_number == 2){$('#gameboard').css("background-image", "url(images/background.png)")};
    

  this.add =    function(obj) { obj.board=this; this.objects.push(obj); return obj; };
  this.remove = function(obj) { this.removed_objs.push(obj); };

  this.addSprite = function(name,x,y,opts) {
    var sprite = this.add(new Sprites.map[name].cls(opts));
    sprite.name = name;
    sprite.x = x; sprite.y = y;
    sprite.w = Sprites.map[name].w; 
    sprite.h = Sprites.map[name].h;
    return sprite;
  };
  

  this.iterate = function(func) {
     for(var i=0,len=this.objects.length;i<len;i++) {
       func.call(this.objects[i]);
     }
  };

  this.detect = function(func) {
    for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
      if(func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };

  this.step = function(dt) { 
    this.removed_objs = [];
    this.iterate(function() { 
        if(!this.step(dt)) this.die();
    }); 

    for(var i=0,len=this.removed_objs.length;i<len;i++) {
      var idx = this.objects.indexOf(this.removed_objs[i]);
      if(idx != -1) this.objects.splice(idx,1);
    }
  };

  this.render = function(canvas) {
    canvas.clearRect(0,0,Game.width,Game.height);
    this.iterate(function() { this.draw(canvas); });
  };

  this.collision = function(o1,o2) {
    return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
             (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
  };

  this.collide = function(obj) {
    return this.detect(function() {
      if(obj != this && !this.invulnrable)
       return board.collision(obj,this) ? this : false;
    });
  };

  this.loadLevel = function(level) {
    this.objects = [];
    this.player = this.addSprite('player', // Sprite
                                 Game.width/2, // X
                                 Game.height - Sprites.map['player'].h - 10); // Y
      
 //this.loadLevel = function(level) {
   // this.objects = [];
    //this.playerleft = this.addSprite('playerleft', // Sprite
                                // Game.width/2, // X
                                 //Game.height - Sprites.map['playerleft'].h - 10); // Y
        

    var flock = this.add(new BirdFlock());   //draws flock
    for(var y=0,rows=level.length;y<rows;y++) {
      for(var x=0,cols=level[y].length;x<cols;x++) {
        var bird = Sprites.map['bird' + level[y][x]];
        if(bird) { 
          this.addSprite('bird' + level[y][x], // Which Sprite
                         (bird.w+10)*x,  // X
                         bird.h*y,       // Y
                         { flock: flock }); // Options
        }
      }
    }
  };

  this.nextLevel = function() { 
    return Game.level_data[level_number + 1] ? (level_number + 1) : false 
  };
 
  this.loadLevel(Game.level_data[level_number]);
};

var GameAudio = new function() {
  this.load_queue = [];
  this.loading_sounds = 0;
  this.sounds = {};

  var channel_max = 10;		
  audio_channels = new Array();
  for (a=0;a<channel_max;a++) {	
    audio_channels[a] = new Array();
    audio_channels[a]['channel'] = new Audio(); 
    audio_channels[a]['finished'] = -1;	
  }

  this.load = function(files,callback) {
    var audioCallback = function() { GameAudio.finished(callback); }

    for(name in files) {
      var filename = files[name];
      this.loading_sounds++;
      var snd = new Audio();
      this.sounds[name] = snd;
      snd.addEventListener('canplaythrough',audioCallback,false);
      snd.src = filename;
      snd.load();
    }
  };
    
//Var GamePoints = function() {
//Game.points = 0;
     // var pointsLength = 8;
       // this.draw = function(canvas) {
         //   canvas.save();
            
         //   canvas.font = "bold 16px arial";  //style
         //   canvas.fillStyle= "#FFFFFF";
            
         //   var txt = "" + Game.points;
            
          //  var i = pointsLength - txt.length, zeros = "";
          //  while(i-- > 0) ( zeros += "0"; )
                
          //  canvas.fillText(zeros + txt,10,20);
            
          //  canvas.restore();
      //  }
      //  this.step = function(dt) { } //score sheet top left corner, current score stored on Fobject in property named points. For every frame game grabs current score and pads it with leading zeros so that's always pointsLength long, then calls fillText to draw the points 
    

  this.finished = function(callback) {
    this.loading_sounds--;
    if(this.loading_sounds == 0) {
      callback();
    }
  };

  this.play = function(s) {
    for (a=0;a<audio_channels.length;a++) {
      thistime = new Date();
      if (audio_channels[a]['finished'] < thistime.getTime()) {	
        audio_channels[a]['finished'] = thistime.getTime() + this.sounds[s].duration*1000;
        audio_channels[a]['channel'].src = this.sounds[s].src;
        audio_channels[a]['channel'].load();
        audio_channels[a]['channel'].play();
        break;
      }
    }
  };
    
    
};

