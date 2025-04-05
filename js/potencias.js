document.addEventListener("DOMContentLoaded", async () => {
    const levelEl = document.getElementById("current-level");
    const scoreEl = document.getElementById("current-score");
    const totalScoreEl = document.getElementById("total-score");
    const problemDisplay = document.getElementById("problem-display");
    const optionsContainer = document.getElementById("options-container");
    const juegoID = 17;
    const maxNivel = 5;

    let nivel = 1;
    let puntaje = 0;
    let totalPuntaje = 0;
    let fallos = 0;
    let problemas = [];
    let problemaActualIndex = 0;
    let respuestasCorrectasNivel = 0;
    let juegoCompletado = false;

    async function obtenerProgreso() {
        try {
            const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
            const data = await response.json();
            if (data.success) {
                nivel = data.nivel;
                puntaje = data.puntaje;
                fallos = data.fallos;
                totalPuntaje = puntaje * 10;
                if (nivel > maxNivel) nivel = maxNivel;
                juegoCompletado = (nivel === maxNivel && respuestasCorrectasNivel >= 2);
            }
        } catch (e) {
            console.error("Error al obtener el progreso:", e);
        }
        generarProblemas();
        actualizarPantalla();
    }

    async function guardarProgreso() {
        try {
            await fetch(`../php/progreso.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `juego_id=${juegoID}&nivel=${nivel}&puntaje=${puntaje}&fallos=${fallos}`
            });
        } catch (e) {
            console.error("Error al guardar el progreso:", e);
        }
    }

    function generarProblemas() {
        problemas = [];
        for (let i = 0; i < 3; i++) {
            const base = Math.floor(Math.random() * 5) + 2;
            const exp = Math.floor(Math.random() * (nivel + 1)) + 1;
            const solucion = Math.pow(base, exp).toString();
            problemas.push({
                problema: `<span class="potencia">${base}<sup>${exp}</sup></span>`,
                solucion,
                opciones: generarOpciones(solucion)
            });
        }
    }

    function generarOpciones(correcta) {
        const set = new Set([correcta]);
        while (set.size < 4) {
            const falsa = (Math.floor(Math.random() * (parseInt(correcta) + 10)) + 1).toString();
            if (falsa !== correcta) set.add(falsa);
        }
        return Array.from(set).sort(() => Math.random() - 0.5);
    }

    function actualizarPantalla() {
        levelEl.textContent = nivel;
        scoreEl.textContent = puntaje;
        totalScoreEl.textContent = totalPuntaje;
        optionsContainer.innerHTML = "";

        if (juegoCompletado) {
            mostrarFinal();
            return;
        }

        const actual = problemas[problemaActualIndex];
        problemDisplay.innerHTML = `<h2>Resuelve: ${actual.problema}</h2>`;
        actual.opciones.forEach(opt => {
            const div = document.createElement("div");
            div.className = "option";
            div.textContent = opt;
            div.onclick = () => verificarRespuesta(opt, div);
            optionsContainer.appendChild(div);
        });
    }

    function verificarRespuesta(seleccion, elem) {
        if (juegoCompletado) return;
        const actual = problemas[problemaActualIndex];
        if (seleccion === actual.solucion) {
            puntaje++;
            totalPuntaje += 10 * nivel;
            respuestasCorrectasNivel++;
            window.audioMuyBien.play();
            elem.classList.add("correct");
            setTimeout(avanzarOContinuar, 500);
        } else {
            fallos++;
            window.audioIncorrecto.play();
            elem.classList.add("incorrect");
            setTimeout(() => mostrarMensaje("❌ Incorrecto", "Respuesta incorrecta. Intenta de nuevo.", "error"), 500);
        }
        guardarProgreso();
    }

    function avanzarOContinuar() {
        if (respuestasCorrectasNivel === 2) {
            if (nivel < maxNivel) {
                mostrarMensaje("¡Nivel completado!", `Avanzas al nivel ${nivel + 1}\nPuntaje actual: ${totalPuntaje}`, "success", () => {
                    nivel++;
                    puntaje = 0;
                    respuestasCorrectasNivel = 0;
                    problemaActualIndex = 0;
                    generarProblemas();
                    actualizarPantalla();
                });
            } else {
                juegoCompletado = true;
                mostrarFinal();
            }
        } else {
            problemaActualIndex = (problemaActualIndex + 1) % problemas.length;
            actualizarPantalla();
        }
    }

    function mostrarMensaje(title, text, icon, callback) {
        Swal.fire({
            title,
            text,
            icon,
            confirmButtonText: "Continuar",
            allowOutsideClick: false
        }).then(() => callback && callback());
    }
      // ─── LECTURA DE LA GUÍA (OPCIONAL) ─────────────────────────────────────────────
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


    function mostrarFinal() {
        Swal.fire({
            title: "¡Juego completado! 🎉",
            text: `Nivel final alcanzado.\nPuntaje total: ${totalPuntaje}`,
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Reiniciar juego",
            cancelButtonText: "Ir al menú"
        }).then(res => {
            if (res.isConfirmed) resetGame();
            else window.location.href = 'menuA.php';
        });
    }

    window.resetGame = () => {
        nivel = 1;
        puntaje = 0;
        totalPuntaje = 0;
        respuestasCorrectasNivel = 0;
        fallos = 0;
        juegoCompletado = false;
        problemaActualIndex = 0;
        generarProblemas();
        actualizarPantalla();
        guardarProgreso();
    };

    // Audios
    window.musicaFondo = new Audio('./audio/Fondo.mp3'); musicaFondo.loop = true; musicaFondo.play();
    window.audioMuyBien = new Audio('./audio/correcto.mp3');
    window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');

    await obtenerProgreso();
});
