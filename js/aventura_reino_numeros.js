// Variables globales
let nivel = 1;
let puntaje = 0;
let fallos = 0;
let objetivo;
let personajePos = { x: 0, y: 0 }; // Posición inicial del personaje
const gridSize = 5; // Tamaño de la cuadrícula
let objetos = []; // Lista de objetos en el escenario
let operacionActual = 0; // Resultado actual de la operación
const juegoID = 4; // ID del juego en la base de datos

// Elementos del DOM
const personaje = document.getElementById("personaje");
const escenario = document.getElementById("escenario");
const nivelDisplay = document.getElementById("nivel");
const puntajeDisplay = document.getElementById("puntaje");
const objetosContainer = document.getElementById("objetos");
const objetivoDisplay = document.getElementById("objetivo");
const operacionDisplay = document.getElementById("operacion");

// ─── AGREGAR AUDIOS ─────────────────────────────────────────────
// Música de fondo y audios para acierto y error (mismos archivos que en los otros juegos)
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

    iniciarJuego(); // Asegurar que el juego se inicie después de cargar el progreso
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

// Crear la cuadrícula en el escenario
function crearCuadricula() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement("div");
            cell.classList.add("absolute", "border", "border-gray-300");
            cell.style.width = `${100 / gridSize}%`;
            cell.style.height = `${100 / gridSize}%`;
            cell.style.left = `${(j / gridSize) * 100}%`;
            cell.style.top = `${(i / gridSize) * 100}%`;
            escenario.appendChild(cell);
        }
    }
}

// Función para generar objetivos alcanzables
function generarObjetivoAlcanzable() {
    // Generamos un objetivo más pequeño para hacer el juego más manejable
    const minObjetivo = 5 + nivel * 2; // Aumenta con el nivel
    const maxObjetivo = 15 + nivel * 3; // Aumenta con el nivel
    return Math.floor(Math.random() * (maxObjetivo - minObjetivo + 1)) + minObjetivo;
}

// Función modificada para generar objetos que permitan alcanzar el objetivo
function generarObjetos() {
    objetosContainer.innerHTML = "";
    objetos = [];
    
    // Primero, generamos números que nos permitan alcanzar el objetivo
    let numeros = [];
    let sumaActual = 0;
    
    // Aseguramos que al menos tengamos una combinación válida para alcanzar el objetivo
    while (sumaActual !== objetivo) {
        // Si nos pasamos del objetivo, agregamos números negativos
        if (sumaActual > objetivo) {
            const diferencia = sumaActual - objetivo;
            const resta = Math.min(Math.floor(Math.random() * 5) + 1, diferencia);
            numeros.push({ valor: resta, tipo: "resta" });
            sumaActual -= resta;
        } 
        // Si estamos por debajo del objetivo, agregamos números positivos
        else {
            const diferencia = objetivo - sumaActual;
            const suma = Math.min(Math.floor(Math.random() * 5) + 1, diferencia);
            numeros.push({ valor: suma, tipo: "suma" });
            sumaActual += suma;
        }
    }
    
    // Agregamos algunos números adicionales para hacer el juego más interesante
    const numerosAdicionales = Math.floor(Math.random() * 3) + 2; // 2-4 números adicionales
    for (let i = 0; i < numerosAdicionales; i++) {
        const valor = Math.floor(Math.random() * 5) + 1;
        const tipo = Math.random() > 0.5 ? "suma" : "resta";
        numeros.push({ valor, tipo });
    }
    
    // Colocamos los números en posiciones aleatorias de la cuadrícula
    while (numeros.length > 0 && objetos.length < gridSize * gridSize) {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        
        // Evitar colocar objetos en la misma celda
        if (objetos.some(obj => obj.x === x && obj.y === y)) {
            continue;
        }
        
        const numero = numeros.pop();
        objetos.push({ x, y, valor: numero.valor, tipo: numero.tipo });
        
        const div = document.createElement("div");
        div.classList.add("absolute", "w-10", "h-10", "rounded-full", "flex", "items-center", "justify-center", "shadow-lg");
        div.style.left = `${(x / gridSize) * 100}%`;
        div.style.top = `${(y / gridSize) * 100}%`;
        
        if (numero.tipo === "suma") {
            div.style.backgroundColor = "#4CAF50";
            div.textContent = `+${numero.valor}`;
        } else {
            div.style.backgroundColor = "#FF5722";
            div.textContent = `-${numero.valor}`;
        }
        
        div.style.color = "white";
        div.style.fontWeight = "bold";
        objetosContainer.appendChild(div);
    }
}

// Función para mover el personaje
function moverPersonaje(direccion) {
    switch (direccion) {
        case "arriba":
            if (personajePos.y > 0) personajePos.y--;
            break;
        case "abajo":
            if (personajePos.y < gridSize - 1) personajePos.y++;
            break;
        case "izquierda":
            if (personajePos.x > 0) personajePos.x--;
            break;
        case "derecha":
            if (personajePos.x < gridSize - 1) personajePos.x++;
            break;
    }
    actualizarPosicionPersonaje();
    verificarColision();
}

