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
        //messageElement.innerText = "Błędna odpowiedź";
        //messageElement.style.color = "black";
        //messageElement.style.textShadow = "0 0 1rem rgba(255, 0, 0, 1), 0 0 1rem rgba(255, 0, 0, 1)";

        setTimeout(() => {
            inputElement.classList.remove('error-shake'); // Płynny powrót dzięki transition w CSS
            inputElement.value = "";
            inputElement.focus();
        }, 1000);
    }
}

function showEndScreen() {
    document.body.classList.remove('no-scroll');
    document.getElementById('game-content').style.display = "none";
    document.getElementById('end-screen').style.display = "block";

    const tableBody = document.getElementById('stats-body');
    tableBody.innerHTML = "";

    userHistory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}"></td>
            <td>${item.name}</td>
            <td>${item.fails}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('final-summary').innerText = `Ukończyłeś wszystkie ${levels.length} poziomy!`;
}

inputElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkGuess();
});

// Start gry
shuffle(levels);
loadLevel();