<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aventura en el Reino de los Números</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script defer src="js/aventura_reino_numeros.js"></script>
    <link rel="stylesheet" href="css/aventura.css">
</head>
<body>
<?php include 'header.php'; ?>
    <div class="container mx-auto p-6">
        <h1 class="text-4xl font-bold text-center mb-6" style="font-family: 'Comic Sans MS', sans-serif; color: #FFFFFF; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);">
            Aventura en el Reino de los Números
        </h1>
        <p class="text-2xl font-bold text-center mb-6" style="font-family: 'Comic Sans MS', sans-serif; color: #FFFFFF; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);">
            Ayuda al personaje a recoger los objetos correctos y resolver los desafíos de suma y resta.
        </p>
        <div class="flex justify-between">
            <!-- Guía del juego -->
            <div id="guia" class="guia" style="width: 250px; height: 550px;">
                <h2 class="text-xl font-bold text-blue-700 mb-10">Guía del Juego</h2>
                <ol class="list-decimal list-inside text-gray-700 text-lg">
                    <li>Observa cuántos objetos hay dentro del círculo.</li>
                    <li>Selecciona los objetos restando cada uno.</li>
                    <li>Si aciertas 3 veces consecutivas, pasarás al siguiente nivel.</li>
                </ol>
                <button id="btnAyuda" class="bg-blue-600 text-white px-4 py-2 rounded-md mt-4">
                    📖 Leer Guía del Juego
                </button>
            </div>
           

            <!-- Escenario del juego -->
            <div id="escenario" class="relative bg-white border border-gray-300 rounded-lg shadow-lg p-4 grid grid-cols-5 grid-rows-5" style="width: 820px; height: 550px;">
                <div id="personaje" class="absolute w-16 h-16">
                    <img src="img/ficha.jpg" alt="Personaje" class="w-full h-full object-contain">
                </div>
                <div id="objetos" class="absolute top-0 left-0 w-full h-full"></div>
            </div>

            <!-- Panel de información -->
            <div id="panel-info" class="panel-info bg-gray-200 border border-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between" style="width: 350px; height: 550px;">
                <div>
                    <h2 class="text-xl font-bold text-gray-700 mb-4">Número a completar</h2>
                    <p id="objetivo" class="text-lg font-semibold text-gray-700 mb-4">Objetivo: 0</p>
                    <p class="text-lg font-semibold text-gray-700">Resultado:</p>
                    <div id="operacion" class="text-lg text-gray-700 p-4 bg-white border border-gray-300 rounded-lg overflow-y-auto mb-4" style="height: 100px;"></div>
                    
                    <!-- Controles de flechas -->
                    <div class="flex flex-col items-center mb-4">
                        <button id="btnArriba" class="bg-blue-500 text-white w-12 h-12 rounded-md hover:bg-blue-600 mb-2 text-2xl">↑</button>
                        <div class="flex justify-center space-x-4">
                            <button id="btnIzquierda" class="bg-blue-500 text-white w-12 h-12 rounded-md hover:bg-blue-600 text-2xl">←</button>
                            <button id="btnDerecha" class="bg-blue-500 text-white w-12 h-12 rounded-md hover:bg-blue-600 text-2xl">→</button>
                        </div>
                        <button id="btnAbajo" class="bg-blue-500 text-white w-12 h-12 rounded-md hover:bg-blue-600 mt-2 text-2xl">↓</button>
                    </div>
                </div>

                <!-- Información de nivel y puntaje -->
                <div>
                    <p class="text-lg font-semibold">Nivel: <span id="nivel">1</span></p>
                    <p class="text-lg font-semibold">Puntaje: <span id="puntaje">0</span></p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
