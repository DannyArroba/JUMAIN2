document.addEventListener("DOMContentLoaded", () => {
    const pantallaCarga = document.getElementById("pantalla-carga");
    const menuPrincipal = document.getElementById("menu-principal");
    const formularioRegistro = document.getElementById("formulario-registro");
    const btnRegistrarse = document.getElementById("btn-registrarse");
    const barraPorcentaje = document.getElementById("barra-porcentaje");
    const valorPorcentaje = document.getElementById("valor-porcentaje");
  
    // Simular pantalla de carga
    setTimeout(() => {
      pantallaCarga.style.opacity = "0";
      setTimeout(() => {
        pantallaCarga.classList.add("hidden");
        menuPrincipal.classList.remove("hidden");
      }, 700);
    }, 3000);
  
    // Mostrar formulario de registro
    btnRegistrarse.addEventListener("click", () => {
      menuPrincipal.classList.add("hidden");
      formularioRegistro.classList.remove("hidden");
    });
  
    // Actualizar porcentaje de discapacidad
    barraPorcentaje.addEventListener("input", (e) => {
      valorPorcentaje.textContent = `${e.target.value}%`;
    });
  });
  