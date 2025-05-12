document.addEventListener("DOMContentLoaded", async () => {
    let nivel = 1;
    let puntaje = 0;
    let aciertos = 0;
    let fallos = 0;     // Fallos global
    let intentosFallidos = 0;
    let juegosPorNivel = 0;
    const niveles = 3;
    const juegoID = 8; // ID del juego en la base de datos

    // Sonidos
    const audioCorrecto = document.getElementById('audioCorrecto');
    const audioIncorrecto = document.getElementById('audioIncorrecto');

    const elementosClima = [
        { src: "./img/soleado.jpg", clima: "soleado" },
        { src: "./img/lluvioso.jpg", clima: "lluvioso" },
        { src: "./img/nevado.jpg", clima: "nevado" },
        { src: "./img/tormenta.jpg", clima: "tormentoso" },
    ];

    // 📌 Obtener el progreso del usuario desde la base de datos
    async function obtenerProgreso() {
        try {
            const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
            const data = await response.json();
            if (data.success) {
                nivel = Math.min(data.nivel, niveles);
                puntaje = data.puntaje;
            }
        } catch (error) {
            console.error("Error al obtener el progreso:", error);
        }

        iniciarJuego();
    }

    // 📌 Guardar el progreso en la base de datos
    async function guardarProgreso() {
        try {
            await fetch(`../php/progreso.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `juego_id=${juegoID}&nivel=${nivel}&puntaje=${puntaje}&fallos=${fallos}`

            });
            console.log(`💾 Progreso guardado: Nivel ${nivel}, Puntaje ${puntaje}`);
        } catch (error) {
            console.error("Error al guardar el progreso:", error);
        }
    }

    function barajarElementos(elementos) {
        return [...elementos].sort(() => Math.random() - 0.5);
    }

    function iniciarJuego() {
        const nivelTexto = document.getElementById("nivel-texto");
        const contenedorImagenes = document.getElementById("imagenes");
        const contenedorCuadros = document.getElementById("cuadros");
        const puntajeElemento = document.getElementById("puntaje");

        nivelTexto.innerText = `Nivel ${nivel}`;
        contenedorImagenes.innerHTML = "";
        contenedorCuadros.innerHTML = "";

        aciertos = 0;

        const elementosAleatorios = barajarElementos(elementosClima).slice(0, nivel + 1);
        
        barajarElementos(elementosAleatorios).forEach((elemento) => {
            const img = document.createElement("img");
            img.src = elemento.src;
            img.alt = elemento.clima;
            img.className = "imagen-clima";
            img.draggable = true;
            img.dataset.clima = elemento.clima;
            img.addEventListener("dragstart", dragStart);
            contenedorImagenes.appendChild(img);
        });

        elementosAleatorios.forEach((elemento) => {
            const cuadro = document.createElement("div");
            cuadro.className = "cuadro";
            cuadro.dataset.clima = elemento.clima;

            const contenedorImagen = document.createElement("div");
            contenedorImagen.className = "contenedor-imagen";
            cuadro.appendChild(contenedorImagen);

            const texto = document.createElement("span");
            texto.innerText = elemento.clima.toUpperCase();
            texto.className = "texto-clima";
            cuadro.appendChild(texto);

            cuadro.addEventListener("dragover", dragOver);
            cuadro.addEventListener("drop", drop);

            contenedorCuadros.appendChild(cuadro);
        });

        puntajeElemento.textContent = puntaje;
        console.log(`Iniciando nuevo juego - Nivel ${nivel}, Juego ${juegosPorNivel + 1}`);
    }

    function dragStart(event) {
        event.dataTransfer.setData("clima", event.target.dataset.clima);
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        
        const cuadro = event.target.classList.contains('cuadro') ? 
                    event.target : 
                    event.target.closest('.cuadro');
        
        if (!cuadro) return; 
        
        const clima = event.dataTransfer.getData("clima");
        const totalAciertosNecesarios = nivel + 1;

        if (cuadro.dataset.clima === clima) {
            audioCorrecto.play();
            
            const img = document.querySelector(`img[data-clima="${clima}"]`);
            img.draggable = false;
            img.style.opacity = "0.8";
            img.style.width = "100%";
            img.style.height = "auto";
            img.style.position = "relative";
            img.style.margin = "auto";

            const contenedorImagen = cuadro.querySelector('.contenedor-imagen');
            contenedorImagen.innerHTML = '';
            contenedorImagen.appendChild(img);
            cuadro.classList.add('cuadro-lleno');

            aciertos++;
            puntaje += 10;
            document.getElementById("puntaje").textContent = puntaje;

            Swal.fire({
                title: "¡Correcto!",
                text: "¡Buen trabajo!",
                icon: "success",
                timer: 1000,
                showConfirmButton: false
            });

            if (aciertos >= totalAciertosNecesarios) {
                juegosPorNivel++;
                
                if (juegosPorNivel >= 2) {
                    juegosPorNivel = 0;
                    
                    if (nivel < niveles) {
                        nivel++;
                        intentosFallidos = 0;
                        guardarProgreso();
                        Swal.fire({
                            title: "¡Nivel Superado!",
                            text: `Avanzas al nivel ${nivel}`,
                            icon: "success"
                        }).then(() => {
                            iniciarJuego();
                        });
                    } else {
                        finalizarJuego();
                    }
                } else {
                    guardarProgreso();
                    Swal.fire({
                        title: "¡Excelente!",
                        text: "Avanzas al siguiente juego.",
                        icon: "info"
                    }).then(() => {
                        iniciarJuego();
                    });
                }
            }
        } else {
            fallos++;
            guardarProgreso();
            audioIncorrecto.play();
            Swal.fire({
                title: "¡Incorrecto!",
                text: "Intenta nuevamente.",
                icon: "error",
                timer: 1000,
                showConfirmButton: false
            });

            intentosFallidos++;
            if (intentosFallidos >= 2) {
                Swal.fire({
                    title: "¡Demasiados errores!",
                    text: "Regresas al Nivel 1.",
                    icon: "warning"
                }).then(() => {
                    reiniciarJuego();
                });
            }
        }
    }

    function finalizarJuego() {
        guardarProgreso();
        Swal.fire({
            title: "¡Eres un campeón!",
            text: "¡Has completado todos los niveles!",
            icon: "success",
            showCancelButton: true,
            cancelButtonText: 'Volver al Menú',
            confirmButtonText: 'Volver a jugar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                nivel = 1;
                puntaje = 0;
                await guardarProgreso();
                iniciarJuego();
            } else {
                window.location.href = 'menu.php';
            }
        });
    }
    // ─── AUDIOS ─────────────────────────────────────────────
window.musicaFondo = new Audio('./audio/Fondo.mp3');
window.musicaFondo.loop = true;
window.musicaFondo.play();

window.audioMuyBien = new Audio('./audio/correcto.mp3');
window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');

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


    function reiniciarJuego() {
        nivel = 1;
        puntaje = 0;
        intentosFallidos = 0;
        juegosPorNivel = 0;
        iniciarJuego();
    }
    

    document.getElementById("btn-reiniciar").addEventListener("click", reiniciarJuego);

    await obtenerProgreso();
});
