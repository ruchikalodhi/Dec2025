// Simple Pong game
// Left paddle (player) controlled by mouse and Arrow Up/Down
// Right paddle (AI) moves toward the ball
// Canvas rendering, collision detection, scoreboard

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const leftScoreEl = document.getElementById('leftScore');
const rightScoreEl = document.getElementById('rightScore');
const restartBtn = document.getElementById('restartBtn');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle specs
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const PADDLE_SPEED = 6;

// Ball specs
const BALL_RADIUS = 8;
const INITIAL_BALL_SPEED = 5;
const SPEED_INCREASE = 0.25; // per paddle hit

// Game state
let leftScore = 0;
let rightScore = 0;

const leftPaddle = {
  x: 10,
  y: (HEIGHT - PADDLE_HEIGHT) / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dy: 0
};

const rightPaddle = {
  x: WIDTH - PADDLE_WIDTH - 10,
  y: (HEIGHT - PADDLE_HEIGHT) / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dy: 0
};

const ball = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
  radius: BALL_RADIUS,
  speed: INITIAL_BALL_SPEED,
  dx: 0,
  dy: 0
};

let keys = { ArrowUp: false, ArrowDown: false };
let mouseActive = false;

// Initialize ball with random direction
function resetBall(direction = null) {
  ball.x = WIDTH / 2;
  ball.y = HEIGHT / 2;
  ball.speed = INITIAL_BALL_SPEED;
  // Choose a random angle between -40 and 40 degrees
  const angle = (Math.random() * 80 - 40) * Math.PI / 180;
  const dir = direction === 'left' ? -1 : direction === 'right' ? 1 : (Math.random() < 0.5 ? -1 : 1);
  ball.dx = dir * Math.cos(angle) * ball.speed;
  ball.dy = Math.sin(angle) * ball.speed;
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function updatePaddles() {
  // Keyboard movement for left paddle
  if (!mouseActive) {
    if (keys.ArrowUp) leftPaddle.y -= PADDLE_SPEED;
    if (keys.ArrowDown) leftPaddle.y += PADDLE_SPEED;
  }
  // Keep paddles in bounds
  leftPaddle.y = clamp(leftPaddle.y, 0, HEIGHT - leftPaddle.height);

  // Simple AI for right paddle: move toward ball with limit
  const targetY = ball.y - rightPaddle.height / 2;
  const diff = targetY - rightPaddle.y;
  const aiSpeed = 4.2; // tweak for difficulty
  if (Math.abs(diff) > 2) {
    rightPaddle.y += clamp(diff, -aiSpeed, aiSpeed);
  }
  rightPaddle.y = clamp(rightPaddle.y, 0, HEIGHT - rightPaddle.height);
}

function ballHitsPaddle(paddle) {
  // Check AABB / circle intersection for paddle rectangle
  const nearestX = clamp(ball.x, paddle.x, paddle.x + paddle.width);
  const nearestY = clamp(ball.y, paddle.y, paddle.y + paddle.height);
  const dx = ball.x - nearestX;
  const dy = ball.y - nearestY;
  return (dx * dx + dy * dy) <= (ball.radius * ball.radius);
}

function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Top / bottom collision
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    ball.dy = -ball.dy;
  } else if (ball.y + ball.radius >= HEIGHT) {
    ball.y = HEIGHT - ball.radius;
    ball.dy = -ball.dy;
  }

  // Left paddle collision
  if (ball.dx < 0 && ball.x - ball.radius <= leftPaddle.x + leftPaddle.width) {
    if (ballHitsPaddle(leftPaddle)) {
      // reflect and add some angle based on hit location
      const relativeIntersectY = (leftPaddle.y + leftPaddle.height / 2) - ball.y;
      const normalized = relativeIntersectY / (leftPaddle.height / 2);
      const bounceAngle = normalized * (5 * Math.PI / 12); // max ~75 degrees
      const newSpeed = ball.speed + SPEED_INCREASE;
      ball.speed = newSpeed;
      ball.dx = Math.cos(bounceAngle) * newSpeed * 1; // positive to the right
      ball.dy = -Math.sin(bounceAngle) * newSpeed;
      // ensure ball is just outside paddle to avoid sticking
      ball.x = leftPaddle.x + leftPaddle.width + ball.radius + 0.5;
    }
  }

  // Right paddle collision
  if (ball.dx > 0 && ball.x + ball.radius >= rightPaddle.x) {
    if (ballHitsPaddle(rightPaddle)) {
      const relativeIntersectY = (rightPaddle.y + rightPaddle.height / 2) - ball.y;
      const normalized = relativeIntersectY / (rightPaddle.height / 2);
      const bounceAngle = normalized * (5 * Math.PI / 12);
      const newSpeed = ball.speed + SPEED_INCREASE;
      ball.speed = newSpeed;
      ball.dx = -Math.cos(bounceAngle) * newSpeed; // negative to left
      ball.dy = -Math.sin(bounceAngle) * newSpeed;
      ball.x = rightPaddle.x - ball.radius - 0.5;
    }
  }

  // Score checks
  if (ball.x + ball.radius < 0) {
    // AI scores
    rightScore++;
    rightScoreEl.textContent = rightScore;
    resetBall('right');
  } else if (ball.x - ball.radius > WIDTH) {
    // Player scores
    leftScore++;
    leftScoreEl.textContent = leftScore;
    resetBall('left');
  }
}

function drawNet() {
  ctx.fillStyle = '#9fb8ff33';
  const step = 18;
  const dashW = 4;
  for (let y = 0; y < HEIGHT; y += step) {
    ctx.fillRect(WIDTH / 2 - dashW / 2, y, dashW, step / 2);
  }
}

function draw() {
  // clear
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // net
  drawNet();

  // paddles
  ctx.fillStyle = '#e6eef8';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // ball
  ctx.beginPath();
  ctx.fillStyle = '#ffd966';
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // scores on canvas (optional small)
  ctx.fillStyle = '#9fb8ff';
  ctx.font = '18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(leftScore, WIDTH / 2 - 40, 30);
  ctx.fillText(rightScore, WIDTH / 2 + 40, 30);
}

function loop() {
  updatePaddles();
  updateBall();
  draw();
  requestAnimationFrame(loop);
}

// Input handlers
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleY = canvas.height / rect.height;
  const y = (e.clientY - rect.top) * scaleY;
  // Center paddle on mouse Y
  leftPaddle.y = clamp(y - leftPaddle.height / 2, 0, HEIGHT - leftPaddle.height);
  mouseActive = true;
});

canvas.addEventListener('mouseleave', () => {
  mouseActive = false;
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    keys[e.key] = true;
    // when a key is pressed, we'll consider keyboard active
    mouseActive = false;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    keys[e.key] = false;
  }
});

restartBtn.addEventListener('click', () => {
  leftScore = 0;
  rightScore = 0;
  leftScoreEl.textContent = leftScore;
  rightScoreEl.textContent = rightScore;
  resetBall();
});

// Start the game
resetBall();
loop();
