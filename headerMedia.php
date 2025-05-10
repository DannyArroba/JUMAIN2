
    <?php
    session_start();

    // Verificar si el usuario ha iniciado sesión y si es un estudiante
    if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'estudiante') {
        header('Location: ./index.php');
        exit;
    }

    require_once './php/conexion.php';

    // Obtener la cédula del estudiante desde la sesión
    $cedula = $_SESSION['usuario'];
    $nombre = 'N/A';
    $apellido = 'N/A';
    $discapacidad_auditiva = false;
    $discapacidad_visual = false;

    try {
        // Obtener nombre y apellido
        $stmt = $conexion->prepare("SELECT nombre, apellido FROM estudiantes WHERE cedula = :cedula");
        $stmt->bindParam(':cedula', $cedula, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $nombre = htmlspecialchars($row['nombre']);
            $apellido = htmlspecialchars($row['apellido']);
        }

        // Verificar discapacidades
        $stmt_disc = $conexion->prepare("
            SELECT discapacidad_id 
            FROM estudiantes_discapacidades 
            WHERE estudiante_cedula = :cedula
        ");
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
<!-- header.php -->
<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    margin-bottom: 20px;  /* Agregado para separar el header del contenido */
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 1rem 1rem;
    font-family: Arial, sans-serif;
}

</style>

<div id="custom-header"></div>
<script>
    const headerHTML = `
    <style>
 
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    margin-bottom: 20px;  /* Agregado para separar el header del contenido */
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 1rem 1rem;
    font-family: Arial, sans-serif;
}

</style>

        <header class="header-container">
            <!-- Nombre del usuario con ícono alineado a la izquierda -->
            <div class="user-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9zM4.5 18a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V18z" />
                </svg>
                <span class="username"><?= htmlspecialchars($nombre . ' ' . $apellido); ?></span>
            </div>

            <!-- Logotipo centrado -->
            <div class="logo-container">
                <img src="./img10/Nombre.png" alt="Logo" class="logo">
            </div>

            <!-- Controles a la derecha -->
            <div class="controls">
                 <!-- Botón de Configuración de sonido -->
    <button onclick="toggleSound()" class="control-btn">
        <img id="soundIcon" src="./img10/sonido.png" alt="Configuración">
    </button>

                <!-- Botón de Volver al Menú -->
                <button onclick="window.location.href='./menuM.php'" class="control-btn">
                    <img src="./img10/game.png" alt="Menú">
                </button>
            </div>
        </header>
    `;

    const headerContainer = document.getElementById('custom-header');
    const shadowRoot = headerContainer.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
        <style>
            /* Encapsulados */
            .header-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 20px;
                background-color: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                border-radius: 0 0 1rem 1rem;
                font-family: Arial, sans-serif;
            }
            .user-info {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .user-info .icon {
                width: 24px;
                height: 24px;
                color: #1D4ED8;
            }
            .user-info .username {
                font-size: 1rem;
                color: #1D4ED8;
                font-weight: bold;
            }
            .logo-container {
                flex-grow: 1;
                display: flex;
                justify-content: center;
            }
            .logo-container .logo {
                width: 120px;
                height: auto;
            }
            .controls {
                display: flex;
                gap: 10px;
            }
            .controls .control-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: transform 0.2s ease;
            }
            .controls .control-btn:hover {
                transform: scale(1.1);
            }
            .controls .control-btn img {
                width: 40px;
                height: 40px;
            }
        </style>
        ${headerHTML}
    `;


    function toggleSound() {
    // Comprueba si los objetos de audio existen y cambia su estado 'muted'
    if (window.musicaFondo) {
        window.musicaFondo.muted = !window.musicaFondo.muted;
    }
    if (window.audioMuyBien) {
        window.audioMuyBien.muted = !window.audioMuyBien.muted;
    }
    if (window.audioIncorrecto) {
        window.audioIncorrecto.muted = !window.audioIncorrecto.muted;
    }

    // Actualiza el ícono según el estado del audio (opcional)
    const soundIcon = document.getElementById("soundIcon");
    if (window.musicaFondo && window.musicaFondo.muted) {
        soundIcon.src = './img10/sound_off.png'; // Asegúrate de tener este icono
    } else {
        soundIcon.src = './img10/sonido.png';
    }
}
</script>

