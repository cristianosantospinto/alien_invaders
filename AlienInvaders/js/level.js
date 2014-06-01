
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
          [0,0,1,1,1,0,0,2,2,0,0],
          [0,1,0,0,0,0,2,0,0,2,0],
          [0,1,0,1,1,0,2,0,0,2,0],
          [0,0,1,1,1,0,0,2,2,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,4,0,0,4,0,0,0,0,0,0],
          [0,0,0,3,0,0,3,0,3,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0]] };

//these are the levels

  var spriteData = {
    'alien1': { sx: 0,  sy: 0,  w: 62, h: 48, cls: Alien, frames: 13 },
    'alien2': { sx: 0,  sy: 48, w: 62, h: 48, cls: Alien, frames: 13 },
    'alien3': { sx: 0,  sy: 96, w: 62, h: 48, cls: Alien, frames: 13 },
    'alien4': { sx: 0,  sy: 144, w: 62, h: 48, cls: Alien, frames: 13 },  
    'player': { sx: 0,  sy: 264, w: 48, h: 108, cls: Player, frames: 10 },
    'missile': { sx: 0,  sy: 192, w: 13,  h: 40, cls: Missile }
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
    var screen = new GameScreen("Game Over","(press space to restart)",
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
    GameAudio.load({ 'fire' : 'media/laser.ogg', 'die' : 'media/yummy.ogg' }, 
                   function() { 
                       Game.initialize("#gameboard", levelData, spriteData,
                                      { "start": startGame,
                                        "die"  : endGame,
                                        "win"  : winGame });
                   }); //sounds it makes when things happen
   }); //audacity, make sound, export selection as .ogg


