// Enemies our player must avoid
class MovingObjects{
  constructor(name){
    this.sprite='images/'+name+'.png';
    this.name=name;
    this.speed=randomInt(70,300);
    this.x=-150;
  }

  placeInColumns(first=70,second=150,third=230){
    let columnPlacement= randomInt(1,3);
    switch (columnPlacement) {
      case 1:
        this.y=first;
        break;
      case 2:
        this.y=second;
        break;
      default:
        this.y=third;
    }
  }

  update(dt){
    this.x+=dt*this.speed;
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
  }

  render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

class Enemies extends MovingObjects{

}

class Gems extends MovingObjects{
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,60,80);
  }
}
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

// Draw the enemy on the screen, required method for game


class Players{
  constructor(fileName){
    this.sprite='images/'+fileName+'.png';
  }

  startingPosition(){
    this.x=101*2;
    this.y=4*83+83/2;
  }

  update(){
    this.x=this.x;
    this.y=this.y;
  }

  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies

let allMovingObjects=[];
const gemValues=[
  'Gem-Blue',
  'Gem-Green',
  'Gem-Orange'
];

const gemIntervalID= window.setInterval(function(){
  let movingGemInstances= new Gems(gemValues[randomInt(0,2)]);  //generates gems randomly
  movingGemInstances.placeInColumns(125, 205, 285);
  allMovingObjects.push(movingGemInstances);
},3000);

const bugIntervalID=window.setInterval(function(){
  let movingBugsInstances= new Enemies('enemy-bug');
  movingBugsInstances.placeInColumns();
  allMovingObjects.push(movingBugsInstances);
},1000);

// Place the player object in a variable called player
const player= new Players('char-boy');
player.startingPosition();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

     player.handleInput(allowedKeys[e.keyCode]);
});

//returns a random integer between min-max inclusive
function randomInt(min, max){
  return Math.floor(Math.random()*(max-min+1)+min);
}
