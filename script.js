class Minesweeper {
    constructor(boardSize = 10, mineCount = 10) {
        this.boardSize = boardSize;
        this.mineCount = mineCount;
        this.board = [];
        this.gameOver = false;
        this.timer = 0;
        this.timerInterval = null;
        this.minesLeft = mineCount;

        this.init();
    }

    init() {
        // Create board
        for (let i = 0; i < this.boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j] = {
                    isMine: false,
                    revealed: false,
                    flagged: false,
                    neighborMines: 0
                };
            }
        }

        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < this.mineCount) {
            const row = Math.floor(Math.random() * this.boardSize);
            const col = Math.floor(Math.random() * this.boardSize);
            if (!this.board[row][col].isMine) {
                this.board[row][col].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate neighbor mines
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (!this.board[i][j].isMine) {
                    this.board[i][j].neighborMines = this.countNeighborMines(i, j);
                }
            }
        }

        this.renderBoard();
        this.updateMinesCount();
        this.startTimer();
    }

    countNeighborMines(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < this.boardSize && 
                    newCol >= 0 && newCol < this.boardSize && 
                    this.board[newRow][newCol].isMine) {
                    count++;
                }
            }
        }
        return count;
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (this.board[i][j].revealed) {
                    cell.classList.add('revealed');
                    if (this.board[i][j].isMine) {
                        cell.classList.add('mine');
                        cell.textContent = '💣';
                    } else if (this.board[i][j].neighborMines > 0) {
                        cell.textContent = this.board[i][j].neighborMines;
                    }
                } else if (this.board[i][j].flagged) {
                    cell.classList.add('flagged');
                    cell.textContent = '🚩';
                }

                cell.addEventListener('click', (e) => this.handleClick(i, j));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleRightClick(i, j);
                });

                boardElement.appendChild(cell);
            }
        }
    }

    handleClick(row, col) {
        if (this.gameOver || this.board[row][col].flagged) return;

        if (this.board[row][col].isMine) {
            this.gameOver = true;
            this.revealAll();
            alert('Game Over!');
            this.stopTimer();
            return;
        }

        this.reveal(row, col);
        this.renderBoard();

        if (this.checkWin()) {
            this.gameOver = true;
            alert('You Win!');
            this.stopTimer();
        }
    }

    handleRightClick(row, col) {
        if (this.gameOver || this.board[row][col].revealed) return;

        this.board[row][col].flagged = !this.board[row][col].flagged;
        this.minesLeft += this.board[row][col].flagged ? -1 : 1;
        this.updateMinesCount();
        this.renderBoard();
    }

    reveal(row, col) {
        if (row < 0 || row >= this.boardSize || 
            col < 0 || col >= this.boardSize || 
            this.board[row][col].revealed || 
            this.board[row][col].flagged) {
            return;
        }

        this.board[row][col].revealed = true;

        if (this.board[row][col].neighborMines === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    this.reveal(row + i, col + j);
                }
            }
        }
    }

    revealAll() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j].revealed = true;
            }
        }
        this.renderBoard();
    }

    checkWin() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (!this.board[i][j].isMine && !this.board[i][j].revealed) {
                    return false;
                }
            }
        }
        return true;
    }

    updateMinesCount() {
        document.getElementById('mines-count').textContent = this.minesLeft;
    }

    startTimer() {
        this.stopTimer();
        this.timer = 0;
        document.getElementById('timer').textContent = this.timer;
        this.timerInterval = setInterval(() => {
            this.timer++;
            document.getElementById('timer').textContent = this.timer;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

// Initialize game
let game = new Minesweeper();

// Reset button
document.getElementById('reset').addEventListener('click', () => {
    game = new Minesweeper();
});
