let initial;
var Engine = (function(global) {

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 406;
    doc.body.appendChild(canvas);
    canvas.setAttribute('id','canvas');

    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        if (!initial){
          update(dt);
        }
        render();
        lastTime = now;

        win.requestAnimationFrame(main);
    }

    function init() {
        reset();
        lastTime = Date.now();
        initial=true;
        main();
    }


    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    function checkCollisions(){
      allMovingObjects.forEach(function(enemy, index){
        if (enemy.checkCollisions()){
          allMovingObjects.splice(index, 1);  //hchange
        }
      })
    }


    function updateEntities(dt) {
        allMovingObjects.forEach(function(enemy, index) {
            enemy.update(dt);
            //eliminates the only reference to the crossing objects to make them garbage collectible once the have crossed the screen
            if (enemy.x>canvas.width){
              let erased=allMovingObjects.splice(index, 1);
            }
        });
    }


    function clear(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }


    function render() {
         clear();
         if (initial){
           selector.render();
           allAvatar.forEach(function(player, index){
             player.render(index);
           })
         }
         else {
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

           for (row = 0; row < numRows; row++) {
               for (col = 0; col < numCols; col++) {

                   ctx.drawImage(Resources.get(rowImages[row]), col * columnWidth, row * rowHeight);
               }
           }

         renderEntities();
         }




    }


    function renderEntities() {
        allMovingObjects.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
        winKey.render();
    }

    function reset() {
        // noop
    }

    Resources.load([
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

function renderAll(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,this.sizeX=columnWidth,this.sizeY=200);
}
