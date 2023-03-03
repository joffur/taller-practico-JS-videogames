const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
let canvasSize;
let elementSize;

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize(params) {
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

  mapRowCols.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      game.fillText(emojis[col], elementSize * ((colIndex + 1) - 1/2), elementSize * ((rowIndex + 1) - 1/2));
    });
  });
  
  // for (let row = 1; row <= 10; row++) {
  //   for (let col = 1; col <= 10; col++) {
  //     game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementSize * (col - 1/2), elementSize * (row - 1/2));
  //   }
  // }
}