const gridSize = 8;
let grid = [];
let greenBoxes = [];
let redHits = 0;
let playerPositions = [];
let currentGreenBox = null;

// Start Game
function startGame() {
    createGrid();
    placeGreenBoxes();
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('status').textContent = 'Your goal is to reach the bottom right corner without hitting too many red boxes!';
}

// Create the grid
function createGrid() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            const box = document.createElement('div');
            box.classList.add('grid-item', 'empty');
            box.setAttribute('data-x', i);
            box.setAttribute('data-y', j);
            box.addEventListener('click', () => handleBoxClick(i, j));
            grid[i][j] = box;
            gridContainer.appendChild(box);
        }
    }
}

// Place two green boxes with numbers inside them
function placeGreenBoxes() {
    // Choose two random positions for the green boxes in the top-left 3x3 area
    let greenBox1 = { x: Math.floor(Math.random() * 3), y: Math.floor(Math.random() * 3) };
    let greenBox2 = { x: Math.floor(Math.random() * 3), y: Math.floor(Math.random() * 3) };
    
    // Ensure the two green boxes are placed in different locations
    while (greenBox1.x === greenBox2.x && greenBox1.y === greenBox2.y) {
        greenBox2 = { x: Math.floor(Math.random() * 3), y: Math.floor(Math.random() * 3) };
    }

    // Set numbers for green boxes and mark them as green
    greenBoxes = [greenBox1, greenBox2];
    greenBoxes.forEach((box, index) => {
        const num = Math.floor(Math.random() * 4) + 1; // Number between 1-4
        grid[box.x][box.y].classList.add('green');
        grid[box.x][box.y].textContent = num;
        grid[box.x][box.y].setAttribute('data-num', num);
    });
}

// Handle box click event
function handleBoxClick(x, y) {
    const box = grid[x][y];
    
    // If it's a green box, move it based on its number
    if (box.classList.contains('green')) {
        if (!currentGreenBox) {
            currentGreenBox = { x, y };
            box.classList.add('active');
        } else {
            moveGreenBox(x, y, parseInt(box.getAttribute('data-num')));
        }
    } else if (box.classList.contains('red')) {
        redHits++;
        if (redHits >= 3) {
            alert("Game Over! You hit 3 red boxes!");
            restartGame();
        }
    }
}

// Move green box logic
function moveGreenBox(x, y, num) {
    const currentBox = grid[currentGreenBox.x][currentGreenBox.y];
    currentBox.classList.remove('green');
    currentBox.textContent = '';

    // Find next green box position based on the number
    const nextBox = findNextGreenBox(x, y, num);
    if (nextBox) {
        grid[nextBox.x][nextBox.y].classList.add('green');
        grid[nextBox.x][nextBox.y].textContent = num;
        checkWin(nextBox.x, nextBox.y);
    }
}

// Find the next green box position based on the number
function findNextGreenBox(x, y, num) {
    const directions = [
        { dx: 0, dy: num }, // Move Down
        { dx: 0, dy: -num }, // Move Up
        { dx: num, dy: 0 }, // Move Right
        { dx: -num, dy: 0 } // Move Left
    ];

    for (let dir of directions) {
        const newX = x + dir.dx;
        const newY = y + dir.dy;
        if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
            return { x: newX, y: newY };
        }
    }
    return null;
}

// Check if the green boxes have reached the bottom right corner
function checkWin(x, y) {
    if (x === gridSize - 1 && y === gridSize - 1) {
        alert("You win! Both green boxes reached the bottom-right corner!");
        document.getElementById('restart-btn').style.display = 'block';
    }
}

// Restart the game
function restartGame() {
    grid = [];
    greenBoxes = [];
    redHits = 0;
    startGame();
}

// Start the initial game
startGame();
