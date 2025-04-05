<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego MCM y MCD</title>
    <link rel="stylesheet" href="css/mcm_mcd.css">
    <script src="https://cdn.tailwindcss.com"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
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
    </style>
</head>
<body>
  <!-- Header fijo -->
  <?php include 'headerAlta.php'; ?>
  <div class="header-spacer"></div>

  <div class="background-overlay"></div>
  <div class="content-wrapper">
      <!-- Contenedor de la guía -->
      <div id="instructionsText" class="guide-container">
          <h3>Guía</h3>
          <p>El MCM (Mínimo Común Múltiplo) es el número más pequeño que es múltiplo común de dos o más números.</p>
          <p>El MCD (Máximo Común Divisor) es el número más grande que divide exactamente a dos o más números.</p>
          <ul>
              <li><strong>MCM:</strong> Busca los múltiplos de cada número y encuentra el más pequeño que ambos compartan.</li>
              <li><strong>MCD:</strong> Encuentra los divisores de cada número y busca el mayor común.</li>
          </ul>
          <p>Haz clic en las opciones para responder. ¡Buena suerte!</p>
          <button id="read-guide" class="bg-blue-500 mb-4 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mt-4 block mx-auto text-2xl">
            🔊 Escuchar Guía
          </button>
          <button id="help-btn" class="help-btn">Ayudas</button>
      </div>

      <!-- Ventana modal -->
      <div id="help-modal" class="modal">
          <div class="modal-content">
              <span id="close-modal" class="close">&times;</span>
              <h3>Ayuda para este ejercicio</h3>
              <p id="help-text"></p>
          </div>
      </div>

      <!-- Contenedor principal del juego -->
      <div class="game-area">
          <div class="level-indicator">
              <h2 id="level">Nivel 1</h2>
          </div>
          <div id="question-container" class="question-container">
              <p id="question">Encuentra el MCM de 4 y 6:</p>
              <button id="read-num" class="sound-btn">🔊</button>
          </div>
          <div id="options-container" class="options-container"></div>
          <button id="next-level" class="sound-btn" style="margin-top: 20px; display: none;" onclick="nextLevel()">Siguiente Nivel</button>
      </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="js/mcm_mcd_game.js"></script>
</body>
</html>
