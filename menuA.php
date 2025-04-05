<?php
session_start();
require_once './php/conexion.php';

// Verificar si el usuario ha iniciado sesión y si es un estudiante
if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'estudiante') {
    header('Location: ./portada.php');
    exit;
}

// Obtener la cédula del estudiante
$cedula = $_SESSION['usuario'];
$nombre = 'N/A';
$apellido = 'N/A';
$discapacidades = [];

// Consultar nombre y apellido
try {
    $stmt = $conexion->prepare("SELECT nombre, apellido FROM estudiantes WHERE cedula = :cedula");
    $stmt->bindParam(':cedula', $cedula, PDO::PARAM_STR);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $nombre = htmlspecialchars($row['nombre']);
        $apellido = htmlspecialchars($row['apellido']);
    }

    // Consultar discapacidades
    $stmt_disc = $conexion->prepare("
        SELECT d.tipo 
        FROM estudiantes_discapacidades ed 
        JOIN discapacidades d ON ed.discapacidad_id = d.id
        WHERE ed.estudiante_cedula = :cedula
    ");
    $stmt_disc->bindParam(':cedula', $cedula, PDO::PARAM_STR);
    $stmt_disc->execute();

    while ($row = $stmt_disc->fetch(PDO::FETCH_ASSOC)) {
        $discapacidades[] = $row['tipo'];
    }

} catch (PDOException $e) {
    die("Error al obtener datos: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menú Juegos Avanzados</title>
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Cargar estilos de adaptación según discapacidad -->
    <?php if (in_array('Visual', $discapacidades)): ?>
        <link rel="stylesheet" href="./css/adaptacion_visual.css">
    <?php endif; ?>
    
    <?php if (in_array('Auditiva', $discapacidades)): ?>
        <link rel="stylesheet" href="./css/adaptacion_auditiva.css">
    <?php endif; ?>
    
    <?php if (in_array('Motriz', $discapacidades)): ?>
        <link rel="stylesheet" href="./css/adaptacion_motriz.css">
    <?php endif; ?>
    
    <?php if (in_array('Cognitiva', $discapacidades)): ?>
        <link rel="stylesheet" href="./css/adaptacion_cognitiva.css">
    <?php endif; ?>
</head>

<body class="gradient-bg min-h-screen flex flex-col
    <?= in_array('Visual', $discapacidades) ? 'modo-visual' : '' ?>
    <?= in_array('Auditiva', $discapacidades) ? 'modo-auditivo' : '' ?>
    <?= in_array('Motriz', $discapacidades) ? 'modo-motriz' : '' ?>
    <?= in_array('Cognitiva', $discapacidades) ? 'modo-cognitivo' : '' ?>
">

    <!-- Encabezado -->
    <header class="bg-white text-gray-800 p-6 flex justify-between items-center shadow-lg rounded-b-3xl">
        <h1 class="text-3xl font-extrabold text-blue-700 drop-shadow-lg">✨ Menú Juegos Avanzados ✨</h1>
        <div class="text-right">
            <span class="font-bold">✈ Bienvenido, <?= $nombre . ' ' . $apellido; ?> ✈</span>
            <span class="text-red-500 text-lg font-bold">
                <?php if (!empty($discapacidades)) {
                    echo ' (' . implode(', ', $discapacidades) . ')';
                } ?>
            </span>
            <form action="./php/logout.php" method="post" class="inline-block ml-4">
                <button type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow-md">Cerrar Sesión</button>
            </form>
        </div>
    </header>

    <!-- Modo adaptativo activado -->
    <?php if (!empty($discapacidades)): ?>
        <div class="container mx-auto bg-yellow-100 border-l-8 mt-4 border-yellow-600 p-4 mb-6 text-yellow-800 font-bold rounded shadow-lg">
            <p>🔔 Modo adaptativo activado:</p>
            <?php foreach ($discapacidades as $discapacidad): ?>
                <p>- Ajustes aplicados para discapacidad <?= $discapacidad ?>.</p>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <!-- Contenedor de juegos -->
    <div class="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php 
        $juegos = [
            ['Potencias Básicas', './img/Potencias Básicas.webp', 'potencias.php'],
            ['MCD y MCM Visual', './img/MCD y MCM Visual.webp', 'mcm_mcd.php'],
            ['Coloreando Fracciones', './img/Coloreando Fracciones.webp', 'coloreando_fracciones.php'],
        ];
        foreach ($juegos as $juego): ?>
            <div onclick="window.location.href='<?= $juego[2] ?>'" 
                 class="juego bg-white shadow-lg rounded-xl overflow-hidden flex flex-col items-center p-6 cursor-pointer hover:scale-105"
                 role="button"
                 tabindex="0"
                 aria-label="Jugar <?= $juego[0] ?>">
                <img src="<?= $juego[1] ?>" alt="Imagen de <?= $juego[0] ?>" class="w-48 h-48 object-cover mb-4 rounded-full" loading="lazy">
                <h2 class="text-2xl font-bold"><?= $juego[0] ?></h2>
            </div>
        <?php endforeach; ?>
    </div>

    <!-- Cargar scripts de adaptación -->
    <?php if (in_array('Visual', $discapacidades)): ?>
        <script src="./js/adaptacion_visual.js"></script>
    <?php endif; ?>
    
    <?php if (in_array('Auditiva', $discapacidades)): ?>
        <script src="./js/adaptacion_auditiva.js"></script>
    <?php endif; ?>
    
    <?php if (in_array('Motriz', $discapacidades)): ?>
        <script src="./js/adaptacion_motriz.js"></script>
    <?php endif; ?>
    
    <?php if (in_array('Cognitiva', $discapacidades)): ?>
        <script src="./js/adaptacion_cognitiva.js"></script>
    <?php endif; ?>
</body>
</html>
