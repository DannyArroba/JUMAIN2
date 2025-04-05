document.addEventListener("DOMContentLoaded", function () {
    if (document.body.classList.contains("modo-cognitivo")) {
        aplicarAdaptacionesCognitivas();
    }

    function aplicarAdaptacionesCognitivas() {
        document.body.classList.add("modo-cognitivo-body");

        // 📢 Crear chatbot
        const chatbot = document.createElement("div");
        chatbot.classList.add("chatbot-container");

        chatbot.innerHTML = `
            <div class="chatbot-header">🤖 Preguntas</div>
            <div class="chatbot-question" onclick="mostrarRespuesta('¿Cómo jugar?', 'Haz clic en un juego y sigue las instrucciones.')">¿Cómo jugar?</div>
            <div class="chatbot-question" onclick="mostrarRespuesta('¿Qué es un nivel?', 'Cada nivel tiene diferentes retos para aprender.')">¿Qué es un nivel?</div>
            <div class="chatbot-question" onclick="mostrarRespuesta('¿Cómo ganar puntos?', 'Resuelve los retos correctamente y gana puntos.')">¿Cómo ganar puntos?</div>
        `;
        document.body.appendChild(chatbot);

        // 📝 Crear modal para respuestas
        const modal = document.createElement("div");
        modal.id = "modalChatbot";
        modal.classList.add("modal");

        modal.innerHTML = `
            <div class="modal-content">
                <h2 id="modalQuestion"></h2>
                <p id="modalAnswer"></p>
                <button class="close-modal" onclick="cerrarModal()">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);

        // 📢 Crear botones de lectura
        const ajustesCognitivo = document.createElement("div");
        ajustesCognitivo.id = "ajustes-cognitivo";

        const leerJuegoBtn = document.createElement("button");
        leerJuegoBtn.textContent = "🔊 Leer Juego";
        leerJuegoBtn.classList.add("lectura-button");
        leerJuegoBtn.addEventListener("click", () => controlarLectura("iniciar"));

        const siguienteJuegoBtn = document.createElement("button");
        siguienteJuegoBtn.textContent = "⏩ Siguiente Juego";
        siguienteJuegoBtn.classList.add("lectura-button");
        siguienteJuegoBtn.addEventListener("click", () => controlarLectura("siguiente"));

        ajustesCognitivo.append(leerJuegoBtn, siguienteJuegoBtn);
        document.body.appendChild(ajustesCognitivo);
    }

    let speech = new SpeechSynthesisUtterance();
    let synth = window.speechSynthesis;
    let juegos = Array.from(document.querySelectorAll(".juego h2"));
    let juegoActual = -1;

    function controlarLectura(accion) {
        limpiarResaltado();
        if (accion === "iniciar") {
            if (synth.speaking) {
                synth.resume();
            } else {
                avanzarLectura();
            }
        } else if (accion === "siguiente") {
            avanzarLectura();
        }
    }

    function avanzarLectura() {
        juegoActual = (juegoActual + 1) % juegos.length;
        resaltarJuego(juegos[juegoActual].parentElement);
        leerTexto(juegos[juegoActual].innerText);
    }

    function leerTexto(texto) {
        synth.cancel();
        speech.text = texto;
        speech.lang = "es-ES";
        synth.speak(speech);
    }

    function resaltarJuego(juego) {
        limpiarResaltado();
        juego.classList.add("leyendo");
    }

    function limpiarResaltado() {
        document.querySelectorAll(".leyendo").forEach(el => el.classList.remove("leyendo"));
    }

    window.mostrarRespuesta = function (pregunta, respuesta) {
        document.getElementById("modalQuestion").textContent = pregunta;
        document.getElementById("modalAnswer").textContent = respuesta;
        document.getElementById("modalChatbot").style.display = "block";
        leerTexto(respuesta);
    };

    window.cerrarModal = function () {
        document.getElementById("modalChatbot").style.display = "none";
    };
});
