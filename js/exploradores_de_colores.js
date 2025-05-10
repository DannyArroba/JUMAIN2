// Datos de los objetos (colores, formas y tamaños)
const objetos = [
    { id: 1, tipo: "color", valor: "rojo", img: "./img/rojos.png" },
    { id: 2, tipo: "color", valor: "azul", img: "./img/morado.png" },
    { id: 3, tipo: "color", valor: "verde", img: "./img/verde.png" },
    { id: 4, tipo: "forma", valor: "círculo", img: "./img/circulo.png" },
    { id: 5, tipo: "forma", valor: "cuadrado", img: "./img/cuadrado.png" },
    { id: 6, tipo: "forma", valor: "triángulo", img: "./img/triangul.png" },
    { id: 7, tipo: "tamaño", valor: "pequeño", img: "./img/llave.png" },
    { id: 8, tipo: "tamaño", valor: "mediano", img: "./img/pelota.png" },
    { id: 9, tipo: "tamaño", valor: "grande", img: "./img/puerta.png" }
];

// Variables del juego
const juegoID = 1;  // ID del juego en la base de datos
let nivel = 1;              // Nivel actual (se reinicia a 1 al reiniciar el juego)
const maxNivel = 3;         // Máximo nivel del juego
let repeticionesNivel = 0;  // Veces que se ha replicado correctamente el patrón en el nivel actual
let puntaje = 0;
let fallos = 0;
let patronActual = [];
let seleccionUsuario = [];

// Variables para audios
window.musicaFondo = new Audio('./audio/Fondo.mp3');
window.audioMuyBien = new Audio('./audio/correcto.mp3');
window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');

// Sonido para los botones (utilizando una URL externa)
const audioButton = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');

// Reproducir música de fondo en bucle
window.musicaFondo.loop = true;
window.musicaFondo.play();


// ─── FUNCIONES DE BASE DE DATOS ──────────────────────────────────────────────

// Función para obtener el progreso desde la base de datos
async function obtenerProgreso() {
    try {
        const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
        const data = await response.json();
        if (data.success) {
            nivel = data.nivel;
            puntaje = data.puntaje;
            fallos = data.fallos || 0;

        }
    } catch (error) {
        console.error("Error al obtener el progreso:", error);
    }
    iniciarJuego(); // Iniciar el juego con el progreso cargado
}