// Función para actualizar la posición del personaje
function actualizarPosicionPersonaje() {
    personaje.style.left = `${(personajePos.x / gridSize) * 100}%`;
    personaje.style.top = `${(personajePos.y / gridSize) * 100}%`;
}

// Función para verificar colisiones con objetos
function verificarColision() {
    let colisionDetectada = false;

    objetos.forEach((objeto, index) => {
        if (personajePos.x === objeto.x && personajePos.y === objeto.y) {
            colisionDetectada = true;

            if (objeto.tipo === "suma") {
                operacionActual += objeto.valor;
            } else {
                operacionActual -= objeto.valor;
            }

            operacionDisplay.textContent = operacionActual;

            // Eliminar objeto del escenario
            objetos.splice(index, 1);
            objetosContainer.removeChild(objetosContainer.children[index]);

            // Verificar si se alcanzó el objetivo o se pasó
            if (operacionActual === objetivo) {
                window.audioMuyBien.play();
                Swal.fire({
                    icon: "success",
                    title: "¡Objetivo logrado!",
                    text: `Has alcanzado el objetivo de ${objetivo}.`,
                    timer: 1500,
                    showConfirmButton: false,
                });
                subirNivel();
            } else if (operacionActual > objetivo) {
                fallos++;
                guardarProgreso();
                window.audioIncorrecto.play();
                Swal.fire({
                    icon: "error",
                    title: "¡Perdiste!",
                    text: `Te has pasado del objetivo de ${objetivo}.`,
                    timer: 1500,
                    showConfirmButton: false,
                });
                reiniciarJuego();
            }
        }
    });

    // 📌 Si no hubo colisión pero ya no hay más objetos y aún no se alcanzó el objetivo
    if (!colisionDetectada && objetos.length === 0 && operacionActual !== objetivo) {
        fallos++;
        guardarProgreso();
        window.audioIncorrecto.play();
        Swal.fire({
            icon: "error",
            title: "¡Fallaste!",
            text: "Se acabaron los objetos y no alcanzaste el objetivo.",
            timer: 2000,
            showConfirmButton: false,
        });
        reiniciarJuego();
    }
}


// Función para subir de nivel
function subirNivel() {
    nivel++;
    nivelDisplay.textContent = nivel;
    objetivo = generarObjetivoAlcanzable();
    objetivoDisplay.textContent = objetivo;
    operacionActual = 0;
    operacionDisplay.textContent = operacionActual;
    generarObjetos();
    actualizarPosicionPersonaje();
    guardarProgreso();
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
        // Reiniciar los valores
        nivel = 1;
        puntaje = 0;
        operacionActual = 0;
        objetivo = generarObjetivoAlcanzable();
        nivelDisplay.textContent = nivel;
        puntajeDisplay.textContent = puntaje;
        objetivoDisplay.textContent = objetivo;
        operacionDisplay.textContent = operacionActual;
        crearCuadricula();
        generarObjetos();
        actualizarPosicionPersonaje();
        guardarProgreso();
    });
}

// Iniciar juego
function iniciarJuego() {
    personajePos = { x: 0, y: 0 };
    nivel = 1;
    puntaje = 0;
    operacionActual = 0;
    objetivo = generarObjetivoAlcanzable();
    nivelDisplay.textContent = nivel;
    puntajeDisplay.textContent = puntaje;
    objetivoDisplay.textContent = objetivo;
    operacionDisplay.textContent = operacionActual;
    crearCuadricula();
    generarObjetos();
    actualizarPosicionPersonaje();
    guardarProgreso();
}

// Función para leer la guía del juego en voz alta
function leerGuia() {
    const texto = "Guía del Juego. Observa cuántos objetos hay dentro del círculo. Selecciona los objetos restando cada uno. Si aciertas tres veces consecutivas, pasarás al siguiente nivel.";
    
    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = "es-ES"; // Español
    speech.rate = 1; // Velocidad normal
    speech.volume = 1; // Volumen máximo
    speech.pitch = 1; // Tono normal

    window.speechSynthesis.speak(speech);
}

// Agregar evento al botón de ayuda
document.getElementById("btnAyuda").addEventListener("click", leerGuia);


// Controles
const btnArriba = document.getElementById("btnArriba");
const btnAbajo = document.getElementById("btnAbajo");
const btnIzquierda = document.getElementById("btnIzquierda");
const btnDerecha = document.getElementById("btnDerecha");

btnArriba.addEventListener("click", () => moverPersonaje("arriba"));
btnAbajo.addEventListener("click", () => moverPersonaje("abajo"));
btnIzquierda.addEventListener("click", () => moverPersonaje("izquierda"));
btnDerecha.addEventListener("click", () => moverPersonaje("derecha"));

// Iniciar el juego al cargar
document.addEventListener("DOMContentLoaded", iniciarJuego);

// Cargar progreso al iniciar
document.addEventListener("DOMContentLoaded", async () => {
    await obtenerProgreso();
});
document.addEventListener("keydown", function (e) {
    switch (e.key) {
        case "ArrowUp":
            moverPersonaje("arriba");
            break;
        case "ArrowDown":
            moverPersonaje("abajo");
            break;
        case "ArrowLeft":
            moverPersonaje("izquierda");
            break;
        case "ArrowRight":
            moverPersonaje("derecha");
            break;
    }
});
