<?php
require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cedula = $_POST['cedula'];
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $edad = $_POST['edad'];
    $sexo = $_POST['sexo'];
    $curso_id = $_POST['curso_id'];

    try {
        // Iniciar transacción
        $conexion->beginTransaction();

        // Insertar el estudiante en la tabla estudiantes
        $sql = "INSERT INTO estudiantes (cedula, nombre, apellido, edad, sexo, curso_id) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$cedula, $nombre, $apellido, $edad, $sexo, $curso_id]);

        // Insertar discapacidades en la tabla estudiantes_discapacidades
        foreach ($_POST as $key => $value) {
            if (strpos($key, 'disc_') === 0) { // Buscar campos de discapacidades
                $disc_id = str_replace('disc_', '', $key);
                $porcentaje = $_POST["porcentaje_${disc_id}"] ?? 0;

                if ($value === 'on' && $porcentaje > 0) { // Verificar que el checkbox esté marcado y el porcentaje sea mayor a 0
                    $sql = "INSERT INTO estudiantes_discapacidades (estudiante_cedula, discapacidad_id, porcentaje) VALUES (?, ?, ?)";
                    $stmt = $conexion->prepare($sql);
                    $stmt->execute([$cedula, $disc_id, $porcentaje]);
                }
            }
        }

        // Confirmar la transacción
        $conexion->commit();

        echo 'Registro exitoso.';
    } catch (Exception $e) {
        // Revertir la transacción en caso de error
        $conexion->rollBack();
        echo 'Error al registrar el estudiante: ' . $e->getMessage();
    }
}
?>
