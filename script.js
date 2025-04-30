// Generate random combination based on difficulty level
function generateCombination(digits) {
    let combination = '';
    for (let i = 0; i < digits; i++) {
        combination += Math.floor(Math.random() * 10); // Generate random number between 0-9
    }
    return combination;
}

// Initialize game variables
let target;
let guesses = 0;  // To track the number of guesses
let timer = 30;  // Time in seconds
let timerInterval; // Timer interval to clear it later
let startTime; // Start time of the game in milliseconds
let previousTimes = []; // Store previous game times
let gamePaused = false; // Flag to check if the game is paused

// Elements for dynamic changes
const inputsContainer = document.getElementById("guess-container");
const difficultySelect = document.getElementById("difficulty");
const guessCountElement = document.getElementById("guess-count");
const previousTimesList = document.getElementById("previous-times-list");
const submitButton = document.getElementById("submit");
const newGameButton = document.getElementById("new-game-btn");
const timerBar = document.getElementById("timer-bar");  // The timer progress bar

// Function to format time in MM:SS.mmm format (rounded to 3 decimal places)
function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.round(ms % 1000); // Round to nearest 3 digits
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}.${milliseconds < 100 ? '0' : ''}${milliseconds}`;
}

// Function to start a new game
function startNewGame() {
    // Reset game state
    guesses = 0;
    document.getElementById("result-container").innerHTML = '';
    guessCountElement.textContent = `Guesses: ${guesses}`;

    // Get selected difficulty level (number of digits)
    const difficulty = parseInt(difficultySelect.value);
    
    // Generate a new target combination based on difficulty level
    target = generateCombination(difficulty);

    // Clear previous inputs and create new input fields
    inputsContainer.innerHTML = ''; // Clear the container
    for (let i = 0; i < difficulty; i++) {
        const input = document.createElement("input");
        input.type = "number";
        input.max = 9;
        input.min = 0;
        input.id = `guess${i + 1}`;
        input.maxLength = 1;
        inputsContainer.appendChild(input);
    }

    // Reset the timer bar to 100% width immediately when a new game starts
    timerBar.style.width = '100%'; // Set the timer bar to full width
    clearInterval(timerInterval);
    timer = 30;  // Set to 30 seconds for each round
    startTimer();
    
    // Set the start time for the game
    startTime = performance.now();

    // Focus on the first input box
    document.getElementById("guess1").focus();

    // Add event listeners for each input to auto-tab to the next input
    const inputs = document.querySelectorAll('#guess-container input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });

    // Enable submit button and input fields
    submitButton.disabled = false;
    newGameButton.style.display = 'none';  // Hide the new game button at the start
    gamePaused = false; // Game is not paused at the start
}

// Timer countdown and update the timer bar
function startTimer() {
    const initialWidth = 100;  // Full width at the start
    const totalTime = 30;  // Total time for the round (in seconds)
    
    timerInterval = setInterval(() => {
        if (timer > 0 && !gamePaused) {
            timer--;
            const remainingWidth = (timer / totalTime) * initialWidth;  // Calculate width for the bar
            timerBar.style.width = `${remainingWidth}%`;  // Update the timer bar width
        } else if (timer === 0) {
            clearInterval(timerInterval);
            alert("Time's up! Game Over.");
        }
    }, 1000);
}

// Handle the submission of the guess
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !gamePaused) {
        const guess = Array.from(inputsContainer.children).map(input => input.value).join('');
        if (guess.length !== target.length) {
            alert('Please enter a complete guess.');
            return;
        }

        guesses++;  // Increment the number of guesses

        const resultContainer = document.getElementById('result-container');
        let resultHTML = '';
        for (let i = 0; i < target.length; i++) {
            const currentDigit = guess[i];
            const targetDigit = target[i];

            if (currentDigit === targetDigit) {
                resultHTML += `<div class="green">${currentDigit}</div>`;
            } else if (target.includes(currentDigit)) {
                resultHTML += `<div class="yellow">${currentDigit}</div>`;
            } else {
                resultHTML += `<div class="no-color">${currentDigit}</div>`;
            }
        }

        resultContainer.innerHTML = resultHTML;

        // Check if the guess is correct
        if (guess === target) {
            const endTime = performance.now();
            const timeTaken = endTime - startTime; // Time in milliseconds
            
            // Format and round time to the nearest second with 3 decimal places
            const formattedTime = formatTime(timeTaken);
            
            alert(`Congratulations! You guessed the right combination in ${formattedTime}!`);
            
            // Store the time and display it in the list
            previousTimes.push(formattedTime);
            updatePreviousTimes();

            // Pause the timer and disable the submit button
            clearInterval(timerInterval);
            submitButton.disabled = true;
            newGameButton.style.display = 'block';  // Show the new game button
            gamePaused = true; // Pause the game
        }

        // Clear input fields after guess
        Array.from(inputsContainer.children).forEach(input => {
            input.value = '';
        });

        // Focus on the first input box for the next guess
        inputsContainer.children[0].focus();

        // Update guess counter
        guessCountElement.textContent = `Guesses: ${guesses}`;
    }

    // Backspace: Move to the previous input field and clear it
    if (event.key === 'Backspace') {
        let currentInput = document.activeElement;
        if (currentInput && currentInput.value === "") {
            const previousInput = currentInput.previousElementSibling;
            if (previousInput) {
                previousInput.focus();
            }
        }
    }
});

// Update the list of previous times
function updatePreviousTimes() {
    previousTimesList.innerHTML = ''; // Clear previous list
    previousTimes.forEach(time => {
        const listItem = document.createElement('li');
        listItem.textContent = time;
        previousTimesList.appendChild(listItem);
    });
}

// Start a new game when the button is clicked
document.getElementById("new-game-btn").addEventListener('click', startNewGame);

// Start the initial game
startNewGame();
