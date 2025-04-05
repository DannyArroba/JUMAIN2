<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>El Tren Matemático</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');
    body {
      font-family: 'Poppins', sans-serif;
      background-color:rgb(172, 200, 238); /* Azul oscuro */

    }
  </style>
</head>

<body>
<?php include 'header.php'; ?>

  <!-- Contenedor principal -->
  <div class="w-full max-w-7xl flex flex-col lg:flex-row gap-8 mx-auto mt-10">

    <!-- Juego -->
    <div class="flex-1 bg-blue-200 p-8 rounded-lg shadow-md border-4 border-dashed border-blue-700 h-[600px] flex flex-col justify-between">
      <div>
        <h1 class="text-4xl font-extrabold text-center text-black mb-4">El Tren Matemático</h1>
        <h2 id="nivel" class="text-3xl font-bold text-center text-black mb-2">Nivel 1</h2>
        <p id="descripcion-nivel" class="text-2xl text-center text-black">El tren va cambiando, mira cuántos vagones tiene.</p>
      </div>

      <!-- Tren -->
      <div class="flex items-center justify-center overflow-hidden">
        <div class="text-5xl">🚂</div>
        <div id="vagones" class="flex items-center ml-4">
          <!-- Vagones generados dinámicamente -->
        </div>
      </div>

      <!-- Opciones -->
      <div class="text-center">
        <p class="text-xl font-bold text-black mb-6">¿Cuántos vagones tiene el tren?</p>
        <div id="opciones" class="flex flex-wrap justify-center gap-6">
          <!-- Botones de opciones generados dinámicamente -->
        </div>
      </div>
    </div>

    <!-- Guía del juego -->
    <div id="instructionsText" class="flex-1 bg-blue-200 p-8 rounded-lg shadow-md border-4 border-dashed border-blue-700 h-[600px]">
      <h2 class="text-3xl font-bold text-center text-black mb-6">📜 Guía del Juego</h2>
      <p class="text-lg text-black leading-relaxed">
        Bienvenido/a a "El Tren Matemático". Este juego está diseñado especialmente para niños. Completa las preguntas sobre cuántos vagones tiene el tren y diviértete mientras aprendes. <br /><br />
        <strong>Nivel 1:</strong> Responde una pregunta correctamente. <br />
        <strong>Nivel 2:</strong> Responde dos preguntas consecutivas correctamente. <br />
        <strong>Nivel 3:</strong> Responde tres preguntas consecutivas correctamente para ganar. <br /><br />
        ¡Buena suerte y disfruta el viaje! 🚂
      </p>
      <div class="flex flex-col items-center gap-4 mt-6">
                <button id="read-guide" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                    🔊 Leer Guía
                </button>
                
            </div>
    </div>
  </div>

  <script src="./js/tren_contador.js" defer>
    
  </script>

</body>
</html>
