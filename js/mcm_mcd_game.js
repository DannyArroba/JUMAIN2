document.addEventListener("DOMContentLoaded", async () => {
    const juegoID = 18; // ID del juego en la base de datos
    let currentLevel = 0;
    let currentQuestionIndex = 0;
    let fallos = 0;

    const levels = [
        {
            level: 1,
            questions: [
                { 
                    question: "Encuentra el MCM de 4 y 6:", 
                    options: ["12", "8", "10", "6"], 
                    answer: "12",
                    help: "El MCM de 4 y 6 es 12 porque es el menor múltiplo común de ambos números."
                },
                { 
                    question: "Encuentra el MCD de 8 y 12:", 
                    options: ["4", "6", "8", "2"], 
                    answer: "4",
                    help: "El MCD de 8 y 12 es 4 porque es el mayor número que divide exactamente a ambos."
                }
            ]
        },
        {
            level: 2,
            questions: [
                { 
                    question: "Encuentra el MCM de 5 y 10:", 
                    options: ["10", "15", "20", "25"], 
                    answer: "10",
                    help: "El MCM de 5 y 10 es 10 porque es el menor múltiplo común de ambos números."
                },
                { 
                    question: "Encuentra el MCD de 9 y 27:", 
                    options: ["3", "9", "27", "1"], 
                    answer: "9",
                    help: "El MCD de 9 y 27 es 9 porque es el mayor número que divide exactamente a ambos."
                },
                { 
                    question: "Encuentra el MCM de 7 y 14:", 
                    options: ["7", "14", "21", "28"], 
                    answer: "14",
                    help: "El MCM de 7 y 14 es 14 porque es el menor múltiplo común de ambos números."
                },
                { 
                    question: "Encuentra el MCD de 18 y 24:", 
                    options: ["6", "12", "18", "24"], 
                    answer: "6",
                    help: "El MCD de 18 y 24 es 6 porque es el mayor número que divide exactamente a ambos."
                }
            ]
        },
        {
            level: 3,
            questions: [
                { 
                    question: "Encuentra el MCM de 3 y 5:", 
                    options: ["15", "10", "5", "20"], 
                    answer: "15",
                    help: "El MCM de 3 y 5 es 15 porque es el menor múltiplo común de ambos números."
                },
                { 
                    question: "Encuentra el MCD de 10 y 25:", 
                    options: ["5", "10", "15", "20"], 
                    answer: "5",
                    help: "El MCD de 10 y 25 es 5 porque es el mayor número que divide exactamente a ambos."
                },
                { 
                    question: "Encuentra el MCM de 9 y 12:", 
                    options: ["36", "18", "24", "27"], 
                    answer: "36",
                    help: "El MCM de 9 y 12 es 36 porque es el menor múltiplo común de ambos números."
                },
                { 
                    question: "Encuentra el MCD de 16 y 24:", 
                    options: ["8", "4", "12", "16"], 
                    answer: "8",
                    help: "El MCD de 16 y 24 es 8 porque es el mayor número que divide exactamente a ambos."
                },
                { 
                    question: "Encuentra el MCM de 11 y 13:", 
                    options: ["143", "121", "169", "132"], 
                    answer: "143",
                    help: "El MCM de 11 y 13 es 143 porque es el menor múltiplo común de ambos números."
                },
                { 
                    question: "Encuentra el MCD de 21 y 35:", 
                    options: ["7", "5", "3", "1"], 
                    answer: "7",
                    help: "El MCD de 21 y 35 es 7 porque es el mayor número que divide exactamente a ambos."
                }
            ]
        }
    ];

    // 📌 Obtener progreso del usuario desde `progreso.php`
    async function obtenerProgreso() {
        try {
            const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
            const data = await response.json();

            if (data.success) {
                currentLevel = data.nivel - 1;
                currentQuestionIndex = 0;
                fallos = data.fallos;
            }
        } catch (error) {
            console.error("Error al obtener el progreso:", error);
        }

        loadQuestion();
    }

    // 📌 Guardar progreso en `progreso.php`
    async function guardarProgreso() {
        try {
            await fetch(`../php/progreso.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `juego_id=${juegoID}&nivel=${currentLevel + 1}&puntaje=${currentQuestionIndex}&fallos=${fallos}`
            });
        } catch (error) {
            console.error("Error al guardar el progreso:", error);
        }
    }

    // 📌 Cargar una pregunta del nivel actual
    function loadQuestion() {
        const level = levels[currentLevel];
        if (!level) return;

        const questionData = level.questions[currentQuestionIndex];
        document.getElementById("level").innerText = `Nivel ${level.level}`;
        document.getElementById("question").innerText = questionData.question;

        const optionsContainer = document.getElementById("options-container");
        optionsContainer.innerHTML = "";

        questionData.options.forEach((option) => {
            const button = document.createElement("button");
            button.className = "option";
            button.innerHTML = `<span class='shape'>${option}</span>`;
            button.onclick = () => checkAnswer(option);
            optionsContainer.appendChild(button);
        });
    }

    // 📌 Verificar respuesta
    function checkAnswer(selected) {
        const level = levels[currentLevel];
        const question = level.questions[currentQuestionIndex];

        if (selected === question.answer) {
            window.audioMuyBien.play();
            Swal.fire({
                title: "¡Correcto! 🎉",
                text: "¡Buena respuesta!",
                icon: "success",
                confirmButtonText: "Continuar"
            }).then(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex >= level.questions.length) {
                    currentLevel++;
                    currentQuestionIndex = 0;
                    if (currentLevel >= levels.length) {
                        mostrarFinal();
                        return;
                    }
                }
                guardarProgreso();
                loadQuestion();
            });
        } else {
            fallos++;
            window.audioIncorrecto.play();
            Swal.fire({
                title: "Incorrecto ❌",
                text: "Intenta nuevamente.",
                icon: "error",
                confirmButtonText: "Intentar"
            });
            guardarProgreso();
        }
    }

    function mostrarFinal() {
        window.audioMuyBien.play();
        Swal.fire({
            title: "¡Felicidades! 🎊",
            text: `Has completado todos los niveles.\nFallos: ${fallos}`,
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Reiniciar juego",
            cancelButtonText: "Volver al menú"
        }).then(res => {
            if (res.isConfirmed) resetGame();
            else window.location.href = 'menuA.php';
        });
    }
    window.resetGame = () => {
        currentLevel = 0;
        currentQuestionIndex = 0;
        fallos = 0;
        guardarProgreso();
        loadQuestion();
    };

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

document.getElementById("read-num").addEventListener("click", function() {
    if (!isReading) {
        speech.text = document.getElementById("question").innerText;
        speech.lang = "es-ES";
        speech.rate = 1;
        speechSynthesis.speak(speech);
    } else {
        speechSynthesis.cancel();
    }
    isReading = !isReading;
});
    // 📌 Botón de ayuda
    const helpBtn = document.getElementById("help-btn");
    const helpModal = document.getElementById("help-modal");
    const closeModal = document.getElementById("close-modal");
    const helpText = document.getElementById("help-text");

    helpBtn.addEventListener("click", () => {
        const questionData = levels[currentLevel].questions[currentQuestionIndex];
        helpText.textContent = questionData.help;
        helpModal.style.display = "flex";
    });

    closeModal.addEventListener("click", () => {
        helpModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === helpModal) {
            helpModal.style.display = "none";
        }
    });

    await obtenerProgreso();
});
