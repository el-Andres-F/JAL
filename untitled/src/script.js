let sequence = [];
let userInput = [];
let level = 0;
let mode = '';

function startGame(selectedMode) {
    mode = selectedMode;
    level = 0;
    sequence = [];
    userInput = [];
    document.getElementById('modes').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    nextLevel();
}

function nextLevel() {
    userInput = [];
    level++;
    document.getElementById('level').innerText = `Nivel ${level}`;

    if (mode === 'desafio' && level === 1) {
        sequence.push(Math.floor(Math.random() * 8) + 1);
        sequence.push(Math.floor(Math.random() * 8) + 1);
    } else {
        sequence.push(Math.floor(Math.random() * 8) + 1);
    }

    showSequence();
}

function showSequence() {
    let i = 0;
    const interval = setInterval(() => {
        lightUp(sequence[i]);
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
        }
    }, 1000);
}

function lightUp(color) {
    const colorDivs = document.getElementsByClassName('color');
    colorDivs[color - 1].style.opacity = '1';
    setTimeout(() => {
        colorDivs[color - 1].style.opacity = '0.7';
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
