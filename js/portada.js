document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevenir el envío tradicional del formulario

        // Obtener los datos del formulario
        const formData = new FormData(form);
        const cedula = formData.get("cedula");

        try {
            // Enviar datos al backend usando fetch
            const response = await fetch('./php/inicio.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `cedula=${encodeURIComponent(cedula)}` // Codificar datos correctamente
            });

            // Verificar si la respuesta incluye una redirección
            if (response.redirected) {
                window.location.href = response.url; // Redirigir al usuario
            } else {
                const error = await response.text(); // Leer el mensaje de error
                alert(error); // Mostrar error al usuario
            }
        } catch (error) {
            console.error("Error durante la solicitud:", error);
            alert("Ocurrió un problema al procesar la solicitud. Intente nuevamente.");
        }
    });
});
