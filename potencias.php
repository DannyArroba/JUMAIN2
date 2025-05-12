<?php
require_once 'seguridad.php';   // Primero cargamos lógica de sesión
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>El Juego de Potencias</title>
    <link rel="stylesheet" href="css/potencias.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Raleway:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
<?php include 'headerAlta.php'; ?>

    
    <div class="game-container">
        <div id="instructionsText"  class="instructions ">
            <h2>Guía de Juego</h2>
            <p>En este juego debes seleccionar el resultado correcto para cada potencia.</p>
            <p>Selecciona el número que corresponda al resultado.</p>
            <p>Necesitas acertar 2 ejercicios para pasar al siguiente nivel.</p>
            <p>¡Gana puntos por cada respuesta correcta!</p>
            <button id="read-guide" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mt-4 block mx-auto text-2xl">
            🔊 Escuchar Guía
          </button>
            <button onclick="resetGame()">Reiniciar Juego</button>
        </div>
        <!-- Contenedor del juego -->
        <div class="game-area">
            <h1>Potencias</h1>
            <div class="level-info">
                <p>Nivel: <span id="current-level">1</span></p>
                <p>Aciertos: <span id="current-score">0</span>/2</p>
                
            </div>
            <div id="problem-display"></div>
            <div class="options-container" id="options-container"></div>
            <p>Puntaje Total: <span id="total-score">0</span></p>
        </div>
    </div>

    <!-- Modal -->
    <div id="modal" class="modal">
        <div class="modal-content">
            <h2 id="modal-title"></h2>
            <p id="modal-message"></p>
            <button onclick="closeModal()">Continuar</button>
        </div>
    </div>
    <script src="js/potencias.js"></script>
</body>
</html>