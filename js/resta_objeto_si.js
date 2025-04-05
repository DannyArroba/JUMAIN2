// Agregar audios globalmente
window.audioMuyBien = new Audio('./audio/correcto.mp3');
window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');

const objectImages = [
    ['./img10/manzana.png', 'Ahora restarás manzanas.'],
    ['./img10/pescad.png', 'Ahora restarás pescados.'],
    ['./img10/pastel.png', 'Ahora restarás pasteles.'],
    ['./img10/pan.png', 'Ahora restarás pan.']
];

const levels = [
    { min: 1, max: 5 },
    { min: 1, max: 5 },
    { min: 1, max: 10 }
];

const totalLevels = 3;
let points = 0;
let correctAnswers = 0;
let currentLevel = 1; // Inicializamos en 1 para que se guarde como nivel 1, 2, 3
let correctAnswer;
let fallos = 0;
const juegoID = 11;

// No forzamos recarga a nivel 1 si se reinicia (se elimina la lógica de recarga)

document.getElementById('levelTitle').innerText = `Nivel ${currentLevel}`;

// 📌 Obtener progreso desde la base de datos
async function obtenerProgreso() {
    try {
        const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
        const data = await response.json();
        if (data.success) {
            // Usamos el nivel tal cual, asegurándonos de que no supere totalLevels
            currentLevel = Math.min(data.nivel, totalLevels);
            points = data.puntaje;
            fallos = data.fallos;
            // Si ya completó el juego, se podría dejar en totalLevels
            if (currentLevel > totalLevels) {
                currentLevel = totalLevels;
            }
        } else {
            currentLevel = 1;
        }
        document.getElementById('levelTitle').innerText = `Nivel ${currentLevel}`;
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
            body: `juego_id=${juegoID}&nivel=${currentLevel}&puntaje=${points}&fallos=${fallos}`
        });
        console.log(`💾 Progreso guardado: Nivel ${currentLevel}, Puntos ${points}, Fallos ${fallos}`);
    } catch (error) {
        console.error("Error al guardar el progreso:", error);
    }
}

// 📌 Generar un número aleatorio
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 📌 Generar el nivel
function generateLevel() {
    if (currentLevel > totalLevels) {
        finalizarJuego();
        return;
    }

    const level = levels[currentLevel - 1];
    const randomNum1 = getRandomInt(level.min, level.max);
    const randomNum2 = getRandomInt(level.min, randomNum1);
    correctAnswer = randomNum1 - randomNum2;

    const [currentImage, message] = objectImages[(currentLevel - 1) % objectImages.length];

    document.getElementById('levelTitle').innerText = `Nivel ${currentLevel}`;

    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    const leftCircle = document.createElement('div');
    leftCircle.className = 'circle';
    const rightCircle = document.createElement('div');
    rightCircle.className = 'circle';

    const minusSign = document.createElement('div');
    minusSign.className = 'minus-sign';
    minusSign.innerText = '-';

    gameArea.appendChild(leftCircle);
    gameArea.appendChild(minusSign);
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
        document.getElementById('score').innerText = `Puntos: ${points}`;
        
        // Sonido de respuesta correcta
        window.audioMuyBien.play();
        
        Swal.fire({
            title: '¡Correcto!',
            text: 'Respuesta correcta, sigue así.',
            icon: 'success',
            confirmButtonText: '¡Genial!'
        });
        
        guardarProgreso();
        
        if (correctAnswers >= 3) {
            currentLevel++;
            correctAnswers = 0;
            guardarProgreso();
            
            if (currentLevel <= totalLevels) {
                // Sonido de nivel superado
                window.audioMuyBien.play();
                Swal.fire({
                    title: '¡Felicidades!',
                    text: '¡Pasaste de nivel!',
                    icon: 'success',
                    confirmButtonText: '¡Genial!'
                }).then(() => {
                    generateLevel();
                });
            } else {
                finalizarJuego();
            }
        } else {
            generateLevel();
        }
    } else {
        fallos++;
        guardarProgreso();
        
        // Sonido de error
        window.audioIncorrecto.play();
        
        Swal.fire({
            title: '¡Incorrecto!',
            text: 'Intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Lo intentaré'
        });
    }
}

// 📌 Finalizar el juego
function finalizarJuego() {
    guardarProgreso();
    Swal.fire({
        title: "¡Felicidades, has completado el juego! 🎉",
        text: "Selecciona una opción para continuar.",
        icon: "success",
        showCancelButton: true,
        cancelButtonText: "Volver al Menú",
        confirmButtonText: "Volver a jugar"
    }).then((result) => {
        if (result.isConfirmed) {
            currentLevel = 1;
            generateLevel();
        } else {
            window.location.href = 'menuM.php';
        }
    });
}

// 📌 Cargar progreso y empezar el juego
obtenerProgreso().then(() => {
    generateLevel();
});

   // ─── AUDIOS para alertas y guía ─────────────────────────────────────────────
   window.musicaFondo = new Audio('./audio/Fondo.mp3');
   window.musicaFondo.loop = true;
   window.musicaFondo.play();
   
   window.audioMuyBien = new Audio('./audio/correcto.mp3');
   window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');
   
   // ─── LECTURA DE LA GUÍA (OPCIONAL) ─────────────────────────────────────────────
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
