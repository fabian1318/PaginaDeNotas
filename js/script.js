// Datos iniciales
const asignaturas = [
    { id: 1, nombre: "Matemáticas", imagen: "matematicas.jpg", color: "#4e73df" },
    { id: 2, nombre: "Inglés", imagen: "ingles.jpg", color: "#1cc88a" },
    { id: 3, nombre: "Ciencias Naturales", imagen: "ciencias.jpg", color: "#36b9cc" },
    { id: 4, nombre: "Lenguaje", imagen: "lenguaje.jpg", color: "#f6c23e" },
    { id: 5, nombre: "Música", imagen: "musica.jpg", color: "#e74a3b" },
    { id: 6, nombre: "Artes", imagen: "artes.jpg", color: "#858796" }
];

// Variables globales
let estudiantes = [];
let notasStorage = {};

// Inicializar datos desde localStorage
function inicializarDatos() {
    try {
        estudiantes = JSON.parse(localStorage.getItem('estudiantesStorage')) || [
            { 
                id: 1, 
                nombres: "Juan", 
                apellidos: "Pérez", 
                nombreCompleto: "Juan Pérez" 
            },
            { 
                id: 2, 
                nombres: "María", 
                apellidos: "González", 
                nombreCompleto: "María González" 
            },
            { 
                id: 3, 
                nombres: "Carlos", 
                apellidos: "López", 
                nombreCompleto: "Carlos López" 
            },
            { 
                id: 4, 
                nombres: "Ana", 
                apellidos: "Martínez", 
                nombreCompleto: "Ana Martínez" 
            }
        ];
        
        // Ordenar estudiantes por apellidos al cargar
        estudiantes.sort((a, b) => a.apellidos.localeCompare(b.apellidos));
        
        notasStorage = JSON.parse(localStorage.getItem('notasStorage')) || {};
    } catch (e) {
        console.error("Error al cargar datos:", e);
        estudiantes = [
            { 
                id: 1, 
                nombres: "Juan", 
                apellidos: "Pérez", 
                nombreCompleto: "Juan Pérez" 
            },
            { 
                id: 2, 
                nombres: "María", 
                apellidos: "González", 
                nombreCompleto: "María González" 
            },
            { 
                id: 3, 
                nombres: "Carlos", 
                apellidos: "López", 
                nombreCompleto: "Carlos López" 
            },
            { 
                id: 4, 
                nombres: "Ana", 
                apellidos: "Martínez", 
                nombreCompleto: "Ana Martínez" 
            }
        ].sort((a, b) => a.apellidos.localeCompare(b.apellidos));
        notasStorage = {};
    }
}
// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', function() {
    inicializarDatos();
    
    
    if (document.getElementById('asignaturas-container')) {
        cargarAsignaturas();
    } else if (document.getElementById('tabla-notas')) {
        cargarNotas();
    }
});

