const levels = [
    { names: ["L Lawliet", "L"], image: "images/L.png" },
    { names: ["Luffy", "Monkey D. Luffy", "One Piece"], image: "images/luffy.png" },
    { names: ["Goku", "Son Goku"], image: "images/goku.png" },
    { names: ["Aki", "Aki Hayakawa"], image: "images/Aki Hayakawa.png" },
    { names: ["Beam"], image: "images/Beam.png" },
    { names: ["Denji"], image: "images/Denji.png" },
    { names: ["Zero Two", "002"], image: "images/ZeroTwo.png" },
    { names: ["Casca"], image: "images/Casca.png" },
    {names: ["C.C.", "CC","C2"], image: "images/C.C..png" }
];

let currentLevel = 0;
let currentBlur = 9;
let attemptsOnCurrent = 0;
let userHistory = [];

const imgElement = document.getElementById('character-image');
const inputElement = document.getElementById('guess-input');
const messageElement = document.getElementById('message');

const themeButton = document.getElementById('theme-toggle');
const body = document.body;

function checkTheme() {
    const savedTheme = localStorage.getItem('theme');

    if(savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
}

checkTheme();

themeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light')
    }
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadLevel() {

    if (currentLevel < levels.length) {
        attemptsOnCurrent = 0;
        currentBlur = 9;

        imgElement.style.opacity = "0";
        imgElement.style.filter = `blur(${currentBlur}px)`;
        imgElement.src = levels[currentLevel].image;

        setTimeout(() => {
            imgElement.style.opacity = "1";
        }, 150);

        document.body.classList.add('no-scroll');
        inputElement.value = "";
        inputElement.disabled = false;
        document.getElementById('level-title').innerText = `Postać ${currentLevel + 1} / ${levels.length}`;
        messageElement.innerText = "";
        inputElement.focus();
    } else {
        showEndScreen();
    }
}

function checkGuess() {
    if (inputElement.disabled) return;

    const rawInput = inputElement.value.trim();
    const userGuess = rawInput.toLowerCase();

    if (userGuess === "") return;

// --- BEZPIECZNA LOGIKA ADMINA ---
    if (userGuess === "adm") {
        // 1. Zatrzymujemy wszelkie animacje obrazka
        imgElement.style.opacity = "1";
        
        // 2. Uzupełniamy historię brakującymi postaciami (opcjonalnie)
        // Sprawdzamy, czy i nie wykracza poza zakres levels
        for (let i = currentLevel; i < levels.length; i++) {
            if (levels[i]) {
                userHistory.push({
                    image: levels[i].image,
                    name: levels[i].names[0],
                    fails: 0
                });
            }
        }
        
        // 3. Przeskakujemy licznik do końca
        currentLevel = levels.length;
        // 4. Odpalamy ekran końcowy
        showEndScreen();
        return; 
    }

    const validNames = levels[currentLevel].names.map(n => n.toLowerCase());
    const isCorrect = validNames.includes(userGuess);

    if (isCorrect) {
        userHistory.push({
            image: levels[currentLevel].image,
            name: levels[currentLevel].names[0],
            fails: attemptsOnCurrent
        });
         imgElement.style.filter = "blur(0px)";
        
        inputElement.disabled = true; // To wywoła efekt scale(1.1) z CSS

        currentLevel++;
        setTimeout(loadLevel, 1000);
    } else {
        attemptsOnCurrent++;
        currentBlur = Math.max(0, currentBlur - 3);
        imgElement.style.filter = `blur(${currentBlur}px)`;

        // Efekt błędu
        inputElement.classList.add('error-shake');

        setTimeout(() => {
            inputElement.classList.remove('error-shake'); // Płynny powrót dzięki transition w CSS
            inputElement.value = "";
            inputElement.focus();
        }, 1000);
    }

}



function showEndScreen() {
    document.body.classList.add('no-scroll');
    document.getElementById('game-content').style.display = "none";
    const endScreen = document.getElementById('end-screen');
    endScreen.style.display = "block";

    // Tworzymy kontener, jeśli go nie ma w HTML, lub czyścimy stary
    const statsBody = document.getElementById('stats-body');
    statsBody.innerHTML = ""; 

    userHistory.forEach(item => {
        const statusClass = item.fails === 0 ? 'status-perfect' : 'status-struggled';
        const statusText = item.fails === 0 ? 'Perfekcyjnie' : `Błędy: ${item.fails}`;

        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="result-info">
                <span class="result-name">${item.name}</span>
            </div>
            <div class="status-badge ${statusClass}">${statusText}</div>
        `;
        statsBody.appendChild(card);
    });

    document.getElementById('final-summary').innerText = `${levels.length}/${levels.length} postaci odgadniętych!`;
}



inputElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkGuess();
});

// Start gry
shuffle(levels);
loadLevel();