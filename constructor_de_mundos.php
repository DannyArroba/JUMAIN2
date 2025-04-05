<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Constructor de Mundos</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="css/constructor_de_mundos.css">
    <script defer src="js/constructor_de_mundos.js"></script>
</head>
<body>
<?php include 'header.php'; ?>
    <div class="background"></div> <!-- Imagen difuminada -->

    <!--<div class="background-container">-->
        <div class="container mx-auto p-6 flex items-center justify-center"> <!-- Centrar contenido principal -->

            <div id="instructionsText" class="guide-container bg-blue-100 p-6 rounded-lg shadow-lg mr-2 w-1/3">
                <h2 class="text-2xl font-bold mb-4 text-blue-800 text-center">Guía del Juego</h2>
                <p class="text-lg mb-2 text-center">1. Identifica las figuras que forman el patrón.</p>
                <p class="text-lg mb-2 text-center">2. Haz clic en las piezas correctas y arrástralas a tu construcción.</p>
                <p class="text-lg mb-2 text-center">3. Ajusta el ángulo con clics hasta que coincida con el patrón.</p>
                <!-- Botones debajo de la guía -->
             <div class="flex flex-col items-center gap-4 mt-6">
                <button id="read-guide" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                    🔊 Leer Guía
                </button>
                
            </div>
            </div>
            
            
            
            <!-- Contenedor principal (el juego) -->
            <div class="main-container max-w-3xl mx-auto flex flex-col justify-between p-4 relative">
                <h2 class="titulo1 text-center mx-auto w-full text-blue-800">Manos a las Piezas</h2>
            
                <p class="info flex justify-center w-full">
                    <span class="nivel-texto">Nivel:</span> <span id="nivel" class="nivel-numero">1</span>  
<span class="puntaje-texto absolute top-0 right-0 p-2">
    <span class="text-red-500">Puntaje:</span> <span id="puntaje" class="text-black">0</span>
</span>

                </p>
    <div class="flex flex-col md:flex-row gap-4 p-4 justify-center">
        <!-- Contenedor Figura a replicar -->
        <div id="modelo-container" class="section max-w-[500px] bg-blue-300 p-4 rounded-lg border-4 border-blue-500">
            <h2 class="texto-negro text-center text-xl">Figura a replicar</h2>
            <div id="modelo" class="modelo"></div>
        </div>

        <!-- Contenedor Tu construcción -->
        <div id="construccion-container" class="section max-w-[500px]  p-4 rounded-lg">
            <h2 class="texto-negro text-center text-xl">Tu construcción</h2>
            <div id="construccion" class="construccion"></div>
            <div class="botones mt-4 flex justify-center gap-4">
                <button id="verificar" class="btn-verificar">Verificar Figura</button>
                <button id="limpiar" class="btn-limpiar">Limpiar Construcción</button>
            </div>
        </div>
    </div>

    <!-- Contenedor Piezas (debajo de los dos anteriores) -->
    <div id="piezas-container" class="section bg-blue-300 mt-4 border-4 border-blue-500">
        <h2 class="texto-negro text-center text-xl">Piezas</h2>
        <div id="piezas" class="piezas-grid"></div>
    </div>
</div>

        </div>
    </div>

</body>
</html>