<?php
session_start();
include '../php/conexion.php';

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['success' => false, 'error' => 'No autenticado']);
    exit;
}

$cedula = $_SESSION['usuario'];
$juego_id = 16; // ID del juego "Suma y Resta de Fracciones"

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
?>
