<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Estudiantes</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body class="bg-gradient-to-br from-blue-300 to-pink-300 min-h-screen flex items-center justify-center">

    <div class="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <!-- Encabezado con los botones -->
        <header class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-blue-600">Registro de Estudiantes</h1>
            <div class="flex gap-4">
                <a href="menu.php" class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
                    Regresar al Menú
                </a>
                <a href="php/reporte_general.php" class="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
                    📊 Generar Reporte
                </a>
            </div>
        </header>

        <!-- Formulario de Registro -->
        <form id="registrationForm" class="flex flex-wrap justify-between" method="POST" action="php/registro_estudiante.php">
        <div class="w-full md:w-1/2 p-2">
                <label for="cedula" class="font-bold">Cédula:</label>
                <input type="text" id="cedula" name="cedula" placeholder="Escribe la cédula" required class="w-full p-2 border rounded" maxlength="10">
            </div>
            <div class="w-full md:w-1/2 p-2">
                <label for="nombre" class="font-bold">Nombre:</label>
                <input type="text" id="nombre" name="nombre" placeholder="Escribe el nombre" required class="w-full p-2 border rounded">
            </div>
            <div class="w-full md:w-1/2 p-2">
                <label for="apellido" class="font-bold">Apellido:</label>
                <input type="text" id="apellido" name="apellido" placeholder="Escribe el apellido" required class="w-full p-2 border rounded">
            </div>
            <div class="w-full md:w-1/2 p-2">
                <label for="edad" class="font-bold">Edad:</label>
                <input type="number" id="edad" name="edad" placeholder="Escribe la edad" required class="w-full p-2 border rounded">
            </div>
            <div class="w-full md:w-1/2 p-2">
                <label for="sexo" class="font-bold">Sexo:</label>
                <select id="sexo" name="sexo" required class="w-full p-2 border rounded">
                    <option value="">Seleccione el sexo...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                </select>
            </div>
            <div class="w-full md:w-1/2 p-2">
                <label for="curso_id" class="font-bold">Curso:</label>
                <select id="curso_id" name="curso_id" required class="w-full p-2 border rounded"></select>
            </div>
            <div class="w-full p-2">
                <label class="font-bold">Discapacidades:</label>
                <div id="discapacidades-container" class="flex flex-wrap gap-2">
                    <!-- Opciones dinámicas de discapacidades -->
                </div>
            </div>
            <div class="w-full p-2">
                <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">Registrar</button>
            </div>
        </form>
    </div>
    
    <script>
        $(document).ready(function() {
            $("#cedula").on("input", function() {
                this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
            });
        });
        $(document).ready(function() {
            // Cargar opciones de cursos
            loadData('cursos', '#curso_id');

            // Cargar opciones de discapacidades
            loadData('discapacidades', null);

            function loadData(type, selector) {
                $.getJSON(`php/get_datos.php?type=${type}`, function(data) {
                    if (selector) {
                        $(selector).empty().append('<option value="">Seleccione...</option>');
                        data.forEach(function(item) {
                            $(selector).append(`<option value="${item.id}">${item.nombre}</option>`);
                        });
                    } else if (type === 'discapacidades') {
                        $('#discapacidades-container').empty();
                        data.forEach(function(discapacidad) {
                            const discHtml = `
                                <div class="mb-4">
                                    <input type="checkbox" id="check_${discapacidad.id}" name="disc_${discapacidad.id}" class="mr-2">
                                    <label for="check_${discapacidad.id}" class="font-bold">${discapacidad.tipo}</label>
                                    <input type="range" id="range_${discapacidad.id}" name="porcentaje_${discapacidad.id}" min="0" max="100" value="0" class="w-full" disabled>
                                    <output for="range_${discapacidad.id}" id="output_${discapacidad.id}">0%</output>
                                </div>
                            `;
                            $('#discapacidades-container').append(discHtml);

                            $(`#check_${discapacidad.id}`).change(function() {
                                const is_checked = $(this).is(':checked');
                                $(`#range_${discapacidad.id}`).prop('disabled', !is_checked).val(0);
                                $(`#output_${discapacidad.id}`).text('0%');
                            });

                            $(`#range_${discapacidad.id}`).on('input', function() {
                                $(`#output_${discapacidad.id}`).text(`${this.value}%`);
                            });
                        });
                    }
                });
            }

            // Manejo del envío del formulario
            $('#registrationForm').on('submit', function(e) {
                e.preventDefault();
                $.ajax({
                    type: 'POST',
                    url: 'php/registro_estudiante.php',
                    data: $(this).serialize(),
                    success: function(response) {
                        Swal.fire({
                            title: '¡Registro Exitoso!',
                            text: 'El estudiante ha sido registrado correctamente.',
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.value) {
                                $('#registrationForm')[0].reset();
                                $('#discapacidades-container').find('output').text('0%');
                                $('#discapacidades-container').find('input[type="range"]').prop('disabled', true).val(0);
                                $('#discapacidades-container').find('input[type="checkbox"]').prop('checked', false);
                            }
                        });
                    },
                    error: function() {
                        Swal.fire({
                            title: 'Error',
                            text: 'No se pudo registrar el estudiante. Por favor, intenta nuevamente.',
                            icon: 'error',
                            confirmButtonColor: '#d33',
                            confirmButtonText: 'OK'
                        });
                    }
                });
            });
        });
    </script>
</body>
</html>
