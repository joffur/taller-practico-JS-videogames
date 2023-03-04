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

const playerPosition = {
  x: undefined,
  y: undefined,
}

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

  const map = maps[0];
  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));

  game.clearRect(0, 0, canvasSize, canvasSize);
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
    });
  });
  movePlayer();
  // console.log({canvasSize ,playerPosition});
}

// Listeners to buttons and keys pressed
document.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);

// Functions to move player
function movePlayer() {
  game.fillText(emojis['PLAYER'], playerPosition.x * elementSize, playerPosition.y * elementSize);
}

function moveByKeys(event) {
  if (event.key == "ArrowUp" || event.key == "w" || event.key == "W") moveUp();
  else if (event.key == "ArrowDown" || event.key == "s" || event.key == "S") moveDown();
  else if (event.key == "ArrowLeft" || event.key == "a" || event.key == "A") moveLeft();
  else if (event.key == "ArrowRight" || event.key == "d" || event.key == "D") moveRight();
}
function moveUp() {
  // console.log('Me quiero mover hacia arriba');
  // playerPosition.y -= elementSize;
  // if (playerPosition.y < 0) {
  //   playerPosition.y = elementSize / 2;
  // }
  playerPosition.y -= 1;
  if (playerPosition.y < 0) {
    playerPosition.y = 1 / 2;
  }
  startGame();
}
function moveDown() {
  // console.log('Me quiero mover hacia abajo');
  // playerPosition.y += elementSize;
  // if (playerPosition.y > canvasSize) {
  //   playerPosition.y = canvasSize - ( elementSize / 2);
  // }
  playerPosition.y += 1;
  if (playerPosition.y > 10) {
    playerPosition.y = 10 - (1 / 2);
  }
  startGame();
}
function moveLeft() {
  // console.log('Me quiero mover hacia la izquierda');
  // playerPosition.x -= elementSize;
  // if (playerPosition.x < 0) {
  //   playerPosition.x = elementSize / 2;
  // }
  playerPosition.x -= 1;
  if (playerPosition.x < 0) {
    playerPosition.x = 1 / 2;
  }
  startGame();
}
function moveRight() {
  // console.log('Me quiero mover hacia la derecha');
  // playerPosition.x += elementSize;
  // if (playerPosition.x > canvasSize) {
  //   playerPosition.x = canvasSize - ( elementSize / 2);
  // }
  playerPosition.x += 1;
  if (playerPosition.x > 10) {
    playerPosition.x = 10 - (1 / 2);
  }
  startGame();
}