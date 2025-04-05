<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JUMAIN</title>
    <link rel="stylesheet" href="./css/portada.css">
</head>
<body>
    <div class="container">
        <!-- Filtro para difuminar el fondo -->
        <div class="background-blur"></div>
        
        <!-- Encabezado con iconos -->
        <div class="header">
            <img src="./img10/conf.png" alt="Configuración" class="icon">
            <div class="right-icons">
                <img src="./img10/sonido.png" alt="Sonido" class="icon">
                <img src="./img10/pregunta.png" alt="Ayuda" class="icon">
            </div>
        </div>

        <!-- Contenido principal con ajustes -->
        <div class="content">
            <img src="./img10/Nombre.png" alt="JUMAIN" class="logo">
            
            <!-- Campo de Estudiante con formulario para inicio de sesión -->
            <div class="info">
                <form id="login-form" method="POST" action="./php/inicio.php">
                    <label for="student-id" class="student-label">Usuario:</label>
                    <input 
                        type="text" 
                        id="student-id" 
                        name="cedula" 
                        class="id-input" 
                        placeholder="Ingrese su cédula" 
                        required 
                        maxlength="10"
                    >
                    <!-- Botón de enviar con diseño estilizado -->
                    <div class="play-button-container">
                        <button type="submit" class="play-button">
                            <img src="./img10/play.png" alt="Entrar">
                            <span>ENTRAR</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="./js/portada.js"></script>
</body>
<script>
    document.getElementById("student-id").addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });
</script>
</html>
