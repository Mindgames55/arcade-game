
var Engine = (function(global) {

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    function renderPlayerSelection(){
      clear();
      let avatar=[
        'char-boy',
        'char-cat-girl',
        'char-horn-girl',
        'char-pink-girl',
        'char-princess-girl'
      ];
      selector.render();
      for (let i=0;i<5;i++){
        let player= new Players(avatar[i]);
        avatar.splice(i,1,player);
      }
      avatar.forEach(function(player, index){
        player.render(index);
      })
      win.requestAnimationFrame(renderPlayerSelection);

    }


    function main() {

        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

          update(dt);
          render();

          lastTime = now;

        win.requestAnimationFrame(main);
    }

    function init() {
        reset();
        lastTime = Date.now();
        initial=true;
        renderPlayerSelection();
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
            //eliminates the only reference to the crossing objectst to make them garbage collectible once the have crossed the screen
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

                  ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
              }
          }

        renderEntities();


    }


    function renderEntities() {

        allMovingObjects.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }


    function reset() {
        // noop
    }

    Resources.load([
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
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);


    global.ctx = ctx;
})(this);


function renderAll(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y,this.sizeX=101,this.sizeY=200);
}
