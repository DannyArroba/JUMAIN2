document.addEventListener("DOMContentLoaded", async () => {
    console.log("El DOM ha sido cargado, ejecutando script...");

    document.getElementById("validateButton").addEventListener("click", validateLevel3);
    const juegoID = 3; // ID del juego en la base de datos

    let score = 0;
    let correctMoves = 0;
    let errorMoves = 0;
    let level = 1;

    const instructions = [
        `Bienvenido/a a "La Tienda de Frutas". Clasifica las frutas en las cestas correctas siguiendo las reglas: <br><br>
        <strong>Nivel 1:</strong> Clasifica todas las frutas según su color. <br>
        <strong>Nivel 2:</strong> Clasifica todas las frutas según su tamaño. <br>
        <strong>Nivel 3:</strong> Todas las frutas están disponibles, pero solo debes colocar las frutas necesarias en las cestas: <br>
        - Una fruta pequeña en la cesta verde. <br>
        - Una fruta mediana en la cesta roja. <br>
        - Una fruta grande en la cesta amarilla. <br>
        ¡Buena suerte!`,

        `Bienvenido/a a "La Tienda de Frutas". Clasifica las frutas en las cestas correctas siguiendo las reglas: <br><br>
        <strong>Nivel 1:</strong> Clasifica todas las frutas según su color. <br>
        <strong>Nivel 2:</strong> Clasifica todas las frutas según su tamaño. <br>
        <strong>Nivel 3:</strong> Todas las frutas están disponibles, pero solo debes colocar las frutas necesarias en las cestas: <br>
        - Una fruta pequeña en la cesta verde. <br>
        - Una fruta mediana en la cesta roja. <br>
        - Una fruta grande en la cesta amarilla. <br>
        ¡Buena suerte!`,

        `Bienvenido/a a "La Tienda de Frutas". Clasifica las frutas en las cestas correctas siguiendo las reglas: <br><br>
        <strong>Nivel 1:</strong> Clasifica todas las frutas según su color. <br>
        <strong>Nivel 2:</strong> Clasifica todas las frutas según su tamaño. <br>
        <strong>Nivel 3:</strong> Todas las frutas están disponibles, pero solo debes colocar las frutas necesarias en las cestas: <br>
        - Una fruta pequeña en la cesta verde. <br>
        - Una fruta mediana en la cesta roja. <br>
        - Una fruta grande en la cesta amarilla. <br>
        ¡Buena suerte!`
    ];

    const fruits = [
        { name: 'Manzana Roja', color: 'red', size: 'large', image: './img/manzana_roja.png' },
        { name: 'Plátano Amarillo', color: 'yellow', size: 'medium', image: './img/banana.png' },
        { name: 'Uva Verde', color: 'green', size: 'small', image: './img/uva_verde.png' },
        { name: 'Fresa Roja', color: 'red', size: 'small', image: './img/fresa.png' },
        { name: 'Limón Amarillo', color: 'yellow', size: 'small', image: './img/limon.png' },
        { name: 'Manzana Verde', color: 'green', size: 'medium', image: './img/manzana_verde.png' },
        { name: 'Sandía', color: 'green', size: 'large', image: './img/sandia.png' },
        { name: 'Cereza Roja', color: 'red', size: 'medium', image: './img/cereza.png' },
        { name: 'Melón Amarillo', color: 'yellow', size: 'large', image: './img/melon.png' }
    ];

    // ─── AUDIO ─────────────────────────────────────────────────────
    // Música de fondo y audios para acierto/error (mismos archivos del otro juego)
    window.musicaFondo = new Audio('./audio/Fondo.mp3');
    window.audioMuyBien = new Audio('./audio/correcto.mp3');
    window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');
    window.musicaFondo.loop = true;
    window.musicaFondo.play();

    // 📌 Obtener progreso del usuario desde `progreso.php`
    async function obtenerProgreso() {
        try {
            const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
            const data = await response.json();
            if (data.success) {
                level = data.nivel;
                score = data.puntaje;
                errorMoves = data.fallos;
            }
        } catch (error) {
            console.error("Error al obtener el progreso:", error);
        }
        updateLevelDisplay();
        startNewGame();
    }

    // 📌 Guardar progreso en `progreso.php`
    async function guardarProgreso() {
        try {
            await fetch(`../php/progreso.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `juego_id=${juegoID}&nivel=${level}&puntaje=${score}&fallos=${errorMoves}`
            });
        } catch (error) {
            console.error("Error al guardar el progreso:", error);
        }
    }

    function updateLevelDisplay() {
        const currentLevelElement = document.getElementById('currentLevel');
        currentLevelElement.textContent = `Nivel ${level}`;
        // Mostrar las instrucciones del nivel correspondiente
        document.getElementById('instructionsText').innerHTML = instructions[level - 1];
    }

    function createFruit(fruit) {
        const div = document.createElement('div');
        const sizeClass = fruit.size === 'small' ? 'w-24 h-24' : fruit.size === 'medium' ? 'w-36 h-36' : 'w-48 h-48';
        div.className = `fruit ${sizeClass} flex justify-center items-center`;
        div.draggable = true;
        div.dataset.color = fruit.color;
        div.dataset.size = fruit.size;

        const img = document.createElement('img');
        img.src = fruit.image;
        img.alt = fruit.name;
        img.className = "w-full h-full object-contain";

        div.appendChild(img);
        div.addEventListener('dragstart', handleDragStart);
        div.addEventListener('dragend', handleDragEnd);

        return div;
    }

    function setupFruits() {
        const largeRow = document.getElementById('largeFruitsRow');
        const mediumRow = document.getElementById('mediumFruitsRow');
        const smallRow = document.getElementById('smallFruitsRow');

        largeRow.innerHTML = '';
        mediumRow.innerHTML = '';
        smallRow.innerHTML = '';

        fruits.forEach(fruit => {
            const fruitElement = createFruit(fruit);
            if (fruit.size === 'large') {
                largeRow.appendChild(fruitElement);
            } else if (fruit.size === 'medium') {
                mediumRow.appendChild(fruitElement);
            } else {
                smallRow.appendChild(fruitElement);
            }
        });
    }

    function setupBaskets() {
        const basketArea = document.getElementById('basketArea');
        basketArea.innerHTML = '';

        const colors = ['red', 'green', 'yellow'];

        if (level === 1 || level === 3) {
            addBasket(colors[0], 'small');
            addBasket(colors[1], 'medium');
            addBasket(colors[2], 'large');
        } else if (level === 2) {
            addBasket(null, 'small');
            addBasket(null, 'medium');
            addBasket(null, 'large');
        }
    }

    function addBasket(color, size) {
        const basket = document.createElement('div');
        const sizeClass = size === 'small' ? 'w-24 h-24' : size === 'medium' ? 'w-36 h-36' : 'w-48 h-48';
        basket.className = `basket ${sizeClass} flex justify-center items-center border-4 ${color ? `border-${color}-500` : 'border-gray-500'} bg-white rounded-lg`;
        if (color) basket.dataset.color = color;
        basket.dataset.size = size;

        basket.addEventListener('dragover', (e) => e.preventDefault());
        basket.addEventListener('drop', handleDrop);

        basketArea.appendChild(basket);
    }

    function handleDragStart(e) {
        e.target.classList.add('dragging');
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDrop(e) {
        e.preventDefault();
        const fruit = document.querySelector('.dragging');
        const basket = e.currentTarget;

        const matchesColor = fruit.dataset.color === basket.dataset.color || !basket.dataset.color;
        const matchesSize = fruit.dataset.size === basket.dataset.size;

        if (
            (level === 1 && matchesColor) ||
            (level === 2 && matchesSize) ||
            (level === 3 && matchesColor && matchesSize)
        ) {
            basket.appendChild(fruit);
            fruit.style.width = '100px';
            fruit.style.height = '100px';
            score += 10;
            correctMoves++;
            // Reproduce sonido de acierto
            window.audioMuyBien.play();
            checkLevelCompletion();
        } else {
            errorMoves++;
            // Reproduce sonido de error
            window.audioIncorrecto.play();
            Swal.fire({
                title: '¡Error!',
                text: 'Esta fruta no pertenece a esta cesta. Vuelve a intentarlo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }

        updateStats();
        guardarProgreso();
    }

    // Para el nivel 3, al validar se muestra la alerta final con opciones de reinicio o menú
    function validateLevel3() {
        if (level !== 3) return;

        const baskets = document.querySelectorAll('.basket');
        const hasFruits = [...baskets].some(basket => basket.children.length > 0);

        if (hasFruits) {
            // Reproduce sonido de acierto
            window.audioMuyBien.play();
            Swal.fire({
                title: '¡Juego Completado!',
                text: 'Has clasificado correctamente las frutas. ¿Quieres reiniciar el juego o volver al menú?',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Reiniciar Juego',
                cancelButtonText: 'Ir al menú'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Reiniciar nivel, puntaje y fallos
                    level = 1;
                    score = 0;
                    errorMoves = 0;
                    guardarProgreso().then(() => {
                        // Forzamos dos recargas de la página de forma imperceptible
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
            guardarProgreso();
        } else {
            // Reproduce sonido de error
            window.audioIncorrecto.play();
            Swal.fire({
                title: '¡Aún no has terminado!',
                text: 'Coloca frutas en las cestas antes de verificar.',
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo'
            });
        }
    }

    function checkLevelCompletion() {
        const fruitsInShelf = document.querySelectorAll('#fruitShelf .fruit').length;

        // Para nivel 3, se mostrará el botón de validación
        if (level === 3) {
            document.getElementById('validateButton').classList.remove('hidden');
        } else {
            document.getElementById('validateButton').classList.add('hidden');
        }

        if (fruitsInShelf === 0) {
            if (level < 3) {
                Swal.fire({
                    title: '¡Felicidades!',
                    text: `Has completado el nivel ${level}. Pasas al siguiente nivel.`,
                    icon: 'success',
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    level++;
                    document.getElementById('instructionsText').innerHTML = instructions[level - 1];
                    guardarProgreso();
                    updateLevelDisplay();
                    startNewGame();
                });
            }
        }
    }

    function updateStats() {
        document.getElementById('score').textContent = score;
        document.getElementById('correct').textContent = correctMoves;
        document.getElementById('errors').textContent = errorMoves;
    }

    function startNewGame() {
        correctMoves = 0;
        errorMoves = 0;
        updateLevelDisplay();
        updateStats();
        setupFruits();
        setupBaskets();
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

    function restartGame() {
        level = 1;
        score = 0;
        errorMoves = 0;
        correctMoves = 0;
        guardarProgreso().then(() => {
            updateLevelDisplay();
            updateStats();
            setupFruits();
            setupBaskets();
        });
    }
    
    // Hacemos que restartGame esté disponible globalmente
    window.restartGame = restartGame;
    

    await obtenerProgreso();
});
