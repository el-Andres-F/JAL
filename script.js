document.addEventListener('DOMContentLoaded', (event) => {
    hideGameOverModal();
    const music = document.getElementById('background-music');
    music.volume = 0.1; // Volumen inicial bajo
    music.play().catch(error => {
        console.log("Auto-play fue bloqueado:", error);
    });
});

// Función para mostrar u ocultar el menú de control de audio
function toggleMusicMenu() {
    const musicMenu = document.getElementById('music-menu');
    musicMenu.classList.toggle('hidden');
}

// Función para pausar o reanudar la música y actualizar el ícono
function togglePlayPause() {
    const music = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (music.paused) {
        music.play();
        playPauseBtn.innerHTML = '⏸️';
        document.getElementById('music-icon').classList.replace('fa-volume-mute', 'fa-volume-up');
    } else {
        music.pause();
        playPauseBtn.innerHTML = '▶️';
        document.getElementById('music-icon').classList.replace('fa-volume-up', 'fa-volume-mute');
    }
}

// Función para ajustar el volumen (ya existente)
function setVolume(volume) {
    const music = document.getElementById('background-music');
    music.volume = volume;
}

let sequence = [];
let userInput = [];
let level = 0;
let mode = '';
let lives = 3;
let inputEnabled = true;
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
    lives = mode === 'desafio' ? 1 : 3;
    inputEnabled = true;
    document.getElementById('modes').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('message').innerText = "¡Comencemos!";
    document.getElementById('lives').innerText = `Vidas: ${lives}`;
    hideGameOverModal();
    nextLevel();
}

function nextLevel() {
    userInput = [];
    level++;
    inputEnabled = false;
    if (mode === 'desafio') {
        for (let i = 0; i < level; i++) {
            sequence.push(Math.floor(Math.random() * 8) + 1);
        }
    } else {
        sequence.push(Math.floor(Math.random() * 8) + 1);
    }

    document.getElementById('level').innerText = `Nivel ${level}`;
    document.getElementById('message').innerText = "Observa la secuencia...";
    setTimeout(() => {
        showSequence();
    }, mode === 'desafio' ? Math.max(1000 - (level * 100), 200) : 1000);
}

function showSequence() {
    let i = 0;
    const intervalTime = mode === 'desafio' ? Math.max(1000 - (level * 100), 300) : 1000;
    const interval = setInterval(() => {
        lightUp(sequence[i]);
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
            document.getElementById('message').innerText = "Tu turno";
            inputEnabled = true;
        }
    }, intervalTime);
}

function lightUp(color) {
    const colorDivs = document.getElementsByClassName('color');
    const div = colorDivs[color - 1];
    div.style.opacity = '1';
    div.classList.add('active');
    sounds[color - 1].play();

    setTimeout(() => {
        div.style.opacity = '1';
        div.classList.remove('active');
    }, 500);
}

function userClick(color) {
    if (lives > 0 && inputEnabled) {
        userInput.push(color);
        lightUp(color);
        checkInput();
    }
}

function checkInput() {
    const index = userInput.length - 1;
    
    if (userInput[index] !== sequence[index]) {
        lives--; 
        inputEnabled = false;
        document.getElementById('lives').innerText = `Vidas: ${lives}`;
        
        if (lives === 0) {
            document.getElementById('game').classList.add('hidden');
            showGameOverModal();
        } else {
            document.getElementById('message').innerText = "¡Fallaste!";
            setTimeout(() => {
                document.getElementById('message').innerText = "Repitiendo la secuencia...";
                userInput = [];
                showSequence();
            }, 2000);
        }
        
    } else if (userInput.length === sequence.length) {
        document.getElementById('message').innerText = "¡Correcto! Pasando al siguiente nivel...";
        setTimeout(() => {
            nextLevel();
        }, 2000);
    }
}

function resetGame() {
    hideGameOverModal();
    level = 0;
    sequence = [];
    userInput = [];
    lives = mode === 'desafio' ? 1 : 3;
    inputEnabled = true;
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('level').innerText = '';
    document.getElementById('message').innerText = '';
    document.getElementById('lives').innerText = `Vidas: ${lives}`;
    document.getElementById('restart-options').classList.add('hidden');
    nextLevel();
}

function toggleMusic() {
    const music = document.getElementById('background-music');
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

function setVolume(volume) {
    const music = document.getElementById('background-music');
    music.volume = volume;
}

function toggleMusicMenu() {
    const musicMenu = document.getElementById('music-menu');
    if (musicMenu.classList.contains('hidden')) {
        musicMenu.classList.remove('hidden');
    } else {
        musicMenu.classList.add('hidden');
    }
}

function goToHome() {
    hideGameOverModal();
    resetGame();
    document.getElementById('modes').classList.remove('hidden');
    document.getElementById('game').classList.add('hidden');
    document.getElementById('music-menu').classList.add('hidden');
    document.getElementById('music-icon').classList.remove('fa-volume-up');
    document.getElementById('music-icon').classList.add('fa-volume-mute');
}

/* ------------------------------------------- */
/* Modal y gráfica al quedarse sin vidas */
/* ------------------------------------------- */
function showGameOverModal() {
    const modal = document.getElementById('game-over-modal');
    modal.classList.add('visible');
    modal.style.display = 'flex';
    drawGraph();
    showResultsSummary();
}

function hideGameOverModal() {
    const modal = document.getElementById('game-over-modal');
    modal.classList.remove('visible');
    modal.style.display = 'none';
}

function drawGraph() {
    const canvas = document.getElementById('result-graph');
    const ctx = canvas.getContext('2d');

    canvas.width = 500;
    canvas.height = 300;

    // Calcular la dificultad acumulada (integral)
    const data = [];
    for (let i = 1; i <= level; i++) {
        const dificultad = i + (i ** 2) / 20; // Integral de (1 + x/10) dx
        data.push(dificultad);
    }

    const maxValue = Math.max(...data, 10);
    const padding = 40;
    const graphWidth = canvas.width - padding * 2;
    const graphHeight = canvas.height - padding * 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ejes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // Línea de datos
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * graphWidth;
        const y = canvas.height - padding - (value / maxValue) * graphHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.strokeStyle = 'red';
    ctx.stroke();

    // Etiquetas
    ctx.fillStyle = '#000';
    ctx.fillText('Nivel', canvas.width - padding, canvas.height - padding + 20);
    ctx.fillText('Dificultad', padding - 10, padding - 10);
}

function showResultsSummary() {
    const resultsSummary = document.getElementById('results-summary');
    const dificultad = level + (level ** 2) / 20; // Integral
    const memoria = 2 - (1 / (2 ** level)); // Serie geométrica

    resultsSummary.innerHTML = `
        <p>Dificultad acumulada: ${dificultad.toFixed(2)}</p>
        <p>Uso de memoria: ${memoria.toFixed(2)} GB</p>
    `;
}