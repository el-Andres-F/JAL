let sequence = [];
let userInput = [];
let level = 0;
let mode = '';

// Sonidos para cada color
const sounds = [
    new Audio('sonido1.mp3'),
    new Audio('sonido2.mp3'),
    new Audio('sonido3.mp3'),
    new Audio('sonido4.mp3'),
    new Audio('sonido5.mp3'),
    new Audio('sonido6.mp3'),
    new Audio('sonido7.mp3'),
    new Audio('sonido8.mp3')
];

function startGame(selectedMode) {
    mode = selectedMode;
    level = 0;
    sequence = [];
    userInput = [];
    document.getElementById('modes').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('message').innerText = "¡Comencemos!";
    nextLevel();
}

function nextLevel() {
    userInput = [];
    level++;
    document.getElementById('level').innerText = `Nivel ${level}`;
    document.getElementById('message').innerText = "Observa la secuencia...";

    if (mode === 'desafio' && level === 1) {
        sequence.push(Math.floor(Math.random() * 8) + 1);
        sequence.push(Math.floor(Math.random() * 8) + 1);
    } else {
        sequence.push(Math.floor(Math.random() * 8) + 1);
    }

    setTimeout(() => {
        showSequence();
    }, 1000);  // Retraso para dar tiempo al usuario a prepararse
}

function showSequence() {
    let i = 0;
    const interval = setInterval(() => {
        lightUp(sequence[i]);
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
            document.getElementById('message').innerText = "Tu turno";
        }
    }, 1000);
}

function lightUp(color) {
    const colorDivs = document.getElementsByClassName('color');
    const div = colorDivs[color - 1];
    div.style.opacity = '1';
    div.classList.add('active');
    sounds[color - 1].play();

    setTimeout(() => {
        div.style.opacity = '0.7';
        div.classList.remove('active');
    }, 500);
}

function userClick(color) {
    userInput.push(color);
    lightUp(color);
    checkInput();
}

function checkInput() {
    const index = userInput.length - 1;
    if (userInput[index] !== sequence[index]) {
        document.getElementById('message').innerText = "¡Fallaste! Reiniciando...";
        setTimeout(() => {
            resetGame();
        }, 2000);
    } else if (userInput.length === sequence.length) {
        document.getElementById('message').innerText = "¡Correcto! Pasando al siguiente nivel...";
        setTimeout(() => {
            nextLevel();
        }, 2000);
    }
}

function resetGame() {
    document.getElementById('modes').classList.remove('hidden');
    document.getElementById('game').classList.add('hidden');
    document.getElementById('level').innerText = '';
    document.getElementById('message').innerText = '';
}
