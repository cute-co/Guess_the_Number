// Game variables
let randomNumber;
let guesses = 0;
let gameOver = false;
let playerName = localStorage.getItem('playerName') || '';

// DOM elements
const guessInput = document.getElementById('guess');
const submitButton = document.getElementById('submit-guess');
const newGameButton = document.getElementById('new-game');
const messageElement = document.getElementById('message');
const statsElement = document.getElementById('stats');
const highscoreList = document.getElementById('highscore-list');

// Initialize the game
function initGame() {
    // If no player name is stored, ask for one
    if (!playerName) {
        playerName = prompt('Please enter your name:') || 'Anonymous';
        localStorage.setItem('playerName', playerName);
    }
    
    randomNumber = Math.floor(Math.random() * 100) + 1;
    guesses = 0;
    gameOver = false;
    
    messageElement.textContent = 'Start guessing!';
    messageElement.className = '';
    statsElement.textContent = '';
    guessInput.value = '';
    guessInput.focus();
    
    // Load high scores from localStorage
    loadHighScores();
}

// Process the player's guess
function processGuess() {
    if (gameOver) return;
    
    const userGuess = parseInt(guessInput.value);
    
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        messageElement.textContent = 'Please enter a valid number between 1 and 100.';
        messageElement.className = 'error';
        return;
    }
    
    guesses++;
    
    if (userGuess === randomNumber) {
        messageElement.textContent = `You guessed it right! The number was ${randomNumber}.`;
        messageElement.className = 'success';
        statsElement.textContent = `You guessed the number in ${guesses} guesses.`;
        gameOver = true;
        
        // Save score to localStorage
        saveScore(playerName, guesses);
    } else {
        if (userGuess > randomNumber) {
            messageElement.textContent = 'You guessed it wrong! Enter a smaller number.';
        } else {
            messageElement.textContent = 'You guessed it wrong! Enter a larger number.';
        }
        messageElement.className = 'error';
    }
    
    guessInput.value = '';
    guessInput.focus();
}

// Save score to localStorage
function saveScore(name, score) {
    // Get current high scores
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    
    // Add new score
    const newScore = {
        player_name: name,
        guesses: score,
        game_date: new Date().toLocaleString()
    };
    
    highScores.push(newScore);
    
    // Sort by score (lowest to highest)
    highScores.sort((a, b) => a.guesses - b.guesses);
    
    // Keep only top 10 scores
    highScores = highScores.slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem('highScores', JSON.stringify(highScores));
    
    // Check if it's a new high score (first place)
    if (highScores[0].player_name === name && highScores[0].guesses === score) {
        statsElement.textContent += ' You have just broken the high score!';
    }
    
    // Refresh high scores display
    loadHighScores();
}

// Load high scores from localStorage
function loadHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highscoreList.innerHTML = '';
    
    if (highScores.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" style="text-align: center;">No high scores yet. Be the first!</td>';
        highscoreList.appendChild(row);
        return;
    }
    
    highScores.forEach((score, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${score.player_name}</td>
            <td>${score.guesses}</td>
            <td>${score.game_date}</td>
        `;
        highscoreList.appendChild(row);
    });
}

// Event listeners
submitButton.addEventListener('click', processGuess);

guessInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        processGuess();
    }
});

newGameButton.addEventListener('click', initGame);

// Initialize game on load
document.addEventListener('DOMContentLoaded', initGame);