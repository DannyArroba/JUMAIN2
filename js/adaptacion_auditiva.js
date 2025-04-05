document.addEventListener("DOMContentLoaded", function () {
    if (document.body.classList.contains("modo-auditivo")) {
        aplicarAdaptacionesAuditivas();
    }

    function aplicarAdaptacionesAuditivas() {
        document.body.classList.add("modo-auditivo");

        // 🔔 Notificación visual
        //const notificacion = document.createElement("div");
        //notificacion.classList.add("notificacion-visual");
        //notificacion.textContent = "🔔 Modo auditivo activado: Se han añadido señales visuales para facilitar la experiencia.";
        //document.body.insertBefore(notificacion, document.body.firstChild);

        // 🎮 Agregar icono de juego y asegurarse de que el texto no desaparezca
        document.querySelectorAll(".juego").forEach((juego) => {
            const titulo = juego.querySelector("h2");

            // Agregar icono de juego 🎮
            const icono = document.createElement("div");
            icono.classList.add("icono-juego");
            icono.textContent = "🎮";
            juego.insertBefore(icono, titulo);
        });

        // 📢 Crear botones de asistencia visual
        const controlesAuditivos = document.createElement("div");
        controlesAuditivos.id = "controles-auditivos";

        const vibrarBoton = document.createElement("button");
        vibrarBoton.textContent = "📳 Activar Vibración";
        vibrarBoton.classList.add("vibration-button");
        vibrarBoton.addEventListener("click", () => activarVibracion());

        const resaltarBoton = document.createElement("button");
        resaltarBoton.textContent = "🔆 Resaltar Nombres";
        resaltarBoton.classList.add("vibration-button");
        resaltarBoton.addEventListener("click", () => resaltarNombresJuegos());

        controlesAuditivos.append(vibrarBoton, resaltarBoton);
        document.body.appendChild(controlesAuditivos);
    }

    // 📳 Activar vibración de los juegos al presionar el botón
    function activarVibracion() {
        document.querySelectorAll(".juego").forEach((juego) => {
            juego.classList.add("vibrando");
        });

        // Detener la vibración después de 3 segundos
        setTimeout(() => {
            document.querySelectorAll(".juego").forEach((juego) => {
                juego.classList.remove("vibrando");
            });
        }, 3000);
    }

    // 🔆 Resaltar los nombres de los juegos
    function resaltarNombresJuegos() {
        document.querySelectorAll(".juego h2").forEach((titulo) => {
            titulo.classList.add("resaltado");
            setTimeout(() => titulo.classList.remove("resaltado"), 4000);
        });
    }
});
