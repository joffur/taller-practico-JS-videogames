// Select HTML elements
const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');

// Initialize variables 
let canvasSize;
let elementSize;
let level = 0;
let lives = 3;
let mapRowCols;
let isCollide = false;

const playerPosition = {
  x: undefined,
  y: undefined,
}

const giftPosition = {
  x: undefined,
  y: undefined,
}

let bombsPosition = [];

// Listeners to load and resize window
window.addEventListener('load',setCanvasSize);
window.addEventListener('resize', setCanvasSize);

// Functions to draw initial map
function setCanvasSize() {
  canvasSize = Math.ceil((window.innerWidth >= window.innerHeight ? window.innerHeight * 0.5 : window.innerWidth * 0.70) / 10) * 10;
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  elementSize = canvasSize / 10;

  startGame();
}

function startGame() {
  game.font = `${elementSize}px Verdana`;
  game.textAlign = 'center';
  game.textBaseline = 'middle';

  if (!isCollide) {
    const map = maps[level];
    const mapRows = map.trim().split('\n');
    mapRowCols = mapRows.map(row => row.trim().split(''));
  }

  game.clearRect(0, 0, canvasSize, canvasSize);
  bombsPosition = [];

  mapRowCols.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const emoji = emojis[col];
      const posX = elementSize * ((colIndex + 1) - 1/2);
      const posY = elementSize * ((rowIndex + 1) - 1/2);
      game.fillText(emoji, posX, posY);

      if (col === 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX / elementSize;
          playerPosition.y = posY / elementSize;
        }
      }
      else if (col === 'I') {
        giftPosition.x = posX / elementSize;
        giftPosition.y = posY / elementSize;
      }
      else if (col === 'X' || col === 'BOMB_COLLISION') {
        bombsPosition.push({
          x: posX / elementSize,
          y: posY / elementSize,
        });
      }
    });
  });
  movePlayer();
}

// Listeners to buttons and keys pressed
document.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);

// Functions to move player
function movePlayer() {
  // console.log('player position{', playerPosition ,'}');
  const giftCollisionX = playerPosition.x == giftPosition.x;
  const giftCollisionY = playerPosition.y == giftPosition.y;

  const bombCollision = bombsPosition.some(bomb => {
    return bomb.x == playerPosition.x && bomb.y == playerPosition.y;
  })

  if (giftCollisionX && giftCollisionY) {
    levelWin();
  } else if (bombCollision) {
    levelFail();
  }

  game.fillText(emojis['PLAYER'], playerPosition.x * elementSize, playerPosition.y * elementSize);
}

function levelWin() {
  console.log('Subiste de nivel! 🎉');
  level++;
  isCollide = false;
  if (level >= maps.length) {
    gameWin();
  }
  else{
    startGame();
  }
}

function levelFail() {
  console.log('Chocaste con una bomba 😔');
  lives--;
  if (lives <= 0) {
    gameOver();
    return -1;
  }
  isCollide = true;
  mapRowCols[playerPosition.y - 1/2][playerPosition.x - 1/2] = 'BOMB_COLLISION';
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() {
  game.clearRect(0, 0, canvasSize, canvasSize);
  game.fillStyle = '#6DBF8F';
  game.fillRect(0, 0, canvasSize, canvasSize);
  game.fillStyle = '#f3f3f3';
  game.font = `${elementSize*3}px 'VT323'`;
  game.textAlign = 'center';
  game.textBaseline = 'middle';
  game.fillText('You Win', canvasSize/2, canvasSize/2);
}

function gameOver(params) {
  level = 0;
  lives = 3;
  isCollide = false;
  game.clearRect(0, 0, canvasSize, canvasSize);
  game.fillStyle = '#C2564F';
  game.fillRect(0, 0, canvasSize, canvasSize);
  game.fillStyle = '#0a0a0a';
  game.font = `${elementSize*3}px 'VT323'`;
  game.textAlign = 'center';
  game.textBaseline = 'middle';
  game.fillText('You Lose', canvasSize/2, canvasSize/2);
}

function moveByKeys(event) {
  if (event.key == "ArrowUp" || event.key == "w" || event.key == "W") moveUp();
  else if (event.key == "ArrowDown" || event.key == "s" || event.key == "S") moveDown();
  else if (event.key == "ArrowLeft" || event.key == "a" || event.key == "A") moveLeft();
  else if (event.key == "ArrowRight" || event.key == "d" || event.key == "D") moveRight();
}
function moveUp() {
  // console.log('Me quiero mover hacia arriba');
  playerPosition.y -= 1;
  if (playerPosition.y < 0) {
    playerPosition.y = 1 / 2;
  }
  startGame();
}
function moveDown() {
  // console.log('Me quiero mover hacia abajo');
  playerPosition.y += 1;
  if (playerPosition.y > 10) {
    playerPosition.y = 10 - (1 / 2);
  }
  startGame();
}
function moveLeft() {
  // console.log('Me quiero mover hacia la izquierda');
  playerPosition.x -= 1;
  if (playerPosition.x < 0) {
    playerPosition.x = 1 / 2;
  }
  startGame();
}
function moveRight() {
  // console.log('Me quiero mover hacia la derecha');
  playerPosition.x += 1;
  if (playerPosition.x > 10) {
    playerPosition.x = 10 - (1 / 2);
  }
  startGame();
}