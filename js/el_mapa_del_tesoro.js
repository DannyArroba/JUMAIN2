const juegoID = 2; // ID del juego en la base de datos

const levels = [
    {
        layout: [
            "WWWWWWWWWW",
            "WSRRRRRRRW",
            "WWWWWWWRRW",
            "WRRRRRWRRW",
            "WRWWWRWRRW",
            "WRRRWRWRRW",
            "WWWRWRWRRW",
            "WRRRRRRRRW",
            "WRWWWWWWWW",
            "WRRRRRRRFW"
        ]
    },
    {
        layout: [
            "WWWWWWWWWW",
            "WSRRRRWRRW",
            "WWWWRWWRRW",
            "WRRRRRWRRW",
            "WRWWWRWRRW",
            "WRRRWRWRRW",
            "WWWRWRWWWW",
            "WRRRRRRRRW",
            "WWWWWWWRWW",
            "WRRRRRRRFW"
        ]
    },
    {
        layout: [
            "WWWWWWWWWW",
            "WSRRRRRRRW",
            "WRWWWWWRRW",
            "WRRRRRWRRW",
            "WWWWWRWRRW",
            "WRRRWRWRRW",
            "WRWRWRWWWW",
            "WRWRRRRRRW",
            "WRWWWWWWRW",
            "WRRRRRRRFW"
        ]
    }
];

let currentLevel = 0;
let playerPosition = { x: 0, y: 0 };
let gameBoard;
let isGameOver = false;
let puntaje = 0;    // Puntaje global
let fallos = 0;     // Fallos global

// ─── AUDIO ─────────────────────────────────────────────────────
// Música y audios para aciertos (usando los mismos archivos del otro juego)
window.musicaFondo = new Audio('./audio/Fondo.mp3');
window.audioMuyBien = new Audio('./audio/correcto.mp3');
window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');

window.musicaFondo.loop = true;
window.musicaFondo.play();

// ─── FUNCIONES DE BASE DE DATOS ───────────────────────────────────────────
async function obtenerProgreso() {
    try {
        const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
        const data = await response.json();
        if (data.success) {
            // Nos aseguramos de que el nivel obtenido no supere el total de niveles disponibles
            currentLevel = Math.min(data.nivel - 1, levels.length - 1);
            puntaje = data.puntaje; // Cargar el puntaje guardado
            // Suponemos que en la base de datos "fallos" se guarda; de no ser así, se quedará en 0
            fallos = data.fallos || 0;
        }
    } catch (error) {
        console.error("Error al obtener el progreso:", error);
    }
    initGame();
}

async function guardarProgreso() {
    try {
        await fetch(`../php/progreso.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `juego_id=${juegoID}&nivel=${currentLevel + 1}&puntaje=${puntaje}&fallos=${fallos}`
        });
    } catch (error) {
        console.error("Error al guardar el progreso:", error);
    }
}

// ─── FUNCIONES DEL JUEGO ───────────────────────────────────────────
function initGame() {
    gameBoard = document.getElementById('gameBoard');
    document.getElementById('level').textContent = currentLevel + 1;
    createBoard();
    document.addEventListener('keydown', handleKeyPress);
}

function createBoard() {
    gameBoard.innerHTML = '';
    const level = levels[currentLevel];
    
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            switch (level.layout[y][x]) {
                case 'W':
                    cell.classList.add('wall');
                    break;
                case 'R':
                    cell.classList.add('road');
                    break;
                case 'S':
                    cell.classList.add('road');
                    playerPosition = { x, y };
                    cell.classList.add('car');
                    break;
                case 'F':
                    cell.classList.add('road');
                    cell.classList.add('goal');
                    break;
            }
            gameBoard.appendChild(cell);
        }
    }
}

function updatePlayerPosition() {
    const cells = gameBoard.children;
    for (let cell of cells) {
        cell.classList.remove('car');
    }
    cells[playerPosition.y * 10 + playerPosition.x].classList.add('car');
}

function move(direction) {
    if (isGameOver) return;

    let newPosition = { ...playerPosition };
    let rotation = 0;

    switch (direction) {
        case 'up':
            newPosition.y--;
            rotation = -90;
            break;
        case 'down':
            newPosition.y++;
            rotation = 90;
            break;
        case 'left':
            newPosition.x--;
            rotation = 180;
            break;
        case 'right':
            newPosition.x++;
            rotation = 0;
            break;
    }

    const level = levels[currentLevel];
    if (
        newPosition.x >= 0 && newPosition.x < 10 &&
        newPosition.y >= 0 && newPosition.y < 10 &&
        level.layout[newPosition.y][newPosition.x] !== 'W'
    ) {
        playerPosition = newPosition;
        updatePlayerPosition();
        document.querySelector('.car').style.transform = `rotate(${rotation}deg)`;

        if (level.layout[newPosition.y][newPosition.x] === 'F') {
            levelComplete();
        }
    }
}

function handleKeyPress(e) {
    switch (e.key) {
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowDown':
            move('down');
            break;
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
    }
}

function levelComplete() {
    isGameOver = true;
    // Sumar 10 puntos al completar el nivel
    puntaje += 10;
    // Reproducir sonido de éxito
    window.audioMuyBien.play();
    guardarProgreso();
    
    if (currentLevel < levels.length - 1) {
        Swal.fire("¡Nivel completado!", "Has avanzado al siguiente nivel.", "success").then(() => {
            currentLevel++;
            isGameOver = false;
            document.getElementById('level').textContent = currentLevel + 1;
            createBoard();
        });
    } else {
        Swal.fire({
            title: "¡Felicidades! 🎉",
            text: "Has completado todos los niveles.",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Volver a jugar",
            cancelButtonText: "Ir al menú"
        }).then((result) => {
            if (result.isConfirmed) {
                // Reiniciar el juego: se reinician nivel, puntaje y fallos
                currentLevel = 0;
                puntaje = 0;
                fallos = 0;
                guardarProgreso().then(() => {
                    // Forzamos dos recargas de la página de forma imperceptible para el usuario
                    if (window.location.hash !== "#reloaded") {
                        window.location.hash = "#reloaded";
                        window.location.reload();
                    } else {
                        window.location.reload();
                    }
                });
            } else {
                window.location.href = 'menu.php';
            }
        });
    }
}
  // 🎤 Funcionalidad para leer la guía en voz alta
  let speech = new SpeechSynthesisUtterance();
  let isReading = false;
  
  document.getElementById("read-guide").addEventListener("click", function() {
      if (!isReading) {
          speech.text = document.getElementById("instructionsText").innerText;
          speech.lang = "es-ES";
          speech.rate = 1;
          speechSynthesis.speak(speech);
          this.textContent = "⏸️ Pausar Lectura";
      } else {
          speechSynthesis.cancel();
          this.textContent = "🔊 Leer Guía";
      }
      isReading = !isReading;
  });
  

document.addEventListener("DOMContentLoaded", async function () {
    await obtenerProgreso();
});
