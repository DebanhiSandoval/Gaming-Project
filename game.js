// Water Run Game - charity: water

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
// Timer removed
const startBtn = document.getElementById('start-btn');
const endMessage = document.getElementById('end-message');
const livesEl = document.getElementById('lives');

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 30;
const OBJECT_RADIUS = 18;
const OBJECT_FALL_SPEED = 4;
const OBSTACLE_FALL_SPEED = 5;
// const GAME_TIME = 30; // seconds (removed)
const MAX_LIVES = 3;

let playerX = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
let playerY = GAME_HEIGHT - PLAYER_HEIGHT - 10;
let leftPressed = false;
let rightPressed = false;
let score = 0;
// let timer = GAME_TIME; (removed)
let lives = MAX_LIVES;
let gameInterval, timerInterval;
let objects = [];
let gameActive = false;

function resetGame() {
  playerX = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
  score = 0;
  // timer = GAME_TIME; (removed)
  lives = MAX_LIVES;
  objects = [];
  scoreEl.textContent = 'Score: 0';
  // timerEl.textContent = 'Time: ' + GAME_TIME; (removed)
  livesEl.textContent = 'Lives: ' + MAX_LIVES;
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
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    if (obj.type === 'water') {
      obj.y += OBJECT_FALL_SPEED;
    } else {
      obj.y += OBSTACLE_FALL_SPEED;
    }
    // If water droplet missed (falls off screen), just remove it (no lives lost)
    if (obj.type === 'water' && obj.y > GAME_HEIGHT + OBJECT_RADIUS) {
      objects.splice(i, 1);
    } else if (obj.y > GAME_HEIGHT + OBJECT_RADIUS) {
      // Remove obstacles that fall off screen
      objects.splice(i, 1);
    }
  }
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
        lives -= 1;
        livesEl.textContent = 'Lives: ' + lives;
        if (lives <= 0) {
          endGame();
        }
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
  // Timer update logic removed
}

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  // clearInterval(timerInterval); (removed)
  let message = `<strong>Game Over!</strong><br>Your score: ${score}<br>`;
  if (lives <= 0) {
    message += 'You ran out of lives!<br>';
  }
  message += '<br>Every drop counts! Thanks for playing and supporting <a href="https://www.charitywater.org/" target="_blank">charity: water</a>.';
  endMessage.innerHTML = message;
  endMessage.style.display = 'block';
  startBtn.textContent = 'Restart Game';
}

function startGame() {
  resetGame();
  gameActive = true;
  startBtn.textContent = 'Restart Game';
  gameInterval = setInterval(gameLoop, 20);
  // timerInterval = setInterval(updateTimer, 1000); (removed)
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

const bgImage = new Image();
bgImage.src = 'Pictures/Background Game.jpg';

function draw() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.drawImage(bgImage, 0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawPlayer();
  for (let obj of objects) {
    drawObject(obj);
  }
}

const bucketImg = new Image();
bucketImg.src = 'Pictures/Bucket.png';

function drawPlayer() {
  const bucketWidth = 70;  // e.g., 70 pixels wide
  const bucketHeight = 40; // e.g., 40 pixels tall
  ctx.drawImage(bucketImg, playerX, playerY, bucketWidth, bucketHeight);
}
