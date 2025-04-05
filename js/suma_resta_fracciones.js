document.addEventListener("DOMContentLoaded", async () => {
    const operacionDiv = document.getElementById("operacion");
    const opciones = [
        document.getElementById("opcionA"),
        document.getElementById("opcionB"),
        document.getElementById("opcionC"),
        document.getElementById("opcionD"),
    ];
    const progresoDiv = document.getElementById("progreso");

    let nivelActual = 1;
    let puntaje = 0;
    let fallos = 0;
    let ejerciciosCompletados = 0;
    let estrellasGanadas = 0;
    let fraccionCorrecta;
    let progresoEstrellas = Array(10).fill(0);
    const juegoID = 16;

    // Obtener la cédula del usuario desde la sesión almacenada en PHP
    let usuarioCedula = ""; 

    // 📌 Obtener progreso del usuario al iniciar el juego
    async function obtenerProgreso() {
        try {
            const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
            const data = await response.json();

            if (data.success) {
                nivelActual = data.nivel;
                puntaje = data.puntaje;
                fallos = data.fallos;
                usuarioCedula = data.cedula; // Obtener el usuario actual

                // 📌 Cargar las estrellas solo del usuario actual
                const estrellasGuardadas = localStorage.getItem(`estrellas_${juegoID}_${usuarioCedula}`);
                if (estrellasGuardadas) {
                    progresoEstrellas = JSON.parse(estrellasGuardadas);
                }
            }
        } catch (error) {
            console.error("Error al obtener el progreso:", error);
        }

        actualizarProgreso();
    }

    // 📌 Guardar progreso en la base de datos y en localStorage por usuario
    async function guardarProgreso() {
        try {
            await fetch(`../php/progreso.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `juego_id=${juegoID}&nivel=${nivelActual}&puntaje=${puntaje}&fallos=${fallos}`
            });

            // 📌 Guardar estrellas solo para el usuario actual
            localStorage.setItem(`estrellas_${juegoID}_${usuarioCedula}`, JSON.stringify(progresoEstrellas));
        } catch (error) {
            console.error("Error al guardar el progreso:", error);
        }
    }

    function actualizarProgreso() {
        progresoDiv.innerHTML = "";

        for (let i = 1; i <= 10; i++) {
            const nivel = document.createElement("div");
            nivel.className = "text-center";
            nivel.style.width = "80px";

            const nivelTexto = document.createElement("div");
            nivelTexto.className = `text-lg font-bold ${i === nivelActual ? "text-indigo-900" : "text-gray-900"}`;
            nivelTexto.innerText = `Nivel ${i}`;

            const estrellas = document.createElement("div");
            estrellas.className = "flex justify-center space-x-1 mt-1";

            for (let j = 0; j < 3; j++) {
                const estrella = document.createElement("span");
                estrella.className = `text-xl ${j < progresoEstrellas[i - 1] ? "text-yellow-500" : "text-gray-300"}`;
                estrella.innerHTML = "★";
                estrellas.appendChild(estrella);
            }

            nivel.appendChild(nivelTexto);
            nivel.appendChild(estrellas);
            progresoDiv.appendChild(nivel);
        }
    }

    function renderFraccionHTML(numerador, denominador) {
        return `<div class="inline-block text-center mx-2">
                    <div class="text-2xl font-bold">${numerador}</div>
                    <div class="border-t-2 border-gray-800 w-full"></div>
                    <div class="text-2xl font-bold">${denominador}</div>
                </div>`;
    }

    function generarFraccion() {
        const numerador = Math.floor(Math.random() * 9) + 1;
        const denominador = Math.floor(Math.random() * 9) + 1;
        return { numerador, denominador };
    }

    function simplificar(numerador, denominador) {
        const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
        const divisor = gcd(Math.abs(numerador), denominador);
        return { numerador: numerador / divisor, denominador: denominador / divisor };
    }

    function generarOperacion() {
        actualizarProgreso();

        const frac1 = generarFraccion();
        const frac2 = generarFraccion();
        const operacion = Math.random() > 0.5 ? "suma" : "resta";

        const resultadoNumerador =
            operacion === "suma"
                ? frac1.numerador * frac2.denominador + frac2.numerador * frac1.denominador
                : frac1.numerador * frac2.denominador - frac2.numerador * frac1.denominador;
        const resultadoDenominador = frac1.denominador * frac2.denominador;
        fraccionCorrecta = simplificar(resultadoNumerador, resultadoDenominador);

        operacionDiv.innerHTML = `
            ${renderFraccionHTML(frac1.numerador, frac1.denominador)}
            <span class="text-3xl font-bold mx-4">${operacion === "suma" ? "+" : "-"}</span>
            ${renderFraccionHTML(frac2.numerador, frac2.denominador)}
            <span class="text-3xl font-bold mx-4">= ?</span>
        `;

        let respuestas = [
            {
                numerador: fraccionCorrecta.numerador,
                denominador: fraccionCorrecta.denominador
            }
        ];

        while (respuestas.length < 4) {
            const falsa = generarFraccion();
            const falsaSimplificada = simplificar(falsa.numerador, falsa.denominador);
            if (!respuestas.some(r => r.numerador === falsaSimplificada.numerador && r.denominador === falsaSimplificada.denominador)) {
                respuestas.push(falsaSimplificada);
            }
        }

        respuestas = respuestas.sort(() => Math.random() - 0.5);

        opciones.forEach((btn, index) => {
            btn.dataset.numerador = respuestas[index].numerador;
            btn.dataset.denominador = respuestas[index].denominador;
            btn.innerHTML = renderFraccionHTML(respuestas[index].numerador, respuestas[index].denominador);
            btn.onclick = () => manejarRespuesta(respuestas[index].numerador, respuestas[index].denominador);
        });

        guardarProgreso();
    }

    function manejarRespuesta(n,d) {
        if(n===fraccionCorrecta.numerador && d===fraccionCorrecta.denominador) {
            estrellasGanadas++; progresoEstrellas[nivelActual-1]++; puntaje+=10;
            window.audioMuyBien.play();
            Swal.fire("¡Muy bien!","Has ganado una estrella.","success");
        } else {
            fallos++;
            window.audioIncorrecto.play();
            Swal.fire("Sigue intentando",`Respuesta correcta: ${fraccionCorrecta.numerador}/${fraccionCorrecta.denominador}`,"error");
        }
        ejerciciosCompletados++;
        if(ejerciciosCompletados===3) {
            ejerciciosCompletados=0;
            if(estrellasGanadas>=2) {
                window.audioMuyBien.play();
                if(nivelActual===10) {
                    Swal.fire({
                        title:"¡Nivel 10 completado! 🎉",
                        text:`Has terminado el juego con ${puntaje} puntos y ${fallos} fallos.`,
                        icon:"success",
                        confirmButtonText:"Reiniciar",
                        cancelButtonText:"Menú",
                        showCancelButton:true
                    }).then(r=> r.isConfirmed?location.reload():window.location.href="menuM.php");
                } else {
                    nivelActual++; estrellasGanadas=0;
                    Swal.fire("¡Felicidades!","Has completado este nivel.","success").then(generarOperacion);
                }
            } else {
                Swal.fire("Nivel no superado","Inténtalo de nuevo.","warning").then(()=>generarOperacion());
            }
        } else generarOperacion();
        guardarProgreso();
    }

    
    window.musicaFondo=new Audio('./audio/Fondo.mp3'); musicaFondo.loop=true; musicaFondo.play();
    window.audioMuyBien=new Audio('./audio/correcto.mp3');
    window.audioIncorrecto=new Audio('./audio/incorrecto.mp3');

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

    await obtenerProgreso();
    generarOperacion();
});
