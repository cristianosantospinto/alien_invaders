  var BirdFlock = function BirdFlock() {
  this.invulnrable = true;
  this.dx = 10; this.dy = 0;
  this.hit = 1; this.lastHit = 0;
  this.speed = 10; //speed of game

  this.draw = function() {};

  this.die = function() {
    if(Game.board.nextLevel()) {
      Game.loadBoard(new GameBoard(Game.board.nextLevel())); 
    } else {
      Game.callbacks['win']();
    }
  }

  this.step = function(dt) { 
    if(this.hit && this.hit != this.lastHit) {
      this.lastHit = this.hit;
      this.dy = this.speed;
    } else {
      this.dy=0;
    }
    this.dx = this.speed * this.hit;

    var max = {}, cnt = 0;
    this.board.iterate(function() {
      if(this instanceof Bird)  {
        if(!max[this.x] || this.y > max[this.x]) {
          max[this.x] = this.y; 
        }
        cnt++;
      } 
    });

    if(cnt == 0) { this.die(); } 

    this.max_y = max;
    return true;
  };

}

var Bird = function Bird(opts) {
  this.flock = opts['flock'];
  this.frame = 0;
  this.mx = 0;
}

Bird.prototype.draw = function(canvas) {
  Sprites.draw(canvas,this.name,this.x,this.y,this.frame); //draws alien
}

Bird.prototype.die = function() {
  GameAudio.play('die');
  this.flock.speed += 1;
  this.board.remove(this);
} //everytime you kill an alien it moves +1 quicker - game gets harder


Bird.prototype.step = function(dt) {
  this.mx += dt * this.flock.dx;
  this.y += this.flock.dy;
  if(Math.abs(this.mx) > 10) {
    if(this.y == this.flock.max_y[this.x]) {
      this.fireSometimes();
    }
    this.x += this.mx;
    this.mx = 0;
    this.frame = (this.frame+1) % 13; // the 13 suggests how many frames for alien
    if(this.x > Game.width - Sprites.map.bird1.w * 2) this.flock.hit = -1;
    if(this.x < Sprites.map.bird1.w) this.flock.hit = 1;
  }
  return true;
}

Bird.prototype.fireSometimes = function() {
      if(Math.random()*100 < 10) {
        this.board.addSprite('worms',this.x + this.w/2 - Sprites.map.worms.w/2,
                                      this.y + this.h, 
                                     { dy: 100 });
      }

    //random missile fire, if you want to make more missiles add another
}

var Player = function Player(opts) { 
  this.reloading = 0;
  this.frame = 0;
  this.counter = 0;
   
 
}



Player.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'player',this.x,this.y,this.frame); //draws player
   
}


Player.prototype.die = function() {
  GameAudio.play('die');
  Game.callbacks['die']();
}

Player.prototype.step = function(dt) { 
  if(Game.keys['left']) { this.x -= 100 * dt; this.counter = (this.counter+1) % 10;
  if (this.counter == 9){this.frame=(this.frame+1)%10}
  console.log(this.frame) }
  if(Game.keys['right']) { this.x += 100 * dt; this.counter = (this.counter+1) % 10;
  if (this.counter == 9){this.frame=(this.frame+1)%10}
  console.log(this.frame) }


  if(this.x < 0) this.x = 0;
  if(this.x > Game.width-this.w) this.x = Game.width-this.w; //control of left and right it gets its value from level.js
   


  this.reloading--;

  if(Game.keys['fire'] && this.reloading <= 0 && this.board.worms < 1) { //amount of bullets before reload <1
    GameAudio.play('fire'); //make noise when fire
    this.board.addSprite('worms',
                          this.x + this.w/2 - Sprites.map.worms.w/2,
                          this.y-this.h,
                          { dy: -100, player: true });
    this.board.worms++;
    this.reloading = 10;
  }
  return true;
}


var Worms = function Worms(opts) {
   this.dy = opts.dy;
   this.player = opts.player;
}

Worms.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'worms',this.x,this.y); //draws missile
}

Worms.prototype.step = function(dt) {
   this.y += this.dy * dt;

   var enemy = this.board.collide(this);
   if(enemy) { 
     enemy.die();
     return false;
   }
   return (this.y < 0 || this.y > Game.height) ? false : true;
}

Worms.prototype.die = function() {
  if(this.player) this.board.worms--;
  if(this.board.worms < 0) this.board.worms=0;
   this.board.remove(this);
}

 

//Var playGame = function() {
   // var board = new GameBoard();
   // board.add(new Player());
   // board.add(new Level(level1,winGame));
   // Game.setBoard(3,board);
  //  Game.setBoard(5,new GamePoints(0)));
//};


