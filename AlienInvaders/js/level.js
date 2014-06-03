
  var levelData = { 
     1:  [[0,0,0,0,0,0,0,4,0,0,0],
          [0,0,1,0,2,0,0,0,0,3,0],
          [0,3,0,0,0,2,0,0,1,0,0],
          [0,0,1,0,0,0,0,3,0,2,0],
          [0,0,0,0,3,0,1,0,0,3,0],
          [3,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0]],
     2:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,1,1,0,0,0,2,0,0,0],
          [0,1,0,0,0,0,2,0,0,2,0],
          [0,1,0,1,1,0,2,0,0,2,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0]],
    3:   [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,1,1,1,0,0,2,2,0,0],
          [0,1,0,0,0,0,2,0,0,2,0],
          [0,1,0,1,1,0,2,0,0,2,0],
          [0,0,1,1,1,0,0,2,2,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,4,0,0,4,0,0,0,0,0,0],
          [0,0,0,3,0,0,3,0,3,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0]]  };

//these are the levels

  var spriteData = {
    'bird1': { sx: 0,  sy: 0,  w: 62, h: 48, cls: Bird, frames: 13 },
    'bird2': { sx: 0,  sy: 48, w: 62, h: 48, cls: Bird, frames: 13 },
    'bird3': { sx: 0,  sy: 96, w: 62, h: 48, cls: Bird, frames: 13 },
    'bird4': { sx: 0,  sy: 144, w: 62, h: 48, cls: Bird, frames: 13 },  
    'player': { sx: 0,  sy: 264, w: 48, h: 108, cls: Player, frames: 10 },
    'playerleft': { sx: 0,  sy: 370, w: 48, h: 108, cls: Player, frames: 10 },
    'worms': { sx: 0,  sy: 192, w: 13,  h: 40, cls: Worms },
    'poop': { sx: 0,  sy: 233, w: 13,  h: 29, cls: Poop }
  }  //'sy' is the position (pixels) on sprite sheet, sy picks up what it looks like
         //w = width of actual image and 'h' is height

  //frames - how many different images of the same image (movement of objects)
  
  function startGame() {
    var screen = new GameScreen("Hungry Birds","(press space to start)",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
      
    Game.loadBoard(screen);
    Game.loop();
  }

  function endGame() {
          $('#gameboard').css("background-image", "url(images/background.png)");  //change for end game background img change

    var screen = new GameScreen("","",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }


  function winGame() {
    var screen = new GameScreen("You Win!","(press space to restart)",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }

  $(function() {
    GameAudio.load({ 'fire' : 'media/baz.ogg', 'die' : 'media/yummy.ogg' }, 
                   function() { 
                       Game.initialize("#gameboard", levelData, spriteData,
                                      { "start": startGame,
                                        "die"  : endGame,
                                        "win"  : winGame });
                   }); //sounds it makes when things happen
   }); //audacity, make sound, export selection as .ogg



