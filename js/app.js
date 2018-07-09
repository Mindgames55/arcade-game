//global
const rowHeight=83;
const columnWidth=101;
let leadersOnArcade;
const leadersBoardBody=document.createElement('div');
let allMovingObjects=[];
let allHearts=[];
let enemySprite='enemy-bug';
let points=0;

if (typeof(Storage) !== "undefined"){
  if (JSON.parse(localStorage.getItem("leadersOnArcade"))!==null){
    leadersOnArcade=JSON.parse(localStorage.getItem("leadersOnArcade"));
  }
  else {
    leadersOnArcade=[];
    localStorage.setItem("leadersOnArcade", JSON.stringify(leadersOnArcade));
  }
}

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
            switch (removeLives()) {
              case 2:
                alert('You have one more live to spare, you can either keep collecting points or go for the key and win the game. Just keep in mind that if you choose keep playing and you die, you will loose all of your points :(');
                break;
              case 3:
                winOrLoose('LOST', 'NO');
            }
            return false;
          case 'Gem-Blue':
            pointsCollected.increasePoints(50);
            allMovingObjects.forEach(function(enemy,index){
              if (enemy.name==='enemy-bug'){
                allMovingObjects.splice(index,1);
              }
            });
            break;
          case 'Gem-Green':
          pointsCollected.increasePoints(100);
          allMovingObjects.forEach(function(enemy,index){
            if (enemy.name==='enemy-bug'){
              enemy.sprite='images/Star.png';  //turn enemies into collectible stars for 5seconds
              enemy.name='Star';
              enemySprite='Star';
              setTimeout(function(){
                enemySprite='enemy-bug';
              },5000);
            }
          });
            break;
          case 'Gem-Orange':
          pointsCollected.increasePoints(500);
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
          pointsCollected.increasePoints(1000);
        }
        return true;  //remove the collectible items once collected
      }
  }
}

class Gems extends MovingObjects{
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,80,80);
  }
}

class Hearts{
  constructor(x){
    this.y=-15;
    this.x=x;
    this.sprite='images/Heart.png';
  }

  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,50,70);
  }
}

class Points{
  constructor(){
    this.y=30;
    this.points=0;
    this.text='Points: 0';
  }

  increasePoints(points){
    this.points+=points;
    this.text=`Points: ${this.points}`;
  }

  render(){
    ctx.font= "30px serif";
    this.x=ctx.measureText(this.text).width;
    ctx.fillText(this.text,505-this.x,this.y);
  }
}

class Selector{
  constructor(fileName){
    this.sprite='images/'+fileName+'.png';
    this.x=0;
    this.y=10;
    this.sizeX=100;
    this.sizeY=90;
  }

  render(){
    renderAll.call(this);
  }

