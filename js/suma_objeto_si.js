// Definición de audios para alertas
window.audioMuyBien = new Audio('./audio/correcto.mp3');
window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');

const objectImages = [
    ['./img10/manzana.png', 'Ahora sumarás manzanas.'],
    ['./img10/pescad.png', 'Ahora sumarás pescados.'],
    ['./img10/pastel.png', 'Ahora sumarás pasteles.'],
    ['./img10/pan.png', 'Ahora sumarás pan.']
];

const levels = [
    { min: 1, max: 5 },
    { min: 1, max: 5 },
    { min: 1, max: 10 }
];

const totalLevels = 3; // Solo llega hasta el nivel 3
let points = 0;
let correctAnswers = 0;
let currentLevel = 0; // Inicialmente 0, se actualizará con el progreso guardado
let correctAnswer;
let fallos = 0; // Contador de fallos
const juegoID = 10; // ID del juego en la base de datos

// 📌 Obtener progreso desde la base de datos
async function obtenerProgreso() {
    try {
        const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
        const data = await response.json();
        if (data.success) {
            currentLevel = Math.min(data.nivel, totalLevels - 1);
            points = data.puntaje;
            fallos = data.fallos;
            // Si ya completó el juego, reiniciamos al nivel 1.
            if (currentLevel >= totalLevels) {
                currentLevel = 0;
            }
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
    if (currentLevel >= totalLevels) {
        finalizarJuego();
        return;
    }

    const level = levels[currentLevel];
    const randomSum1 = getRandomInt(level.min, level.max);
    const randomSum2 = getRandomInt(level.min, level.max);
    correctAnswer = randomSum1 + randomSum2;

    const [currentImage, message] = objectImages[currentLevel % objectImages.length];

    document.getElementById('levelTitle').innerText = `Nivel ${currentLevel + 1}`;
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    const leftCircle = document.createElement('div');
    leftCircle.className = 'circle';
    const rightCircle = document.createElement('div');
    rightCircle.className = 'circle';

    const plusSign = document.createElement('div');
    plusSign.className = 'plus-sign';
    plusSign.innerText = '+';

    gameArea.appendChild(leftCircle);
    gameArea.appendChild(plusSign);
    gameArea.appendChild(rightCircle);

    for (let i = 0; i < randomSum1; i++) {
        const object = document.createElement('div');
        object.className = 'object';
        object.style.backgroundImage = `url('${currentImage}')`;
        leftCircle.appendChild(object);
    }
    for (let i = 0; i < randomSum2; i++) {
        const object = document.createElement('div');
        object.className = 'object';
        object.style.backgroundImage = `url('${currentImage}')`;
        rightCircle.appendChild(object);
    }

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    const wrongAnswer = correctAnswer + getRandomInt(1, 3);
    const answers = [
        correctAnswer,
        wrongAnswer,
        wrongAnswer + getRandomInt(1, 3),
        wrongAnswer - getRandomInt(1, 3)
    ];
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
        const answerButton = document.createElement('div');
        answerButton.className = 'answer';
        answerButton.innerText = answer;
        answerButton.onclick = () => checkAnswer(answer);
        answersContainer.appendChild(answerButton);
    });

    // Guardar progreso al iniciar cada nivel
    guardarProgreso();
}

// 📌 Verificar respuesta y guardar progreso
function checkAnswer(selectedAnswer) {
    if (selectedAnswer === correctAnswer) {
        points++;
        correctAnswers++;
        document.getElementById('score').innerText = `Puntos: ${points}`;
        
        // Reproducir sonido de acierto
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
            if (currentLevel < totalLevels) {
                // Reproducir sonido de subir de nivel
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
        // Reproducir sonido de error
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
            currentLevel = 0;
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


   // ─── AUDIOS ─────────────────────────────────────────────
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