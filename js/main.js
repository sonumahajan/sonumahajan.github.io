document
.querySelector("form")
.addEventListener("submit", function (event) {
    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !message || !email) {
    alert("Please fill out all fields.");
    event.preventDefault();
    } else {
    alert("Your message has been sent!");
    }
});
// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");

// Set initial theme icon based on current mode (dark mode default)
if (document.body.classList.contains("dark-mode")) {
themeIcon.classList.remove("fa-sun");
themeIcon.classList.add("fa-moon");
}

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");

mobileMenuBtn.addEventListener("click", () => {
navLinks.classList.toggle("active");
});

// Download Resume Button
// document.getElementById('download-resume').addEventListener('click', function(e) {
//     e.preventDefault();
//     alert('Resume download would start here. In a real implementation, this would download your PDF resume.');
// });

// Animate on Scroll
const animateElements = document.querySelectorAll(".animate");

const observer = new IntersectionObserver(
(entries) => {
    entries.forEach((entry) => {
    if (entry.isIntersecting) {
        entry.target.classList.add("animated");
    }
    });
},
{
    threshold: 0.1,
}
);

animateElements.forEach((element) => {
observer.observe(element);
});

// Skill Bars Animation
const skillBars = document.querySelectorAll(".skill-progress");

const skillsObserver = new IntersectionObserver(
(entries) => {
    entries.forEach((entry) => {
    if (entry.isIntersecting) {
        const width = entry.target.getAttribute("data-width");
        entry.target.style.width = width;
    }
    });
},
{
    threshold: 0.5,
}
);

skillBars.forEach((bar) => {
skillsObserver.observe(bar);
});

// Simple Game Implementation
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-game");
const resetButton = document.getElementById("reset-game");
const gameOverMessage = document.getElementById("game-over-message");

let gameRunning = false;
let score = 0;

// Paddle properties
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 7;

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 4;
let ballDY = -4;
const ballRadius = 10;

// Brick properties
const brickRowCount = 3;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
bricks[c] = [];
for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
}
}

const keys = {
left: false,
right: false,
};

function drawBall() {
ctx.beginPath();
ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
ctx.fillStyle = "#0095dd";
ctx.fill();
ctx.closePath();
}

function drawPaddle() {
ctx.beginPath();
ctx.rect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
);
ctx.fillStyle = "#0095dd";
ctx.fill();
ctx.closePath();
}

function drawBricks() {
for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
    if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095dd";
        ctx.fill();
        ctx.closePath();
    }
    }
}
}

function updateScoreDisplay() {
document.getElementById("score-display").textContent = score;
}

function movePaddle() {
if (keys.left) {
    paddleX -= paddleSpeed;
    if (paddleX < 0) paddleX = 0;
}
if (keys.right) {
    paddleX += paddleSpeed;
    if (paddleX > canvas.width - paddleWidth)
    paddleX = canvas.width - paddleWidth;
}
}

function draw() {
if (!gameRunning) return;

ctx.clearRect(0, 0, canvas.width, canvas.height);

movePaddle();
drawBricks();
drawBall();
drawPaddle();
updateScoreDisplay();

if (
    ballX + ballDX > canvas.width - ballRadius ||
    ballX + ballDX < ballRadius
) {
    ballDX = -ballDX;
}

if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
} else if (ballY + ballDY > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
    ballDY = -ballDY;
    score++;
    updateScoreDisplay();
    } else {
    gameRunning = false;
    showGameOver("Game Over", "lose");
    }
}

ballX += ballDX;
ballY += ballDY;

for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
    const b = bricks[c][r];
    if (b.status === 1) {
        if (
        ballX > b.x &&
        ballX < b.x + brickWidth &&
        ballY > b.y &&
        ballY < b.y + brickHeight
        ) {
        ballDY = -ballDY;
        b.status = 0;
        score++;
        updateScoreDisplay();

        let allBroken = true;
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                allBroken = false;
            }
            }
        }
        if (allBroken) {
            gameRunning = false;
            showGameOver("You Win!", "win");
        }
        }
    }
    }
}

requestAnimationFrame(draw);
}

function showGameOver(message, type) {
gameOverMessage.textContent = message;
gameOverMessage.style.display = "block";

if (type === "win") {
    gameOverMessage.style.backgroundColor = "rgba(102, 255, 102, 0.3)"; // light green
    gameOverMessage.style.color = "green";
} else {
    gameOverMessage.style.backgroundColor = "rgba(255, 102, 102, 0.3)"; // light red
    gameOverMessage.style.color = "maroon";
}
}

function hideGameOver() {
gameOverMessage.style.display = "none";
gameOverMessage.textContent = "Game Over";
gameOverMessage.style.backgroundColor = "rgba(255, 102, 102, 0.3)";
gameOverMessage.style.color = "maroon";
}

function mouseMoveHandler(e) {
const relativeX = e.clientX - canvas.getBoundingClientRect().left;
if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
}
}

function keyDownHandler(e) {
if (e.key === "ArrowLeft") {
    keys.left = true;
} else if (e.key === "ArrowRight") {
    keys.right = true;
}
}

function keyUpHandler(e) {
if (e.key === "ArrowLeft") {
    keys.left = false;
} else if (e.key === "ArrowRight") {
    keys.right = false;
}
}

document.addEventListener("mousemove", mouseMoveHandler);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

startButton.addEventListener("click", () => {
if (!gameRunning) {
    gameRunning = true;
    hideGameOver();
    draw();
}
});

