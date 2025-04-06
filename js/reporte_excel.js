function exportarExcelPlano() {
    const filas = [];
    const tarjetas = document.querySelectorAll('h3');

    tarjetas.forEach(titulo => {
        const card = titulo.closest('div');
        const nombre = titulo.innerText;
        const curso = card.querySelector('p:nth-of-type(1)')?.innerText.split(': ')[1] || '';
        const fallos = card.querySelector('p:nth-of-type(2)')?.innerText.split(': ')[1] || '';
        const nota = card.querySelector('p:nth-of-type(3)')?.innerText.split(': ')[1] || '';

        filas.push({ Nombre: nombre, Curso: curso, Fallos: fallos, "Nota Final": nota });
    });

    if (filas.length === 0) {
        alert("No se encontraron datos para exportar.");
        return;
    }

    // Crear hoja
    const ws = XLSX.utils.json_to_sheet(filas);

    // Ajustar estilos manualmente
    const wscols = [
        { wch: 30 }, // Nombre
        { wch: 20 }, // Curso
        { wch: 10 }, // Fallos
        { wch: 12 }  // Nota Final
    ];
    ws['!cols'] = wscols;

    // Crear libro
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    // Aplicar colores por curso
    filas.forEach((fila, i) => {
        const filaIndex = i + 2; // porque la primera fila es encabezado
        const color = fila.Curso.includes("Basicas") ? "92D050" // verde claro
                    : fila.Curso.includes("Media") ? "9DC3E6"  // azul claro
                    : fila.Curso.includes("Avanzadas") ? "C39BD3" // morado claro
                    : "FFFFFF"; // blanco

        const ref = `A${filaIndex}:D${filaIndex}`;
        const cellStyle = {
            fill: {
                patternType: "solid",
                fgColor: { rgb: color.replace('#', '') }
            }
        };

        const range = XLSX.utils.decode_range(ref);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) continue;
                ws[cellAddress].s = cellStyle;
            }
        }
    });

    // Aplicar negrita al encabezado
    ['A1', 'B1', 'C1', 'D1'].forEach(c => {
        if (ws[c]) {
            ws[c].s = {
                font: { bold: true },
                fill: { patternType: 'solid', fgColor: { rgb: 'D9E1F2' } }
            };
        }
    });

    XLSX.writeFile(wb, "reporte_estudiantes.xlsx");
}
