const objectImages = [
    ['../img10/manzana.png', 'Ahora compararás manzanas.'],
    ['../img10/pescad.png', 'Ahora compararás pescados.'],
    ['../img10/pastel.png', 'Ahora compararás pasteles.'],
    ['../img10/pan.png', 'Ahora compararás pan.']
];

const levels = [
    { correctAnswersToPass: 3 },
    { correctAnswersToPass: 4 },
    { correctAnswersToPass: 5 },
];

let correctAnswersCount = 0;
let fallos = 0;
let currentLevel = 0;
const juego_id = 14;
const puntosPorAcierto = 10;

async function obtenerProgreso() {
    try {
        const response = await fetch(`../php/progreso.php?juego_id=${juego_id}`);
        const data = await response.json();
        if (data.success) {
            currentLevel = Math.min(data.nivel - 1, levels.length - 1);
            correctAnswersCount = data.puntaje / puntosPorAcierto;
            fallos = data.fallos;
        }
    } catch (error) {
        console.error("Error al obtener el progreso:", error);
    }
}

async function guardarProgreso() {
    try {
        await fetch(`../php/progreso.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `juego_id=${juego_id}&nivel=${Math.min(currentLevel + 1, levels.length)}&puntaje=${correctAnswersCount * puntosPorAcierto}&fallos=${fallos}`
        });
        console.log(`💾 Progreso guardado: Nivel ${Math.min(currentLevel + 1, levels.length)}, Puntos ${correctAnswersCount * puntosPorAcierto}, Fallos ${fallos}`);
    } catch (error) {
        console.error("Error al guardar el progreso:", error);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateLevelText() {
    const levelTitle = document.getElementById('levelTitle');
    levelTitle.innerText = `Nivel ${currentLevel + 1}`;
}

function generateLevel() {
    updateLevelText();

    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    const num1 = getRandomInt(1, 9);
    const num2 = getRandomInt(1, 9);
    const [currentImage, message] = objectImages[currentLevel % objectImages.length];

    const isTrueComparison = Math.random() < 0.5;
    const correctSign = num1 > num2 ? '>' : num1 < num2 ? '<' : '=';
    const displayedSign = isTrueComparison
        ? correctSign
        : ['>', '<', '='].filter(sign => sign !== correctSign)[Math.floor(Math.random() * 2)];

    const correctAnswer = isTrueComparison;

    const leftCircle = document.createElement('div');
    leftCircle.className = 'circle';
    for (let i = 0; i < num1; i++) {
        const object = document.createElement('div');
        object.className = 'object';
        object.style.backgroundImage = `url('${currentImage}')`;
        leftCircle.appendChild(object);
    }

    const rightCircle = document.createElement('div');
    rightCircle.className = 'circle';
    for (let i = 0; i < num2; i++) {
        const object = document.createElement('div');
        object.className = 'object';
        object.style.backgroundImage = `url('${currentImage}')`;
        rightCircle.appendChild(object);
    }

    const comparisonSign = document.createElement('div');
    comparisonSign.className = 'plus-sign';
    comparisonSign.innerText = displayedSign;

    gameArea.appendChild(leftCircle);
    gameArea.appendChild(comparisonSign);
    gameArea.appendChild(rightCircle);

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';
    ['Verdadero', 'Falso'].forEach(choice => {
        const button = document.createElement('div');
        button.className = 'answer';
        button.innerText = choice;
        button.onclick = () => checkAnswer(choice === 'Verdadero', correctAnswer);
        answersContainer.appendChild(button);
    });

    guardarProgreso();
}
function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        correctAnswersCount++;
        guardarProgreso();

        // ▶️ Audio de respuesta correcta
        window.audioMuyBien.play();
        Swal.fire('¡Correcto!', 'Sigue así.', 'success');

        if (correctAnswersCount >= levels[currentLevel].correctAnswersToPass) {
            if (currentLevel === levels.length - 1) {
                guardarProgreso();
                window.audioMuyBien.play();
                Swal.fire({
                    title: '¡Felicidades! 🎉',
                    text: `¡Has completado todos los niveles! Puntos: ${correctAnswersCount * puntosPorAcierto}, Fallos: ${fallos}`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Volver a jugar',
                    cancelButtonText: 'Ir al menú',
                }).then((result) => {
                    if (result.isConfirmed) {
                        currentLevel = 0;
                        correctAnswersCount = 0;
                        fallos = 0;
                        guardarProgreso();
                        generateLevel();
                    } else {
                        window.location.href = 'menuM.php';
                    }
                });
            } else {
                currentLevel++;
                correctAnswersCount = 0;
                guardarProgreso();
                window.audioMuyBien.play();
                Swal.fire('¡Nivel completado!', `¡Pasaste al Nivel ${currentLevel + 1}!`, 'success');
                generateLevel();
            }
        } else {
            generateLevel();
        }
    } else {
        fallos++;
        guardarProgreso();

        // ▶️ Audio de respuesta incorrecta
        window.audioIncorrecto.play();
        Swal.fire('¡Incorrecto!', 'Intenta de nuevo.', 'error');
    }
}


obtenerProgreso().then(() => generateLevel());


// Audios
window.musicaFondo = new Audio('./audio/Fondo.mp3');
musicaFondo.loop = true;
musicaFondo.play();
window.audioMuyBien = new Audio('./audio/correcto.mp3');
window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');

// Lectura de guía
let speech = new SpeechSynthesisUtterance(), isReading = false;
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
