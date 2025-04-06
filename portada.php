<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>JUMAIN</title>
    <link rel="stylesheet" href="./css/portada.css"/>
    <link rel="stylesheet" href="./css/portada_extras.css"/>
</head>
<body>
    <div class="container">
        <!-- Fondo difuminado -->
        <div class="background-blur"></div>

        <!-- Encabezado con iconos -->
        <div class="header">
            <img src="./img10/conf.png" alt="Configuración" class="icon" id="config-btn" title="Configuración">
            <div class="right-icons">
                <img src="./img10/sonido.png" alt="Sonido" class="icon" id="sound-btn" title="Sonido">
                <img src="./img10/pregunta.png" alt="Ayuda" class="icon" id="help-btn" title="Acerca de">
            </div>
        </div>

        <!-- Contenido principal -->
        <div class="content">
            <img src="./img10/Nombre.png" alt="JUMAIN" class="logo"/>

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
                    />
                    <div class="play-button-container">
                        <button type="submit" class="play-button">
                            <img src="./img10/play.png" alt="Entrar" />
                            <span>ENTRAR</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Panel de ayuda -->
        <div id="help-panel" class="hidden help-box">
            <h2>🌟 Acerca de JUMAIN 🌟</h2>
            <p>Este juego educativo fue desarrollado por estudiantes creativos 💡.</p>
            <p>© 2024 JUMAIN. Todos los derechos reservados.</p>
            <p>Diseño inspirado en madera clara y tonos cálidos para accesibilidad.</p>
            <button onclick="document.getElementById('help-panel').classList.add('hidden')" class="cerrar-btn">Cerrar</button>
        </div>

        <!-- Panel de configuración -->
        <div id="config-panel" class="hidden config-box">
            <h2>🔧 Configuración</h2>
            <p>¡Próximamente podrás ajustar sonidos, accesibilidad y más desde aquí!</p>
            <button onclick="document.getElementById('config-panel').classList.add('hidden')" class="cerrar-btn">Cerrar</button>
        </div>
    </div>

    <script>
        // Cargar música de fondo y sonidos
        window.musicaFondo = new Audio('./audio/Fondo.mp3');
        window.audioMuyBien = new Audio('./audio/correcto.mp3');
        window.audioIncorrecto = new Audio('./audio/incorrecto.mp3');

        musicaFondo.loop = true;
        musicaFondo.volume = 0.5;
        musicaFondo.play();

        // Control del sonido
        const soundBtn = document.getElementById("sound-btn");
        let isMuted = false;

        soundBtn.addEventListener("click", () => {
            isMuted = !isMuted;
            musicaFondo.muted = isMuted;
            soundBtn.style.opacity = isMuted ? 0.5 : 1;
        });

        // Botón ayuda
        document.getElementById("help-btn").addEventListener("click", () => {
            document.getElementById("help-panel").classList.remove("hidden");
        });

        // Botón configuración
        document.getElementById("config-btn").addEventListener("click", () => {
            document.getElementById("config-panel").classList.remove("hidden");
        });

        // Validar solo números en cédula
        document.getElementById("student-id").addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    </script>

    <!-- Tu JS original para login -->
    <script src="./js/portada.js"></script>
</body>
</html>
