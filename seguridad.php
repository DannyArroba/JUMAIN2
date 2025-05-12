<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Verificar si el usuario ha iniciado sesión y si es un estudiante
    if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'estudiante') {
        header('Location: ./index.php');
        exit;
    }

    require_once './php/conexion.php';

    // Obtener datos
    $cedula = $_SESSION['usuario'];
    $nombre = 'N/A';
    $apellido = 'N/A';
    $discapacidad_auditiva = false;
    $discapacidad_visual = false;

    try {
        $stmt = $conexion->prepare("SELECT nombre, apellido FROM estudiantes WHERE cedula = :cedula");
        $stmt->bindParam(':cedula', $cedula, PDO::PARAM_STR);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $nombre = htmlspecialchars($row['nombre']);
            $apellido = htmlspecialchars($row['apellido']);
        }

        $stmt_disc = $conexion->prepare("SELECT discapacidad_id FROM estudiantes_discapacidades WHERE estudiante_cedula = :cedula");
        $stmt_disc->bindParam(':cedula', $cedula, PDO::PARAM_STR);
        $stmt_disc->execute();

        while ($row = $stmt_disc->fetch(PDO::FETCH_ASSOC)) {
            if ($row['discapacidad_id'] == 3) $discapacidad_auditiva = true;
            if ($row['discapacidad_id'] == 1) $discapacidad_visual = true;
        }
    } catch (PDOException $e) {
        die("Error al obtener datos: " . $e->getMessage());
    }
    ?>
