let nivel = 1;
let puntaje = 0;
let fallos = 0; // Variable para los fallos
const juegoID = 5; // ID del juego en la base de datos

// Piezas disponibles en la zona inferior
const piezasData = [
    { tipo: "cuadrado", color: "blue", ancho: 110, alto: 80, rotacion: 0 },
    { tipo: "romboide", color: "green", ancho: 130, alto: 70, rotacion: 0 },
    { tipo: "triangulo", color: "purple", ancho: 80, alto: 80, rotacion: 0 },
    { tipo: "rectangulo", color: "cyan", ancho: 110, alto: 60, rotacion: 0 },
];

// Patrones que aparecerán en la figura a replicar
const patronesData = [
    [
        { tipo: "cuadrado", color: "blue", ancho: 110, alto: 80, rotacion: 0 },
        { tipo: "romboide", color: "green", ancho: 130, alto: 70, rotacion: 30 },
    ],
    [
        { tipo: "triangulo", color: "purple", ancho: 80, alto: 80, rotacion: 0 },
        { tipo: "rectangulo", color: "cyan", ancho: 110, alto: 60, rotacion: 45 },
    ],
    [
        { tipo: "romboide", color: "green", ancho: 130, alto: 70, rotacion: 60 },
        { tipo: "rectangulo", color: "cyan", ancho: 110, alto: 60, rotacion: 90 },
    ],
];

// ─── AGREGAR AUDIOS ─────────────────────────────────────────────
// Música de fondo y audios para acierto e incorrecto (mismos archivos que en los otros juegos)
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
            nivel = data.nivel;
            puntaje = data.puntaje;
            fallos = data.fallos || 0;
        }
    } catch (error) {
        console.error("Error al obtener el progreso:", error);
    }
    actualizarPantalla();
}

// 📌 Guardar progreso en `progreso.php`
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

function actualizarPantalla() {
    document.getElementById("puntaje").textContent = puntaje;
    document.getElementById("nivel").textContent = nivel;
}

// Crear pieza HTML
function crearPieza(pieza, draggable = true, id = null) {
    const container = document.createElement("div");
    container.classList.add("pieza");
    container.style.position = "relative";
    container.style.width = `${pieza.ancho}px`;
    container.style.height = `${pieza.alto}px`;
    container.style.backgroundColor = pieza.color;

    if (pieza.tipo === "triangulo") {
        container.style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
    } else if (pieza.tipo === "romboide") {
        container.style.transform = `skewX(-20deg) rotate(${pieza.rotacion}deg)`;
    } else if (pieza.tipo === "circulo") {
        container.style.borderRadius = "50%";
    }

    container.dataset.rotacion = pieza.rotacion;
    container.dataset.tipo = pieza.tipo;
    container.dataset.color = pieza.color;

    if (draggable) {
        container.setAttribute("draggable", true);
        container.id = id || `pieza-${Date.now()}`;
        container.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("pieza-id", container.id);
            e.dataTransfer.setData("pieza-data", JSON.stringify(pieza));
        });

        let rotacion = pieza.rotacion;
        container.addEventListener("click", () => {
            rotacion = (rotacion + 15) % 360;
            container.style.transform = pieza.tipo === "romboide" ?
                `skewX(-20deg) rotate(${rotacion}deg)` :
                `rotate(${rotacion}deg)`;
            container.dataset.rotacion = rotacion;
            etiqueta.textContent = `${pieza.tipo} (${rotacion}°)`;
        });
    }

    const etiqueta = document.createElement("span");
    etiqueta.classList.add("etiqueta");
    etiqueta.textContent = `${pieza.tipo} (${pieza.rotacion}°)`;
    container.appendChild(etiqueta);

    return container;
}

// ─── MODIFICACIÓN: Generar modelo con ángulos aleatorios hasta 180° ─────────────────
function generarModelo() {
    const modelo = document.getElementById("modelo");
    modelo.innerHTML = "";

    const patron = patronesData[Math.floor(Math.random() * patronesData.length)];

    // Asignar a cada pieza un ángulo aleatorio (múltiplos de 15°) entre 0 y 180
    const patronRandom = patron.map(pieza => {
        const randomRotacion = Math.floor(Math.random() * 13) * 15; // 0,15,...,180
        return { ...pieza, rotacion: randomRotacion };
    });

    patronRandom.forEach((pieza) => {
        const div = crearPieza(pieza, false);
        div.style.transform = pieza.tipo === "romboide" ?
            `skewX(-20deg) rotate(${pieza.rotacion}deg)` :
            `rotate(${pieza.rotacion}deg)`;
        div.dataset.rotacion = pieza.rotacion;
        modelo.appendChild(div);
    });

    return patronRandom;
}

// Generar todas las piezas en la zona inferior
function generarPiezas() {
    const piezasContainer = document.getElementById("piezas");
    piezasContainer.innerHTML = "";
    piezasData.forEach((pieza, index) => {
        const div = crearPieza(pieza, true, `pieza-${index}`);
        piezasContainer.appendChild(div);
    });
}

