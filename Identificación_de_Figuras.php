<?php
require_once 'seguridad.php';   // Primero cargamos lógica de sesión
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Figuras Mágicas</title>
    <link rel="stylesheet" href="./css/identificacionfigu.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script defer src="./js/identificacionfigu.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet">
    <style>
      /* Header fijo */
      #custom-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 9999;
      }
      /* Espaciador para que el contenido no quede tapado por el header */
      .header-spacer {
        height: 120px;
      }
    </style>
</head>
<body>

  <!-- Header fijo -->
  <?php include 'headerMedia.php'; ?>
  <div class="header-spacer"></div>

  <div class="game-container mt-40">
      <!-- Panel de Guía -->
      <div id="instructionsText" class="guide-panel ">
          <h2>Guía del Juego</h2>
          <p>Encuentra la figura geométrica que se indica en las instrucciones.</p>
          <p>Haz clic en la figura correcta o selecciona con "Enter".</p>
          <p>Puedes obtener una pista para ayudarte.</p>
          <button id="read-guide" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mt-4 block mx-auto text-2xl">
            🔊 Escuchar Guía
          </button>
          <button id="hint-button" class="help-button">Mostrar pista</button>
      </div>

      <!-- Panel del Juego -->
      <div class="container">
          <h1>Identificación de Figuras</h1>
          <p class="info">
              Nivel: <span id="nivel">1</span> | Puntaje: <span id="puntaje">0</span>
          </p>
          <p class="instructions" id="instructions">Encuentra el triángulo</p>
          <p class="hint" id="hint"></p>
          <div class="figures" id="figures"></div>
      </div>
  </div>

  <audio id="levelUpSound" src="./audio/niv.mp3"></audio>
  <div class="background"></div>
</body>
</html>
