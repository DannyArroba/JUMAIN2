document.addEventListener("DOMContentLoaded", async () => {
    // Variables locales del juego
    let currentLevel = 1;
    let puntaje = 0;
    let fallos = 0;
    let aciertos = 0; // Compras correctas realizadas en el nivel actual
    const maxLevels = 3;  // El juego finaliza en el Nivel 3
    const juegoID = 7;
    let coinCounts = { 1: 0, 5: 0, 10: 0 };

    // Variable para almacenar el producto actual seleccionado
    let currentProduct = null;
    let requiredAmount = 0;

    // ─── AUDIOS ─────────────────────────────────────────────
    window.musicaFondo = new Audio('./audio/Fondo.mp3');
    window.musicaFondo.loop = true;
    window.musicaFondo.play();
    
    window.audioMuyBien = new Audio('./audio/correcto.mp3');
    window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');

    // Lista completa de productos base
    const productsByLevel = [
        { name: "Huevo", price: 3, image: "./img10/huev.png" },
        { name: "Manzana", price: 4, image: "./img10/manzana.png" },
        { name: "Pan", price: 5, image: "./img10/pan.png" },
        { name: "Queso", price: 6, image: "./img10/queso.png" },
        { name: "Leche", price: 7, image: "./img10/leche.png" },
        { name: "Carne", price: 8, image: "./img10/carne.png" },
        { name: "Pescado", price: 9, image: "./img10/pescad.png" },
        { name: "Pastel", price: 10, image: "./img10/pastel.png" },
        { name: "Jugo", price: 12, image: "./img10/jugo.png" },
        { name: "Frutas Variadas", price: 15, image: "./img10/frutasvariada.png" }
    ];

    // ─── OBTENER PROGRESO ─────────────────────────────────────────────
    async function obtenerProgreso() {
        try {
            const response = await fetch(`../php/progreso.php?juego_id=${juegoID}`);
            const data = await response.json();
            if (data.success) {
                currentLevel = Math.min(data.nivel, maxLevels);
                puntaje = data.puntaje;
                fallos = data.fallos || 0;
                aciertos = data.aciertos || 0;
            }
        } catch (error) {
            console.error("Error al obtener el progreso:", error);
        }
        actualizarUI();
    }

    // ─── GUARDAR PROGRESO ─────────────────────────────────────────────
    async function guardarProgreso() {
        try {
            await fetch(`../php/progreso.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `juego_id=${juegoID}&nivel=${currentLevel}&puntaje=${puntaje}&fallos=${fallos}&aciertos=${aciertos}`
            });
            console.log(`Progreso guardado: Nivel ${currentLevel}, Puntaje ${puntaje}, Fallos ${fallos}, Aciertos ${aciertos}`);
        } catch (error) {
            console.error("Error al guardar el progreso:", error);
        }
    }

    // ─── ESTABLECER PRODUCTO ACTUAL ─────────────────────────────────────────────
    function setCurrentProduct() {
        if (currentLevel === 1) {
            // Nivel 1 siempre muestra "Huevo"
            currentProduct = productsByLevel.find(p => p.name === "Huevo");
        } else {
            // Para niveles 2 y 3, seleccionar aleatoriamente de los productos excepto "Huevo"
            const available = productsByLevel.filter(p => p.name !== "Huevo");
            currentProduct = available[Math.floor(Math.random() * available.length)];
        }
        // Precio requerido es el precio base (sin multiplicar) – ya que la cantidad de compras correctas determinará el avance
        requiredAmount = currentProduct.price;
    }

    // ─── ACTUALIZAR LA UI ─────────────────────────────────────────────
    function actualizarUI() {
        setCurrentProduct();
        document.getElementById("levelTitle").innerText = `Nivel ${currentLevel} (Compra ${currentLevel} cosa${currentLevel > 1 ? 's' : ''})`;
        document.getElementById("productName").innerHTML = `<strong>${currentProduct.name}</strong>`;
        document.getElementById("productPrice").innerHTML = `Precio: <span class="bg-yellow-300 p-1 rounded">$${requiredAmount}</span> Centavos`;
        document.getElementById("productImage").src = currentProduct.image;
        document.getElementById("puntaje").innerText = `Puntaje: ${puntaje}`;
        document.getElementById("fallos").innerText = `Fallos: ${fallos}`;
        reiniciarMonedas();
    }

    function reiniciarMonedas() {
        coinCounts = { 1: 0, 5: 0, 10: 0 };
        updateCoinDisplay();
    }

    function updateCoinDisplay() {
        document.getElementById("count1").innerText = coinCounts[1];
        document.getElementById("count5").innerText = coinCounts[5];
        document.getElementById("count10").innerText = coinCounts[10];
    }

    function addCoin(coinValue) {
        coinCounts[coinValue]++;
        updateCoinDisplay();
    }

    // ─── PROCESAR PAGO ─────────────────────────────────────────────
    async function processPayment() {
        const totalGiven = coinCounts[1] * 1 + coinCounts[5] * 5 + coinCounts[10] * 10;
        // Si no se ingresan monedas, no se acepta el pago
        if (totalGiven === 0) {
            window.audioIncorrecto.play();
            Swal.fire({
                title: 'Error',
                text: 'No has ingresado ninguna moneda.',
                icon: 'error',
                confirmButtonText: 'Reintentar'
            }).then(() => {
                reiniciarMonedas();
            });
            return;
        }
    
        if (totalGiven === requiredAmount) {
            window.audioMuyBien.play();
            aciertos++;  // Compra correcta para el nivel actual
            puntaje += 10;
            await guardarProgreso();
            reiniciarMonedas();
    
            Swal.fire({
                title: '¡Bien hecho!',
                text: `Has comprado correctamente (${aciertos}/${currentLevel}) cosa(s).`,
                icon: 'success',
                confirmButtonText: 'Continuar'
            }).then(async () => {
                if (aciertos >= currentLevel) {
                    currentLevel++;
                    aciertos = 0;
                }
                await guardarProgreso();
                if (currentLevel > maxLevels) {
                    finalizarJuego();
                } else {
                    actualizarUI();
                }
            });
        } else {
            fallos++;
            await guardarProgreso();
            window.audioIncorrecto.play();
            Swal.fire({
                title: 'Error',
                text: 'La cantidad no es correcta. Las monedas se reinician y debes recomenzar el nivel.',
                icon: 'error',
                confirmButtonText: 'Reintentar'
            }).then(() => {
                reiniciarMonedas();
            });
        }
    }

    // ─── FINALIZAR JUEGO ─────────────────────────────────────────────
    async function finalizarJuego() {
        await guardarProgreso();
        Swal.fire({
            title: '¡Felicidades! 🎉',
            text: 'Has completado todos los niveles.',
            icon: 'success',
            showCancelButton: true,
            cancelButtonText: 'Volver al Menú',
            confirmButtonText: 'Volver a jugar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    title: "Reiniciando...",
                    text: "El juego se reiniciará.",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    currentLevel = 1;
                    puntaje = 0;
                    fallos = 0;
                    aciertos = 0;
                    guardarProgreso().then(() => {
                        if (window.location.hash !== "#reloaded") {
                            window.location.hash = "#reloaded";
                            window.location.reload();
                        } else {
                            window.location.reload();
                        }
                    });
                });
            } else {
                window.location.href = 'menu.php';
            }
        });
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

    // ─── ASIGNAR EVENTOS A LOS BOTONES ─────────────────────────────────────────────
    document.getElementById("coin1").addEventListener("click", () => addCoin(1));
    document.getElementById("coin5").addEventListener("click", () => addCoin(5));
    document.getElementById("coin10").addEventListener("click", () => addCoin(10));
    document.getElementById("processPayment").addEventListener("click", processPayment);

    // ─── OBTENER PROGRESO AL INICIAR ─────────────────────────────────────────────
    await obtenerProgreso();
});
