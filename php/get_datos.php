<?php
require 'conexion.php';

$type = $_GET['type'] ?? '';

switch ($type) {
    case 'cursos':
        $query = $conexion->query("SELECT id, nombre FROM cursos");
        break;
    case 'instituciones':
        $query = $conexion->query("SELECT id, nombre FROM instituciones");
        break;
    case 'discapacidades':
        $query = $conexion->query("SELECT id, tipo FROM discapacidades");
        break;
    default:
        echo json_encode([]);
        exit;
}

$result = $query->fetchAll(PDO::FETCH_ASSOC);
header('Content-Type: application/json');
echo json_encode($result);
?>
