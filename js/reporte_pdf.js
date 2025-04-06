function exportarPDFPlano() {
    const area = document.createElement('div');
    area.style.fontFamily = 'Arial, sans-serif';
    area.style.fontSize = '12px';

    const encabezado = document.querySelector('h1')?.outerHTML || '';
    const profesor = document.querySelector('p')?.outerHTML || '';

    area.innerHTML += encabezado;
    area.innerHTML += profesor;
    area.innerHTML += "<h3 style='margin-top: 1rem;'>📋 Reporte de Estudiantes</h3><br>";

    const tarjetas = document.querySelectorAll('h3');

    tarjetas.forEach(titulo => {
        const card = titulo.closest('div');
        const nombre = titulo.innerText;
        const curso = card.querySelector('p:nth-of-type(1)')?.innerText.split(': ')[1] || '';
        const fallos = card.querySelector('p:nth-of-type(2)')?.innerText.split(': ')[1] || '';
        const nota = card.querySelector('p:nth-of-type(3)')?.innerText.split(': ')[1] || '';

        let bgColor = "#f2f2f2"; // default
        if (curso.includes("Basicas")) bgColor = "#d4edda";
        else if (curso.includes("Media")) bgColor = "#d1ecf1";
        else if (curso.includes("Avanzadas")) bgColor = "#f5e0ff";

        area.innerHTML += `
            <div style="background:${bgColor}; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Curso:</strong> ${curso}</p>
                <p><strong>Fallos:</strong> ${fallos}</p>
                <p><strong>Nota Final:</strong> ${nota}</p>
            </div>
        `;
    });

    html2pdf().set({
        margin: 0.5,
        filename: 'reporte_estudiantes.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(area).save();
}