  handleInput(keyPressed){
    switch (keyPressed) {
      case 'left':
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
    this.startingY=-50;
    this.y=0;
  }

  startingPositionOnGame(){
    this.x=columnWidth*2;
    this.y=this.startingY+4*rowHeight;
  }

  render(column=this.x/columnWidth){
    this.x=columnWidth*column;
    renderAll.call(this);
  }

  checkIfWon(){
    if (this.x===winKey.x && this.y<0){
      winOrLoose('won', pointsCollected.points);
    }
  }

  handleInput(keyPressed){
    switch (keyPressed) {
      case 'up':
        this.y-=(this.y>10)?rowHeight:0;
        break;
      case 'down':
        this.y+=(this.y<(4*rowHeight))?rowHeight:0;
        break;
      case 'left':
        this.x-=(this.x>=50.5)?50.5:0;
        break;
      case 'right':
        this.x+=(this.x<400)?50.5:0;
    }
    this.checkIfWon();
  }

}

class Key{
  constructor(name){
    this.sprite=('images/'+name+'.png');
    this.x=101*randomInt(0, 4);
    this.y=30;
  }

  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y,100,100);
  }
}

  const gemIntervalID= window.setInterval(function(){
    if (!initial){
      const gemValues=[
        'Gem-Blue',
        'Gem-Green',
        'Gem-Orange'
      ];
      let movingGemInstances= new Gems(gemValues[randomInt(0,2)]);  //generates gems randomly
      movingGemInstances.placeInColumns(41.5);
      allMovingObjects.push(movingGemInstances);
    }
  },3000);

  const bugIntervalID=window.setInterval(function(){
    if (!initial){
      let movingBugsInstances= new MovingObjects(enemySprite);
      movingBugsInstances.placeInColumns(-20);
      allMovingObjects.push(movingBugsInstances);
    }
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
  let player,
      winKey,
      pointsCollected;

  const moveChar= function(e){
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    }
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
         document.removeEventListener('keyup',selectChar);
         leadersBoardBody.className='board';
         document.body.appendChild(leadersBoardBody);

         const gameHeader=document.querySelector('.header');
         document.getElementById('canvas').className='canvas-on-game';
         gameHeader.className='game-header';
         gameHeader.innerHTML=`<img src="images/Gem-Blue.png"></img> + 50
                                <img src="images/Gem-Green.png"></img> + 100
                                <img src="images/Gem-Orange.png"></img> + 500
                                <img src="images/Star.png"></img> + 1000`;

         createBoardOnPage(leadersOnArcade, true);
         player= new Players(avatar[selectedX/columnWidth]);
         winKey= new Key('Key');
         player.startingPositionOnGame();
         pointsCollected=new Points();
         for (let i=0;i<3;i++){
           let hearts=new Hearts(50*i);
           allHearts.push(hearts);
         }
         initial=false;
         document.addEventListener('keyup', moveChar);
       }
  }

  document.addEventListener('keyup', selectChar );

  function winOrLoose(action, points){
    const string=`<h1>You ${action} with ${points} points!</h1>
                      <button id="play-again">Play Again</button>`;
    clearInterval(gemIntervalID);
    clearInterval(bugIntervalID);
    const canvas=document.getElementById('canvas');
    canvas.classList.add('hidden');
    document.querySelector('.game-header').classList.add('hidden');
    winDiv= document.createElement('div');
    winDiv.innerHTML=string;
    document.body.appendChild(winDiv);
    const button=document.getElementById('play-again');
    button.addEventListener("click",reloading);

    const leaderBoardOnWin= document.createElement('div');
    leaderBoardOnWin.className= 'win-board';
    leaderBoardOnWin.innerHTML= `<div class="board-header"><p>Leader</p><p>Points</p></div>`;
    leadersBoardBody.className='leader-bodyOnWin';
    leaderBoardOnWin.appendChild(leadersBoardBody);

    document.body.appendChild(leaderBoardOnWin);

    if (typeof(Storage) !== "undefined"){
      if (pointsCollected.points>=localStorage.getItem("master")||JSON.parse(localStorage.getItem("leadersOnArcade")).length<5){
        createBoard();
      }
    }
    else {
      createBoardOnPage([],false);
    }
  }

function reloading(){
  location.reload();
}

let removeLives=(function(){
  let counter=1;
  return function addOne(){
    allHearts.pop();
    return counter++}
})();
//returns a random integer between min-max both inclusive
function randomInt(min, max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

//displays the pop up box to get the name of a new record
  function getLeaderName(){
    const person = prompt("You have set a new record, enter your name:", "Arcade Game Master");
    if (person !== null && person !== "") {
      return person;
    }
  }

  //creates an object with the data of the user with a new record
    class Leader{
      constructor(){
        this.name= getLeaderName();
        this.points=pointsCollected.points;
      }
  }

  //creates the board and storages it on local storage
  function createBoard(){
    let leaderEntrance= new Leader();
    if (leadersOnArcade.length>=5){

      leadersOnArcade.splice(-1,1,leaderEntrance);
    }
    else {
      leadersOnArcade.push(leaderEntrance);
    }
    orderLeaderBoard(leadersOnArcade);
    localStorage.setItem("leadersOnArcade", JSON.stringify(leadersOnArcade));
    leaderEntries=JSON.parse(localStorage.getItem("leadersOnArcade"));
    localStorage.setItem("master",leaderEntries[leaderEntries.length-1].points);
    createBoardOnPage(leaderEntries, true);
  }

  //sorts by number of moves. In case they are equal it is sorted by time.
    function orderLeaderBoard(objects){
      objects.sort(function(a, b){return (a.points-b.points<0)?1:((a.points-b.points>0))?-1:0});
    }

    //adds the board to the DOM
      function createBoardOnPage(users,value){
        leadersBoardBody.innerHTML=[];
        if (value){
          let piece=document.createDocumentFragment();
          for (i=0;i<users.length;i++){
            let name=document.createElement('p');
            name.textContent=users[i].name;
            let points=document.createElement('p');
            points.textContent=users[i].points;
            name.className='leader-name';
            points.className='leader-points';
            piece.appendChild(name);
            piece.appendChild(points);
          }
          leadersBoardBody.appendChild(piece);
        }
        else {
          leadersBoardBody.innerHTML='<p>Local storage is not supported by your browser. It is not possible to generate a Leaderboard</p>'
        }
      }
