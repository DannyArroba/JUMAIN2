document.addEventListener("DOMContentLoaded", function() {
    if (document.body.classList.contains("modo-visual")) {
        aplicarAdaptacionesVisuales();
    }

    function aplicarAdaptacionesVisuales() {
        document.body.classList.add("modo-visual");

        // Crear controles de lectura en voz alta
        const lecturaControles = document.createElement("div");
        lecturaControles.id = "modo-lectura";

        const leerBtn = document.createElement("button");
        leerBtn.textContent = "🔊 Leer Juego";
        leerBtn.addEventListener("click", () => controlarLectura("iniciar"));

        const pausarBtn = document.createElement("button");
        pausarBtn.textContent = "⏸ Pausar";
        pausarBtn.addEventListener("click", () => controlarLectura("pausar"));

        const adelantarBtn = document.createElement("button");
        adelantarBtn.textContent = "⏩ Siguiente Juego";
        adelantarBtn.addEventListener("click", () => controlarLectura("siguiente"));

        lecturaControles.append(leerBtn, pausarBtn, adelantarBtn);
        document.body.appendChild(lecturaControles);

        // Agregar botones para ajustes visuales
        const ajustesVisual = document.createElement("div");
        ajustesVisual.id = "ajustes-visual";

        const aumentarBtn = document.createElement("button");
        aumentarBtn.textContent = "🔍 + Aumentar";
        aumentarBtn.addEventListener("click", () => ajustarTamanoTexto(1.2));

        const disminuirBtn = document.createElement("button");
        disminuirBtn.textContent = "🔍 - Disminuir";
        disminuirBtn.addEventListener("click", () => ajustarTamanoTexto(0.8));

        const contrasteBtn = document.createElement("button");
        contrasteBtn.textContent = "🎨 Contraste";
        contrasteBtn.addEventListener("click", cambiarContraste);

        const nocturnoBtn = document.createElement("button");
        nocturnoBtn.textContent = "🌙 Modo Nocturno";
        nocturnoBtn.addEventListener("click", () => document.body.classList.toggle("modo-nocturno"));

        ajustesVisual.append(aumentarBtn, disminuirBtn, contrasteBtn, nocturnoBtn);
        document.body.appendChild(ajustesVisual);

        // Configurar lectura de nombres de juegos al seleccionar o hacer clic
        document.querySelectorAll(".juego").forEach((juego, index) => {
            const titulo = juego.querySelector("h2");
            titulo.setAttribute("tabindex", "0");
            titulo.dataset.index = index;
            
            // Leer el nombre del juego al recibir foco (teclado)
            titulo.addEventListener("focus", () => leerTexto(titulo.innerText));

            // Leer el nombre del juego al hacer clic en él
            juego.addEventListener("click", (event) => {
                event.preventDefault(); // Evita la navegación inmediata para leer el texto antes
                leerTexto(titulo.innerText, () => {
                    window.location.href = juego.getAttribute("onclick").split("'")[1]; // Redirige después de la lectura
                });
            });
        });
    }

    // Control de lectura en voz alta
    let speech = new SpeechSynthesisUtterance();
    let synth = window.speechSynthesis;
    speech.lang = "es-ES";
    let juegos = Array.from(document.querySelectorAll(".juego h2"));
    let juegoActual = -1; // No inicia en ningún juego

    function controlarLectura(accion) {
        if (accion === "iniciar") {
            if (synth.speaking) {
                synth.resume();
            } else {
                avanzarLectura();
            }
        } else if (accion === "pausar") {
            synth.pause();
        } else if (accion === "siguiente") {
            avanzarLectura();
        }
    }

    function avanzarLectura() {
        limpiarResaltado();
        if (juegoActual < juegos.length - 1) {
            juegoActual++;
            juegos[juegoActual].classList.add("resaltado");
            speech.text = juegos[juegoActual].innerText;
            synth.cancel();
            synth.speak(speech);
        }
    }

    function leerTexto(texto, callback = null) {
        synth.cancel();
        speech.text = texto;
        synth.speak(speech);
        if (callback) {
            speech.onend = callback; // Ejecuta la redirección después de la lectura
        }
    }

    function ajustarTamanoTexto(factor) {
        document.querySelectorAll("body, h1, h2, h3, p, a, button, .juego").forEach(el => {
            const actualSize = window.getComputedStyle(el).fontSize.replace("px", "");
            el.style.fontSize = (parseFloat(actualSize) * factor) + "px";
        });
    }

    let contrasteNivel = 0;
    function cambiarContraste() {
        const clases = ["contraste-1", "contraste-2", "contraste-3"];
        document.body.classList.remove(...clases);
        contrasteNivel = (contrasteNivel + 1) % clases.length;
        document.body.classList.add(clases[contrasteNivel]);
    }

    function limpiarResaltado() {
        document.querySelectorAll(".resaltado").forEach(el => el.classList.remove("resaltado"));
    }
});
