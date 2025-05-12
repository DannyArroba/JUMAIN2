<?php
$host = 'db:3306'; // ← ¡Este es el cambio importante!
$db = 'jumain2';
$user = 'root';
$pass = 'rootpass';

date_default_timezone_set('America/Guayaquil'); // ✅ ESTABLECE LA ZONA HORARIA CORRECTA


try {
    // Crear la conexión con PDO
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Asignar $conn a $conexion para mantener la compatibilidad con código que usa $conexion
    $conexion = $conn;

} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>
