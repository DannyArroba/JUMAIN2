<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EL mapa del tesoro</title>
    <script defer src="./js/el_mapa_del_tesoro.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <link rel="stylesheet" href="./css/mapa_de_tesoro.css">
</head>
<body>
     <!-- Incluir el encabezado -->
     <?php include 'header.php'; ?>

    <div class="main-container">
        <div class="game-container">
            <h1>EL mapa del tesoro</h1>
            <div class="level-info">Nivel: <span id="level">1</span></div>
            <div class="message" id="message"></div>
            <div class="game-board" id="gameBoard"></div>
            <div class="controls">
                <div class="controls-row">
                    <button onclick="move('up')">↑</button>
                </div>
                <div class="controls-row">
                    <button onclick="move('left')">←</button>
                    <button onclick="move('down')">↓</button>
                    <button onclick="move('right')">→</button>
                </div>
                <button class="next-level" onclick="nextLevel()" id="nextLevelBtn" style="display: none;">
                    Siguiente Nivel
                </button>
            </div>
        </div>

        <div class="guide-container">
            <h2>Guía del Juego</h2>
            <div class="keyboard-controls">
                <h3>Controles:</h3>
                <div class="key-guide">
                    <span class="key">↑</span>
                    <span>Mover arriba</span>
                </div>
                <div class="key-guide">
                    <span class="key">↓</span>
                    <span>Mover abajo</span>
                </div>
                <div class="key-guide">
                    <span class="key">←</span>
                    <span>Mover izquierda</span>
                </div>
                <div class="key-guide">
                    <span class="key">→</span>
                    <span>Mover derecha</span>
                </div>
            </div>
            <ul id="instructionsText">
                <li>🎯 Objetivo: Lleva el carrito desde el inicio hasta la meta verde</li>
                <li>🚦 Evita chocar con las paredes rojas</li>
                <li>🏁 Completa los 3 niveles para ganar</li>
                <li>⌨️ Puedes usar el teclado o los botones en pantalla</li>
            </ul>
             <!-- Botones debajo de la guía -->
             <div class="flex flex-col items-center gap-4 mt-6">
                <button id="read-guide" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                    🔊 Leer Guía
                </button>
                
            </div>
        </div>
    </div>
</body>
</html>
