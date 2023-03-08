// Select HTML elements
const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

// Initialize variables 
let canvasSize;
let elementSize;
let mapRowCols;
let level = 0;
let lives = 3;
let isCollide = false;
let timeStart;
let timePlayer;
let timeInterval;
let playerTime = undefined;

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

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
    pResult.classList.remove('messages__result-final');
  }

  game.clearRect(0, 0, canvasSize, canvasSize);
  bombsPosition = [];

  showLives();

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

  game.fillText(emojis['PLAYER'], playerPosition.x * elementSize, playerPosition.y * elementSize);

  if (giftCollisionX && giftCollisionY) {
    levelWin();
  } else if (bombCollision) {
    levelFail();
  }
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
  showLives();
  isCollide = true;
  mapRowCols[playerPosition.y - 1/2][playerPosition.x - 1/2] = 'BOMB_COLLISION';
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  if (lives <= 0) {
    gameOver();
  }
  else {
    startGame();
  }
}

function gameWin() {
  playerTime = Date.now() - timeStart;
  restartGame();
  spanTime.innerText = formatTime(playerTime);
  game.clearRect(0, 0, canvasSize, canvasSize);
  game.fillStyle = '#6DBF8F';
  game.fillRect(0, 0, canvasSize, canvasSize);
  game.fillStyle = '#f3f3f3';
  game.font = `${elementSize*3}px 'VT323'`;
  game.textAlign = 'center';
  game.textBaseline = 'middle';
  game.fillText('You Win', canvasSize/2, canvasSize/2);

  const recordTime = localStorage.getItem('record_time');
  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime);
      pResult.innerText = '¡Superaste el record! 😎';
      
      game.font = `${elementSize*2}px 'VT323'`;
      game.textAlign = 'center';  
      game.textBaseline = 'middle';
      game.fillText('¡New Record!', canvasSize / 2, (3 * canvasSize) / 4);
    }
    else {
      pResult.innerText = 'Lo siento, no superaste el record 😔';
    }
  }
  else {
    pResult.innerText = 'Primera vez? Muy bien, pero ahora intenta superar tu tiempo';
    localStorage.setItem('record_time', playerTime);
  }
  
  pResult.classList.add('messages__result-final');
  showRecord();
}

function showLives() {
  spanLives.innerText = emojis['HEART'].repeat(lives);
}

function showTime() {
  spanTime.innerText = formatTime(Date.now() - timeStart);
}

function showRecord() {
  if (localStorage.getItem('record_time')) {
    spanRecord.innerText = formatTime(localStorage.getItem('record_time'));
  }
  else {
    spanRecord.innerText = '59:59:99';
  }
}

function formatTime(time_ms) {
  const cs = parseInt(time_ms / 10) % 100;
  const seg = parseInt(time_ms / 1000) % 60;
  const min = parseInt(time_ms / 60000) % 60;
  const csStr = `${cs}`.padStart(3, "0");
  const segStr = `${seg}`.padStart(2, "0");
  const minStr = `${min}`.padStart(2, "0");
  return `${minStr}:${segStr}:${csStr}`;
}

function gameOver() {
  restartGame();
  game.clearRect(0, 0, canvasSize, canvasSize);
  game.fillStyle = '#C2564F';
  game.fillRect(0, 0, canvasSize, canvasSize);
  game.fillStyle = '#0a0a0a';
  game.font = `${elementSize*3}px 'VT323'`;
  game.textAlign = 'center';
  game.textBaseline = 'middle';
  game.fillText('You Lose', canvasSize/2, canvasSize/2);
  pResult.innerText = 'Game Over ☠️';
  pResult.classList.add('messages__result-final');
}
function restartGame() {
  clearInterval(timeInterval);
  timeStart = undefined;
  level = 0;
  lives = 3;
  isCollide = false;
  playerPosition.x = undefined;
  playerPosition.y = undefined;
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