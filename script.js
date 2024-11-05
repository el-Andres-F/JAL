let sequence = [];
let userInput = [];
let level = 0;
let mode = '';
let lives = 3; // Número de vidas para el modo clásico
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
    lives = mode === 'desafio' ? 1 : 3; // Una vida para desafío, tres para clásico
    document.getElementById('modes').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('message').innerText = "¡Comencemos!";
    document.getElementById('lives').innerText = `Vidas: ${lives}`;
    nextLevel();
}

function nextLevel() {
    userInput = [];
    level++;
    
    // Incrementar la longitud de la secuencia en modo desafío
    if (mode === 'desafio') {
        // Agregar un nuevo color a la secuencia
        for (let i = 0; i < level; i++) {
            sequence.push(Math.floor(Math.random() * 8) + 1); // Agregar más colores con cada nivel
        }
    } else {
        sequence.push(Math.floor(Math.random() * 8) + 1); // Solo un color en modo clásico
    }

    document.getElementById('level').innerText = `Nivel ${level}`;
    document.getElementById('message').innerText = "Observa la secuencia...";
    
    setTimeout(() => {
        showSequence();
    }, mode === 'desafio' ? Math.max(1000 - (level * 100), 300) : 1000); // Disminuir el tiempo solo en modo desafío
}

function showSequence() {
    let i = 0;
    disableButtons(true); // Deshabilitar botones durante la secuencia
    const intervalTime = mode === 'desafio' ? Math.max(1000 - (level * 100), 300) : 1000; // Tiempo entre colores solo en modo desafío
    const interval = setInterval(() => {
        lightUp(sequence[i]);
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
            document.getElementById('message').innerText = "Tu turno";
            disableButtons(false); // Habilitar botones para el jugador
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
    if (lives > 0) { // Solo permitir clics si hay vidas
        userInput.push(color);
        lightUp(color);
        checkInput();
    }
}

function checkInput() {
    const index = userInput.length - 1;
    
    if (userInput[index] !== sequence[index]) {
        lives--; // Restar una vida si el usuario falla
        
        // Penalización: agregar un color extra a la secuencia en modo clásico
        if (mode === 'clasico') {
            sequence.push(Math.floor(Math.random() * 8) + 1); // Agregar un color extra si fallan
        }

        document.getElementById('message').innerText = "¡Fallaste!";
        document.getElementById('lives').innerText = `Vidas: ${lives}`;
        
        if (lives === 0) {
            document.getElementById('message').innerText = "¡Perdiste! Fin del juego.";
            disableButtons(true); // Deshabilitar botones
            document.getElementById('restart-options').classList.remove('hidden');
        } else {
            setTimeout(() => {
                document.getElementById('message').innerText = "Repitiendo la secuencia...";
                userInput = []; // Resetear la entrada del usuario
                showSequence(); // Repetir la secuencia
            }, 2000);
        }
        
    } else if (userInput.length === sequence.length) {
        document.getElementById('message').innerText = "¡Correcto! Pasando al siguiente nivel...";
        setTimeout(() => {
            nextLevel();
        }, 2000);
    }
}

function disableButtons(disable) {
    const colorDivs = document.getElementsByClassName('color');
    for (let div of colorDivs) {
        div.style.pointerEvents = disable ? 'none' : 'auto'; // Deshabilitar/activar clics
    }
}

function resetGame() {
   level = 0;
   sequence = [];
   userInput = [];
   
   // Reiniciar vidas según el modo actual
   lives = mode === 'desafio' ? 1 : 3; 

   // Actualizar la interfaz
   document.getElementById('level').innerText = '';
   document.getElementById('message').innerText = '';
   document.getElementById('lives').innerText = `Vidas: ${lives}`;
   
   document.getElementById('restart-options').classList.add('hidden'); // Ocultar opciones de reinicio

   nextLevel(); // Comenzar un nuevo nivel
}

function goToHome() {
   resetGame(); // Reiniciar el juego para volver a la pantalla de inicio
   document.getElementById('modes').classList.remove('hidden'); // Mostrar opciones de modo
   document.getElementById('game').classList.add('hidden'); // Ocultar el juego
}