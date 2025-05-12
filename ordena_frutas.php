<?php
require_once 'seguridad.php';   // Primero cargamos lógica de sesión
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>La Tienda de Frutas</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="./css/ordena_frutas.css">

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body class="bg-blue-100">
    <?php include 'header.php'; ?>
    <!-- Botón de regreso al menú -->
    <div class="p-1">
    <!-- Contenido principal -->
    <div class="mt-16 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        <!-- Contenedor principal -->
        <div class="flex-2 bg-blue-200 p-6 rounded-lg shadow-md border-2 border-dashed border-blue-700">
            <h1 class="text-4xl font-extrabold text-center mb-6 text-black lg:text-5xl">🍎 Ordena las Frutas 🍌</h1>

            <!-- Estadísticas -->
            <div class="flex justify-around bg-blue-300 p-4 rounded-lg mb-6">
                <div class="text-center">
                    <p class="font-bold text-xl text-black lg:text-2xl">Puntos:</p>
                    <span id="score" class="text-2xl text-black lg:text-3xl">0</span>
                </div>
                <div class="text-center">
                    <p class="font-bold text-xl text-black lg:text-2xl">Aciertos:</p>
                    <span id="correct" class="text-2xl text-black lg:text-3xl">0</span>
                </div>
                <div class="text-center">
                    <p class="font-bold text-xl text-black lg:text-2xl">Errores:</p>
                    <span id="errors" class="text-2xl text-red-500 lg:text-3xl">0</span>
                </div>
            </div>
            <div id="currentLevel" class="text-center text-black text-2xl lg:text-3xl font-semibold mb-4">
                Nivel 1
            </div>
            

            <!-- Tarea actual -->
            <div id="currentTask" class="bg-blue-300 text-center p-6 rounded-lg mb-6 font-medium text-black text-xl lg:text-2xl">
                ¡Coloca las frutas correctamente!
            </div>

            <!-- Estante de frutas -->
            <div id="fruitShelf" class="bg-blue-200 p-6 rounded-lg mb-6 flex flex-col gap-4 border-2 border-dashed border-blue-700">
                <div id="largeFruitsRow" class="flex flex-wrap gap-4 justify-center"></div>
                <div id="mediumFruitsRow" class="flex flex-wrap gap-4 justify-center"></div>
                <div id="smallFruitsRow" class="flex flex-wrap gap-4 justify-center"></div>
            </div>

            <!-- Área de cestas -->
            <div id="basketArea" class="flex flex-wrap gap-6 justify-center mb-6"></div>

            <!-- Botones -->
            <div class="flex justify-center gap-4">
            <button onclick="restartGame()" class="bg-blue-500 text-white text-lg px-6 py-3 rounded-lg hover:bg-blue-600 lg:text-xl">Nuevo Juego</button>
            <button id="validateButton" class="bg-green-500 text-white text-lg px-6 py-3 rounded-lg hover:bg-green-600 hidden lg:text-xl">Verificar Nivel 3</button>
            </div>
        </div>

        <!-- Contenedor de guía -->
        <div class="flex-1 bg-blue-200 p-6 rounded-lg shadow-md border-2 border-dashed border-blue-700">
            <h2 class="text-3xl font-bold text-center mb-6 text-black lg:text-4xl">📜 Guía del Juego</h2>
            <p id="instructionsText" class="text-black text-lg leading-relaxed lg:text-xl">
                Bienvenido/a a "La Tienda de Frutas". Clasifica las frutas en las cestas correctas siguiendo las reglas: <br><br>
                <strong>Nivel 1:</strong> Clasifica todas las frutas según su color. <br>
                <strong>Nivel 2:</strong> Clasifica todas las frutas según su tamaño. <br>
                <strong>Nivel 3:</strong> Todas las frutas están disponibles, pero solo debes colocar las frutas necesarias en las cestas: <br>
                - Una fruta pequeña en la cesta verde. <br>
                - Una fruta mediana en la cesta roja. <br>
                - Una fruta grande en la cesta amarilla. <br>
                ¡Buena suerte!
            </p>
            <!-- Botones debajo de la guía -->
            <div class="flex flex-col items-center gap-4 mt-6">
                <button id="read-guide" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                    🔊 Leer Guía
                </button>
                
            </div>
        </div>
    </div>
    </div>





    
</body>
<script src="./js/ordena_frutas.js" defer>
       
    </script>
</html>
