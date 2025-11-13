const API_URL = '/api/horarios';
const AUTH_URL = '/api/auth';
const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
let tokenAdmin = null;

const mostrarError = (mensaje) => {
    const errorElement = document.getElementById('error-login');
    errorElement.textContent = mensaje;
    errorElement.style.display = 'block';
};

const mostrarMensaje = (texto, tipo) => {
    const mensajeDiv = document.getElementById('mensaje-resultado');
    mensajeDiv.innerHTML = `<div class="mensaje ${tipo}">${texto}</div>`;
    setTimeout(() => mensajeDiv.innerHTML = '', 5000);
};

const iniciarSesion = async () => {
    const password = document.getElementById('password-input').value;
    
    if (!password) return mostrarError('Ingresa la contraseña');
    
    try {
        const respuesta = await fetch(AUTH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        const data = await respuesta.json();
        
        if (data.valido) {
            tokenAdmin = data.token;
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            cargarHorariosActuales();
        } else {
            mostrarError('Contraseña incorrecta');
        }
    } catch {
        mostrarError('Error de conexión');
    }
};

const cerrarSesion = () => {
    tokenAdmin = null;
    document.getElementById('login-screen').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('password-input').value = '';
};

const cargarHorariosActuales = async () => {
    try {
        const respuesta = await fetch(API_URL);
        const horarios = await respuesta.json();
        DIAS.forEach(dia => {
            document.getElementById(dia).value = horarios[dia].join('\n');
        });
    } catch {
        mostrarMensaje('Error al cargar horarios actuales', 'error');
    }
};

const procesarTexto = (texto) => texto.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const guardarHorarios = async () => {
    if (!tokenAdmin) return mostrarMensaje('No estás autenticado', 'error');
    
    const horarios = Object.fromEntries(
        DIAS.map(dia => [dia, procesarTexto(document.getElementById(dia).value)])
    );
    
    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            },
            body: JSON.stringify(horarios)
        });
        
        const data = await respuesta.json();
        mostrarMensaje(
            respuesta.ok ? '✅ Horarios guardados y publicados correctamente' : `❌ Error: ${data.error}`,
            respuesta.ok ? 'exito' : 'error'
        );
    } catch {
        mostrarMensaje('❌ Error de conexión con el servidor', 'error');
    }
};

const limpiarTodo = () => {
    if (confirm('¿Estás seguro de limpiar todos los horarios? Esta acción no se puede deshacer.')) {
        DIAS.forEach(dia => document.getElementById(dia).value = '');
        mostrarMensaje('⚠️ Formularios limpiados. No olvides guardar para aplicar cambios.', 'error');
    }
};
