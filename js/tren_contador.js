document.addEventListener("DOMContentLoaded", async () => {
    // Variables locales del juego
    let nivel = 1;
    let aciertos = 0;
    let fallos = 0;
    let puntaje = 0;
    const juegoID = 6;
    let juegoCompletado = false;

    const nivelContainer = document.getElementById('nivel');
    const vagonesContainer = document.getElementById('vagones');
    const opcionesContainer = document.getElementById('opciones');

    // ─── AUDIOS ─────────────────────────────────────────────
    // Música de fondo y audios de acierto e incorrecto (verifica las rutas)
    window.musicaFondo = new Audio('./audio/Fondo.mp3');
    window.audioMuyBien = new Audio('./audio/correcto.mp3');
    window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');
    window.musicaFondo.loop = true;
    window.musicaFondo.play();

    // ─── OBTENER PROGRESO ─────────────────────────────────────────────
    async function obtenerProgreso() {
        try {
            const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
            const data = await response.json();
            if (data.success) {
                nivel = data.nivel;
                aciertos = data.aciertos || 0;
                fallos = data.fallos || 0;
                puntaje = data.puntaje;
            }
        } catch (error) {
            console.error("Error al obtener el progreso:", error);
        }
    }

    // ─── GUARDAR PROGRESO ─────────────────────────────────────────────
    async function guardarProgreso() {
        if (juegoCompletado) return;
        // Limitar a 3 niveles
        const nivelGuardado = Math.min(nivel, 3);
        try {
            await fetch(`../php/progreso.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `juego_id=${juegoID}&nivel=${nivelGuardado}&aciertos=${aciertos}&fallos=${fallos}&puntaje=${puntaje}`
            });
            console.log(`💾 Progreso guardado: Nivel ${nivelGuardado}, Aciertos ${aciertos}, Fallos ${fallos}, Puntaje ${puntaje}`);
        } catch (error) {
            console.error("Error al guardar el progreso:", error);
        }
    }

    function actualizarJuego() {
        nivelContainer.textContent = `Nivel ${nivel}`;
        generarVagones();
    }

    function generarVagones() {
        const cantidad = Math.floor(Math.random() * 7) + 3;
        vagonesContainer.innerHTML = '';

        for (let i = 1; i <= cantidad; i++) {
            const vagon = document.createElement('div');
            vagon.className = 'w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center mx-2 text-white font-bold text-lg';
            vagon.textContent = i;
            vagonesContainer.appendChild(vagon);
        }

        generarOpciones(cantidad);
    }

    function generarOpciones(correcta) {
        let opciones = [correcta];
        while (opciones.length < 3) {
            const opcion = Math.max(1, Math.min(10, correcta + Math.floor(Math.random() * 5) - 2));
            if (!opciones.includes(opcion)) {
                opciones.push(opcion);
            }
        }
        opciones = opciones.sort(() => Math.random() - 0.5);
        opcionesContainer.innerHTML = '';

        opciones.forEach(opcion => {
            const button = document.createElement('button');
            button.textContent = opcion;
            button.className = 'w-28 h-28 text-3xl bg-blue-500 text-white rounded-lg hover:bg-blue-600';
            button.onclick = () => verificarRespuesta(opcion, correcta);
            opcionesContainer.appendChild(button);
        });
    }

    async function verificarRespuesta(opcion, correcta) {
        if (juegoCompletado) {
            juegoCompletado = false;
            nivel = 1;
            aciertos = 0;
            fallos = 0;
            puntaje = 0;
            await guardarProgreso();
        }

        if (opcion === correcta) {
            aciertos++;
            puntaje += 10;
            window.audioMuyBien.play();

            console.log(`✔️ Correcto. Aciertos: ${aciertos}, Nivel: ${nivel}, Puntaje: ${puntaje}`);

            let avanzarDeNivel = false;
            if ((nivel === 1 && aciertos >= 1) || (nivel === 2 && aciertos >= 2) || (nivel === 3 && aciertos >= 3)) {
                avanzarDeNivel = true;
                nivel++;
                aciertos = 0;
            }

            await guardarProgreso();

            if (nivel > 3) {
                finalizarJuego();
                return;
            }

            if (avanzarDeNivel) {
                Swal.fire({
                    icon: 'success',
                    title: `¡Nivel ${nivel - 1} Completado!`,
                    text: `Ahora estás en el Nivel ${nivel}.`,
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    actualizarJuego();
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '¡Correcto! 🎉',
                    text: '¡Sigue así!',
                    confirmButtonText: 'Continuar',
                    timer: 2000,
                    timerProgressBar: true
                }).then(() => {
                    generarVagones();
                });
            }
        } else {
            fallos++;
            await guardarProgreso();
            window.audioIncorrecto.play();
            Swal.fire({
                icon: 'error',
                title: 'Incorrecto 😢',
                text: '¡Vuelve a intentarlo, tú puedes!',
                confirmButtonText: 'Reintentar',
                timer: 2000,
                timerProgressBar: true
            });
        }
    }

    async function finalizarJuego() {
        juegoCompletado = true;
        await guardarProgreso();
        Swal.fire({
            icon: 'success',
            title: '¡Felicidades, Campeón/a! 🎉',
            html: `
                <p class="text-lg">¡Has completado los 3 niveles con éxito!</p>
                <p class="text-lg font-bold">Puntaje final: ${puntaje} puntos 🎯</p>
                <div class="flex justify-center mt-4">⭐️⭐️⭐️</div>
            `,
            showCancelButton: true,
            cancelButtonText: 'Volver al Menú',
            confirmButtonText: 'Volver a jugar',
            allowOutsideClick: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log("🔄 Volver a jugar. Puntaje reseteado.");
                puntaje = 0;
                actualizarJuego();
            } else {
                console.log("🔙 Volviendo al menú.");
                window.location.href = 'menu.php';
            }
        });
    }

    function actualizarJuego() {
        console.log(`🔄 Actualizando UI: Nivel ${nivel}, Puntaje ${puntaje}`);
        nivelContainer.textContent = `Nivel ${nivel}`;
        generarVagones();
    }

    // Funcionalidad para leer la guía en voz alta (opcional)
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

    // Primero, cargar el progreso guardado y luego actualizar la UI
    await obtenerProgreso();
    actualizarJuego();
});
