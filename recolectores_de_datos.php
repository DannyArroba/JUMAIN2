<?php
require_once 'seguridad.php';   // Primero cargamos lógica de sesión
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recolectores de Datos</title>
  <link rel="stylesheet" href="./css/recolectores_de_datos.css">
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  

</head>
<body>
<?php include 'header.php'; ?>
  <main id="main-container">
    <div id="guide-container">
      <h2>¡Bienvenido, Explorador de Datos!</h2>
      <p>¡Estás a punto de empezar una misión muy divertida! En este juego, vas a organizar y clasificar diferentes cosas, como frutas y números. ¡Tu objetivo es ser el mejor recolector de datos del mundo! ¿Estás listo para la aventura?</p>
      <p>Arrastra los objetos a las cajas correctas antes de que se acabe el tiempo. ¡Es rápido y emocionante! ¡A jugar!</p>
      <button id="read-guide-button">Escuchar Guía</button>
    </div>
    <div id="game-container">
      <h1>Recolectores de Datos</h1>
      <div id="level-display">Nivel: 1</div>
      <div id="timer-display">Tiempo: 120</div>
      <div id="hearts-display"></div>
      <div id="progress-bar-container">
        <div id="progress-bar"></div>
      </div>
      <div id="game-area">
        <!-- Los elementos de juego se generarán aquí -->
      </div>
      <div id="categories-container">
        <div class="category" id="frutas" data-category="frutas" ondrop="drop(event)" ondragover="allowDrop(event)">Frutas</div>
        <div class="category" id="numeros" data-category="numeros" ondrop="drop(event)" ondragover="allowDrop(event)">Números</div>
      </div>
      <button id="start-button">Reiniciar Juego</button>
    </div>
  </main>

  <script src="./js/recolectores_de_datos.js" ></script>
</body>
</html>
