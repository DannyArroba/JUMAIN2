<?php
require_once 'seguridad.php';   // Primero cargamos lógica de sesión
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Juego de Multiplicación</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./css/multiplicacion.css">
  <style>
    /* Header fijo */
    #custom-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
    }
    .header-spacer {
      height: 120px;
    }
    .main-content {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 30px;
      justify-content: center;
      width: 100%;
      margin-top: 5rem;
    }
    .guide-panel {
      width: 340px !important;
      padding: 1rem;
    }
    .guide-panel h2 {
  font-size: 1.5rem; /* baja 2 niveles (de text‑4xl → text‑2xl) */
}
.guide-panel p {
  font-size: 1rem; /* baja 2 niveles (de text‑xl → text‑base) */
}
    .tv-frame {
      display: block !important;
      transform: scaleY(0.9) !important;
    }
    #score {
      font-size: 1.75rem;
      color: #028849;
      position: absolute;
      top: 20px;
      right: 20px;
    }
  </style>
</head>
<body class="bg-[#D1F7C4]">

  <?php include 'headerMedia.php'; ?>
  <div class="header-spacer"></div>

  <div class="main-content">
    <div id="instructionsText" class="guide-panel mt-20 bg-blue-100 rounded-lg shadow-lg">
      <h2  class="text-center font-bold text-green-700">Guía del Juego</h2>
      <p class="text-xl">El objetivo del juego es resolver correctamente multiplicaciones.</p>
      <p>Selecciona la opción correcta entre las posibles respuestas.</p>
      <p>Cada nivel es más desafiante. ¡Buena suerte!</p>
      <div class="flex flex-col items-center gap-2 mt-2">
        <button id="read-guide" class="bg-blue-500 text-white px-2 py-1 rounded-lg shadow-md hover:bg-blue-600 transition text-2xl">
          🔊 Guía
        </button>
      </div>
    </div>

    <div class="tv-frame mt-10">
      <div class="tv-screen">
        <div class="container text-center">
          <h1 class="text-4xl text-green-700">Juego de Multiplicación</h1>
          <p class="text-xl text-gray-700 mb-4">Selecciona la respuesta correcta para resolver la multiplicación.</p>
          <div id="game">
            <h2 class="level-title text-3xl mb-4" id="levelTitle">Nivel 1</h2>
            <div class="game-area mb-6" id="gameArea"></div>
            <div class="answers flex justify-center gap-4 flex-wrap" id="answers"></div>
            <div class="message text-2xl mt-4" id="message"></div>
            <div class="temporary-message text-2xl mt-2" id="temporaryMessage"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="score">Puntos: 0</div>

  <audio id="levelUpSound" src="./audio/niv.mp3"></audio>
  <div class="background"></div>
  <script src="./js/multiplicacion.js" defer></script>
</body>
</html>
