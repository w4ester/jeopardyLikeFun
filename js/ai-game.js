class JeopardyGame {
    constructor() {
        this.currentQuestion = null;
        this.players = [
            { name: 'Player 1', score: 0 },
            { name: 'Player 2', score: 0 },
            { name: 'Player 3', score: 0 }
        ];
        this.categories = [
            // Categories from gameAI.html
        ];
        this.initializeGame();
    }

    initializeGame() {
        this.renderBoard();
        this.renderPlayers();
    }

    renderBoard() {
        const board = document.getElementById('gameBoard');
        
        // Render categories
        this.categories.forEach(category => {
            const categoryEl = document.createElement('div');
            categoryEl.className = 'category';
            categoryEl.textContent = category.name;
            board.appendChild(categoryEl);
        });

        // Render question tiles
        for (let i = 0; i < 5; i++) {
            this.categories.forEach(category => {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.textContent = '$' + category.questions[i].value;
                tile.addEventListener('click', () => this.showQuestion(category, i));
                board.appendChild(tile);
            });
        }
    }

    renderPlayers() {
        const playersContainer = document.getElementById('players');
        playersContainer.innerHTML = this.players.map((player, index) => `
            <div class="player">
                <h2>${player.name}</h2>
                <div class="score">$${player.score}</div>
                <div class="controls">
                    <button onclick="game.awardPoints(${index}, true)">Correct</button>
                    <button onclick="game.awardPoints(${index}, false)">Incorrect</button>
                </div>
            </div>
        `).join('');
    }

    showQuestion(category, index) {
        const question = category.questions[index];
        this.currentQuestion = { ...question, categoryIndex: this.categories.indexOf(category), questionIndex: index };

        const modal = document.getElementById('questionModal');
        const questionText = document.getElementById('questionText');
        const answerText = document.getElementById('answerText');

        questionText.textContent = question.question;
        answerText.textContent = question.answer;
        answerText.style.display = 'none';

        modal.style.display = 'flex';
    }

    revealAnswer() {
        document.getElementById('answerText').style.display = 'block';
    }

    awardPoints(playerIndex, correct) {
        const pointValue = correct ? this.currentQuestion.value : -this.currentQuestion.value;
        this.players[playerIndex].score += pointValue;
        this.renderPlayers();

        // Mark question as used
        const tileIndex = this.currentQuestion.categoryIndex + (this.currentQuestion.questionIndex * this.categories.length);
        const tiles = document.getElementsByClassName('tile');
        tiles[tileIndex].classList.add('used');

        // Close modal
        document.getElementById('questionModal').style.display = 'none';
        this.currentQuestion = null;
    }
}

// Initialize game
const game = new JeopardyGame();

// Close modal when clicking outside
document.getElementById('questionModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('questionModal')) {
        e.target.style.display = 'none';
    }
});