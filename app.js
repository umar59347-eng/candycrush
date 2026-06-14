// Game Variables
const GRID_SIZE = 6;
const CANDY_TYPES = 6;
const INITIAL_MOVES = 20;

let gameGrid = [];
let score = 0;
let moves = INITIAL_MOVES;
let level = 1;
let gameOver = false;
let animating = false;
let selectedCandy = null;

// Telegram Web App
const tg = window.Telegram.WebApp;

// Initialize Telegram
if (tg) {
    tg.ready();
    tg.MainButton.text = "Close";
    tg.MainButton.onClick(() => tg.close());
}

// Initialize Game
function initGame() {
    gameGrid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        gameGrid[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            gameGrid[i][j] = Math.floor(Math.random() * CANDY_TYPES) + 1;
        }
    }
    removeInitialMatches();
    renderGrid();
}

// Remove matches at start
function removeInitialMatches() {
    let found = true;
    while (found) {
        found = false;
        const matches = getMatches();
        if (matches.length > 0) {
            found = true;
            matches.forEach(([i, j]) => {
                gameGrid[i][j] = 0;
            });
            applyGravity();
        }
    }
}

// Get matching candies
function getMatches() {
    const matches = new Set();

    // Check horizontal matches
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE - 2; j++) {
            if (gameGrid[i][j] !== 0 &&
                gameGrid[i][j] === gameGrid[i][j + 1] &&
                gameGrid[i][j] === gameGrid[i][j + 2]) {
                matches.add(`${i},${j}`);
                matches.add(`${i},${j + 1}`);
                matches.add(`${i},${j + 2}`);
            }
        }
    }

    // Check vertical matches
    for (let i = 0; i < GRID_SIZE - 2; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (gameGrid[i][j] !== 0 &&
                gameGrid[i][j] === gameGrid[i + 1][j] &&
                gameGrid[i][j] === gameGrid[i + 2][j]) {
                matches.add(`${i},${j}`);
                matches.add(`${i + 1},${j}`);
                matches.add(`${i + 2},${j}`);
            }
        }
    }

    return Array.from(matches).map(m => m.split(',').map(Number));
}

// Apply gravity
function applyGravity() {
    for (let j = 0; j < GRID_SIZE; j++) {
        let writePos = GRID_SIZE - 1;
        for (let i = GRID_SIZE - 1; i >= 0; i--) {
            if (gameGrid[i][j] !== 0) {
                gameGrid[writePos][j] = gameGrid[i][j];
                if (writePos !== i) {
                    gameGrid[i][j] = 0;
                }
                writePos--;
            }
        }
    }

    // Fill empty spaces
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (gameGrid[i][j] === 0) {
                gameGrid[i][j] = Math.floor(Math.random() * CANDY_TYPES) + 1;
            }
        }
    }
}

// Check if adjacent
function isAdjacent(row1, col1, row2, col2) {
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
}

// Swap candies
async function swapCandies(row1, col1, row2, col2) {
    if (animating || moves === 0 || gameOver) return;

    animating = true;

    // Swap
    [gameGrid[row1][col1], gameGrid[row2][col2]] = [gameGrid[row2][col2], gameGrid[row1][col1]];
    renderGrid();

    selectedCandy = null;
    moves--;
    updateStats();

    // Wait for animation
    await sleep(300);

    // Check matches
    const matches = getMatches();
    let matchedPoints = 0;

    if (matches.length > 0) {
        // Animate removal
        matches.forEach(([i, j]) => {
            const element = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
            if (element) element.classList.add('animating');
        });

        await sleep(300);

        // Remove matched candies
        matches.forEach(([i, j]) => {
            gameGrid[i][j] = 0;
            matchedPoints += 10;
        });

        renderGrid();
        await sleep(200);

        // Apply gravity and refill
        applyGravity();
        renderGrid();

        // Check for cascades
        await processCascade();

        score += matchedPoints;
        updateStats();
        checkLevelUp();
    } else {
        // No match - swap back
        [gameGrid[row1][col1], gameGrid[row2][col2]] = [gameGrid[row2][col2], gameGrid[row1][col1]];
        renderGrid();
    }

    // Check game over
    if (moves === 0) {
        await sleep(300);
        endGame();
    }

    animating = false;
}

