let initial;
var Engine = (function(global) {

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    let header=document.createElement('div');
    header.innerHTML=`<h1>Select your avatar using  <img id='left-arrow' class="header-img" src="https://carwad.net/sites/default/files/cartoon-arrow-104409-6060131.png"></img> <img class="header-img" src="https://carwad.net/sites/default/files/cartoon-arrow-104409-6060131.png"></img>
                      Then press <img class="header-img" src="images/enter.png"></img></h1>`;
    header.className='header';
    doc.body.appendChild(header);

    canvas.width = 505;
    canvas.height = 306;
    doc.body.appendChild(canvas);
    canvas.setAttribute('id','canvas');

//runs when resources are ready
    function init() {
        lastTime = Date.now();
        initial=true;    //this variable will be true while the player is selecting his character, it is set to false to start the game and start instantianting the objects
        main();
    }

//repaints the screen (by calling update and render) using dt to give the animation illusion
    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        if (!initial){
          update(dt); //if initial===true no need to update objects position on screen
        }
        render();  //clears and repaint the canvas
        lastTime = now;

        win.requestAnimationFrame(main);
    }

    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

//check collision with every moving object (implemented as a method on every moving object)
    function checkCollisions(){
      allMovingObjects.forEach(function(enemy, index){
        if (enemy.checkCollisions()){ //returns true if the moving object is a collectible item and it removes it from the to-be-rendered objects array.
          allMovingObjects.splice(index, 1);
        }
      })
    }

    //update position of every object on the canvas
    function updateEntities(dt) {
        allMovingObjects.forEach(function(enemy, index) {
            enemy.update(dt);
            //eliminates the only reference to the crossing objects to make them garbage collectible once they have crossed the screen
            if (enemy.x>canvas.width){
              let erased=allMovingObjects.splice(index, 1);
            }
        });
    }

    function clear(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    function render() {
         clear();  //clears the canvas before repainting it
         if (initial){  //displays character selection menu
           selector.render();
           allAvatar.forEach(function(player, index){
             player.render(index);
           })
         }
         else {  //game on rendering
           canvas.height=606;
           var rowImages = [
                   'images/water-block.png',   // Top row is water
                   'images/stone-block.png',   // Row 1 of 3 of stone
                   'images/stone-block.png',   // Row 2 of 3 of stone
                   'images/stone-block.png',   // Row 3 of 3 of stone
                   'images/grass-block.png',   // Row 1 of 2 of grass
                   'images/grass-block.png'    // Row 2 of 2 of grass
               ],
               numRows = 6,
               numCols = 5,
               row, col;

           for (row = 0; row < numRows; row++) {  //background
               for (col = 0; col < numCols; col++) {
                   ctx.drawImage(Resources.get(rowImages[row]), col * columnWidth, row * rowHeight);
               }
           }

         renderEntities();
         }
    }

    function renderEntities() {  //renders all the entities (every object) on the screen
        allMovingObjects.forEach(function(crossingObject) {
            crossingObject.render();
        });
        allHearts.forEach(function(live) {
            live.render();
        });
        pointsCollected.render();
        player.render();
        winKey.render();
    }

    Resources.load([
        'images/Heart.png',
        'images/Star.png',
        'images/Selector.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Gem-Blue.png',
        'images/Gem-Green.png',
        'images/Gem-Orange.png',
        'images/stone-block.png',
        'images/Key.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
