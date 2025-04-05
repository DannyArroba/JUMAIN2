document.addEventListener("DOMContentLoaded", async () => {
    const instructions = document.getElementById("instructions");
    const figuresContainer = document.getElementById("figures");
    const nivelEl = document.getElementById("nivel");
    const puntajeEl = document.getElementById("puntaje");
    const hintEl = document.getElementById("hint");
    const hintButton = document.getElementById("hint-button");

    const juegoID = 15;
    const puntosPorAcierto = 10;
    const targetsPerLevel = {1:3, 2:6, 3:9};
    let nivel = 1, puntaje = 0, fallos = 0, foundCount = 0, targetName = "";

    const shapes = [
        { name:"triángulo", className:"triangle", hint:"Tiene 3 lados" },
        { name:"cuadrado", className:"square", hint:"Tiene 4 lados iguales" },
        { name:"círculo", className:"circle", hint:"No tiene lados" },
        { name:"hexágono", className:"hexagon", hint:"Tiene 6 lados" },
        { name:"estrella", className:"star", hint:"Tiene puntas afiladas" },
        { name:"pentágono", className:"pentagon", hint:"Tiene 5 lados" },
        { name:"trapecio", className:"trapezoid", hint:"4 lados, dos paralelos" },
        { name:"rectángulo", className:"rectangle", hint:"4 lados, pares iguales" },
        { name:"paralelogramo", className:"parallelogram", hint:"Lados opuestos paralelos" },
        { name:"elipse", className:"ellipse", hint:"Ovalada sin lados" }
    ];

    async function obtenerProgreso() {
        try {
            const resp = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
            const data = await resp.json();
            if(data.success) {
                nivel = Math.min(Math.max(data.nivel,1),3);
                puntaje = data.puntaje;
                fallos = data.fallos;
            }
        } catch(e){ console.error(e) }
        nivelEl.textContent = nivel;
        puntajeEl.textContent = puntaje;
    }

    async function guardarProgreso() {
        await fetch(`../php/progreso.php`, {
            method:'POST',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body:`juego_id=${juegoID}&nivel=${nivel}&puntaje=${puntaje}&fallos=${fallos}`
        });
    }

    function generarFiguras() {
        figuresContainer.innerHTML = "";
        hintEl.textContent = "";
        foundCount = 0;
        const count = targetsPerLevel[nivel];
        const pool = shapes.sort(() => Math.random() - .5).slice(0, count);
        targetName = pool[Math.floor(Math.random()*pool.length)].name;
        instructions.textContent = `Encuentra el ${targetName}`;
        hintButton.dataset.target = targetName;

        pool.forEach(shape => {
            const div = document.createElement("div");
            div.className = `figure ${shape.className}`;
            div.dataset.shape = shape.name;
            div.tabIndex = 0;
            figuresContainer.appendChild(div);
            div.onclick = () => verificarFigura(div);
            div.onkeydown = e => { if(e.key==="Enter") verificarFigura(div) };
        });
    }

    hintButton.addEventListener("click", () => {
        const shape = shapes.find(s => s.name === hintButton.dataset.target);
        hintEl.textContent = `Pista: ${shape.hint}`;
    });

    function verificarFigura(div) {
        if(div.dataset.shape === targetName) {
            puntaje += puntosPorAcierto;
            foundCount++;
            div.remove();
            window.audioMuyBien.play();
            guardarProgreso();
            Swal.fire('¡Correcto!','¡Sigue así!','success').then(() => {
                if(foundCount < targetsPerLevel[nivel]) {
                    const remaining = Array.from(figuresContainer.children).map(el => el.dataset.shape);
                    targetName = remaining[Math.floor(Math.random()*remaining.length)];
                    instructions.textContent = `Encuentra el ${targetName}`;
                    hintButton.dataset.target = targetName;
                    hintEl.textContent = "";
                } else {
                    avanzarNivel();
                }
            });
        } else {
            fallos++;
            window.audioIncorrecto.play();
            guardarProgreso();
            Swal.fire('¡Incorrecto!','Intenta de nuevo.','error');
        }
        nivelEl.textContent = nivel;
        puntajeEl.textContent = puntaje;
    }

    function avanzarNivel() {
        if(nivel < 3) {
            nivel++;
            guardarProgreso();
            Swal.fire('¡Nivel completado!',`¡Bienvenido al Nivel ${nivel}!`,'success').then(generarFiguras);
        } else {
            guardarProgreso();
            Swal.fire({
                title:'¡Felicidades! 🎉',
                text:`Juego completado.\nPuntos: ${puntaje}, Fallos: ${fallos}`,
                icon:'success',
                showCancelButton:true,
                confirmButtonText:'Reiniciar',
                cancelButtonText:'Menú'
            }).then(res => {
                if(res.isConfirmed) {
                    nivel=1; puntaje=0; fallos=0;
                    guardarProgreso();
                    generarFiguras();
                } else window.location.href='menuM.php';
            });
        }
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
    generarFiguras();
});
