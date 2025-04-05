<?php
session_start();
include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cedula = $_POST['cedula'];

    // Validar si la cédula es de un profesor
    $queryProfesor = $conexion->prepare("SELECT * FROM profesores WHERE cedula = :cedula");
    $queryProfesor->execute([':cedula' => $cedula]);
    $profesor = $queryProfesor->fetch();

    if ($profesor) {
        $_SESSION['usuario'] = $profesor['cedula'];
        $_SESSION['rol'] = 'profesor';
        header('Location: ../registro_estudiantes.php');
        exit;
    }

    // Validar si la cédula es de un estudiante
    $queryEstudiante = $conexion->prepare("
        SELECT estudiantes.*, cursos.nombre AS curso_nombre 
        FROM estudiantes 
        JOIN cursos ON estudiantes.curso_id = cursos.id 
        WHERE estudiantes.cedula = :cedula
    ");
    $queryEstudiante->execute([':cedula' => $cedula]);
    $estudiante = $queryEstudiante->fetch();

    if ($estudiante) {
        $_SESSION['usuario'] = $estudiante['cedula'];
        $_SESSION['rol'] = 'estudiante';
        
        // Redirigir al menú específico según el curso
        switch ($estudiante['curso_nombre']) {
            case 'Matematicas Basicas':
                header('Location: ../menu.php');
                break;
            case 'Matematicas Media':
                header('Location: ../menuM.php');
                break;
            case 'Matematicas Avanzadas':
                header('Location: ../menuA.php');
                break;
            default:
                header('Location: ../menu.php'); // Por defecto
        }
        exit;
    }

    // Si no se encuentra la cédula, redirigir al inicio con error
    $_SESSION['error'] = 'Cédula no encontrada.';
    header('Location: ../portada.php');
    exit;
}
?>
