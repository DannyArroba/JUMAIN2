let currentLevel = 1; // Nivel inicial
let currentExercise = 1; // Ejercicio inicial dentro del nivel

// Fracciones por nivel (4 ejercicios por nivel)
const levels = [
    [
        { numerator: 1, denominator: 4 },
        { numerator: 2, denominator: 4 },
        { numerator: 3, denominator: 4 },
        { numerator: 4, denominator: 4 }
    ],
    [
        { numerator: 1, denominator: 2 },
        { numerator: 2, denominator: 3 },
        { numerator: 3, denominator: 4 },
        { numerator: 4, denominator: 5 }
    ],
    [
        { numerator: 2, denominator: 3 },
        { numerator: 3, denominator: 5 },
        { numerator: 4, denominator: 6 },
        { numerator: 5, denominator: 8 }
    ]
];

// Función para cargar el nivel
function loadLevel() {
    // Cargar ejercicios del nivel actual
    loadExercise();
    updateLevelHighlight();
}

// Función para cargar un ejercicio
function loadExercise() {
    const fraction = levels[currentLevel - 1][currentExercise - 1];
    const totalExercises = levels[currentLevel - 1].length;

    // Actualizar indicadores
    document.getElementById('operation-indicator').textContent = `Operación: ${currentExercise} / ${totalExercises}`;
    updateLevelHighlight();

    // Dibujar gráfica de fracción
    drawFractionGraphic(fraction.numerator, fraction.denominator);

    // Mostrar opciones de respuesta
    addAnswerOptions(fraction);
}

// Actualiza el nivel resaltado
function updateLevelHighlight() {
    const levelButtons = document.querySelectorAll('button[id^="level-"]');
    
    levelButtons.forEach((button, index) => {
        if (index + 1 < currentLevel) {
            button.classList.remove('bg-blue-500', 'text-white');
            button.classList.add('bg-green-500', 'text-white'); // Completado
        } else if (index + 1 === currentLevel) {
            button.classList.remove('bg-blue-500', 'text-white');
            button.classList.add('bg-blue-500', 'text-white'); // Nivel actual
        } else {
            button.classList.remove('bg-green-500', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-400', 'text-gray-600'); // Niveles no alcanzados
        }
    });
}

// Dibujar la gráfica de la fracción
function drawFractionGraphic(numerator, denominator) {
    const fractionGraphic = document.getElementById('fraction-graphic');
    fractionGraphic.innerHTML = ''; // Limpiar el contenido previo

    for (let i = 0; i < denominator; i++) {
        const part = document.createElement('div');
        part.classList.add('w-full', 'h-full', 'flex-1', 'border', 'border-gray-500');
        part.style.backgroundColor = i < numerator ? '#4A90E2' : '#E5E5E5'; // Azul para la parte coloreada
        fractionGraphic.appendChild(part);
    }
}

// Agregar opciones de respuesta
function addAnswerOptions(correctFraction) {
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = ''; // Limpiar las opciones anteriores

    const options = [
        correctFraction,
        { numerator: correctFraction.numerator + 1, denominator: correctFraction.denominator },
        { numerator: correctFraction.numerator, denominator: correctFraction.denominator + 1 },
        { numerator: correctFraction.numerator - 1, denominator: correctFraction.denominator }
    ];

    // Mezclar opciones
    options.sort(() => Math.random() - 0.5);

    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = `${option.numerator} / ${option.denominator}`;
        button.classList.add('bg-gray-300', 'text-black', 'p-2', 'rounded', 'hover:bg-blue-500');
        button.addEventListener('click', () => handleAnswer(option, correctFraction));
        optionsContainer.appendChild(button);
    });
}

// Manejar la respuesta del usuario
function handleAnswer(selectedFraction, correctFraction) {
    if (selectedFraction.numerator === correctFraction.numerator &&
        selectedFraction.denominator === correctFraction.denominator) {
        Swal.fire({
            title: '¡Correcto!',
            text: '¡Bien hecho!',
            icon: 'success',
        }).then(() => {
            if (currentExercise < levels[currentLevel - 1].length) {
                currentExercise++;
                loadExercise();
            } else if (currentLevel < levels.length) {
                currentLevel++;
                currentExercise = 1;
                Swal.fire({
                    title: '¡Nivel Completado!',
                    text: `Has completado el Nivel ${currentLevel - 1}. Ahora pasarás al Nivel ${currentLevel}.`,
                    icon: 'info',
                }).then(() => loadLevel());
            } else {
                Swal.fire({
                    title: '¡Juego Terminado!',
                    text: '¡Felicidades! Has completado todos los niveles.',
                    icon: 'success'
                });
            }
        });
    } else {
        Swal.fire({
            title: '¡Incorrecto!',
            text: 'Inténtalo nuevamente.',
            icon: 'error'
        });
    }
}

// Iniciar el juego al cargar la página
window.onload = loadLevel;
