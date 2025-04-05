<?php
require './conexion.php'; // Incluye la conexión a la base de datos

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = trim($_POST['usuario']); // Obtiene el usuario ingresado

    try {
        // Verificar si el usuario existe
        $stmt = $conn->prepare("SELECT COUNT(*) FROM usuarios WHERE usuario = :usuario");
        $stmt->bindParam(':usuario', $usuario);
        $stmt->execute();
        $exists = $stmt->fetchColumn();

        if ($exists) {
            // Respuesta para inicio exitoso
            echo json_encode(["status" => "success", "message" => "Inicio Correcto. Bienvenido, $usuario!"]);
        } else {
            // Respuesta para usuario no encontrado
            echo json_encode(["status" => "error", "message" => "Usuario no encontrado. Por favor regístrate."]);
        }
    } catch (PDOException $e) {
        // Respuesta para error de conexión
        echo json_encode(["status" => "error", "message" => "Error al verificar el usuario. Inténtalo más tarde."]);
    }
}
?>
