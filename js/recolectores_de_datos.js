const totalLevels = 3;
let currentLevel = 1;
let itemsToCollect = 4;
let itemsCollected = 0;
let timeLeft = 120;
let timerInterval;
let hearts = 3;
let puntaje = 0;
let fallos = 0;
const juegoID = 9; // ID del juego en la base de datos

const categories = {
  frutas: ['🍎', '🍌', '🍓', '🍇'],
  numeros: ['1', '2', '3', '4', '5', '6']
};

// Referencias a elementos del DOM
const levelDisplay = document.getElementById('level-display');
const timerDisplay = document.getElementById('timer-display');
const progressBar = document.getElementById('progress-bar');
const playArea = document.getElementById('game-area');
const heartsDisplay = document.getElementById('hearts-display');
const startButton = document.getElementById('start-button');
const readGuideButton = document.getElementById('read-guide-button');

// 📌 Texto de la guía
const guideText = `
¡Bienvenido, Explorador de Datos! 
Estás a punto de empezar una misión muy divertida. 
En este juego, vas a organizar y clasificar diferentes cosas, como frutas y números.
Tu objetivo es ser el mejor recolector de datos del mundo. ¿Estás listo para la aventura?
Arrastra los objetos a las cajas correctas antes de que se acabe el tiempo. ¡Es rápido y emocionante! ¡A jugar!
`;

// 📌 Variables de audio
const audioCorrecto = new Audio('./audio/correcto.mp3');
const audioError = new Audio('./audio/incorrecto.mp3');

// 📌 Variables para la síntesis de voz
let isSpeaking = false;

// 📌 Obtener progreso desde la base de datos
async function obtenerProgreso() {
    try {
        const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
        const data = await response.json();

        if (data.success) {
            currentLevel = Math.min(data.nivel, totalLevels);
            puntaje = data.puntaje;
            fallos = data.fallos;
        }
    } catch (error) {
        console.error("Error al obtener el progreso:", error);
    }
}

