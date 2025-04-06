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


$nota_final = 1;
$completo = false;
$total_fallos = 0;
$juegos_faltantes = [];
$juegos_media = [
    10 => 'Sumas Básicas',
    11 => 'Restas Básicas',
    12 => 'Multiplicaciones Básicas',
    13 => 'Divisiones Básicas',
    14 => 'Mayor y Menor Que',
    15 => 'Identificación de Figuras',
    16 => 'Sumas y Restas con Fracciones'
];

try {
    $stmt = $conexion->prepare("
        SELECT juego_id, nivel, fallos
        FROM progreso
        WHERE estudiante_cedula = :cedula AND juego_id BETWEEN 10 AND 16
    ");
    $stmt->bindParam(':cedula', $cedula, PDO::PARAM_STR);
    $stmt->execute();
    $registros = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $progresos = [];
    $juegos_jugados_ids = [];

    foreach ($registros as $registro) {
        $id = (int)$registro['juego_id'];
        $nivel = (int)$registro['nivel'];
        $fallos = (int)$registro['fallos'];

        if (!isset($progresos[$id])) {
            $progresos[$id] = [
                'nivel_maximo' => $nivel,
                'total_fallos' => $fallos
            ];
        } else {
            $progresos[$id]['nivel_maximo'] = max($progresos[$id]['nivel_maximo'], $nivel);
            $progresos[$id]['total_fallos'] += $fallos;
        }

        $juegos_jugados_ids[] = $id;
    }

    $juegos_jugados_ids = array_unique($juegos_jugados_ids);
    $puntos_acumulados = 0;
    $total_fallos = 0;

    foreach ($juegos_media as $id => $nombre) {
        if (isset($progresos[$id])) {
            $nivel = $progresos[$id]['nivel_maximo'];
            $fallos = $progresos[$id]['total_fallos'];
            $puntos_acumulados += min($nivel, 3);
            $total_fallos += $fallos;

            if ($nivel < 3) {
                $juegos_faltantes[$id] = "$nombre (nivel $nivel)";
            }
        } else {
            $juegos_faltantes[$id] = "$nombre (sin jugar)";
        }
    }

    if ($puntos_acumulados === 0) {
        $mensaje = "🔔 Aún no has jugado ningún juego del menú media. ¡Empieza ahora para ganar puntos!";
    } else {
        if ($puntos_acumulados === 21) {
            $completo = true;
            $nota_base = 10;
        } else {
            $nota_base = ($puntos_acumulados / 21) * 9 + 1;
        }

        $penalizacion = $total_fallos * 0.02;
        $nota_final = round(max(1, $nota_base - $penalizacion), 2);

        $mensaje = $completo
            ? "🎉 ¡Felicidades! Completaste todos los juegos. Tu nota es $nota_final / 10."
            : "📘 Tu nota actual del menú media es: $nota_final / 10.";
    }
} catch (PDOException $e) {
    $mensaje = "⚠️ Error al calcular tu nota.";
}


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
    <title>Menú Juegos - Clase Media</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>


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

    
    <!-- Encabezado: tope y lados -->
    <header class="bg-white text-gray-800 p-4 flex justify-between items-center shadow-lg rounded-b-3xl w-full">
        <h1 class="text-2xl font-extrabold text-blue-700 drop-shadow-lg">
        ✨ Menú Juegos - Clase Media ✨
        </h1>
        <div class="text-right">
            <span class="font-bold">✈ Bienvenido, <?= $nombre . ' ' . $apellido; ?> ✈</span>
            <span class="text-red-500 text-lg font-bold">
                <?php if (!empty($discapacidades)) {
                    echo ' (' . implode(', ', $discapacidades) . ')';
                } ?>
            </span>
            <form action="./php/logout.php" method="post" class="inline-block ml-4">
                <button type="submit" class="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow-md">
                    Cerrar Sesión
                </button>
            </form>
        </div>
    </header>

    <!-- Modo adaptativo activado -->
    <?php if (!empty($discapacidades)): ?>
        <div class="container mx-auto mt-4 bg-yellow-100 border-l-8 border-yellow-600 p-4 mb-6 text-yellow-800 font-bold rounded shadow-lg">
            <p>🔔 Modo adaptativo activado:</p>
            <?php foreach ($discapacidades as $discapacidad): ?>
                <p>- Ajustes aplicados para discapacidad <?= $discapacidad ?>.</p>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>


     <!-- AlpineJS Tabs para Nota y Progreso -->
   <div x-data="{ tab: 'nota', showFaltantes: false }" class="container mx-auto mt-6 bg-white rounded-xl shadow-lg border border-gray-300 p-6">
        <div class="flex space-x-4 border-b pb-2 mb-4">
            <button @click="tab = 'nota'" :class="tab === 'nota' ? 'border-b-4 border-blue-500 font-bold' : 'text-gray-600'" class="text-lg focus:outline-none">📘 Nota Actual</button>
            <button @click="tab = 'progreso'" :class="tab === 'progreso' ? 'border-b-4 border-blue-500 font-bold' : 'text-gray-600'" class="text-lg focus:outline-none">📈 Progreso por Juego</button>
        </div>

        <!-- TAB: Nota Actual -->
        <div x-show="tab === 'nota'" x-transition>
            <p class="text-3xl font-extrabold text-blue-700 mb-2">⭐ Tu nota actual: <?= $nota_final ?>/10</p>
            <p class="text-gray-800 mb-4"><?= $mensaje ?></p>
            <?php if (!$completo && !empty($juegos_faltantes)): ?>
                <button @click="showFaltantes = !showFaltantes" class="bg-yellow-300 text-yellow-900 px-4 py-2 rounded-lg shadow hover:bg-yellow-400 font-semibold transition">🎮 Mostrar juegos que debes completar</button>
                <div x-show="showFaltantes" x-transition class="mt-4">
                    <ul class="list-disc list-inside text-gray-700">
                        <?php foreach ($juegos_faltantes as $nombre): ?>
                            <li><?= $nombre ?></li>
                        <?php endforeach; ?>
                    </ul>
                    <p class="mt-2 text-sm text-blue-700">🚀 ¡Sigue jugando para alcanzar el 10!</p>
                </div>
            <?php endif; ?>
        </div>

       <!-- TAB: Progreso por Juego -->
<div x-show="tab === 'progreso'" x-transition>
    <?php if (!empty($progresos)): ?>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <?php foreach ($progresos as $juego_id => $progreso): ?>
                <div class="bg-gray-100 p-4 rounded-lg shadow text-gray-900">
                    <h3 class="text-lg font-bold mb-2 text-blue-800">
                    <?= $juegos_media[$juego_id] ?>
                    </h3>
                    <p class="text-base">
                        Nivel alcanzado:
                        <span class="text-blue-700 font-extrabold text-xl"><?= $progreso['nivel_maximo'] ?></span>
                    </p>
                    <p class="text-base">
                        Fallos:
                        <span class="text-red-600 font-extrabold text-xl"><?= $progreso['total_fallos'] ?></span>
                    </p>
                </div>
            <?php endforeach; ?>
        </div>
    <?php else: ?>
        <p class="text-gray-600">Aún no has jugado ningún juego. ¡Empieza ahora para ver tu progreso!</p>
    <?php endif; ?>
</div>
    </div>

    <!-- Contenedor de juegos -->
    <div class="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php 
        $juegos = [
            ['Sumas Básicas', './img/suma.png', 'suma_objeto_si.php'],
            ['Restas Básicas', './img/resta.png', 'resta_objeto_si.php'],
            ['Multiplicaciones Básicas', './img/multiplicacion.png', 'multiplicacion.php'],
            ['Divisiones Básicas', './img/Division.png', 'division_objeto_si.php'],
            ['Mayor y Menor Que', './img/mayorqymenorq.png', 'mayor_menor.php'],
            ['Identificación de Figuras', './img/formas.png', 'Identificación_de_Figuras.php'],
            ['Sumas y Restas con Fracciones', './img/fracciones.png', 'suma_resta_fracciones.php'],
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
