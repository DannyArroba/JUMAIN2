<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coloreando Fracciones</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');
        body {
            font-family: 'Poppins', sans-serif;
        }
        /* Header fijo */
        #custom-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 9999;
        }
        .header-spacer {
          height: 50px;
        }
    </style>
</head>
<body class="bg-gradient-to-b from-blue-200 to-purple-200 min-h-screen p-6 flex flex-col items-center">

  <!-- Header fijo -->
  <?php include 'headerAlta.php'; ?>
  <div class="header-spacer"></div>

  <!-- Main Container -->
  <div class="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
    <!-- Game Container -->
    <div class="flex-1 mt-12 bg-blue-200 p-8 rounded-lg shadow-md border-4 border-dashed border-blue-700 h-auto flex flex-col justify-between">
      <div>
        <h1 class="text-4xl font-extrabold text-center text-black mb-4">Coloreando Fracciones</h1>
        <div id="currentLevelText" class="text-2xl font-bold text-center text-black mb-4">Estás en el Nivel 1</div>
        <h2 id="levelTitle" class="text-3xl font-bold text-center text-black mb-6">Nivel 1: Casa</h2>
        <p class="text-xl text-center text-black mb-6">Segmentos coloreados: <span id="coloredCount"></span></p>
      </div>
      <div id="drawingContainer" class="bg-white p-6 rounded-lg shadow-md w-full h-96 flex items-center justify-center"></div>
      <div class="mt-6 flex gap-4 justify-center">
        <button onclick="resetLevel()" class="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-green-600">Reiniciar Nivel</button>
        <button onclick="checkResult()" id="checkButton" class="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-green-600">Comprobar</button>
      </div>
    </div>

    <!-- Guide Container -->
    <div id="instructionsText"  class="flex-1 mt-12 bg-blue-200 p-8 rounded-lg shadow-md border-4 border-dashed border-blue-700 h-auto">
      <h2 class="text-3xl font-bold text-center text-black mb-6">📜 Guía del Juego</h2>
      <p class="text-lg text-black leading-relaxed">
        Bienvenido/a al juego de colorear. El objetivo es pintar un número correcto de figuras basándote en la fracción mostrada. Sigue estos pasos:
      </p>
      <ul class="list-disc pl-6 text-lg text-black mt-4 space-y-2">
        <li>Haz clic en las figuras para colorearlas.</li>
        <li>El número de figuras a pintar se muestra en el título del nivel.</li>
        <li>Una vez pintadas las figuras necesarias, presiona "Comprobar".</li>
        <li>Si aciertas, pasarás al siguiente nivel. ¡Buena suerte!</li>
      </ul>
      <button id="read-guide" class="bg-blue-500 mb-4 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mt-4 block mx-auto text-2xl">
            🔊 Escuchar Guía
          </button>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="js/coloreando_fracciones.js" defer></script>
</body>
</html>
