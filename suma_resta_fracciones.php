<?php
require_once 'seguridad.php';   // Primero cargamos lógica de sesión
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Juego de Sumas y Restas de Fracciones</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script defer src="js/suma_resta_fracciones.js"></script>
  <link rel="stylesheet" href="css/suma_resta_fracciones.css">
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
  </style>
</head>
<body>

  <!-- Header fijo -->
  <?php include 'headerMedia.php'; ?>
  <div class="header-spacer"></div>

  <div class="container flex flex-row justify-between items-start h-screen mt-14 p-4">
  <div class="container flex flex-row justify-between items-start h-screen mt-14 p-4">
        <!-- Cuadro de instrucciones -->
        <div id="instructionsText"  class="bg-blue-100 border border-blue-300 rounded-lg shadow-lg p-4 w-1/3 self-center mt-40">
            <h2 class="text-center text-blue-800 font-bold text-2xl mb-4">Guía del Juego</h2>
            <ul class="list-disc pl-6 text-blue-700 text-lg">
                <li><strong>¿Qué es una fracción?</strong> Es una parte de algo. Por ejemplo, si tienes una pizza y la partes en 4 pedazos, cada pedazo es 1/4 de la pizza.</li>
                <li><strong>¿Cómo sumar fracciones?</strong>
                    <ul class="pl-6">
                        <li>1. Si los números de abajo (denominadores) son iguales, suma los números de arriba (numeradores). Ejemplo: 1/4 + 2/4 = 3/4.</li>
                        <li>2. Si los números de abajo son diferentes, conviértelos en iguales multiplicando. Ejemplo: 1/2 + 1/3 → Cambia a 3/6 + 2/6 = 5/6.</li>
                    </ul>
                </li>
                <li><strong>¿Cómo restar fracciones?</strong>
                    <ul class="pl-6">
                        <li>1. Igual que la suma, si los números de abajo son iguales, resta los de arriba. Ejemplo: 3/4 - 1/4 = 2/4.</li>
                        <li>2. Si los números de abajo son diferentes, hazlos iguales primero. Ejemplo: 2/3 - 1/6 → Cambia a 4/6 - 1/6 = 3/6.</li>
                    </ul>
                </li>
                <li>¡Practica mucho y te volverás un experto en fracciones!</li>
            </ul>
            <button id="read-guide" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mt-4 block mx-auto text-2xl">
            🔊 Escuchar Guía
          </button>
        </div>

      <!-- Área del juego -->
      <div class="flex mt-10 flex-col justify-start items-center w-3/4">
          <h1 id="titulo" class="text-center mb-4 text-4xl">Juego de Sumas y Restas de Fracciones</h1>
          <div id="progreso" class="flex flex-wrap justify-center items-center mb-6 space-x-4"></div>
          <div class="flex flex-col justify-start items-center w-full">
              <div id="pregunta" class="text-center mb-4 text-2xl">¿Cuál es el resultado de la siguiente operación?</div>
              <div class="bg-white border-4 border-gray-700 rounded-lg shadow-lg flex justify-center items-center mb-6" style="width: 85%; height: 200px;">
                  <div id="operacion" class="text-4xl text-center"></div>
              </div>
              <div class="grid grid-cols-2 gap-4 w-4/5 h-1/5">
                  <button id="opcionA" class="respuesta-btn bg-custom-yellow text-gray-800 py-4 px-6 rounded-lg shadow hover:bg-yellow-400">A</button>
                  <button id="opcionB" class="respuesta-btn bg-custom-gray text-gray-800 py-4 px-6 rounded-lg shadow hover:bg-gray-400">B</button>
                  <button id="opcionC" class="respuesta-btn bg-custom-orange text-gray-800 py-4 px-6 rounded-lg shadow hover:bg-orange-400">C</button>
                  <button id="opcionD" class="respuesta-btn bg-custom-purple text-gray-800 py-4 px-6 rounded-lg shadow hover:bg-purple-400">D</button>
              </div>
          </div>
      </div>
  </div>

</body>
</html>
