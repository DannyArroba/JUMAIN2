document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evitar el envío estándar del formulario
  
    const usuario = document.getElementById('usuario').value;
  
    try {
      const response = await fetch('./php/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `usuario=${encodeURIComponent(usuario)}`,
      });
  
      const result = await response.json();
  
      if (result.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Inicio Correcto',
          text: result.message,
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.href = './menu.html'; // Redirigir al menú
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al iniciar sesión. Intenta de nuevo más tarde.',
      });
    }
  });
  