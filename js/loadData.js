$(document).ready(function() {
    // Cargar datos de cursos y discapacidades
    loadData('cursos', '#curso_id');
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
                            <output for="range_${discapacidad.id}" id="output_${discapacidad.id}">${0}%</output>
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
                        $('#registrationForm')[0].reset(); // Resetea el formulario solo si el usuario confirma la alerta
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
