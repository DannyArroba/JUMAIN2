const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
let currentLevel = 1;
let fallos = 0; // Fallos globales
let coloredSegments = 0;
let requiredSegments = 0;
const juegoID = 19; // ID del juego en la base de datos

const levelData = {
    1: {
        title: "Nivel 1: Casa",
        essentialSegments: `
            <rect class="segment" x="150" y="200" width="200" height="150" fill="white" stroke="#000"/>
            <polygon class="segment" points="150,200 250,100 350,200" fill="white" stroke="#000"/>
        `,
        optionalSegments: `
            <rect class="segment" x="230" y="270" width="40" height="80" fill="white" stroke="#000"/>
            <rect class="segment" x="180" y="220" width="40" height="40" fill="white" stroke="#000"/>
            <rect class="segment" x="280" y="220" width="40" height="40" fill="white" stroke="#000"/>
            <circle class="segment" cx="80" cy="80" r="40" fill="white" stroke="#000"/>
            <rect class="segment" x="140" y="350" width="220" height="20" fill="white" stroke="#000"/>
            <rect class="segment" x="230" y="350" width="40" height="50" fill="white" stroke="#000"/>
            <circle class="segment" cx="250" cy="180" r="15" fill="white" stroke="#000"/>
        `
    },
    2: {
        title: "Nivel 2: Coche",
        essentialSegments: `
            <rect class="segment" x="100" y="150" width="300" height="100" fill="white" stroke="#000"/>
            <circle class="segment" cx="150" cy="250" r="30" fill="white" stroke="#000"/>
            <circle class="segment" cx="350" cy="250" r="30" fill="white" stroke="#000"/>
        `,
        optionalSegments: `
            <rect class="segment" x="150" y="100" width="200" height="50" fill="white" stroke="#000"/>
            <rect class="segment" x="120" y="120" width="40" height="30" fill="white" stroke="#000"/>
            <rect class="segment" x="340" y="120" width="40" height="30" fill="white" stroke="#000"/>
            <rect class="segment" x="220" y="180" width="60" height="40" fill="white" stroke="#000"/>
            <rect class="segment" x="50" y="170" width="40" height="20" fill="white" stroke="#000"/>
            <rect class="segment" x="410" y="170" width="40" height="20" fill="white" stroke="#000"/>
            <polygon class="segment" points="200,130 220,100 240,130" fill="white" stroke="#000"/>
        `
    },
    3: {
        title: "Nivel 3: Peces",
        essentialSegments: `
            <circle class="segment" cx="100" cy="100" r="40" fill="white" stroke="#000"/>
            <polygon class="segment" points="140,100 170,80 170,120" fill="white" stroke="#000"/>
            <circle class="segment" cx="275" cy="200" r="40" fill="white" stroke="#000"/>
            <polygon class="segment" points="315,200 345,180 345,220" fill="white" stroke="#000"/>
            <circle class="segment" cx="450" cy="300" r="40" fill="white" stroke="#000"/>
            <polygon class="segment" points="490,300 520,280 520,320" fill="white" stroke="#000"/>
        `,
        optionalSegments: `
            <circle class="segment" cx="90" cy="95" r="8" fill="white" stroke="#000"/>
            <circle class="segment" cx="265" cy="195" r="8" fill="white" stroke="#000"/>
            <circle class="segment" cx="440" cy="295" r="8" fill="white" stroke="#000"/>
            <polygon class="segment" points="100,140 90,160 110,160" fill="white" stroke="#000"/>
        `
    }
};

// Obtener progreso del usuario
async function obtenerProgreso() {
    try {
        const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
        const data = await response.json();

        if (data.success) {
            currentLevel = data.nivel;
            fallos = data.fallos || 0;

        }
    } catch (error) {
        console.error("Error al obtener el progreso:", error);
    }

    initLevel(currentLevel);
}

