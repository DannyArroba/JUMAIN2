<?php
session_start();
include 'conexion.php';

// Verificar autenticación
if (!isset($_SESSION['usuario'])) {
    echo "No estás autenticado.";
    exit;
}

$cedula = $_SESSION['usuario'];

// Obtener progreso del estudiante
$query = $conexion->prepare("
    SELECT juegos.nombre AS juego, progreso.nivel, progreso.puntaje, progreso.fallos, progreso.fecha 
    FROM progreso
    JOIN juegos ON progreso.juego_id = juegos.id
    WHERE progreso.estudiante_cedula = ?
    ORDER BY progreso.fecha DESC
");
$query->execute([$cedula]);
$progreso = $query->fetchAll(PDO::FETCH_ASSOC);

// Datos para gráficos
$juegos = [];
$puntajes = [];
$fallos = [];
$fechas = [];

foreach ($progreso as $fila) {
    $juegos[] = $fila['juego'];
    $puntajes[] = $fila['puntaje'];
    $fallos[] = $fila['fallos'];
    $fechas[] = date("d/m/Y H:i", strtotime($fila['fecha'])); // Formateo de fecha
}

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📊 Reporte de Progreso</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-6">
    <h1 class="text-3xl font-bold text-center mb-6 text-blue-600">📊 Mi Progreso en los Juegos</h1>

    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Gráfico de Puntajes -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-3 text-blue-500">📈 Puntajes por Juego</h2>
            <canvas id="puntajesChart"></canvas>
        </div>

        <!-- Gráfico de Fallos -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-3 text-red-500">❌ Fallos por Juego</h2>
            <canvas id="fallosChart"></canvas>
        </div>
    </div>

    <h2 class="text-2xl font-bold text-center mt-8 text-gray-800">📜 Detalle de Juegos</h2>
    <div class="container mx-auto mt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php foreach ($progreso as $fila): ?>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h3 class="text-lg font-bold text-blue-700"><?= htmlspecialchars($fila['juego']) ?></h3>
                    <p><strong>Nivel:</strong> <?= htmlspecialchars($fila['nivel']) ?></p>
                    <p><strong>Puntaje:</strong> <?= htmlspecialchars($fila['puntaje']) ?></p>
                    <p><strong>Fallos:</strong> <?= htmlspecialchars($fila['fallos']) ?></p>
                    <p class="text-sm text-gray-500"><strong>Última Partida:</strong> <?= date("d/m/Y H:i", strtotime($fila['fecha'])) ?></p>

                    <!-- Sugerencias -->
                    <?php if ($fila['fallos'] > 5): ?>
                        <p class="text-red-500 text-sm mt-2">⚠ ¡Practica más este juego!</p>
                    <?php elseif ($fila['puntaje'] > 80): ?>
                        <p class="text-green-500 text-sm mt-2">🎉 ¡Gran trabajo!</p>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="text-center mt-6">
        <a href="menu.php" class="bg-blue-500 text-white px-4 py-2 rounded shadow-md">Volver al Menú</a>
    </div>

    <script>
        const ctx1 = document.getElementById('puntajesChart').getContext('2d');
        const ctx2 = document.getElementById('fallosChart').getContext('2d');

        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: <?= json_encode($juegos) ?>,
                datasets: [{
                    label: 'Puntaje',
                    data: <?= json_encode($puntajes) ?>,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)'
                }]
            }
        });

        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: <?= json_encode($juegos) ?>,
                datasets: [{
                    label: 'Fallos',
                    data: <?= json_encode($fallos) ?>,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)'
                }]
            }
        });
    </script>
</body>
</html>