// Función para guardar el progreso en la base de datos
async function guardarProgreso() {
    try {
        await fetch(`../php/progreso.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `juego_id=${juegoID}&nivel=${nivel}&puntaje=${puntaje}&fallos=${fallos}`
        });
    } catch (error) {
        console.error("Error al guardar el progreso:", error);
    }
}


// ─── FUNCIONES DEL JUEGO ─────────────────────────────────────────────────────

// Función para mezclar un array aleatoriamente
function mezclarArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// Genera el patrón aleatorio para la ronda actual
function generarPatron() {
    const objetosMezclados = mezclarArray([...objetos]);
    // Longitud del patrón: se usa nivel + 2 (o el máximo disponible)
    const longitudPatron = Math.min(nivel + 2, objetosMezclados.length);
    patronActual = objetosMezclados.slice(0, longitudPatron);

    const patronContainer = document.getElementById("patron");
    patronContainer.innerHTML = "";

    patronActual.forEach(objeto => {
        const div = document.createElement("div");
        div.classList.add("p-6", "bg-white", "rounded-lg", "shadow-md", "flex", "justify-center");
        div.innerHTML = `<img src="${objeto.img}" alt="${objeto.valor}" class="w-12 h-12">`;
        patronContainer.appendChild(div);
    });
}

// Genera el tablero de selección de objetos
function generarTablero() {
    const tablero = document.getElementById("tablero");
    tablero.innerHTML = "";

    const objetosMezclados = mezclarArray([...objetos]);

    objetosMezclados.forEach(objeto => {
        const div = document.createElement("div");
        div.classList.add("p-6", "bg-white", "rounded-lg", "shadow-md", "cursor-pointer", "flex", "justify-center", "border-1", "objeto-seleccionable");
        div.setAttribute("data-id", objeto.id);
        div.innerHTML = `<img src="${objeto.img}" alt="${objeto.valor}" class="w-12 h-12">`;

        // Al hacer clic, se reproduce el sonido del botón y se maneja la selección
        div.addEventListener("click", () => {
            audioButton.play();
            manejarSeleccion(objeto, div);
        });
        tablero.appendChild(div);
    });
}

// Maneja la selección del usuario
function manejarSeleccion(objeto, elemento) {
    const index = seleccionUsuario.findIndex(seleccion => seleccion.id === objeto.id);

    if (index === -1) {
        if (seleccionUsuario.length < patronActual.length) {
            seleccionUsuario.push(objeto);
            elemento.classList.add("seleccionado", "opacity-50");
        }
    } else {
        seleccionUsuario.splice(index, 1);
        elemento.classList.remove("seleccionado", "opacity-50");
    }

    // Si se completó la selección, se verifica el patrón
    if (seleccionUsuario.length === patronActual.length) {
        verificarPatron();
    }
}

// Verifica si el patrón ingresado es correcto y administra la progresión de niveles y rondas
function verificarPatron() {
    const esCorrecto = seleccionUsuario.every((objeto, index) => objeto.id === patronActual[index].id);

    if (esCorrecto) {
        window.audioMuyBien.play();
        Swal.fire({
            icon: "success",
            title: "¡Muy bien!",
            text: "¡Has hecho un gran trabajo replicando el patrón!",
            timer: 1000,
            showConfirmButton: false
        });
        puntaje += 20;
        repeticionesNivel++;

        // Guarda el progreso en la base de datos
        guardarProgreso();

        if (repeticionesNivel < nivel) {
            // Repetir la misma ronda en el nivel actual
            iniciarJuego();
        } else {
            // Si se completó el número de repeticiones requeridas para el nivel
            if (nivel < maxNivel) {
                nivel++;               // Pasar al siguiente nivel
                repeticionesNivel = 0; // Reiniciar las repeticiones para el nuevo nivel
                iniciarJuego();
            } else {
                // Juego completado: muestra cuadro final con opciones para reiniciar o volver al menú
                Swal.fire({
                    icon: "success",
                    title: "¡Excelente trabajo!",
                    text: "¡Has completado el juego! ¿Quieres reiniciar el juego y comenzar de nuevo o volver al menú?",
                    showCancelButton: true,
                    confirmButtonText: "Reiniciar Juego",
                    cancelButtonText: "Volver al Menú",
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Reinicia todo el progreso del estudiante
                        nivel = 1;
                        repeticionesNivel = 0;
                        puntaje = 0;
                        guardarProgreso().then(() => {
                            // Forzamos dos recargas de la página de manera imperceptible
                            if (window.location.hash !== "#reloaded") {
                                window.location.hash = "#reloaded";
                                window.location.reload();
                            } else {
                                window.location.reload();
                            }
                        });
                    } else {
                        window.location.href = "./menu.php";
                    }
                });
            }
        }
    } else {
        window.audioIncorrecto.play();
        Swal.fire({
            icon: "error",
            title: "¡Oh, no!",
            text: "El patrón no coincide. ¡Inténtalo de nuevo!",
            timer: 1500,
            showConfirmButton: false
        });
        puntaje -= 10;
        fallos += 1;
        // Guarda el progreso también en caso de error
        guardarProgreso();
        iniciarJuego();
    }
    actualizarPuntaje();
}

// Actualiza el puntaje y muestra el nivel y la ronda actual en pantalla
function actualizarPuntaje() {
    document.getElementById("puntaje").textContent = puntaje;
    document.getElementById("nivel").textContent = `Nivel: ${nivel} (Ronda ${repeticionesNivel + 1}/${nivel})`;
}

// Reinicia la selección y genera un nuevo patrón y tablero para la ronda actual
function iniciarJuego() {
    seleccionUsuario = [];
    generarPatron();
    generarTablero();
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

// Cargar el progreso cuando se inicie la página
document.addEventListener("DOMContentLoaded", async function () {
    await obtenerProgreso();
});
