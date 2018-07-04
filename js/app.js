// This is the parent class, enemies and gems will inherit from here
class MovingObjects{
  constructor(name){
    this.sprite='images/'+name+'.png';
    this.name=name;
    this.speed=randomInt(70,300);
    this.x=-150;
  }

  placeInColumns(yDisplacement){ //this is to generate placement in columns randomly
    this.startingY=yDisplacement;  //this value is to center the image on every column (player uses it as well)
    let columnPlacement= randomInt(1,3);
    this.y=yDisplacement+83*columnPlacement;
  }

  update(dt){
    this.x+=dt*this.speed;
  }

  render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  checkCollisions(){
      let x=(this.name==='enemy-bug')?65:45;  //collision threshold for x
      if ((Math.abs(this.x-player.x)<x) && (Math.abs(this.y-player.y)===Math.abs(this.startingY-player.startingY))){
        switch (this.name){
          case 'enemy-bug':
            player.startingPositionOnGame();
            return false;
          case 'Gem-Blue':
            console.log('blue');
            break;
          case 'Gem-Green':
            console.log('green');
            break;
          case 'Gem-Orange':
          console.log('orange');
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
        this.x-=(this.x!==0)?101:0;
        break;
      case 'right':
        this.x+=(this.x!==404)?101:0;
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
    this.x=101*2;
    this.y=this.startingY+4*83;
  }

  render(column=this.x/101){
    this.x=101*column;
    renderAll.call(this);
  }

  handleInput(keyPressed){
    switch (keyPressed) {
      case 'up':
        this.y-=(this.y>40)?83:0;
        break;
      case 'down':
        this.y+=(this.y<(4*83+83/2))?83:0;
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
    let movingBugsInstances= new Enemies('enemy-bug');
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
         player= new Players(avatar[selectedX/101]);
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
