<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exploradores de colores y formas</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.2/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/exploradores_colores.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&family=Poppins:wght@300;400;500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script defer src="js/exploradores_de_colores.js"></script>
</head>
<body class="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
    <!-- Incluir el encabezado -->
    <?php include 'header.php'; ?>

    <div class="grid grid-cols-4 gap-4 p-4">
        <!-- Contenedor de reglas y dinámica -->
        <div class="col-span-1 bg-blue-200 rounded-lg shadow-md p-4">
            <h3 class="text-xl font-semibold text-blue-900 mt-4">Guía del juego:</h3>
            <ul id="instructionsText" class="list-disc pl-5 text-gray-800">
                <li>En este juego, debes observar el patrón mostrado y replicarlo seleccionando los objetos correctos de la tabla.</li>
                <li>Haz clic en los objetos del tablero para seleccionarlos.</li>
                <li>Debes replicar el patrón exactamente en el orden mostrado.</li>
                <li>Por cada patrón correcto, ganarás 20 puntos.</li>
                <li>Si fallas, perderás 10 puntos y deberás intentarlo de nuevo.</li>
            </ul>

            <!-- Botones debajo de la guía -->
            <div class="flex flex-col items-center gap-4 mt-6">
                <button id="read-guide" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                    🔊 Leer Guía
                </button>
                
            </div>
        </div>

        <!-- Contenedor principal del juego -->
        <div class="col-span-3 bg-blue-200 rounded-lg shadow-md p-4">
            <h1 class="text-4xl font-bold text-center text-blue-900 mb-8">Exploradores de colores y formas</h1>
            
            <div class="text-center mb-6">
                <p class="text-xl font-semibold">Patrón a replicar:</p>
                <div id="patron" class="flex justify-center gap-4 mt-4">
                    <!-- El patrón se generará aquí -->
                </div>
            </div>
            
            <div class="grid grid-cols-3 gap-8" id="tablero">
                <!-- Los objetos se generarán aquí -->
            </div>
            
            <div class="mt-8 text-center">
                <p class="text-xl font-semibold">Nivel: <span id="nivel">1</span></p>
                <p class="text-xl font-semibold">Puntaje: <span id="puntaje">0</span></p>
            </div>
        </div>
    </div>
</body>
</html>