// Guardar progreso en la base de datos
async function guardarProgreso() {
    try {
        await fetch(`../php/progreso.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `juego_id=${juegoID}&nivel=${currentLevel}&puntaje=0&fallos=${fallos}`

        });
    } catch (error) {
        console.error("Error al guardar el progreso:", error);
    }
}

function generateRandomFractionAndSegments(level) {
    const essentialSegments = levelData[level].essentialSegments;
    const optionalSegmentsArray = levelData[level].optionalSegments
        .trim()
        .split('\n')
        .map(segment => segment.trim());
    const totalSegments = Math.floor(Math.random() * 4) + 7; // Entre 7 y 10
    const randomOptionalSegments = optionalSegmentsArray
        .sort(() => 0.5 - Math.random())
        .slice(0, totalSegments - essentialSegments.trim().split('\n').length);

    return {
        fraction: `${Math.floor(Math.random() * (totalSegments - 1)) + 1}/${totalSegments}`,
        svg: essentialSegments + randomOptionalSegments.join('')
    };
}

function initLevel(level) {
    const { fraction, svg } = generateRandomFractionAndSegments(level);
    currentLevel = level;
    requiredSegments = parseInt(fraction.split('/')[0]);
    const totalSegments = parseInt(fraction.split('/')[1]); // Obtener el denominador correctamente
    coloredSegments = 0;

    document.getElementById('currentLevelText').textContent = `Estás en el Nivel ${level}`;
    document.getElementById('coloredCount').textContent = `0/${totalSegments}`;
    document.getElementById('levelTitle').textContent = `${levelData[level].title} (${fraction})`;
    document.getElementById('drawingContainer').innerHTML = `<svg width="500" height="400" viewBox="0 0 500 400"><g id="drawing">${svg}</g></svg>`;

    document.querySelectorAll('.segment').forEach(segment => {
        segment.addEventListener('click', function () {
            if (this.getAttribute('fill') === 'white') {
                this.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
                coloredSegments++;
            } else {
                this.setAttribute('fill', 'white');
                coloredSegments--;
            }
            updateProgress(totalSegments);
        });
    });
}

function updateProgress(totalSegments) {
    document.getElementById('coloredCount').textContent = `${coloredSegments}/${totalSegments}`;
}

function checkResult() {
    if (coloredSegments === requiredSegments) {
        window.audioMuyBien.play();
        Swal.fire({
            title: '¡Bien hecho!',
            text: 'Has completado este nivel.',
            icon: 'success',
            confirmButtonText: 'Continuar'
        }).then(() => {
            if (currentLevel < 3) {
                currentLevel++;
                guardarProgreso();
                initLevel(currentLevel);
            } else {
                window.audioMuyBien.play();
                Swal.fire({
                    title: '¡Felicidades!',
                    text: 'Has completado todos los niveles.',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Reiniciar juego',
                    cancelButtonText: 'Ir al menú'
                }).then(res => {
                    if (res.isConfirmed) restartGame();
                    else window.location.href = 'menuA.php';
                });
            }
        });
    } else {
        fallos++; // Se cuenta el fallo
        guardarProgreso(); // Guarda inmediatamente el fallo
        window.audioIncorrecto.play();
        Swal.fire({
            title: '¡Ups!',
            text: 'Aún no cumples el objetivo. Inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Reintentar'
        });
    }
}

function restartGame() {
    currentLevel = 1;
    coloredSegments = 0;
    guardarProgreso();
    initLevel(currentLevel);
}

function resetLevel() {
    initLevel(currentLevel);
}

window.musicaFondo=new Audio('./audio/Fondo.mp3'); musicaFondo.loop=true; musicaFondo.play();
window.audioMuyBien=new Audio('./audio/correcto.mp3');
window.audioIncorrecto=new Audio('./audio/incorrecto.mp3');

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


document.addEventListener("DOMContentLoaded", async function() {
    await obtenerProgreso();
});
