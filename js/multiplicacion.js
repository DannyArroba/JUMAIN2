const objectImages = [
    ['./img10/manzana.png', 'Ahora multiplicarás manzanas.'],
    ['./img10/pescad.png', 'Ahora multiplicarás pescados.'],
    ['./img10/pastel.png', 'Ahora multiplicarás pasteles.'],
    ['./img10/pan.png', 'Ahora multiplicarás pan.']
];

const levels = [
    { min: 1, max: 5 },
    { min: 1, max: 5 },
    { min: 2, max: 6 }
];

const totalLevels = 3;
let points = 0;
let correctAnswers = 0;
let currentLevel = 0;
let correctAnswer;
let fallos = 0;
const juegoID = 12;

async function obtenerProgreso() {
    try {
        const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
        const data = await response.json();
        if (data.success) {
            // Convertir nivel guardado (1‑3) a índice (0‑2)
            currentLevel = Math.max(0, Math.min(totalLevels - 1, data.nivel - 1));
            points = data.puntaje;
            fallos = data.fallos;
        } else {
            currentLevel = 0;
        }
        document.getElementById('levelTitle').innerText = `Nivel ${currentLevel + 1}`;
    } catch (error) {
        console.error("Error al obtener el progreso:", error);
    }
}

async function guardarProgreso() {
    try {
        // Guardar nivel real (+1) en la base de datos
        await fetch(`../php/progreso.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `juego_id=${juegoID}&nivel=${currentLevel + 1}&puntaje=${points}&fallos=${fallos}`
        });
        console.log(`💾 Progreso guardado: Nivel ${currentLevel + 1}, Puntos ${points}, Fallos ${fallos}`);
    } catch (error) {
        console.error("Error al guardar el progreso:", error);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLevel() {
    if (currentLevel >= totalLevels) return finalizarJuego();

    const { min, max } = levels[currentLevel];
    const randomNum1 = getRandomInt(min, max);
    const randomNum2 = getRandomInt(min, max);
    correctAnswer = randomNum1 * randomNum2;

    const [currentImage] = objectImages[currentLevel];

    document.getElementById('levelTitle').innerText = `Nivel ${currentLevel + 1}`;
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    const leftCircle = document.createElement('div');
    leftCircle.className = 'circle';
    const rightCircle = document.createElement('div');
    rightCircle.className = 'circle';
    const timesSign = document.createElement('div');
    timesSign.className = 'times-sign';
    timesSign.innerText = '×';
    gameArea.append(leftCircle, timesSign, rightCircle);

    for (let i = 0; i < randomNum1; i++) {
        const obj = document.createElement('div');
        obj.className = 'object';
        obj.style.backgroundImage = `url('${currentImage}')`;
        leftCircle.appendChild(obj);
    }
    for (let i = 0; i < randomNum2; i++) {
        const obj = document.createElement('div');
        obj.className = 'object';
        obj.style.backgroundImage = `url('${currentImage}')`;
        rightCircle.appendChild(obj);
    }

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';
    const wrongAnswer = correctAnswer + getRandomInt(1,5);
    [correctAnswer, wrongAnswer, wrongAnswer + getRandomInt(1,3), wrongAnswer - getRandomInt(1,3)]
        .sort(() => Math.random() - 0.5)
        .forEach(ans => {
            const btn = document.createElement('div');
            btn.className = 'answer';
            btn.innerText = ans;
            btn.onclick = () => checkAnswer(ans);
            answersContainer.appendChild(btn);
        });

    guardarProgreso();
}

function checkAnswer(selectedAnswer) {
    if (selectedAnswer === correctAnswer) {
        points++;
        correctAnswers++;
        document.getElementById('score').innerText = `Puntos: ${points}`;
        window.audioMuyBien.play();
        Swal.fire({ title:'¡Correcto!', text:'Respuesta correcta, sigue así.', icon:'success', confirmButtonText:'¡Genial!' });
        guardarProgreso();
        if (correctAnswers >= 3) {
            currentLevel++;
            correctAnswers = 0;
            guardarProgreso();
            if (currentLevel < totalLevels) {
                document.getElementById('levelUpSound').play();
                window.audioMuyBien.play();
                Swal.fire({ title:'¡Felicidades!', text:'¡Pasaste de nivel!', icon:'success', confirmButtonText:'Continuar' })
                    .then(generateLevel);
            } else finalizarJuego();
        } else generateLevel();
    } else {
        fallos++;
        guardarProgreso();
        window.audioIncorrecto.play();
        Swal.fire({ title:'¡Incorrecto!', text:'Intenta de nuevo.', icon:'error', confirmButtonText:'Lo intentaré' });
    }
}

function finalizarJuego() {
    guardarProgreso();
    Swal.fire({
        title:"¡Juego completado! 🎉",
        text:"Selecciona una opción para continuar.",
        icon:"success",
        showCancelButton:true,
        cancelButtonText:"Volver al Menú",
        confirmButtonText:"Volver a jugar"
    }).then(result => {
        if (result.isConfirmed) {
            currentLevel = 0;
            generateLevel();
        } else {
            window.location.href = 'menuM.php';
        }
    });
}

obtenerProgreso().then(generateLevel);

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
