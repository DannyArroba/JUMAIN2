<?php
require_once 'seguridad.php';   // Primero cargamos lógica de sesión
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Juego de Mayor y Menor</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./css/mayor_menor.css">
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
    .guide-container {
      width: 400px !important;
      padding: 3rem;
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
<body>

  <?php include 'headerMedia.php'; ?>
  <div class="header-spacer"></div>

  <div class="main-content">
    <!-- Guía -->
    <div id="instructionsText" class="guide-container bg-blue-100 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-blue-800 text-center">Guía del Juego</h2>
      <p class="text-xl text-center">1. Observa los dos grupos de objetos dentro de los círculos.</p>
      <p class="text-xl text-center">2. Verifica si la comparación (mayor, menor o igual) es correcta.</p>
      <p class="text-xl text-center">3. Responde correctamente para avanzar de nivel.</p>
      <button id="read-guide" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mt-4 block mx-auto text-2xl">
        🔊 Escuchar Guía
      </button>
    </div>

    <!-- Juego -->
    <div class="tv-frame">
      <div class="tv-screen">
        <h1 class="text-4xl text-blue-700 text-center mb-4">Juego de Mayor y Menor</h1>
        <p class="text-xl text-gray-700 text-center mb-6">Decide si la comparación es correcta.</p>
        <div id="game" class="text-center">
          <h2 class="level-title text-3xl mb-4" id="levelTitle">Nivel 1</h2>
          <div class="game-area mb-6" id="gameArea"></div>
          <div class="answers flex justify-center gap-4 flex-wrap" id="answers"></div>
          <div class="message text-2xl font-bold text-blue-700 mt-4" id="message"></div>
        </div>
      </div>
      <div id="score"></div>
    </div>
  </div>

  <audio id="levelUpSound" src="./audio/niv.mp3"></audio>
  <div class="background"></div>
  <script src="./js/mayor_menor.js"></script>
</body>
</html>
