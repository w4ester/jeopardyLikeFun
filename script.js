// Initialize IndexedDB
let db;
const request = indexedDB.open('JeopardyDB', 1);

request.onerror = (event) => {
    console.error('Database error:', event.target.error);
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    
    if (!db.objectStoreNames.contains('categories')) {
        const categoryStore = db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
        categoryStore.createIndex('name', 'name', { unique: false });
    }
    
    if (!db.objectStoreNames.contains('questions')) {
        const questionStore = db.createObjectStore('questions', { keyPath: 'id', autoIncrement: true });
        questionStore.createIndex('categoryId', 'categoryId', { unique: false });
    }
    
    if (!db.objectStoreNames.contains('contestants')) {
        const contestantStore = db.createObjectStore('contestants', { keyPath: 'id', autoIncrement: true });
        contestantStore.createIndex('name', 'name', { unique: false });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    loadGameData();
};

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.querySelector(`.tab[onclick="showTab('${tabName}')"]`).classList.add('active');
}

function handleFileUploads() {
    const gameDataFile = document.getElementById('gameDataFile').files[0];
    const contestantsFile = document.getElementById('contestantsFile').files[0];

    if (gameDataFile) {
        Papa.parse(gameDataFile, {
            complete: function(results) {
                processGameData(results.data);
            }
        });
    }

    if (contestantsFile) {
        Papa.parse(contestantsFile, {
            complete: function(results) {
                processContestants(results.data);
            }
        });
    }
}

function processGameData(data) {
    const transaction = db.transaction(['categories', 'questions'], 'readwrite');
    const categoryStore = transaction.objectStore('categories');
    const questionStore = transaction.objectStore('questions');

    data.shift(); // Skip header row
    
    const categories = {};
    data.forEach(row => {
        if (row.length < 4) return;
        const [category, question, answer, points] = row;
        
        if (!categories[category]) {
            categories[category] = [];
        }
        
        categories[category].push({
            question,
            answer,
            points: parseInt(points)
        });
    });

    Object.entries(categories).forEach(([categoryName, questions]) => {
        const categoryRequest = categoryStore.add({ name: categoryName });
        
        categoryRequest.onsuccess = (event) => {
            const categoryId = event.target.result;
            questions.forEach(q => {
                questionStore.add({
                    categoryId,
                    ...q
                });
            });
        };
    });

    transaction.oncomplete = () => {
        loadGameData();
        showMessage('Game data uploaded successfully!', 'success');
    };
}

function processContestants(data) {
    const transaction = db.transaction(['contestants'], 'readwrite');
    const contestantStore = transaction.objectStore('contestants');

    data.shift(); // Skip header row
    
    data.forEach(row => {
        if (row.length < 1) return;
        contestantStore.add({ name: row[0] });
    });

    transaction.oncomplete = () => {
        loadGameData();
        showMessage('Contestants uploaded successfully!', 'success');
    };
}

function addQuestion() {
    const container = document.getElementById('questionsContainer');
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-container';
    questionDiv.innerHTML = `
        <div class="form-group">
            <label>Question:</label>
            <input type="text" class="question" required>
        </div>
        <div class="form-group">
            <label>Answer:</label>
            <input type="text" class="answer" required>
        </div>
        <div class="form-group">
            <label>Points:</label>
            <input type="number" class="points" required min="100" step="100" value="200">
        </div>
    `;
    container.appendChild(questionDiv);
}

function addContestant() {
    const name = document.getElementById('contestantName').value;
    if (!name) return;

    const transaction = db.transaction(['contestants'], 'readwrite');
    const contestantStore = transaction.objectStore('contestants');
    
    contestantStore.add({ name });
    
    transaction.oncomplete = () => {
        document.getElementById('contestantName').value = '';
        loadGameData();
        showMessage('Contestant added successfully!', 'success');
    };
}

function loadGameData() {
    const gameDataDiv = document.getElementById('gameData');
    gameDataDiv.innerHTML = '<h3>Loading...</h3>';

    const categories = [];
    const questions = {};
    const contestants = [];

    const transaction = db.transaction(['categories', 'questions', 'contestants'], 'readonly');

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

    transaction.objectStore('contestants').openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            contestants.push(cursor.value);
            cursor.continue();
        }
    };

    transaction.oncomplete = () => {
        let html = '<div class="preview-section">';
        
        html += '<h3>Categories and Questions</h3>';
        html += '<table>';
        html += '<tr><th>Category</th><th>Question</th><th>Answer</th><th>Points</th></tr>';
        
        categories.forEach(category => {
            const categoryQuestions = questions[category.id] || [];
            categoryQuestions.forEach((q, i) => {
                html += `
                    <tr>
                        <td>${i === 0 ? category.name : ''}</td>
                        <td>${q.question}</td>
                        <td>${q.answer}</td>
                        <td>$${q.points}</td>
                    </tr>
                `;
            });
        });
        
        html += '</table>';

        html += '<h3>Contestants</h3>';
        html += '<table>';
        html += '<tr><th>Name</th></tr>';
        
        contestants.forEach(contestant => {
            html += `
                <tr>
                    <td>${contestant.name}</td>
                </tr>
            `;
        });
        
        html += '</table>';
        html += '</div>';

        gameDataDiv.innerHTML = html;
    };
}

function showMessage(message, type) {
    const div = document.createElement('div');
    div.textContent = message;
    div.className = type;
    document.querySelector('.container').appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// Initialize manual entry form
document.getElementById('manualEntryForm').onsubmit = function(e) {
    e.preventDefault();
    
    const categoryName = document.getElementById('categoryName').value;
    const questions = Array.from(document.getElementsByClassName('question-container')).map(container => ({
        question: container.querySelector('.question').value,
        answer: container.querySelector('.answer').value,
        points: parseInt(container.querySelector('.points').value)
    }));

    const transaction = db.transaction(['categories', 'questions'], 'readwrite');
    const categoryStore = transaction.objectStore('categories');
    const questionStore = transaction.objectStore('questions');

    const categoryRequest = categoryStore.add({ name: categoryName });
    
    categoryRequest.onsuccess = (event) => {
        const categoryId = event.target.result;
        questions.forEach(q => {
            questionStore.add({
                categoryId,
                ...q
            });
        });
    };

    transaction.oncomplete = () => {
        document.getElementById('categoryName').value = '';
        document.getElementById('questionsContainer').innerHTML = '';
        loadGameData();
        showMessage('Category and questions added successfully!', 'success');
    };
};