// Process cascade matches
async function processCascade() {
    let cascadeLevel = 0;
    while (true) {
        const matches = getMatches();
        if (matches.length === 0) break;

        cascadeLevel++;
        let cascadePoints = matches.length * (10 + cascadeLevel * 5);

        matches.forEach(([i, j]) => {
            const element = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
            if (element) element.classList.add('animating');
            gameGrid[i][j] = 0;
        });

        await sleep(300);
        renderGrid();

        applyGravity();
        renderGrid();

        await sleep(200);

        score += cascadePoints;
    }
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Render grid
function renderGrid() {
    const gridElement = document.getElementById('gameGrid');
    gridElement.innerHTML = '';

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const candy = document.createElement('div');
            candy.className = `candy candy-${gameGrid[i][j]}`;
            candy.dataset.row = i;
            candy.dataset.col = j;

            if (gameGrid[i][j] === 0) {
                candy.classList.add('empty');
            }

            if (selectedCandy && selectedCandy.row === i && selectedCandy.col === j) {
                candy.classList.add('selected');
            }

            candy.onclick = (e) => {
                e.stopPropagation();
                selectCandy(i, j);
            };

            gridElement.appendChild(candy);
        }
    }
}

// Select candy
function selectCandy(row, col) {
    if (animating || gameOver) return;

    if (!selectedCandy) {
        selectedCandy = { row, col };
        renderGrid();
    } else {
        const { row: sRow, col: sCol } = selectedCandy;

        if (sRow === row && sCol === col) {
            // Deselect
            selectedCandy = null;
            renderGrid();
        } else if (isAdjacent(sRow, sCol, row, col)) {
            // Swap
            swapCandies(sRow, sCol, row, col);
        } else {
            // Select new candy
            selectedCandy = { row, col };
            renderGrid();
        }
    }
}

// Update stats
function updateStats() {
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('movesValue').textContent = moves;
    document.getElementById('levelValue').textContent = level;
}

// Check level up
function checkLevelUp() {
    const newLevel = Math.floor(score / 500) + 1;
    if (newLevel > level) {
        level = newLevel;
        showNotification(`🎉 Level ${level} Unlocked!`);
    }
}

// Show notification
function showNotification(message) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 2000;
        animation: slideUp 0.3s ease;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// End game
function endGame() {
    gameOver = true;
    document.getElementById('gameOverModal').style.display = 'flex';
    document.getElementById('finalScore').textContent = score;

    // Set message based on score
    let message = '';
    if (score < 200) {
        message = 'اور بہتری کی ضرورت ہے! 💪';
    } else if (score < 500) {
        message = 'عمدہ کوشش! 🌟';
    } else if (score < 1000) {
        message = 'بہت خوب! 🎊';
    } else {
        message = 'حیرت انگیز! آپ ایک چیمپیئن ہیں! 👑';
    }
    document.getElementById('gameMessage').textContent = message;

    // Send score to Telegram
    if (tg && tg.sendData) {
        tg.sendData(JSON.stringify({ score, level }));
    }
}

// Reset game
function resetGame() {
    score = 0;
    moves = INITIAL_MOVES;
    level = 1;
    gameOver = false;
    selectedCandy = null;
    animating = false;
    
    document.getElementById('gameOverModal').style.display = 'none';
    updateStats();
    initGame();
}

// Share score
function shareScore() {
    const message = `🍬 Candy Crush میں میرا Score: ${score} 🎮\nLevel: ${level}\n\nکیا تم یہ Score ہرا سکتے ہو?`;
    
    if (tg && tg.shareUrl) {
        tg.shareUrl('https://your-app-url.vercel.app', message);
    } else {
        alert(message);
    }
}

// Open settings
function openSettings() {
    alert('⚙️ Settings\n\n🔊 Sound: ' + (true ? 'On' : 'Off') + '\n\n🌙 Dark Mode: ' + (true ? 'On' : 'Off'));
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !gameOver) {
        resetGame();
    }
});

// Start game on load
window.addEventListener('load', () => {
    initGame();
    updateStats();
});

// Export for debugging
window.gameDebug = {
    getGrid: () => gameGrid,
    getScore: () => score,
    getMoves: () => moves,
    getLevel: () => level,
    forceGameOver: endGame
};