function verificarConstruccion() {
    const construccion = Array.from(document.getElementById("construccion").children);
    const modelo = Array.from(document.getElementById("modelo").children);

    if (construccion.length !== modelo.length) {
        Swal.fire(
            "Incorrecto",
            `La cantidad de piezas no coincide. <br> - Modelo requiere ${modelo.length} piezas. <br> - Construcción actual tiene ${construccion.length} piezas.`,
            "error"
        );
        return;
    }

    let correcto = true;
    let retroalimentacion = "";

    for (let i = 0; i < modelo.length; i++) {
        const piezaConstruida = construccion[i];
        const piezaModelo = modelo[i];

        if (piezaConstruida.style.backgroundColor !== piezaModelo.style.backgroundColor) {
            correcto = false;
            retroalimentacion += `- La pieza ${i + 1} tiene el color incorrecto. Debe ser ${piezaModelo.style.backgroundColor}.<br>`;
        }
        if (piezaConstruida.style.clipPath !== piezaModelo.style.clipPath) {
            correcto = false;
            retroalimentacion += `- La forma de la pieza ${i + 1} no coincide. Asegúrate de usar el tipo correcto.<br>`;
        }
        if (piezaConstruida.style.width !== piezaModelo.style.width || piezaConstruida.style.height !== piezaModelo.style.height) {
            correcto = false;
            retroalimentacion += `- El tamaño de la pieza ${i + 1} no coincide. Asegúrate de usar las dimensiones correctas.<br>`;
        }
        if (parseInt(piezaConstruida.dataset.rotacion) !== parseInt(piezaModelo.dataset.rotacion)) {
            correcto = false;
            retroalimentacion += `- El ángulo de rotación de la pieza ${i + 1} es incorrecto. Debe ser ${piezaModelo.dataset.rotacion}°.<br>`;
        }
    }

    if (correcto) {
        window.audioMuyBien.play();
        puntaje += 10;
        if (nivel < 3) {
            nivel++;
            guardarProgreso();
            document.getElementById("puntaje").textContent = puntaje;
            document.getElementById("nivel").textContent = nivel;
            Swal.fire("¡Correcto!", "Has pasado al siguiente nivel", "success").then(() => {
                limpiarConstruccion();
                setTimeout(() => generarModelo(), 500);
            });
        } else {
            Swal.fire({
                icon: "success",
                title: "¡Felicidades!",
                text: "Has completado todos los niveles. ¿Deseas reiniciar el juego o volver al menú?",
                showCancelButton: true,
                confirmButtonText: "Reiniciar Juego",
                cancelButtonText: "Ir al menú",
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    reiniciarJuego();
                } else {
                    window.location.href = 'menu.php';
                }
            });
        }
    } else {
        // Incrementar fallos y guardar progreso en caso de error
        fallos++;
        window.audioIncorrecto.play();
        Swal.fire(
            "Incorrecto",
            `Tu construcción tiene los siguientes errores:<br>${retroalimentacion}`,
            "error"
        );
        guardarProgreso();
    }
}

function limpiarConstruccion() {
    const construccion = document.getElementById("construccion");
    construccion.innerHTML = "";
}

function inicializarConstruccion() {
    const construccion = document.getElementById("construccion");
    construccion.innerHTML = "";
    construccion.addEventListener("dragover", (e) => e.preventDefault());
    construccion.addEventListener("drop", (e) => {
        e.preventDefault();
        const piezaId = e.dataTransfer.getData("pieza-id");
        const piezaData = JSON.parse(e.dataTransfer.getData("pieza-data"));

        const piezaExistente = document.getElementById(piezaId);

        if (piezaExistente && construccion.contains(piezaExistente)) {
            piezaExistente.style.position = "absolute";
            piezaExistente.style.left = `${e.offsetX - piezaData.ancho / 2}px`;
            piezaExistente.style.top = `${e.offsetY - piezaData.alto / 2}px`;
        } else {
            const nuevaPieza = crearPieza(piezaData, true, piezaId);
            nuevaPieza.style.position = "absolute";
            nuevaPieza.style.left = `${e.offsetX - piezaData.ancho / 2}px`;
            nuevaPieza.style.top = `${e.offsetY - piezaData.alto / 2}px`;
            construccion.appendChild(nuevaPieza);
        }
    });
}

// Inicializar construcción (segunda definición, para asegurarse)
function inicializarConstruccion() {
    const construccion = document.getElementById("construccion");
    construccion.innerHTML = "";
    construccion.addEventListener("dragover", (e) => e.preventDefault());
    construccion.addEventListener("drop", (e) => {
        e.preventDefault();
        const piezaId = e.dataTransfer.getData("pieza-id");
        const piezaData = JSON.parse(e.dataTransfer.getData("pieza-data"));

        const piezaExistente = document.getElementById(piezaId);

        if (piezaExistente && construccion.contains(piezaExistente)) {
            piezaExistente.style.position = "absolute";
            piezaExistente.style.left = `${e.offsetX - piezaData.ancho / 2}px`;
            piezaExistente.style.top = `${e.offsetY - piezaData.alto / 2}px`;
        } else {
            const nuevaPieza = crearPieza(piezaData, true, piezaId);
            nuevaPieza.style.position = "absolute";
            nuevaPieza.style.left = `${e.offsetX - piezaData.ancho / 2}px`;
            nuevaPieza.style.top = `${e.offsetY - piezaData.alto / 2}px`;
            construccion.appendChild(nuevaPieza);
        }
    });
}

// Inicializar juego
function inicializarJuego() {
    generarPiezas();
    generarModelo();
    inicializarConstruccion();
}

// Función para reiniciar el juego
function reiniciarJuego() {
    Swal.fire({
        icon: "info",
        title: "Reiniciando...",
        text: "El juego se reiniciará.",
        timer: 1500,
        showConfirmButton: false,
    }).then(() => {
        nivel = 1;
        puntaje = 0;
        fallos = 0;
        guardarProgreso();
        document.getElementById("puntaje").textContent = puntaje;
        document.getElementById("nivel").textContent = nivel;
        reiniciarConstruccion();
    });
}

function reiniciarConstruccion() {
    limpiarConstruccion();
    inicializarJuego();
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
  

// Inicializar juego al cargar
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("verificar").addEventListener("click", verificarConstruccion);
    document.getElementById("limpiar").addEventListener("click", limpiarConstruccion);
    generarPiezas();
    generarModelo();
    inicializarConstruccion();
    obtenerProgreso();
});