// Cargar las cards de asignaturas
function cargarAsignaturas() {
    const container = document.getElementById('asignaturas-container');
    
    asignaturas.forEach(asignatura => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6 mb-4';
        
        const card = document.createElement('div');
        card.className = 'card card-asignatura h-100';
        card.style.borderTop = `4px solid ${asignatura.color}`;
        card.innerHTML = `
            <img src="img/${asignatura.imagen}" class="card-img-top img-fluid" alt="${asignatura.nombre}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-center">${asignatura.nombre}</h5>
                <div class="text-center mt-auto">
                    <button class="btn btn-primary btn-ingresar" data-id="${asignatura.id}" aria-label="Ingresar notas de ${asignatura.nombre}">
                        Ingresar Notas <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        col.appendChild(card);
        container.appendChild(col);
    });
    
    // Delegación de eventos para los botones
    document.getElementById('asignaturas-container').addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-ingresar') || e.target.closest('.btn-ingresar')) {
            const btn = e.target.classList.contains('btn-ingresar') ? e.target : e.target.closest('.btn-ingresar');
            const idAsignatura = parseInt(btn.getAttribute('data-id'));
            const asignatura = asignaturas.find(a => a.id === idAsignatura);
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
            btn.classList.add('disabled');
            
            setTimeout(() => {
                sessionStorage.setItem('asignaturaActual', JSON.stringify(asignatura));
                window.location.href = 'notas.html';
            }, 800);
        }
    });
}

// Cargar la tabla de notas
function cargarNotas() {
    const asignaturaActual = JSON.parse(sessionStorage.getItem('asignaturaActual'));
    document.getElementById('asignatura-titulo').textContent = `Registro de Notas - ${asignaturaActual.nombre}`;
    
    const tbody = document.querySelector('#tabla-notas tbody');
    actualizarTablaNotas(tbody);
    configurarEventosNotas();
}

// Actualizar la tabla de notas
function actualizarTablaNotas(tbody) {
    tbody.innerHTML = '';
    const asignaturaActual = JSON.parse(sessionStorage.getItem('asignaturaActual'));
    const notasGuardadas = notasStorage[asignaturaActual.id]?.notas || [];
    
    estudiantes.forEach((estudiante, index) => {
        const notasEstudiante = notasGuardadas.find(n => n.estudianteId === estudiante.id);
        const promedioGuardado = notasEstudiante?.promedio || '0.0';
        
        const tr = document.createElement('tr');
        tr.className = 'fade-in';
        tr.setAttribute('data-estudiante-id', estudiante.id);
        tr.innerHTML = `
            <td class="student-col">${estudiante.nombreCompleto}</td>
            ${Array(5).fill().map((_, i) => `
            <td>
                <input type="text" class="form-control input-nota" 
                       value="${notasEstudiante?.notas[i] || ''}">
                <div class="mensaje-error"></div>
            </td>
            `).join('')}
            <td class="promedio-final text-center fw-bold">${promedioGuardado}</td>
        `;
        
        actualizarEstiloPromedio(tr.querySelector('.promedio-final'));
        tbody.appendChild(tr);
    });
    
    // Cargar ponderaciones guardadas
    if (notasStorage[asignaturaActual.id]?.ponderaciones) {
        const ponderaciones = document.querySelectorAll('.ponderacion');
        notasStorage[asignaturaActual.id].ponderaciones.forEach((valor, index) => {
            if (ponderaciones[index]) ponderaciones[index].value = valor;
        });
        actualizarPonderaciones();
    }
}

// Configurar eventos de la página de notas
function configurarEventosNotas() {
    // Eventos para ponderaciones
    document.querySelector('#tabla-notas').addEventListener('input', function(e) {
        if (e.target.classList.contains('ponderacion')) {
            const valor = parseInt(e.target.value) || 0;
            if (valor < 0) e.target.value = 0;
            if (valor > 100) e.target.value = 100;
            actualizarPonderaciones();
        }
    });
    
    // Evento input modificado para notas (nuevo)
    document.querySelector('#tabla-notas').addEventListener('input', function(e) {
        if (e.target.classList.contains('input-nota')) {
            const input = e.target;
            const cursorPosition = input.selectionStart;
            
            // Limpiar el valor (solo números y puntos)
            let newValue = input.value.replace(/[^0-9.]/g, '');
            
            // Manejar múltiples puntos (solo permitir uno)
            const puntos = newValue.split('.');
            if (puntos.length > 2) {
                newValue = puntos[0] + '.' + puntos.slice(1).join('');
            }
            
            // Auto-insertar punto después del primer dígito si se ingresan dos números
            if (newValue.length === 2 && !newValue.includes('.')) {
                newValue = newValue[0] + '.' + newValue[1];
                // Ajustar posición del cursor después de insertar el punto
                setTimeout(() => {
                    input.selectionStart = input.selectionEnd = cursorPosition + 1;
                }, 0);
            }
            
            // Actualizar el valor del input
            input.value = newValue;
            
            // Validar en tiempo real
            validarNota(input);
        }
    }, true);
    
    // Eventos para notas (blur)
    document.querySelector('#tabla-notas').addEventListener('blur', function(e) {
        if (e.target.classList.contains('input-nota')) {
            if (validarNota(e.target)) {
                calcularPromedio(e.target.closest('tr'));
            }
        }
    }, true);
    
    // Eventos de teclado para navegación
    document.querySelector('#tabla-notas').addEventListener('keydown', function(e) {
        if (!e.target.classList.contains('input-nota')) return;
        
        const currentInput = e.target;
        const currentRow = currentInput.closest('tr');
        const allInputs = Array.from(currentRow.querySelectorAll('.input-nota'));
        const currentIndex = allInputs.indexOf(currentInput);
        const allRows = Array.from(document.querySelectorAll('#tabla-notas tbody tr:not(:first-child)'));
        const rowIndex = allRows.indexOf(currentRow);
        
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                manejarNavegacion(e.target, currentIndex, rowIndex, allInputs, allRows);
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (rowIndex < allRows.length - 1) {
                    const nextInputs = allRows[rowIndex + 1].querySelectorAll('.input-nota');
                    nextInputs[currentIndex].focus();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (rowIndex > 0) {
                    const prevInputs = allRows[rowIndex - 1].querySelectorAll('.input-nota');
                    prevInputs[currentIndex].focus();
                }
                break;
            case 'ArrowRight':
                if (currentInput.selectionStart === currentInput.value.length && currentIndex < allInputs.length - 1) {
                    allInputs[currentIndex + 1].focus();
                    e.preventDefault();
                }
                break;
            case 'ArrowLeft':
                if (currentInput.selectionStart === 0 && currentIndex > 0) {
                    allInputs[currentIndex - 1].focus();
                    e.preventDefault();
                }
                break;
        }
    }, true);
    
    // Botones
    document.getElementById('btn-guardar').addEventListener('click', guardarNotas);
    document.getElementById('btn-exportar').addEventListener('click', exportarAExcel);
    document.getElementById('btn-agregar').addEventListener('click', mostrarModalEstudiante);
    document.getElementById('btn-eliminar').addEventListener('click', mostrarModalEliminar);
    document.getElementById('btn-confirmar').addEventListener('click', agregarEstudiante);
    document.getElementById('btn-confirmar-eliminar').addEventListener('click', eliminarEstudiante);
    
    // Formulario
    document.getElementById('form-estudiante').addEventListener('submit', function(e) {
        e.preventDefault();
        agregarEstudiante();
    });
}

// Función para manejar navegación entre celdas
function manejarNavegacion(input, currentIndex, rowIndex, allInputs, allRows) {
    input.blur();
    
    if (currentIndex < allInputs.length - 1) {
        allInputs[currentIndex + 1].focus();
    } else if (rowIndex < allRows.length - 1) {
        const nextInputs = allRows[rowIndex + 1].querySelectorAll('.input-nota');
        nextInputs[0].focus();
    }
}

// Validar nota
function validarNota(input) {
    const valorStr = input.value;
    const mensajeError = input.nextElementSibling;
    
    // Resetear estado
    input.classList.remove('invalida');
    if (mensajeError) mensajeError.style.display = 'none';
    
    // Permitir campo vacío durante la edición
    if (valorStr === '') return true;
    
    // Eliminar cualquier carácter que no sea número o punto
    let valorLimpio = valorStr.replace(/[^0-9.]/g, '');
    
    // Eliminar puntos adicionales (solo permitir uno)
    const partes = valorLimpio.split('.');
    if (partes.length > 2) {
        valorLimpio = partes[0] + '.' + partes.slice(1).join('');
    }
    
    // Auto-insertar punto decimal si se ingresan dos números sin punto
    if (valorLimpio.length === 2 && !valorLimpio.includes('.')) {
        valorLimpio = valorLimpio[0] + '.' + valorLimpio[1];
    }
    
    // Actualizar el valor del input
    if (valorLimpio !== valorStr) {
        input.value = valorLimpio;
    }
    
    // Convertir a número para validación
    const valor = parseFloat(valorLimpio);
    
    // Validar rango (1.0 a 7.0) solo cuando se sale del campo
    if (input !== document.activeElement) {
        if (isNaN(valor)) {
            input.classList.add('invalida');
            if (mensajeError) {
                mensajeError.textContent = 'Ingrese un número válido';
                mensajeError.style.display = 'block';
            }
            return false;
        }
        
        const notaRedondeada = Math.round(valor * 10) / 10;
        
        if (notaRedondeada < 1.0 || notaRedondeada > 7.0) {
            input.classList.add('invalida');
            if (mensajeError) {
                mensajeError.textContent = 'Nota debe estar entre 1.0 y 7.0';
                mensajeError.style.display = 'block';
            }
            return false;
        }
        
        // Formatear al salir del campo
        input.value = notaRedondeada.toFixed(1);
    }
    
    return true;
}
function mostrarErrorNota(input, mensaje) {
    input.classList.add('invalida');
    const mensajeError = input.nextElementSibling;
    if (mensajeError) {
        mensajeError.textContent = mensaje;
        mensajeError.style.display = 'block';
    }
}

// Calcular promedio para una fila
function calcularPromedio(row) {
    const inputs = row.querySelectorAll('.input-nota');
    const ponderaciones = document.querySelectorAll('.ponderacion');
    const promedioFinal = row.querySelector('.promedio-final');
    
    let sumaPonderada = 0;
    let sumaPonderaciones = 0;
    let todasNotasValidas = true;
    
    inputs.forEach((input, index) => {
        const nota = parseFloat(input.value);
        const ponderacion = parseFloat(ponderaciones[index].value) || 0;
        
        if (!isNaN(nota) && nota >= 1.0 && nota <= 7.0) {
            sumaPonderada += nota * (ponderacion / 100);
            sumaPonderaciones += ponderacion / 100;
        } else if (input.value !== '') {
            todasNotasValidas = false;
        }
    });
    
    if (todasNotasValidas && sumaPonderaciones > 0) {
        const promedio = sumaPonderada / sumaPonderaciones;
        promedioFinal.textContent = promedio.toFixed(1);
        actualizarEstiloPromedio(promedioFinal);
    } else {
        promedioFinal.textContent = '0.0';
        promedioFinal.className = 'promedio-final text-center fw-bold';
    }
}

function actualizarEstiloPromedio(elemento) {
    const valor = parseFloat(elemento.textContent);
    elemento.className = 'promedio-final text-center fw-bold ' + 
        (valor < 4.0 ? 'text-danger' : valor >= 5.0 ? 'text-success' : 'text-warning');
}

// Actualizar ponderaciones
function actualizarPonderaciones() {
    const ponderaciones = document.querySelectorAll('.ponderacion');
    let suma = 0;
    
    ponderaciones.forEach(p => suma += parseInt(p.value) || 0);
    
    const spanSuma = document.getElementById('suma-ponderaciones');
    spanSuma.textContent = `Suma ponderaciones: ${suma}%`;
    spanSuma.className = suma === 100 ? 'text-success' : 'text-danger';
    
    // Recalcular promedios solo para filas con datos
    document.querySelectorAll('#tabla-notas tbody tr').forEach(row => {
        calcularPromedio(row);
    });
}

// Guardar notas
function guardarNotas() {
    const asignaturaActual = JSON.parse(sessionStorage.getItem('asignaturaActual'));
    const filas = document.querySelectorAll('#tabla-notas tbody tr');
    const notas = [];
    
    // Recorrer todas las filas (ya no hay fila de encabezados)
    for (let i = 0; i < filas.length; i++) {
        const estudiante = estudiantes[i]; // Cambiar a [i] en lugar de [i - 1]
        const inputs = filas[i].querySelectorAll('.input-nota');
        const estudianteNotas = Array.from(inputs).map(input => input.value || null);
        
        notas.push({
            estudianteId: estudiante.id,
            notas: estudianteNotas,
            promedio: filas[i].querySelector('.promedio-final').textContent
        });
    }
    
    // Guardar ponderaciones
    const ponderaciones = Array.from(document.querySelectorAll('.ponderacion')).map(p => p.value);
    
    notasStorage[asignaturaActual.id] = { ponderaciones, notas };
    
    try {
        localStorage.setItem('notasStorage', JSON.stringify(notasStorage));
        mostrarFeedbackGuardado();
    } catch (e) {
        console.error("Error al guardar:", e);
        mostrarNotificacion('Error al guardar los datos', 'danger');
    }
}

function mostrarFeedbackGuardado() {
    const btnGuardar = document.getElementById('btn-guardar');
    btnGuardar.innerHTML = '<i class="fas fa-check"></i> Guardado!';
    btnGuardar.classList.replace('btn-success', 'btn-secondary');
    
    setTimeout(() => {
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
        btnGuardar.classList.replace('btn-secondary', 'btn-success');
    }, 2000);
}

// Exportar a Excel
function exportarAExcel() {
    const asignaturaActual = JSON.parse(sessionStorage.getItem('asignaturaActual'));
    const datos = notasStorage[asignaturaActual.id] || { notas: [], ponderaciones: Array(5).fill(20) };
    
    // Preparar datos
    const wsData = [
        ['Estudiante', ...Array(5).fill().map((_, i) => `Nota ${i+1} (${datos.ponderaciones[i]}%)`), 'Promedio'],
        ...datos.notas.map(notaEst => {
            const estudiante = estudiantes.find(e => e.id === notaEst.estudianteId);
            return [estudiante.nombreCompleto, ...notaEst.notas, notaEst.promedio];
        })
    ];
    
    try {
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Notas");
        XLSX.writeFile(wb, `Notas_${asignaturaActual.nombre}.xlsx`);
        mostrarNotificacion('Exportación a Excel completada', 'success');
    } catch (e) {
        console.error("Error al exportar:", e);
        mostrarNotificacion('Error al exportar a Excel', 'danger');
    }
}

// Funciones para estudiantes
function mostrarModalEstudiante() {
    const modal = new bootstrap.Modal(document.getElementById('modalEstudiante'));
    
    // Usar los nuevos IDs
    document.getElementById('nombres-estudiante').classList.remove('is-invalid');
    document.getElementById('apellidos-estudiante').classList.remove('is-invalid');
    
    modal.show();
}
function mostrarModalEliminar() {
    if (estudiantes.length === 0) {
        mostrarNotificacion('No hay estudiantes para eliminar', 'warning');
        return;
    }
    
    const select = document.getElementById('select-estudiante');
    select.innerHTML = estudiantes.map(e => 
        `<option value="${e.id}">${e.apellidos}, ${e.nombres}</option>`
    ).join('');
    
    new bootstrap.Modal(document.getElementById('modalEliminar')).show();
}

function agregarEstudiante() {
    const nombresInput = document.getElementById('nombres-estudiante');
    const apellidosInput = document.getElementById('apellidos-estudiante');
    const nombres = nombresInput.value.trim();
    const apellidos = apellidosInput.value.trim();
    
    // Validar campos
    let isValid = true;
    if (!nombres) {
        nombresInput.classList.add('is-invalid');
        isValid = false;
    } else {
        nombresInput.classList.remove('is-invalid');
    }
    
    if (!apellidos) {
        apellidosInput.classList.add('is-invalid');
        isValid = false;
    } else {
        apellidosInput.classList.remove('is-invalid');
    }
    
    if (!isValid) return;
    
    const nuevoId = estudiantes.length > 0 ? Math.max(...estudiantes.map(e => e.id)) + 1 : 1;
    const nombreCompleto = `${nombres} ${apellidos}`;
    estudiantes.push({ 
        id: nuevoId, 
        nombres,
        apellidos,
        nombreCompleto 
    });
    
    // Ordenar estudiantes por apellidos
    estudiantes.sort((a, b) => a.apellidos.localeCompare(b.apellidos));
    
    try {
        localStorage.setItem('estudiantesStorage', JSON.stringify(estudiantes));
        actualizarTablaNotas(document.querySelector('#tabla-notas tbody'));
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEstudiante'));
        modal.hide();
        
        // Limpiar campos
        nombresInput.value = '';
        apellidosInput.value = '';
        
        mostrarNotificacion(`Estudiante "${nombreCompleto}" agregado`, 'success');
    } catch (e) {
        console.error("Error al agregar estudiante:", e);
        mostrarNotificacion('Error al agregar estudiante', 'danger');
    }
}
function eliminarEstudiante() {
    const id = parseInt(document.getElementById('select-estudiante').value);
    const estudiante = estudiantes.find(e => e.id === id);
    
    estudiantes = estudiantes.filter(e => e.id !== id);
    
    try {
        localStorage.setItem('estudiantesStorage', JSON.stringify(estudiantes));
        actualizarTablaNotas(document.querySelector('#tabla-notas tbody'));
        guardarNotas();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminar'));
        modal.hide();
        
        mostrarNotificacion(`Estudiante eliminado: ${estudiante.nombre}`, 'success');
    } catch (e) {
        console.error("Error al eliminar estudiante:", e);
        mostrarNotificacion('Error al eliminar estudiante', 'danger');
    }
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo) {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} position-fixed top-0 end-0 m-3`;
    alerta.style.zIndex = '1100';
    alerta.style.transition = 'opacity 0.5s';
    alerta.setAttribute('role', 'alert');
    alerta.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
        ${mensaje}
    `;
    
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        alerta.style.opacity = '0';
        setTimeout(() => alerta.remove(), 500);
    }, 3000);
}