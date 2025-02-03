class JeopardyGame {
    constructor() {
        this.loadGameData();
        this.currentQuestion = null;
        this.contestants = [];
    }

    async loadGameData() {
        const request = indexedDB.open('JeopardyDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            this.loadCategories(db);
            this.loadContestants(db);
        };
    }

    loadCategories(db) {
        const transaction = db.transaction(['categories', 'questions'], 'readonly');
        const categories = [];
        const questions = {};

        transaction.objectStore('categories').openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                categories.push(cursor.value);
                cursor.continue();
            }
        };

        transaction.objectStore('questions').openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const question = cursor.value;
                if (!questions[question.categoryId]) {
                    questions[question.categoryId] = [];
                }
                questions[question.categoryId].push(question);
                cursor.continue();
            }
        };

        transaction.oncomplete = () => {
            this.renderGameBoard(categories, questions);
        };
    }

    loadContestants(db) {
        const transaction = db.transaction(['contestants'], 'readonly');
        
        transaction.objectStore('contestants').openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                this.contestants.push({...cursor.value, score: 0});
                cursor.continue();
            } else {
                this.renderContestants();
            }
        };
    }

    renderGameBoard(categories, questions) {
        const board = document.getElementById('gameBoard');
        
        let html = categories.map(category => 
            `<div class="category-header">${category.name}</div>`
        ).join('');

        categories.forEach(category => {
            const categoryQuestions = questions[category.id] || [];
            categoryQuestions.sort((a, b) => a.points - b.points);
            
            categoryQuestions.forEach(question => {
                html += `
                    <div class="question-cell" data-question='${JSON.stringify(question)}'>
                        $${question.points}
                    </div>
                `;
            });
        });

        board.innerHTML = html;
        
        board.querySelectorAll('.question-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const question = JSON.parse(e.target.dataset.question);
                this.showQuestion(question);
                e.target.style.visibility = 'hidden';
            });
        });
    }

    renderContestants() {
        const container = document.getElementById('contestants');
        container.innerHTML = this.contestants.map(contestant => `
            <div class="contestant">
                <h3>${contestant.name}</h3>
                <p>$${contestant.score}</p>
                <button onclick="game.awardPoints(${contestant.id}, true)">Correct (+)</button>
                <button onclick="game.awardPoints(${contestant.id}, false)">Incorrect (-)</button>
            </div>
        `).join('');
    }

    showQuestion(question) {
        this.currentQuestion = question;
        const overlay = document.createElement('div');
        overlay.className = 'question-display';
        overlay.innerHTML = `
            <div>
                <div class="question-content">${question.question}</div>
                <button onclick="game.showAnswer(this)">Show Answer</button>
                <div class="answer-content" style="display: none;">${question.answer}</div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    showAnswer(button) {
        button.nextElementSibling.style.display = 'block';
    }

    awardPoints(contestantId, correct) {
        const contestant = this.contestants.find(c => c.id === contestantId);
        if (contestant && this.currentQuestion) {
            contestant.score += correct ? this.currentQuestion.points : -this.currentQuestion.points;
            this.renderContestants();
            document.querySelector('.question-display').remove();
            this.currentQuestion = null;
        }
    }
}

const game = new JeopardyGame();
window.game = game;