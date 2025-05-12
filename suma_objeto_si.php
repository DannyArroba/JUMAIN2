<?php
require_once 'seguridad.php';   // Primero cargamos lógica de sesión
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Juego de Suma de Objetos</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./css/suma_objeto_si.css">
  <style>
    /* Fijar el header en la parte superior */
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
    /* Contenedor principal que agrupa la guía y el juego en fila */
    .main-content {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 10px;
      justify-content: center;
      width: 100%;
      margin-top: 5rem; /* mt-20 */
    }
    .guide-container {
      width: 340px !important;
      padding: 0.5rem;
    }
    /* Ajuste del contenedor del juego: achátalo un poquito (reducción vertical del 10%) */
    .tv-frame {
      display: block !important;
      transform: scaleY(0.9) !important;
    }
  </style>
</head>
<body>
  <!-- Se incluye el header (sin modificar su contenido) -->
  <?php include 'headerMedia.php'; ?>

  <!-- Espaciador para que el contenido no quede tapado por el header -->
  <div class="header-spacer"></div>

  <!-- Contenedor principal que agrupa la guía y el juego -->
  <div class="main-content">
   <!-- Guía (ahora más grande y con letra mayor) -->
   <div id="instructionsText" class="guide-container mt-20 bg-blue-100 rounded-lg shadow-lg">
      <h2 class="text-center text-4xl font-bold text-blue-800">Guía</h2>
      <p class="text-center text-2xl">1. Observa los objetos.</p>
      <p class="text-center text-2xl">2. Selecciona los objetos sumando cada uno.</p>
      <p class="text-center text-2xl">3. Tres aciertos, subes de nivel.</p>
      <div class="flex flex-col items-center gap-2 mt-2">
        <button id="read-guide" class="bg-blue-500 text-white px-2 py-1 rounded-lg shadow-md hover:bg-blue-600 transition text-2xl">
          🔊 Guía
        </button>
      </div>
    </div>
    
    <!-- Contenedor del Juego -->
    <div class="tv-frame mt-30">
      <div class="tv-screen">
        <div class="container">
          <h1 class="text-4xl text-blue-700">Juego de Suma</h1>
          <p class="text-xl text-gray-700">Selecciona la respuesta correcta para resolver la suma.</p>
          <div id="game">
            <h2 class="level-title" id="levelTitle">Nivel 1</h2>
            <div class="game-area" id="gameArea"></div>
            <div class="answers" id="answers"></div>
            <div class="message" id="message"></div>
            <div class="temporary-message" id="temporaryMessage"></div>
          </div>
        </div>
      </div>
      <div id="score" class="text-black">Puntos: 0</div>
    </div>
  </div>

  <audio id="levelUpSound" src="./audio/niv.mp3"></audio>
  <div class="background"></div>
  <script src="./js/suma_objeto_si.js"></script>
</body>
</html>
