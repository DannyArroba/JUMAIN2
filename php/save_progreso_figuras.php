<?php
session_start();
include 'conexion.php';

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['success' => false, 'error' => 'No autenticado']);
    exit;
}

$cedula = $_SESSION['usuario'];
$juego_id = 15; // ID del juego "Identificación de Figuras"
$nivel = $_POST['nivel'];
$puntaje = $_POST['puntaje'];
$fallos = $_POST['fallos'];
$fecha_actual = date("Y-m-d H:i:s"); // Obtiene la fecha y hora actual

$query = $conexion->prepare("SELECT * FROM progreso WHERE estudiante_cedula = ? AND juego_id = ?");
$query->execute([$cedula, $juego_id]);

if ($query->rowCount() > 0) {
    // Si el estudiante ya tiene progreso, actualizamos los datos y la fecha
    $update = $conexion->prepare("UPDATE progreso SET nivel = ?, puntaje = ?, fallos = ?, fecha = ? WHERE estudiante_cedula = ? AND juego_id = ?");
    $update->execute([$nivel, $puntaje, $fallos, $fecha_actual, $cedula, $juego_id]);
} else {
    // Si no tiene progreso previo, insertamos uno nuevo con la fecha actual
    $insert = $conexion->prepare("INSERT INTO progreso (estudiante_cedula, juego_id, nivel, puntaje, fallos, fecha) VALUES (?, ?, ?, ?, ?, ?)");
    $insert->execute([$cedula, $juego_id, $nivel, $puntaje, $fallos, $fecha_actual]);
}

echo json_encode(['success' => true]);
?>
