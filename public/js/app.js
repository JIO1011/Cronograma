const API_URL = '/api/horarios';
const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
let horarioActual = null;

const horaAMinutos = (hora) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
};

const obtenerDiaActual = () => DIAS[new Date().getDay()];

const actualizarRelojFecha = () => {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fecha = ahora.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    
    document.getElementById('reloj').textContent = hora;
    document.getElementById('fecha').textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

const cargarHorarios = async () => {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error();
        horarioActual = await respuesta.json();
        renderizarTabla();
    } catch {
        mostrarError('No se pudieron cargar los horarios');
    }
};

const parsearLinea = (linea, dia) => {
    if (!linea.trim()) return null;
    const partes = linea.split(',').map(p => p.trim());
    if (partes.length !== 5) return null;
    
    return {
        dia: dia.charAt(0).toUpperCase() + dia.slice(1),
        materia: partes[0],
        profesor: partes[1],
        laboratorio: partes[2],
        hora: partes[3],
        encargado: partes[4],
        horaMinutos: horaAMinutos(partes[3])
    };
};

const obtenerClases = () => {
    if (!horarioActual) return [];
    return ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
        .flatMap(dia => (horarioActual[dia] || []).map(linea => parsearLinea(linea, dia)))
        .filter(Boolean);
};

const filtrarClasesCercanas = (clases) => {
    const ahora = new Date();
    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    const diaActual = obtenerDiaActual();
    
    return clases.filter(clase => {
        const diferencia = clase.horaMinutos - minutosActuales;
        return clase.dia.toLowerCase() === diaActual && diferencia >= -20 && diferencia <= 120;
    });
};

const obtenerColorFila = (horaClase) => {
    const minutosActuales = new Date().getHours() * 60 + new Date().getMinutes();
    const diferencia = horaClase - minutosActuales;
    
    if (diferencia < -7) return 'rojo';
    if (diferencia <= 7) return 'amarillo';
    if (diferencia <= 10) return 'verde';
    return 'blanco';
};

const renderizarTabla = () => {
    const tbody = document.getElementById('tabla-body');
    const clases = filtrarClasesCercanas(obtenerClases()).sort((a, b) => a.horaMinutos - b.horaMinutos);
    
    if (clases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="sin-datos">No hay actividades próximas en este momento</td></tr>';
        return;
    }
    
    tbody.innerHTML = clases.map(clase => `
        <tr class="fila-${obtenerColorFila(clase.horaMinutos)}">
            <td>${clase.dia}</td>
            <td>${clase.materia}</td>
            <td>${clase.profesor}</td>
            <td>${clase.laboratorio}</td>
            <td><strong>${clase.hora}</strong></td>
            <td>${clase.encargado}</td>
        </tr>
    `).join('');
};

const mostrarError = (mensaje) => {
    document.getElementById('tabla-body').innerHTML = 
        `<tr><td colspan="6" class="sin-datos" style="color: #f44336;">${mensaje}</td></tr>`;
};

// Inicialización
setInterval(actualizarRelojFecha, 1000);
setInterval(renderizarTabla, 1000);
setInterval(cargarHorarios, 30000);
actualizarRelojFecha();
cargarHorarios();
