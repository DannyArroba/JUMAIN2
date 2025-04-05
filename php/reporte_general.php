<?php
session_start();
include 'conexion.php';

// Verificar si el usuario es un profesor
if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'profesor') {
    echo "Acceso denegado.";
    exit;
}

// Obtener el progreso de todos los estudiantes
$query = $conexion->prepare("
    SELECT estudiantes.nombre, estudiantes.apellido, juegos.nombre AS juego, 
           AVG(progreso.nivel) AS nivel_promedio, AVG(progreso.puntaje) AS puntaje_promedio, 
           AVG(progreso.fallos) AS fallos_promedio
    FROM progreso
    JOIN estudiantes ON progreso.estudiante_cedula = estudiantes.cedula
    JOIN juegos ON progreso.juego_id = juegos.id
    GROUP BY estudiantes.cedula, juegos.id
    ORDER BY estudiantes.apellido ASC
");
$query->execute();
$progreso = $query->fetchAll(PDO::FETCH_ASSOC);

// Datos para gráficos
$juegos = [];
$puntajesPromedio = [];
$fallosPromedio = [];

foreach ($progreso as $fila) {
    if (!in_array($fila['juego'], $juegos)) {
        $juegos[] = $fila['juego'];
        $puntajesPromedio[] = $fila['puntaje_promedio'];
        $fallosPromedio[] = $fila['fallos_promedio'];
    }
}

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📊 Reporte General de Estudiantes</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-6">
    <h1 class="text-3xl font-bold text-center mb-6 text-green-600">📊 Reporte General de Estudiantes</h1>

    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Gráfico de Promedio de Puntajes -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-3 text-blue-500">📈 Puntajes Promedio por Juego</h2>
            <canvas id="puntajesChart"></canvas>
        </div>

        <!-- Gráfico de Promedio de Fallos -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-3 text-red-500">❌ Fallos Promedio por Juego</h2>
            <canvas id="fallosChart"></canvas>
        </div>
    </div>

    <h2 class="text-2xl font-bold text-center mt-8 text-gray-800">📜 Rendimiento por Estudiante</h2>
    <div class="container mx-auto mt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php foreach ($progreso as $fila): ?>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h3 class="text-lg font-bold text-green-700"><?= htmlspecialchars($fila['nombre'] . ' ' . $fila['apellido']) ?></h3>
                    <p><strong>Juego:</strong> <?= htmlspecialchars($fila['juego']) ?></p>
                    <p><strong>Nivel Promedio:</strong> <?= number_format($fila['nivel_promedio'], 1) ?></p>
                    <p><strong>Puntaje Promedio:</strong> <?= number_format($fila['puntaje_promedio'], 1) ?></p>
                    <p><strong>Fallos Promedio:</strong> <?= number_format($fila['fallos_promedio'], 1) ?></p>

                    <!-- Sugerencias -->
                    <?php if ($fila['fallos_promedio'] > 5): ?>
                        <p class="text-red-500 text-sm mt-2">⚠ Necesita más práctica en este juego.</p>
                    <?php elseif ($fila['puntaje_promedio'] > 80): ?>
                        <p class="text-green-500 text-sm mt-2">🎉 ¡Gran desempeño!</p>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="text-center mt-6">
        <a href="../registro_estudiantes.php" class="bg-green-500 text-white px-4 py-2 rounded shadow-md">Volver al Menú</a>
    </div>

    <script>
        const ctx1 = document.getElementById('puntajesChart').getContext('2d');
        const ctx2 = document.getElementById('fallosChart').getContext('2d');

        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: <?= json_encode($juegos) ?>,
                datasets: [{
                    label: 'Puntaje Promedio',
                    data: <?= json_encode($puntajesPromedio) ?>,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)'
                }]
            }
        });

        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: <?= json_encode($juegos) ?>,
                datasets: [{
                    label: 'Fallos Promedio',
                    data: <?= json_encode($fallosPromedio) ?>,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)'
                }]
            }
        });
    </script>
</body>
</html>