// 📌 Guardar progreso en la base de datos
async function guardarProgreso() {
    try {
        await fetch(`../php/progreso.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `juego_id=${juegoID}&nivel=${currentLevel}&puntaje=${puntaje}&fallos=${fallos}`
        });
        console.log(`💾 Progreso guardado: Nivel ${currentLevel}, Puntaje ${puntaje}, Fallos ${fallos}`);
    } catch (error) {
        console.error("Error al guardar el progreso:", error);
    }
}

// 📌 Iniciar juego
function startGame() {
    resetGame();
    loadLevel();
}

// 📌 Reiniciar juego
function resetGame() {
    playArea.innerHTML = '';
    progressBar.style.width = '0%';
    itemsCollected = 0;
    timeLeft = 120 - (currentLevel - 1) * 10;
    timerDisplay.textContent = `Tiempo: ${timeLeft}`;
    clearInterval(timerInterval);
    resetHearts();
    startTimer();
}

// 📌 Reiniciar corazones
function resetHearts() {
    hearts = 3;
    updateHeartsDisplay();
}

// 📌 Actualizar visualización de corazones
function updateHeartsDisplay() {
    heartsDisplay.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.textContent = i < hearts ? '❤️' : '🖤';
        heart.className = 'heart';
        heartsDisplay.appendChild(heart);
    }
}

// 📌 Cargar nivel
function loadLevel() {
    levelDisplay.textContent = `Nivel: ${currentLevel}`;
    itemsToCollect = 4 + (currentLevel - 1) * 2;
    spawnItems();
}

// 📌 Generar elementos en pantalla con imágenes
function spawnItems() {
    const allItems = [];
    const itemSize = 60;
    const maxX = playArea.clientWidth - itemSize;
    const maxY = playArea.clientHeight - itemSize;

    for (let i = 0; i < itemsToCollect; i++) {
        const categoryKeys = Object.keys(categories);
        const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const randomItem = categories[randomCategory][Math.floor(Math.random() * categories[randomCategory].length)];

        allItems.push({ item: randomItem, category: randomCategory });
    }

    allItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.draggable = true;
        itemElement.dataset.category = item.category;
        itemElement.id = `item-${index}`;

        const img = document.createElement('img');

        if (item.category === 'numeros') {
            img.src = `./images/${item.item}.png`;
            img.onerror = function () {
                img.src = `./images/${item.item}.jpg`;
            };
        } else if (item.category === 'frutas') {
            const fruitNames = {
                '🍎': 'manzana',
                '🍌': 'platano',
                '🍓': 'fresa',
                '🍇': 'uvas',
            };
            img.src = `./images/${fruitNames[item.item]}.png`;
            img.onerror = function () {
                img.src = `./images/${fruitNames[item.item]}.jpg`;
            };
        }

        img.draggable = false;
        itemElement.appendChild(img);

        const xPos = Math.random() * maxX;
        const yPos = Math.random() * maxY;

        itemElement.style.left = `${xPos}px`;
        itemElement.style.top = `${yPos}px`;
        itemElement.style.width = `${itemSize}px`;
        itemElement.style.height = `${itemSize}px`;

        itemElement.ondragstart = drag;

        playArea.appendChild(itemElement);
    });
}

// 📌 Iniciar temporizador
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Tiempo: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            Swal.fire("¡Tiempo agotado!", "El juego ha terminado.", "error").then(() => {
                resetGame();
            });
        }
    }, 1000);
}

// 📌 Funciones de arrastre
function drag(event) {
    event.dataTransfer.setData('text', event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function updateProgress() {
  const progress = (itemsCollected / itemsToCollect) * 100;
  progressBar.style.width = `${progress}%`;
}
function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text');
  const draggedItem = document.getElementById(data);
  const targetCategory = event.target.dataset.category;

  if (draggedItem.dataset.category === targetCategory) {
    guardarProgreso();
    itemsCollected++;
    draggedItem.remove();
    updateProgress();
      puntaje += 10;
      audioCorrecto.play();

      if (itemsCollected >= itemsToCollect) {
        nextLevel();
      }
  } else {
      audioError.play();
      fallos++;
      guardarProgreso();
      loseHeart();
  }
}

function finalizarJuego() {
  guardarProgreso(); // Guardar que el jugador llegó hasta el nivel 3

  Swal.fire({
      title: "¡Felicidades, has completado el juego! 🎉",
      text: "Selecciona una opción para continuar.",
      icon: "success",
      showCancelButton: true,
      cancelButtonText: "Volver al Menú",
      confirmButtonText: "Volver a jugar"
  }).then((result) => {
      if (result.isConfirmed) {
          currentLevel = 1; // Reiniciar el nivel
          startGame();
      } else {
          window.location.href = 'menu.php'; // Redirigir al menú principal
      }
  });
}


// 📌 Perder un corazón
function loseHeart() {
    hearts--;
    updateHeartsDisplay();
    if (hearts <= 0) {
        Swal.fire("¡Te quedaste sin corazones!", "Regresas al nivel 1.", "warning").then(() => {
            currentLevel = 1;
            startGame();
        });
    }
}
   // ─── AUDIOS ─────────────────────────────────────────────
   window.musicaFondo = new Audio('./audio/Fondo.mp3');
   window.musicaFondo.loop = true;
   window.musicaFondo.play();
   
   window.audioMuyBien = new Audio('./audio/correcto.mp3');
   window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');
   
   


// 📌 Evento del botón "Escuchar Guía"
readGuideButton.addEventListener('click', () => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(guideText);
        utterance.lang = 'es-ES';
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    } else {
        Swal.fire("Error", "La síntesis de voz no es compatible con este navegador.", "error");
    }
});

// 📌 Evento del botón de iniciar juego
startButton.addEventListener("click", startGame);

function nextLevel() {
  if (currentLevel < totalLevels) {
      currentLevel++;
      guardarProgreso(); // Guardar el nivel en la base de datos
      Swal.fire("¡Nivel completado!", `Pasas al nivel ${currentLevel}.`, "success").then(() => {
          startGame();
      });
  } else {
      finalizarJuego(); // Llamar a la alerta de finalización cuando llegue al nivel 3
  }
}



// 📌 Obtener progreso antes de iniciar el juego
obtenerProgreso().then(() => {
    startGame();
});
