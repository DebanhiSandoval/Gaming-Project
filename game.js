// Water Run Game - charity: water

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const endMessage = document.getElementById('end-message');

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 30;
const OBJECT_RADIUS = 18;
const OBJECT_FALL_SPEED = 4;
const OBSTACLE_FALL_SPEED = 5;
const GAME_TIME = 30; // seconds

let playerX = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
let playerY = GAME_HEIGHT - PLAYER_HEIGHT - 10;
let leftPressed = false;
let rightPressed = false;
let score = 0;
let timer = GAME_TIME;
let gameInterval, timerInterval;
let objects = [];
let gameActive = false;

function resetGame() {
  playerX = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
  score = 0;
  timer = GAME_TIME;
  objects = [];
  scoreEl.textContent = 'Score: 0';
  timerEl.textContent = 'Time: ' + GAME_TIME;
  endMessage.style.display = 'none';
}

function drawPlayer() {
  ctx.fillStyle = '#0288d1';
  ctx.fillRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
  ctx.fillStyle = '#fff';
  ctx.fillRect(playerX + 10, playerY + 8, PLAYER_WIDTH - 20, PLAYER_HEIGHT - 16);
}

function drawObject(obj) {
  if (obj.type === 'water') {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, OBJECT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#00bcd4';
    ctx.fill();
    ctx.strokeStyle = '#0288d1';
    ctx.stroke();
    ctx.closePath();
  } else if (obj.type === 'obstacle') {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, OBJECT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#757575';
    ctx.fill();
    ctx.strokeStyle = '#424242';
    ctx.stroke();
    ctx.closePath();
    ctx.font = '16px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('X', obj.x - 6, obj.y + 6);
  }
}

function spawnObject() {
  const x = Math.random() * (GAME_WIDTH - OBJECT_RADIUS * 2) + OBJECT_RADIUS;
  const type = Math.random() < 0.7 ? 'water' : 'obstacle';
  objects.push({
    x,
    y: -OBJECT_RADIUS,
    type
  });
}

function moveObjects() {
  for (let obj of objects) {
    if (obj.type === 'water') {
      obj.y += OBJECT_FALL_SPEED;
    } else {
      obj.y += OBSTACLE_FALL_SPEED;
    }
  }
  // Remove objects that are off screen
  objects = objects.filter(obj => obj.y < GAME_HEIGHT + OBJECT_RADIUS);
}

function checkCollisions() {
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    if (
      obj.x > playerX &&
      obj.x < playerX + PLAYER_WIDTH &&
      obj.y + OBJECT_RADIUS > playerY &&
      obj.y - OBJECT_RADIUS < playerY + PLAYER_HEIGHT
    ) {
      if (obj.type === 'water') {
        score += 1;
        scoreEl.textContent = 'Score: ' + score;
      } else {
        score -= 1;
        scoreEl.textContent = 'Score: ' + score;
      }
      objects.splice(i, 1);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawPlayer();
  for (let obj of objects) {
    drawObject(obj);
  }
}

function gameLoop() {
  if (!gameActive) return;
  if (Math.random() < 0.04) spawnObject();
  moveObjects();
  checkCollisions();
  draw();
}

function updateTimer() {
  timer -= 1;
  timerEl.textContent = 'Time: ' + timer;
  if (timer <= 0) {
    endGame();
  }
}

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  endMessage.innerHTML = `<strong>Game Over!</strong><br>Your score: ${score}<br><br>Every drop counts! Thanks for playing and supporting <a href='https://www.charitywater.org/' target='_blank'>charity: water</a>.`;
  endMessage.style.display = 'block';
  startBtn.textContent = 'Restart Game';
}

function startGame() {
  resetGame();
  gameActive = true;
  startBtn.textContent = 'Restart Game';
  gameInterval = setInterval(gameLoop, 20);
  timerInterval = setInterval(updateTimer, 1000);
}

startBtn.addEventListener('click', () => {
  if (!gameActive) startGame();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') leftPressed = true;
  if (e.key === 'ArrowRight') rightPressed = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') leftPressed = false;
  if (e.key === 'ArrowRight') rightPressed = false;
});

function movePlayer() {
  if (leftPressed) playerX -= 7;
  if (rightPressed) playerX += 7;
  if (playerX < 0) playerX = 0;
  if (playerX > GAME_WIDTH - PLAYER_WIDTH) playerX = GAME_WIDTH - PLAYER_WIDTH;
}

setInterval(movePlayer, 20);
