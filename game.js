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

  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
      game.fillText(emojis['X'], elementSize * (i - 1/2), elementSize * (j - 1/2));
    }
  }
}