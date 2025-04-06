<?php
session_start();
include 'conexion.php';

if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'profesor') {
    echo "Acceso denegado.";
    exit;
}

$profesorCedula = $_SESSION['usuario'];

// 1. Datos del profesor
$stmtProfesor = $conexion->prepare("SELECT nombre, apellido FROM profesores WHERE cedula = ?");
$stmtProfesor->execute([$profesorCedula]);
$profesor = $stmtProfesor->fetch(PDO::FETCH_ASSOC);

// 2. Cursos e instituciones del profesor
$stmtCursos = $conexion->prepare("
    SELECT c.id AS curso_id, c.nombre AS curso_nombre, i.nombre AS institucion
    FROM profesores_cursos pc
    JOIN cursos c ON pc.curso_id = c.id
    JOIN instituciones i ON c.institucion_id = i.id
    WHERE pc.profesor_cedula = ?
");
$stmtCursos->execute([$profesorCedula]);
$cursosData = $stmtCursos->fetchAll(PDO::FETCH_ASSOC);
$cursosProfesor = array_column($cursosData, 'curso_id');
$instituciones = array_unique(array_column($cursosData, 'institucion'));

// 3. Obtener progreso por estudiante
$query = $conexion->prepare("
    SELECT e.cedula, e.nombre, e.apellido, c.id AS curso_id, c.nombre AS curso, j.id AS juego_id, j.nombre AS juego,
           MAX(p.nivel) AS nivel_maximo, AVG(p.puntaje) AS puntaje_promedio, AVG(p.fallos) AS fallos_promedio, 
           SUM(p.fallos) AS total_fallos
    FROM progreso p
    JOIN estudiantes e ON p.estudiante_cedula = e.cedula
    JOIN cursos c ON e.curso_id = c.id
    JOIN juegos j ON p.juego_id = j.id
    WHERE e.curso_id IN (" . implode(',', array_fill(0, count($cursosProfesor), '?')) . ")
    GROUP BY e.cedula, j.id
    ORDER BY e.apellido ASC
");
$query->execute($cursosProfesor);
$progreso = $query->fetchAll(PDO::FETCH_ASSOC);

// 4. Procesar datos para estudiantes y gráficas
$estudiantes = [];
$juegos = [];
$puntajesPromedio = [];
$fallosPromedio = [];

foreach ($progreso as $fila) {
    $cedula = $fila['cedula'];
    $juegoId = (int)$fila['juego_id'];
    $cursoId = $fila['curso_id'];
    $nivel = (int)$fila['nivel_maximo'];
    $fallos = (int)$fila['total_fallos'];

    // Para las gráficas
    if (!in_array($fila['juego'], $juegos)) {
        $juegos[] = $fila['juego'];
        $puntajesPromedio[] = round($fila['puntaje_promedio'], 2);
        $fallosPromedio[] = round($fila['fallos_promedio'], 2);
    }

    // Por estudiante
    if (!isset($estudiantes[$cedula])) {
        $estudiantes[$cedula] = [
            'nombre' => $fila['nombre'],
            'apellido' => $fila['apellido'],
            'curso_id' => $cursoId,
            'curso' => $fila['curso'],
            'fallos' => 0,
            'progreso' => 0
        ];
    }

    // Solo juegos según su curso
    if (
        ($cursoId == 1 && $juegoId >= 1 && $juegoId <= 9) ||
        ($cursoId == 2 && $juegoId >= 10 && $juegoId <= 16) ||
        ($cursoId == 3 && $juegoId >= 17 && $juegoId <= 19)
    ) {
        $estudiantes[$cedula]['progreso'] += $nivel;
        $estudiantes[$cedula]['fallos'] += $fallos;
    }
}

// Función para nota
function calcularNota($puntos, $maximo, $fallos) {
    $nota_base = ($puntos / $maximo) * 9 + 1;
    $penalizacion = $fallos * 0.02;
    return round(max(1, $nota_base - $penalizacion), 2);
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte General de Estudiantes</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Librerías para exportar -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script src="../js/reporte_excel.js"></script>
<script src="../js/reporte_pdf.js"></script>

</head>
<body class="bg-gray-100 p-6">

    <!-- Encabezado -->
    <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-green-700">📊 Reporte General de Estudiantes</h1>
        <p class="text-lg mt-2 text-gray-700">
            Profesor: <strong><?= $profesor['nombre'] . ' ' . $profesor['apellido'] ?></strong><br>
            Institución<?= count($instituciones) > 1 ? 'es' : '' ?>: <strong><?= implode(', ', $instituciones) ?></strong>
        </p>
    </div>
    <div class="mt-4 flex justify-center gap-4">
    <button onclick="exportarExcelPlano()" class="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600">📥 Exportar a Excel</button>
    <button onclick="exportarPDFPlano()" class="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600">📄 Exportar a PDF</button>
</div>


    <!-- Gráficas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 container mx-auto">
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-3 text-blue-500">📈 Puntajes Promedio por Juego</h2>
            <canvas id="puntajesChart"></canvas>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-3 text-red-500">❌ Fallos Promedio por Juego</h2>
            <canvas id="fallosChart"></canvas>
        </div>
    </div>

    <!-- Tarjetas por estudiante -->
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php foreach ($estudiantes as $e): ?>
            <?php
                $colores = [1 => 'green', 2 => 'blue', 3 => 'purple'];
                $maximos = [1 => 27, 2 => 21, 3 => 9];
                $bgColor = $colores[$e['curso_id']];
                $nota = calcularNota($e['progreso'], $maximos[$e['curso_id']], $e['fallos']);
            ?>
            <div class="bg-<?= $bgColor ?>-100 border-l-4 border-<?= $bgColor ?>-500 p-4 rounded shadow">
                <h3 class="text-lg font-bold text-<?= $bgColor ?>-800"><?= htmlspecialchars($e['nombre'] . ' ' . $e['apellido']) ?></h3>
                <p><strong>Curso:</strong> <?= htmlspecialchars($e['curso']) ?></p>
                <p><strong>Fallos:</strong> <?= $e['fallos'] ?></p>
                <p><strong>Nota Final:</strong> <?= $nota ?> / 10</p>
                <?php if ($nota < 6): ?>
                    <p class="text-red-500 text-sm mt-1">⚠ Desempeño bajo</p>
                <?php else: ?>
                    <p class="text-green-600 text-sm mt-1">✅ Buen desempeño</p>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>

    <div class="text-center mt-6">
        <a href="../registro_estudiantes.php" class="bg-green-500 text-white px-4 py-2 rounded shadow-md">Volver al Menú</a>
    </div>

    <!-- Script de gráficas -->
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
