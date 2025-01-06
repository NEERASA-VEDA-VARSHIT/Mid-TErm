let flashcards = [];
let currentIndex = 0;

const fileInput = document.getElementById('textFile');
const flashcardsContainer = document.getElementById('flashcardsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const flipBtn = document.getElementById('flipBtn');
const currentCardSpan = document.getElementById('currentCard');
const totalCardsSpan = document.getElementById('totalCards');

fileInput.addEventListener('change', handleFileSelect);
prevBtn.addEventListener('click', showPreviousCard);
nextBtn.addEventListener('click', showNextCard);
flipBtn.addEventListener('click', flipCard);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        processFileContent(e.target.result);
    };
    reader.readAsText(file);
}

function processFileContent(content) {
    flashcards = content.split('\n')
        .filter(line => line.trim() && line.includes('-'))
        .map(line => {
            const [term, definition] = line.split('-').map(str => str.trim());
            return { term, definition };
        });

    if (flashcards.length > 0) {
        currentIndex = 0;
        updateButtonStates();
        displayCurrentCard();
        updateProgress();
    }
}

function createFlashcardElement(flashcard) {
    const cardElement = document.createElement('div');
    cardElement.className = 'flashcard';
    
    cardElement.innerHTML = `
        <div class="flashcard-front">
            ${flashcard.term}
        </div>
        <div class="flashcard-back">
            ${flashcard.definition}
        </div>
    `;
    
    return cardElement;
}

function displayCurrentCard() {
    if (flashcards.length === 0) return;

    flashcardsContainer.innerHTML = '';
    const cardElement = createFlashcardElement(flashcards[currentIndex]);
    flashcardsContainer.appendChild(cardElement);
    flipBtn.disabled = false;
}

function showPreviousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        const cardElement = flashcardsContainer.querySelector('.flashcard');
        if (cardElement.classList.contains('flipped')) {
            cardElement.classList.remove('flipped');
        }
        updateButtonStates();
        displayCurrentCard();
        updateProgress();
    }
}

function showNextCard() {
    if (currentIndex < flashcards.length - 1) {
        currentIndex++;
        const cardElement = flashcardsContainer.querySelector('.flashcard');
        if (cardElement.classList.contains('flipped')) {
            cardElement.classList.remove('flipped');
        }
        updateButtonStates();
        displayCurrentCard();
        updateProgress();
    }
}

function flipCard() {
    const cardElement = flashcardsContainer.querySelector('.flashcard');
    cardElement.classList.toggle('flipped');
}

function updateButtonStates() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === flashcards.length - 1;
    flipBtn.disabled = flashcards.length === 0;
}

function updateProgress() {
    currentCardSpan.textContent = flashcards.length > 0 ? currentIndex + 1 : 0;
    totalCardsSpan.textContent = flashcards.length;
}