resetButton.addEventListener("click", () => {
ballX = canvas.width / 2;
ballY = canvas.height - 30;
ballDX = 4;
ballDY = -4;
paddleX = (canvas.width - paddleWidth) / 2;
score = 0;

for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r].status = 1;
    }
}

gameRunning = false;
hideGameOver();
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawBricks();
drawBall();
drawPaddle();
updateScoreDisplay();
});

// Initial draw
drawBricks();
drawBall();
drawPaddle();
updateScoreDisplay();

// Background Animation
const backgroundCanvas = document.getElementById("background-canvas");
const bgCtx = backgroundCanvas.getContext("2d");
let animationId;

// Animation variables
let stars = [];
let isDarkMode = document.body.classList.contains("dark-mode");

// Resize canvas
function resizeCanvas() {
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;
}

// Initialize stars for dark mode
function initStars() {
stars = [];
const starCount = Math.floor(
    window.innerWidth * window.innerHeight * 0.0003
);

for (let i = 0; i < starCount; i++) {
    stars.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.5 + 0.1,
    opacity: Math.random() * 0.8 + 0.2,
    twinkle: Math.random() * 0.02 + 0.01,
    });
}
}

// Initialize clouds for light mode (CSS-based, no JS needed)
function initClouds() {
// CSS clouds are handled automatically
}

// Draw stars
function drawStars() {
bgCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
stars.forEach((star) => {
    star.opacity += star.twinkle * (Math.random() > 0.5 ? 1 : -1);
    star.opacity = Math.max(0.1, Math.min(1, star.opacity));

    bgCtx.globalAlpha = star.opacity;
    bgCtx.beginPath();
    bgCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    bgCtx.fill();

    // Move stars
    star.y += star.speed;
    if (star.y > window.innerHeight) {
    star.y = 0;
    star.x = Math.random() * window.innerWidth;
    }
});
bgCtx.globalAlpha = 1;
}

// Draw sun and sunlight
function drawSun() {
const centerX = window.innerWidth * 0.2;
const centerY = window.innerHeight * 0.2;
const radius = 60;

// Sun rays
bgCtx.strokeStyle = "rgba(255, 255, 0, 0.3)";
bgCtx.lineWidth = 2;
for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12;
    const x1 = centerX + Math.cos(angle) * (radius + 20);
    const y1 = centerY + Math.sin(angle) * (radius + 20);
    const x2 = centerX + Math.cos(angle) * (radius + 40);
    const y2 = centerY + Math.sin(angle) * (radius + 40);

    bgCtx.beginPath();
    bgCtx.moveTo(x1, y1);
    bgCtx.lineTo(x2, y2);
    bgCtx.stroke();
}

// Sun
const gradient = bgCtx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    radius
);
gradient.addColorStop(0, "rgba(255, 255, 0, 0.8)");
gradient.addColorStop(1, "rgba(255, 165, 0, 0.4)");

bgCtx.fillStyle = gradient;
bgCtx.beginPath();
bgCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
bgCtx.fill();
}

// Draw moon for dark mode
function drawMoon() {
const centerX = window.innerWidth * 0.2;
const centerY = window.innerHeight * 0.2;
const radius = 60;

// Moon glow effect
const glowGradient = bgCtx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    radius + 20
);
glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

bgCtx.fillStyle = glowGradient;
bgCtx.beginPath();
bgCtx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
bgCtx.fill();

// Moon main body
const moonGradient = bgCtx.createRadialGradient(
    centerX - 10,
    centerY - 10,
    0,
    centerX,
    centerY,
    radius
);
moonGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
moonGradient.addColorStop(0.7, "rgba(240, 240, 240, 0.8)");
moonGradient.addColorStop(1, "rgba(200, 200, 200, 0.6)");

bgCtx.fillStyle = moonGradient;
bgCtx.beginPath();
bgCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
bgCtx.fill();

// Moon craters
bgCtx.fillStyle = "rgba(180, 180, 180, 0.3)";

// Large crater
bgCtx.beginPath();
bgCtx.arc(centerX + 10, centerY + 5, 8, 0, Math.PI * 2);
bgCtx.fill();

// Medium crater
bgCtx.beginPath();
bgCtx.arc(centerX - 15, centerY - 10, 5, 0, Math.PI * 2);
bgCtx.fill();

// Small crater
bgCtx.beginPath();
bgCtx.arc(centerX + 5, centerY - 15, 3, 0, Math.PI * 2);
bgCtx.fill();
}

// Draw clouds (CSS-based, no JS drawing needed)
function drawClouds() {
// CSS clouds are handled automatically
}

// Main animation loop
function animate() {
bgCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

if (isDarkMode) {
    drawStars();
    drawMoon();
} else {
    drawSun();
    // Clouds are handled by CSS animations
}

animationId = requestAnimationFrame(animate);
}

// Initialize and start animation
function initBackground() {
resizeCanvas();
isDarkMode = document.body.classList.contains("dark-mode");

if (isDarkMode) {
    initStars();
}
// Clouds are handled by CSS animations

animate();
}

// Handle window resize
window.addEventListener("resize", () => {
resizeCanvas();
if (isDarkMode) {
    initStars();
}
// Clouds are handled by CSS animations
});

// Start background animation
initBackground();

// Update background when theme changes
const originalThemeToggle = themeToggle.addEventListener;
themeToggle.addEventListener("click", () => {
// Call original theme toggle logic
document.body.classList.toggle("light-mode");
document.body.classList.toggle("dark-mode");

if (document.body.classList.contains("dark-mode")) {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
} else {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
}

// Update background animation
isDarkMode = document.body.classList.contains("dark-mode");
if (isDarkMode) {
    initStars();
}
// Clouds are handled by CSS animations
});
