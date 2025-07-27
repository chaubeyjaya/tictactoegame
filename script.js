document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const playerXIndicator = document.getElementById('player-x');
    const playerOIndicator = document.getElementById('player-o');
    const xWinsElement = document.getElementById('x-wins');
    const oWinsElement = document.getElementById('o-wins');
    const tiesElement = document.getElementById('ties');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalBtn = document.getElementById('modal-btn');

    // Game state
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let xWins = 0;
    let oWins = 0;
    let ties = 0;

    // Winning conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Initialize the game
    const initGame = () => {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        updatePlayerIndicators();
        status.textContent = `Player ${currentPlayer}'s turn`;
        
        // Clear the board
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
        });
    };

    // Handle cell click
    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // If cell already filled or game not active, ignore click
        if (gameState[clickedCellIndex] !== '' || !gameActive) return;
        
        // Update game state and UI
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Add animation class
        clickedCell.classList.add('cell-pop');
        setTimeout(() => {
            clickedCell.classList.remove('cell-pop');
        }, 300);
        
        // Check for win or draw
        checkResult();
    };

    // Check game result
    const checkResult = () => {
        let roundWon = false;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                highlightWinningCells([a, b, c]);
                break;
            }
        }
        
        // If won
        if (roundWon) {
            endGame(false);
            return;
        }
        
        // Check for draw
        if (!gameState.includes('')) {
            endGame(true);
            return;
        }
        
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updatePlayerIndicators();
        status.textContent = `Player ${currentPlayer}'s turn`;
    };

    // Highlight winning cells
    const highlightWinningCells = (cellsIndexes) => {
        cellsIndexes.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
    };

    // Update player indicators
    const updatePlayerIndicators = () => {
        if (currentPlayer === 'X') {
            playerXIndicator.classList.add('x-active');
            playerOIndicator.classList.remove('o-active');
        } else {
            playerXIndicator.classList.remove('x-active');
            playerOIndicator.classList.add('o-active');
        }
    };

    // End game
    const endGame = (isDraw) => {
        gameActive = false;
        
        if (isDraw) {
            ties++;
            tiesElement.textContent = ties;
            showModal("Game Over!", "The game ended in a draw!");
        } else {
            if (currentPlayer === 'X') {
                xWins++;
                xWinsElement.textContent = xWins;
            } else {
                oWins++;
                oWinsElement.textContent = oWins;
            }
            showModal("Game Over!", `Player ${currentPlayer} wins!`);
        }
    };

    // Show modal
    const showModal = (title, message) => {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.add('active');
    };

    // Hide modal
    const hideModal = () => {
        modal.classList.remove('active');
    };

    // Reset game (keep scores)
    const resetGame = () => {
        initGame();
    };

    // New game (reset scores)
    const newGame = () => {
        xWins = 0;
        oWins = 0;
        ties = 0;
        xWinsElement.textContent = '0';
        oWinsElement.textContent = '0';
        tiesElement.textContent = '0';
        initGame();
    };

    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetBtn.addEventListener('click', resetGame);
    newGameBtn.addEventListener('click', newGame);
    modalBtn.addEventListener('click', () => {
        hideModal();
        initGame();
    });

    // Initialize the game
    initGame();
});