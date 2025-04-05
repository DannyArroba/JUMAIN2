<?php
session_start();
include 'conexion.php';

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['success' => false, 'error' => 'No autenticado']);
    exit;
}

$cedula = $_SESSION['usuario'];
$juego_id = isset($_POST['juego_id']) ? intval($_POST['juego_id']) : (isset($_GET['juego_id']) ? intval($_GET['juego_id']) : 0);

if ($juego_id === 0) {
    echo json_encode(['success' => false, 'error' => 'ID de juego no válido']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // OBTENER PROGRESO DEL ESTUDIANTE
    $query = $conexion->prepare("SELECT nivel, puntaje, fallos, fecha FROM progreso WHERE estudiante_cedula = ? AND juego_id = ?");
    $query->execute([$cedula, $juego_id]);
    $result = $query->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode([
            'success' => true,
            'nivel' => $result['nivel'],
            'puntaje' => $result['puntaje'],
            'fallos' => $result['fallos'],
            'fecha' => $result['fecha']
        ]);
    } else {
        echo json_encode(['success' => true, 'nivel' => 1, 'puntaje' => 0, 'fallos' => 0, 'fecha' => null]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // GUARDAR PROGRESO DEL ESTUDIANTE
    $nivel = isset($_POST['nivel']) ? intval($_POST['nivel']) : 1;
    $puntaje = isset($_POST['puntaje']) ? intval($_POST['puntaje']) : 0;
    $fallos = isset($_POST['fallos']) ? intval($_POST['fallos']) : 0;
    $fecha_actual = date("Y-m-d H:i:s");

    $query = $conexion->prepare("SELECT * FROM progreso WHERE estudiante_cedula = ? AND juego_id = ?");
    $query->execute([$cedula, $juego_id]);

    if ($query->rowCount() > 0) {
        $update = $conexion->prepare("UPDATE progreso SET nivel = ?, puntaje = ?, fallos = ?, fecha = ? WHERE estudiante_cedula = ? AND juego_id = ?");
        $update->execute([$nivel, $puntaje, $fallos, $fecha_actual, $cedula, $juego_id]);
    } else {
        $insert = $conexion->prepare("INSERT INTO progreso (estudiante_cedula, juego_id, nivel, puntaje, fallos, fecha) VALUES (?, ?, ?, ?, ?, ?)");
        $insert->execute([$cedula, $juego_id, $nivel, $puntaje, $fallos, $fecha_actual]);
    }

    echo json_encode(['success' => true]);
}
?>
