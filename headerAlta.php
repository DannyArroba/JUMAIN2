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
    .volume-panel {
  position: absolute;
  top: 70px;
  right: 70px;
  background: #fff;
  border: 2px solid #ccc;
  border-radius: 1rem;
  padding: 15px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  width: 250px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.volume-panel h4 {
  margin: 0;
  font-size: 1rem;
  color: #1D4ED8;
}
.volume-slider {
  width: 100%;
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
                <button onclick="window.location.href='./menuA.php'" class="control-btn">
                    <img src="./img10/game.png" alt="Menú">
                </button>
            </div>
        </header>
        <div id="volumePanel" class="volume-panel" style="display: none;">
  <h4>Volumen Música</h4>
  <input type="range" id="volMusica" class="volume-slider" min="0" max="1" step="0.01">
  <h4>Volumen “Muy Bien”</h4>
  <input type="range" id="volMuyBien" class="volume-slider" min="0" max="1" step="0.01">
  <h4>Volumen “Incorrecto”</h4>
  <input type="range" id="volIncorrecto" class="volume-slider" min="0" max="1" step="0.01">
</div>

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
    const panel = shadowRoot.getElementById('volumePanel');
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';

    const soundIcon = document.getElementById("soundIcon");
    if (window.musicaFondo && window.musicaFondo.muted) {
        soundIcon.src = './img10/sound_off.png';
    } else {
        soundIcon.src = './img10/sonido.png';
    }
}
// Guardar volumen por usuario
function guardarVolumen(nombre, valor) {
    const cedula = "<?= $cedula ?>";
    localStorage.setItem(nombre + "_" + cedula, valor);
    if (window[nombre]) {
        window[nombre].volume = valor;
    }
}

// Cargar volumen guardado
function cargarVolumen(nombre, defaultValue) {
    const cedula = "<?= $cedula ?>";
    const valor = parseFloat(localStorage.getItem(nombre + "_" + cedula));
    return isNaN(valor) ? defaultValue : valor;
}

// Aplicar configuración después de cargar el header
setTimeout(() => {
    const volMusica = shadowRoot.getElementById('volMusica');
    const volMuyBien = shadowRoot.getElementById('volMuyBien');
    const volIncorrecto = shadowRoot.getElementById('volIncorrecto');

    const defaultMusica = 0.333;
    const defaultOtros = 1;

    volMusica.value = cargarVolumen('musicaFondo', defaultMusica);
    volMuyBien.value = cargarVolumen('audioMuyBien', defaultOtros);
    volIncorrecto.value = cargarVolumen('audioIncorrecto', defaultOtros);

    if (window.musicaFondo) window.musicaFondo.volume = volMusica.value;
    if (window.audioMuyBien) window.audioMuyBien.volume = volMuyBien.value;
    if (window.audioIncorrecto) window.audioIncorrecto.volume = volIncorrecto.value;

    volMusica.addEventListener('input', () => guardarVolumen('musicaFondo', volMusica.value));
    volMuyBien.addEventListener('input', () => guardarVolumen('audioMuyBien', volMuyBien.value));
    volIncorrecto.addEventListener('input', () => guardarVolumen('audioIncorrecto', volIncorrecto.value));
}, 300);

</script>

