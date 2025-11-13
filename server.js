const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DATA_FILE = path.join(__dirname, 'data', 'horarios.json');
const DIAS_VALIDOS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
const HORARIOS_VACIO = Object.fromEntries(DIAS_VALIDOS.map(d => [d, []]));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Utilidades
const leerHorarios = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return { ...HORARIOS_VACIO };
    }
};

const guardarHorarios = async (horarios) => 
    await fs.writeFile(DATA_FILE, JSON.stringify(horarios, null, 2));

const validarLinea = (linea) => {
    if (!linea.trim()) return true;
    const partes = linea.split(',');
    return partes.length === 5 && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(partes[3].trim());
};

const autenticar = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token !== ADMIN_PASSWORD) return res.status(401).json({ error: 'No autorizado' });
    next();
};

// Rutas
app.get('/admin', (req, res) => res.redirect('/admin.html'));

app.get('/api/horarios', async (req, res) => {
    try {
        res.json(await leerHorarios());
    } catch {
        res.status(500).json({ error: 'Error al leer horarios' });
    }
});

app.post('/api/horarios', autenticar, async (req, res) => {
    try {
        const horarios = req.body;
        
        for (const dia of DIAS_VALIDOS) {
            if (!Array.isArray(horarios[dia])) {
                return res.status(400).json({ error: `Día "${dia}" debe ser un array` });
            }
            for (const linea of horarios[dia]) {
                if (!validarLinea(linea)) {
                    return res.status(400).json({ 
                        error: `Formato inválido en ${dia}: "${linea}"\nFormato: MATERIA,PROFESOR,LAB,HORA,ENCARGADO` 
                    });
                }
            }
        }
        
        await guardarHorarios(horarios);
        res.json({ mensaje: 'Horarios actualizados correctamente' });
    } catch {
        res.status(500).json({ error: 'Error al guardar horarios' });
    }
});

app.post('/api/auth', (req, res) => {
    const { password } = req.body;
    const valido = password === ADMIN_PASSWORD;
    res.status(valido ? 200 : 401).json({ 
        ...(valido && { token: ADMIN_PASSWORD }), 
        valido,
        ...(!valido && { error: 'Contraseña incorrecta' })
    });
});

app.get('/api/estado', (req, res) => {
    res.json({ estado: 'activo', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   HORARIOS DE LABORATORIO - UPS               ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║   Servidor: http://localhost:${PORT.toString().padEnd(20)} ║`);
    console.log(`║   Admin: http://localhost:${PORT}/admin${' '.repeat(13)} ║`);
    console.log('╚════════════════════════════════════════════════╝');
});
