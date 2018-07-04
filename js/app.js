const rowHeight=83;
const columnWidth=101;
// This is the parent class, enemies and gems will inherit from here
class MovingObjects{
  constructor(name){
    this.sprite='images/'+name+'.png';
    this.name=name;
    this.speed=randomInt(70,300);
    this.x=-100;  //intial position off screen
  }

  placeInColumns(yDisplacement){ //this is to generate placement in columns randomly
    this.startingY=yDisplacement;  //this value is to center the image on every column (player uses it as well)
    let columnPlacement= randomInt(1,3);
    this.y=yDisplacement+rowHeight*columnPlacement;
  }

  update(dt){
    this.x+=dt*this.speed;
  }

  render() {
      if (this.name!=='nothing'){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
      }
  }

  checkCollisions(){
      let x=(this.name==='enemy-bug')?65:45;  //collision threshold for x
      if ((Math.abs(this.x-player.x)<x) && (Math.abs(this.y-player.y)===Math.abs(this.startingY-player.startingY))){
        switch (this.name){
          case 'enemy-bug':
            player.startingPositionOnGame();
            return false;
          case 'Gem-Blue':
            points+=50;
            allMovingObjects.forEach(function(enemy,index){
              if (enemy.name==='enemy-bug'){
                allMovingObjects.splice(index,1);
              }
            });
            break;
          case 'Gem-Green':
          points+=100;
          allMovingObjects.forEach(function(enemy,index){
            if (enemy.name==='enemy-bug'){
              enemy.sprite='images/Star.png';
              enemy.name='Star';
              enemySprite='Star';
              setTimeout(function(){
                enemySprite='enemy-bug';
              },5000);
            }
          });
            break;
          case 'Gem-Orange':
          points+=500;
          allMovingObjects.forEach(function(enemy,index){
            if (enemy.name==='enemy-bug'){
              enemy.speed=0;
              enemySprite='nothing';
              setTimeout(function(){
                enemySprite='enemy-bug';
                enemy.speed=200;
              },5000);
            }
          });
          break;
          case 'Star':
          points+=1000;
        }
        return true;
      }
  }

}

class Enemies extends MovingObjects{

}

class Gems extends MovingObjects{
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,80,80);
  }
}

class Selector{
  constructor(fileName){
    this.sprite='images/'+fileName+'.png';
    this.x=0;
    this.y=310;
    this.sizeX=100;
    this.sizeY=90;
  }

  render(){
    renderAll.call(this);
  }

  handleInput(keyPressed){
    switch (keyPressed) {
      case 'left':
      console.log('left');
        this.x-=(this.x!==0)?columnWidth:0;
        break;
      case 'right':
        this.x+=(this.x!==404)?columnWidth:0;
        break;
      case 'enter':
      return this.x;
    }
  }

}

class Players{
  constructor(fileName){
    this.sprite='images/'+fileName+'.png';
    this.startingY=-30;
    this.y=300;
  }

  startingPositionOnGame(){
    this.x=columnWidth*2;
    this.y=this.startingY+4*rowHeight;
  }

  render(column=this.x/columnWidth){
    this.x=columnWidth*column;
    renderAll.call(this);
  }

  handleInput(keyPressed){
    switch (keyPressed) {
      case 'up':
        this.y-=(this.y>40)?rowHeight:0;
        break;
      case 'down':
        this.y+=(this.y<(4*rowHeight+rowHeight/2))?rowHeight:0;
        break;
      case 'left':
        this.x-=(this.x>=50.5)?50.5:0;
        break;
      case 'right':
        this.x+=(this.x<400)?50.5:0;
    }
  }
}


  let allMovingObjects=[];
  let enemySprite='enemy-bug';
  let points=0;

  const gemIntervalID= window.setInterval(function(){
    const gemValues=[
      'Gem-Blue',
      'Gem-Green',
      'Gem-Orange'
    ];
    let movingGemInstances= new Gems(gemValues[randomInt(0,2)]);  //generates gems randomly
    movingGemInstances.placeInColumns(41.5);
    allMovingObjects.push(movingGemInstances);
  },3000);

  const bugIntervalID=window.setInterval(function(){
    let movingBugsInstances= new Enemies(enemySprite);
    movingBugsInstances.placeInColumns(-20);
    allMovingObjects.push(movingBugsInstances);
  },1000);

  const allAvatar=[];
  const selector= new Selector('Selector');
  let avatar=[
    'char-boy',
    'char-cat-girl',
    'char-horn-girl',
    'char-pink-girl',
    'char-princess-girl'
  ];
  for (let i=0;i<avatar.length;i++){
    let player= new Players(avatar[i]);
    allAvatar.push(player);
  }
  let player;

  const moveChar= function(e){
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    }
    console.log(player.x);
    player.handleInput(allowedKeys[e.keyCode])
  }


  const selectChar= function (e) {
      var allowedKeys = {
          37: 'left',
          39: 'right',
          13: 'enter'
      };


       let selectedX=selector.handleInput(allowedKeys[e.keyCode]);
       if (selectedX!==undefined){
         document.removeEventListener('keyup',selectChar)
         player= new Players(avatar[selectedX/columnWidth]);
         player.startingPositionOnGame();
         initial=false;
         document.addEventListener('keyup', moveChar);
       }
  }

  document.addEventListener('keyup', selectChar );


//returns a random integer between min-max both inclusive
function randomInt(min, max){
  return Math.floor(Math.random()*(max-min+1)+min);
}
