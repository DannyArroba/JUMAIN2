document.addEventListener("DOMContentLoaded", function () {
    if (document.body.classList.contains("modo-motriz")) {
        aplicarAdaptacionesMotrices();
    }

    function aplicarAdaptacionesMotrices() {
        document.body.classList.add("modo-motriz");

        // 🎮 Controles de accesibilidad
        const controlesMotrices = document.createElement("div");
        controlesMotrices.id = "controles-motrices";

        const modoFacilBtn = document.createElement("button");
        modoFacilBtn.innerHTML = "🛠️ Activar <br> Modo Fácil";
        modoFacilBtn.classList.add("modo-facil");
        modoFacilBtn.addEventListener("click", () => activarModoFacil());

        controlesMotrices.append(modoFacilBtn);
        document.body.appendChild(controlesMotrices);
    }

    // 🔄 Activar Modo Fácil con cambios de diseño
    function activarModoFacil() {
        document.body.classList.toggle("modo-facil-activo");

        document.querySelectorAll(".juego").forEach(juego => {
            if (document.body.classList.contains("modo-facil-activo")) {
                juego.style.minHeight = "220px";
                juego.style.minWidth = "220px";
                juego.style.fontSize = "1.8em";
                juego.style.padding = "30px";
                juego.style.border = "6px solid #2196F3";
                juego.style.backgroundColor = "#E3F2FD";
            } else {
                juego.style.minHeight = "150px";
                juego.style.minWidth = "150px";
                juego.style.fontSize = "1.4em";
                juego.style.padding = "20px";
                juego.style.border = "4px solid #FF9800";
                juego.style.backgroundColor = "#FFF3E0";
            }
        });
    }
});
