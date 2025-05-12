<?php
require_once 'seguridad.php';   // Primero cargamos lógica de sesión
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>El Clima Mágico</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="./css/el_clima_magico.css">
    <script src="https://cdn.tailwindcss.com"></script>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Raleway:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>

       
<?php include 'header.php'; ?>
    
    <!-- Contenedor principal del juego con dos columnas -->
    <div class="game-container">
        <!-- Panel de guía -->
        <div id="instructionsText" class="guia-container">
            <h2>Guía del Juego</h2>
            <p>Selecciona y arrastra la imagen del clima correcto hacia su cuadro correspondiente.</p>
            <p>Debes acertar al menos dos veces para avanzar al siguiente nivel.</p>
            <p>¡Gana puntos por cada acierto!</p>
            <div class="flex flex-col items-center gap-4 mt-6">
                <button id="read-guide" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                    🔊 Leer Guía
                </button>
                
            </div>
        </div>

        <!-- Área de juego -->
        <div class="area-juego">
            <h1>El Clima Mágico</h1>
            <h2 id="nivel-texto">Nivel 1</h2>

            <!-- Imágenes de clima -->
            <div id="imagenes" class="contenedor-imagenes"></div>

            <!-- Cuadros para colocar las imágenes -->
            <div id="cuadros" class="contenedor-cuadros"></div>

            <!-- Mensaje de resultado -->
            <div id="mensaje"></div>

            <!-- Puntaje -->
            <div id="puntaje-container">
                <p>Puntaje: <span id="puntaje">0</span></p>
            </div>

            <!-- Botón para reiniciar el juego -->
            <div class="boton-reiniciar">
                <button id="btn-reiniciar">Reiniciar Juego</button>
            </div>
        </div>
    </div>

    <!-- Sonidos de respuesta -->
    <audio id="audioCorrecto" src="./audio/correcto.mp3"></audio>
    <audio id="audioIncorrecto" src="./audio/incorrecto.mp3"></audio>

    <script src="./js/el_clima_magico.js"></script>
</body>
</html>
