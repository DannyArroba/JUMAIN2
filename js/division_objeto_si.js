const objectImages = [
    ['./img10/manzana.png', 'Ahora restarás manzanas.'],
    ['./img10/pescad.png', 'Ahora restarás pescados.'],
    ['./img10/pastel.png', 'Ahora restarás pasteles.'],
    ['./img10/pan.png', 'Ahora restarás pan.']
];

const levels = [
    { correctAnswersToPass: 3 },
    { correctAnswersToPass: 4 },
    { correctAnswersToPass: 5 }
];

let points = 0;
let correctAnswers = 0;
let currentLevel = 0;
let correctAnswer;
const juego_id = 13;

async function obtenerProgreso() {
    try {
        const response = await fetch(`../php/progreso.php?juego_id=${juego_id}`);
        const data = await response.json();
        if (data.success) {
            currentLevel = Math.min(data.nivel - 1, levels.length - 1);
            points = data.puntaje;
            correctAnswers = data.fallos;
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
            body: `juego_id=${juego_id}&nivel=${Math.min(currentLevel + 1, levels.length)}&puntaje=${points}&fallos=${correctAnswers}`
        });
        console.log(`💾 Progreso guardado: Nivel ${Math.min(currentLevel + 1, levels.length)}, Puntos ${points}, Fallos ${correctAnswers}`);
    } catch (error) {
        console.error("Error al guardar el progreso:", error);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLevel() {
    const level = levels[currentLevel];
    let randomNum1 = getRandomInt(1, 9) * 2;
    let randomNum2 = getRandomInt(1, randomNum1);

    if (randomNum1 % randomNum2 !== 0) {
        return generateLevel();
    }

    correctAnswer = randomNum1 / randomNum2;
    const [currentImage, message] = objectImages[currentLevel % objectImages.length];

    document.getElementById('levelTitle').innerText = `Nivel ${currentLevel + 1}`;
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    const leftCircle = document.createElement('div');
    leftCircle.className = 'circle';
    const rightCircle = document.createElement('div');
    rightCircle.className = 'circle';

    const divideSign = document.createElement('div');
    divideSign.className = 'divide-sign';
    divideSign.innerText = '÷';

    gameArea.appendChild(leftCircle);
    gameArea.appendChild(divideSign);
    gameArea.appendChild(rightCircle);

    for (let i = 0; i < randomNum1; i++) {
        const object = document.createElement('div');
        object.className = 'object';
        object.style.backgroundImage = `url('${currentImage}')`;
        leftCircle.appendChild(object);
    }

    for (let i = 0; i < randomNum2; i++) {
        const object = document.createElement('div');
        object.className = 'object';
        object.style.backgroundImage = `url('${currentImage}')`;
        rightCircle.appendChild(object);
    }

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    const answers = new Set();
    answers.add(correctAnswer);
    while (answers.size < 4) {
        const wrongAnswer = correctAnswer + getRandomInt(-3, 3);
        if (wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
            answers.add(wrongAnswer);
        }
    }

    Array.from(answers).sort(() => Math.random() - 0.5).forEach(answer => {
        const answerButton = document.createElement('div');
        answerButton.className = 'answer';
        answerButton.innerText = answer;
        answerButton.onclick = () => checkAnswer(answer);
        answersContainer.appendChild(answerButton);
    });
    guardarProgreso();
}

// 📌 Verificar respuesta y guardar progreso
function checkAnswer(selectedAnswer) {
    if (selectedAnswer === correctAnswer) {
        points++;
        correctAnswers++;
        guardarProgreso();

        // ▶️ Audio correcto
        window.audioMuyBien.play();
        Swal.fire('¡Correcto!', 'Sigue así.', 'success');

        if (correctAnswers >= levels[currentLevel].correctAnswersToPass) {
            if (currentLevel === levels.length - 1) {
                guardarProgreso();
                // ▶️ Audio correcto
                window.audioMuyBien.play();
                Swal.fire({
                    title: '¡Felicidades! 🎉',
                    text: `¡Has completado todos los niveles! Puntos: ${points}, Fallos: ${correctAnswers}`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Volver a jugar',
                    cancelButtonText: 'Ir al menú'
                }).then((result) => {
                    if (result.isConfirmed) {
                        currentLevel = 0;
                        correctAnswers = 0;
                        points = 0;
                        guardarProgreso();
                        generateLevel();
                    } else {
                        window.location.href = 'menuM.php';
                    }
                });
            } else {
                currentLevel++;
                correctAnswers = 0;
                guardarProgreso();
                // ▶️ Audio correcto
                window.audioMuyBien.play();
                Swal.fire('¡Nivel completado!', 'Pasaste al siguiente nivel.', 'success');
                generateLevel();
            }
        } else {
            generateLevel();
        }
    } else {
        guardarProgreso();
        // ▶️ Audio incorrecto
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
