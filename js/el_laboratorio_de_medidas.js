const escalaCmPx = 40; // Define cuántos píxeles representa un centímetro
const niveles = [
    { objetos: [{ objeto: "img/Libros.jpg", longitud: 5 }] }, // Nivel 1: 1 objeto
    {
        objetos: [
            { objeto: "img/Libros.jpg", longitud: 5 },
            { objeto: "img/Lapiz.png", longitud: 7 },
            { objeto: "img/Caja.png", longitud: 10 },
        ],
    }, // Nivel 2: 3 objetos
    {
        objetos: [
            { objeto: "img/Libros.jpg", longitud: 5 },
            { objeto: "img/Lapiz.png", longitud: 7 },
            { objeto: "img/Caja.png", longitud: 10 },
            { objeto: "img/Manzana.png", longitud: 4 },
            { objeto: "img/Borrador.png", longitud: 3 },
            { objeto: "img/Regla.jpg", longitud: 8 },
        ],
    }, // Nivel 3: 6 objetos
];
let nivelActual = 0;
let objetoActual = 0; // Para controlar cuál objeto se está mostrando

// Elementos del DOM
const nivelDisplay = document.getElementById("nivel");
const nivelCornerDisplay = document.createElement("div"); // Elemento para mostrar el nivel en la esquina
nivelCornerDisplay.id = "nivelCornerDisplay";
nivelCornerDisplay.style.position = "fixed";
nivelCornerDisplay.style.top = "10px";
nivelCornerDisplay.style.right = "10px";
nivelCornerDisplay.style.padding = "10px 20px";
nivelCornerDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
nivelCornerDisplay.style.color = "white";
nivelCornerDisplay.style.borderRadius = "5px";
nivelCornerDisplay.style.fontSize = "1.2rem";
nivelCornerDisplay.style.zIndex = "1000";
document.body.appendChild(nivelCornerDisplay);

const objetosContainer = document.getElementById("objeto");
const opciones = document.querySelectorAll(".opcion");
const virtualRule = document.getElementById("virtualRule"); // Añadido para actualizar la regla

// Función para generar la regla
function generarRegla(longitud) {
    const marcadores = Array(longitud + 1).fill("|").join("   ");
    const numeros = Array(longitud + 1)
        .fill(0)
        .map((_, i) => i)
        .join("   ");
    return `${marcadores}\n${numeros}`;
}

// Función para generar opciones aleatorias
function generarOpciones(longitudCorrecta) {
    const opcionesSet = new Set();
    opcionesSet.add(longitudCorrecta); // Añadir la opción correcta

    while (opcionesSet.size < 3) {
        const opcionErronea = Math.floor(Math.random() * 10) + 1; // Generar opciones entre 1 y 10
        if (opcionErronea !== longitudCorrecta) {
            opcionesSet.add(opcionErronea);
        }
    }

    return Array.from(opcionesSet).sort(() => Math.random() - 0.5); // Mezclar opciones
}

// Función para cargar un objeto del nivel actual
function cargarObjeto() {
    const nivel = niveles[nivelActual];
    const objetoInfo = nivel.objetos[objetoActual];

    objetosContainer.innerHTML = ""; // Limpiar contenedor de objetos

    // Crear imagen del objeto
    const objetoImg = document.createElement("img");
    objetoImg.src = objetoInfo.objeto;
    objetoImg.style.width = `${objetoInfo.longitud * escalaCmPx}px`;
    objetoImg.style.height = "auto";
    objetoImg.classList.add("mb-2", "rounded-lg", "shadow-md");

    // Crear regla correspondiente
    const reglaDiv = document.createElement("pre");
    reglaDiv.textContent = generarRegla(objetoInfo.longitud);
    reglaDiv.style.width = `${objetoInfo.longitud * escalaCmPx}px`;
    reglaDiv.classList.add(
        "text-sm",
        "font-mono",
        "bg-gray-100",
        "p-2",
        "rounded-md",
        "shadow"
    );

    // Añadir imagen y regla al contenedor
    objetosContainer.appendChild(objetoImg);
    objetosContainer.appendChild(reglaDiv);

    // Actualizar el nivel mostrado
    nivelDisplay.textContent = `Nivel: ${nivelActual + 1} - Objeto ${objetoActual + 1} de ${nivel.objetos.length}`;

    // Actualizar nivel en la esquina
    nivelCornerDisplay.textContent = `Nivel ${nivelActual + 1}`;

    // Generar y asignar opciones dinámicas
    const opcionesDinamicas = generarOpciones(objetoInfo.longitud);
    opciones.forEach((opcion, index) => {
        opcion.textContent = `${opcionesDinamicas[index]} cm`;
        opcion.dataset.value = opcionesDinamicas[index];
        opcion.classList.remove("correcto", "incorrecto");
        opcion.disabled = false;
    });

    // Ajustar regla al tamaño de la imagen
    virtualRule.textContent = generarRegla(objetoInfo.longitud);
    virtualRule.style.width = `${objetoInfo.longitud * escalaCmPx}px`;
}

// Función para verificar la respuesta
function verificarRespuesta(event) {
    const valorSeleccionado = parseInt(event.target.dataset.value); // Obtiene el valor seleccionado
    const nivel = niveles[nivelActual];
    const objetoInfo = nivel.objetos[objetoActual];

    if (valorSeleccionado === objetoInfo.longitud) {
        event.target.classList.add("correcto");

        // Mostrar notificación de respuesta correcta
        Swal.fire({
            icon: "success",
            title: "¡Respuesta Correcta!",
            text: "Has seleccionado la longitud correcta.",
            showConfirmButton: false,
            timer: 1500,
        });

        objetoActual++;
        if (objetoActual < nivel.objetos.length) {
            setTimeout(cargarObjeto, 1500); // Cargar el siguiente objeto después de 1.5 segundos
        } else {
            objetoActual = 0; // Reiniciar el índice de objetos
            nivelActual++;
            if (nivelActual < niveles.length) {
                setTimeout(cargarObjeto, 1500); // Pasar al siguiente nivel
            } else {
                Swal.fire({
                    icon: "success",
                    title: "¡Felicidades!",
                    text: "Completaste todos los niveles del juego.",
                });
            }
        }
    } else {
        event.target.classList.add("incorrecto");

        // Mostrar notificación de respuesta incorrecta
        Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Seleccionaste un valor incorrecto. Inténtalo nuevamente.",
            confirmButtonText: "Reintentar",
        }).then(() => {
            cargarObjeto(); // Reinicia el objeto actual
        });
    }

    // Deshabilitar botones después de la respuesta
    opciones.forEach((opcion) => {
        opcion.disabled = true;
    });
}

// Asignar evento a cada botón de opción
opciones.forEach((opcion) => {
    opcion.addEventListener("click", verificarRespuesta);
});

// Cargar el primer objeto al inicio
cargarObjeto();
