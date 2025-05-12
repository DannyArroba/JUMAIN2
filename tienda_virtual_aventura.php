<?php
require_once 'seguridad.php';   // Primero cargamos lógica de sesión
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tienda por Niveles</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Fuente estilo "Cartón" -->
    <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet">
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- Font Awesome for Music Icon -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="./css/tienda_virtual_aventura.css">
    <style>
        /* Asegurar desplazamiento vertical */
        body {
            overflow-y: scroll; /* Siempre mostrar la barra de desplazamiento vertical */
            margin: 0;
            padding: 0;
            font-family: 'Luckiest Guy', cursive;
        }
        .background {
            background: url('./img10/background.jpg') no-repeat center center fixed;
            background-size: cover;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
    </style>
</head>
<body>
    <?php include 'header.php'; ?>
    <div class="background"></div> <!-- Imagen difuminada -->

    <div class="container mx-auto p-6 flex items-center justify-center min-h-screen"> <!-- Centrar contenido principal -->

        <!-- Contenedor de la guía -->
        <div id="instructionsText" class="guide-container bg-blue-100 p-6 rounded-lg shadow-lg mr-6 w-1/3">
            <h2 class="text-2xl font-bold mb-4 text-blue-800 text-center">Guía del Juego</h2>
            <p class="text-lg mb-2 text-center">1. Observa el precio del producto en la tienda.</p>
            <p class="text-lg mb-2 text-center">2. Haz clic en las monedas correctas hasta llegar al precio exacto.</p>
            <p class="text-lg mb-2 text-center">3. Si aciertas 3 veces consecutivas, pasarás al siguiente nivel.</p>
            <div class="flex flex-col items-center gap-4 mt-6">
                <button id="read-guide" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                    🔊 Leer Guía
                </button>
                
            </div>
        </div>

        <!-- Contenedor del juego -->
        <div class="tv-container w-2/3 text-center border-2 border-blue-800">
            <div class="title text-4xl font-bold mb-6 text-blue-800">Tienda de Aventuras</div>

            <div id="buyItemArea">
                <h3 class="text-3xl mb-4 font-semibold" id="levelTitle">Nivel 1</h3>
                <img id="productImage" class="product-image mx-auto mb-4" src="">
                <p id="productName" class="text-2xl font-normal mb-2">Huevo</p>
                <p id="productPrice" class="text-lg mb-4">Precio: <span class="text-highlight font-bold">$3</span></p>
                <p class="text-2xl text-blue-500 mb-4 animate-bounce">¡Haz clic en las monedas para pagar!</p>

                <div class="coin-container flex justify-center space-x-6 mb-4">
                    <div>
                        <img id="coin1" class="coin-image mx-auto" src="./img10/moneda 1 centav.png" alt="1 Cent">
                        <p id="count1" class="text-lg text-center">0</p>
                    </div>
                    <div>
                        <img id="coin5" class="coin-image mx-auto" src="./img10/moneda 5 centav.png" alt="5 Cents">
                        <p id="count5" class="text-lg text-center">0</p>
                    </div>
                    <div>
                        <img id="coin10" class="coin-image mx-auto" src="./img10/moneda 10 centav.png" alt="10 Cents">
                        <p id="count10" class="text-lg text-center">0</p>
                    </div>
                </div>

                <button id="processPayment" class="button mt-4 mx-auto block">Pagar</button>
                <style>
                    .coin-image {
                        border: none; /* Eliminar bordes de las monedas */
                    }
                </style>
            </div>
        </div>
    </div>

    <audio id="successSound" src="./audio/Sonido_de_dinero.mp3"></audio>
    <audio id="guideAudio" src="./audio/guia_turno.mp3"></audio>

    <script src="./js/tienda_virtual_aventura.js"></script>
</body>
</html>
