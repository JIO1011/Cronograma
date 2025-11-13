# Buenas Prácticas - Cronograma

Este documento establece las mejores prácticas para el desarrollo del proyecto Cronograma, una aplicación web para gestionar y visualizar horarios de laboratorios en tiempo real.

## Tabla de Contenidos

1. [Estructura del Código](#estructura-del-código)
2. [Convenciones de Nomenclatura](#convenciones-de-nomenclatura)
3. [Control de Versiones con Git](#control-de-versiones-con-git)
4. [Seguridad](#seguridad)
5. [Pruebas](#pruebas)
6. [Rendimiento](#rendimiento)
7. [Accesibilidad](#accesibilidad)
8. [Documentación](#documentación)

## Estructura del Código

### Organización de Directorios

```
/
├── src/
│   ├── components/     # Componentes reutilizables de la UI
│   ├── pages/          # Vistas/páginas de la aplicación
│   ├── services/       # Lógica de negocio y llamadas API
│   ├── utils/          # Funciones utilitarias
│   ├── hooks/          # Custom hooks (React/Vue)
│   ├── styles/         # Estilos globales y temas
│   └── assets/         # Imágenes, fuentes, etc.
├── tests/              # Pruebas unitarias e integración
├── docs/               # Documentación adicional
└── config/             # Archivos de configuración
```

### Principios de Diseño

- **Separación de Responsabilidades**: Cada módulo debe tener una responsabilidad única y bien definida.
- **DRY (Don't Repeat Yourself)**: Evita la duplicación de código. Extrae lógica común en funciones/módulos reutilizables.
- **KISS (Keep It Simple, Stupid)**: Prioriza soluciones simples y claras sobre las complejas.
- **Modularidad**: Divide el código en módulos pequeños y manejables.

## Convenciones de Nomenclatura

### Archivos y Carpetas

- **Archivos de componentes**: PascalCase (ej: `ScheduleList.jsx`, `LabCard.vue`)
- **Utilidades y servicios**: camelCase (ej: `dateUtils.js`, `apiService.js`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_BASE_URL`, `MAX_RETRY_ATTEMPTS`)

### Variables y Funciones

```javascript
// ✓ Correcto
const scheduleList = [];
const totalLaboratories = 10;

function getScheduleById(id) {
  // ...
}

// ✗ Incorrecto
const schedule_list = [];
const TotalLaboratories = 10;

function get_schedule_by_id(id) {
  // ...
}
```

### Componentes y Clases

```javascript
// ✓ Correcto
class ScheduleManager {
  // ...
}

const ScheduleCard = () => {
  // ...
};

// ✗ Incorrecto
class schedule_manager {
  // ...
}

const schedulecard = () => {
  // ...
};
```

## Control de Versiones con Git

### Ramas (Branches)

- **main**: Rama principal con código estable de producción
- **develop**: Rama de desarrollo donde se integran nuevas características
- **feature/nombre-funcionalidad**: Para nuevas características
- **bugfix/descripcion-bug**: Para corrección de bugs
- **hotfix/descripcion-urgente**: Para correcciones urgentes en producción

### Commits

#### Estructura de Mensajes de Commit

```
<tipo>: <descripción breve>

[cuerpo opcional con más detalles]

[footer opcional con referencias]
```

#### Tipos de Commit

- **feat**: Nueva funcionalidad
- **fix**: Corrección de bug
- **docs**: Cambios en documentación
- **style**: Cambios de formato (espacios, comas, etc.)
- **refactor**: Refactorización de código
- **test**: Añadir o modificar tests
- **chore**: Tareas de mantenimiento

#### Ejemplos

```bash
# ✓ Correcto
git commit -m "feat: agregar filtro de búsqueda por laboratorio"
git commit -m "fix: corregir formato de fecha en horarios"
git commit -m "docs: actualizar guía de instalación"

# ✗ Incorrecto
git commit -m "cambios"
git commit -m "fix bug"
git commit -m "WIP"
```

### Pull Requests

- Usa títulos descriptivos
- Incluye descripción detallada de los cambios
- Referencia issues relacionados
- Solicita revisión de al menos un compañero
- Asegúrate de que pasen todas las pruebas antes de solicitar merge

## Seguridad

### Datos Sensibles

- **NUNCA** incluyas credenciales, claves API o contraseñas en el código
- Usa variables de entorno para información sensible
- Agrega archivos sensibles a `.gitignore`

```javascript
// ✓ Correcto
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;

// ✗ Incorrecto
const apiKey = "sk_test_1234567890abcdef";
const dbPassword = "miContraseña123";
```

### Validación de Datos

- Valida todas las entradas del usuario
- Sanitiza datos antes de mostrarlos o guardarlos
- Usa bibliotecas de validación establecidas

```javascript
// ✓ Correcto
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const sanitizedInput = DOMPurify.sanitize(userInput);
```

### Autenticación y Autorización

- Implementa autenticación robusta (JWT, OAuth, etc.)
- Verifica permisos en el backend, no solo en el frontend
- Usa HTTPS para todas las comunicaciones

### Dependencias

- Mantén las dependencias actualizadas
- Revisa regularmente vulnerabilidades conocidas
- Usa herramientas como `npm audit` o `snyk`

```bash
npm audit
npm audit fix
```

## Pruebas

### Tipos de Pruebas

1. **Pruebas Unitarias**: Prueban funciones/componentes aislados
2. **Pruebas de Integración**: Prueban la interacción entre módulos
3. **Pruebas End-to-End**: Prueban flujos completos de usuario

### Cobertura de Código

- Objetivo mínimo: 80% de cobertura
- Prioriza pruebas de lógica crítica de negocio
- Usa herramientas de cobertura (Jest, Istanbul)

### Ejemplo de Prueba Unitaria

```javascript
describe('ScheduleService', () => {
  test('debería obtener horarios por laboratorio', async () => {
    const labId = 'lab-001';
    const schedules = await getSchedulesByLab(labId);
    
    expect(schedules).toBeDefined();
    expect(schedules.length).toBeGreaterThan(0);
    expect(schedules[0].laboratoryId).toBe(labId);
  });
});
```

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con cobertura
npm test -- --coverage

# Ejecutar en modo watch
npm test -- --watch
```

## Rendimiento

### Frontend

1. **Optimización de Imágenes**: Comprime y usa formatos modernos (WebP)
2. **Lazy Loading**: Carga componentes y recursos bajo demanda
3. **Minimización**: Minimiza CSS, JavaScript y HTML
4. **Caché**: Implementa estrategias de caché efectivas
5. **Code Splitting**: Divide el código en chunks más pequeños

```javascript
// Lazy loading de componentes
const ScheduleDetail = lazy(() => import('./components/ScheduleDetail'));
```

### Backend

1. **Consultas Eficientes**: Optimiza queries de base de datos
2. **Índices**: Crea índices en campos de búsqueda frecuente
3. **Paginación**: Implementa paginación para grandes conjuntos de datos
4. **Caché**: Usa Redis u otro sistema de caché
5. **Rate Limiting**: Limita solicitudes para prevenir abuso

### Monitoreo

- Implementa logging estructurado
- Monitorea métricas clave (tiempo de respuesta, errores)
- Usa herramientas de monitoreo (New Relic, Datadog, etc.)

## Accesibilidad

### Principios WCAG

Sigue las pautas de accesibilidad web (WCAG 2.1 nivel AA):

1. **Perceptible**: Información y UI deben ser presentables para todos
2. **Operable**: Componentes de UI y navegación deben ser operables
3. **Comprensible**: Información y operación de UI deben ser comprensibles
4. **Robusto**: Contenido debe ser robusto para diferentes tecnologías

### Prácticas Recomendadas

```html
<!-- ✓ Correcto: Uso apropiado de ARIA y semántica -->
<button aria-label="Cerrar menú" onclick="closeMenu()">
  <svg aria-hidden="true">...</svg>
</button>

<nav aria-label="Navegación principal">
  <ul>
    <li><a href="/horarios">Horarios</a></li>
    <li><a href="/laboratorios">Laboratorios</a></li>
  </ul>
</nav>

<!-- ✗ Incorrecto: Falta de semántica y accesibilidad -->
<div onclick="closeMenu()">X</div>
```

### Contraste y Colores

- Mantén un contraste mínimo de 4.5:1 para texto normal
- 3:1 para texto grande (18pt+)
- No uses solo color para transmitir información

### Navegación por Teclado

- Todos los elementos interactivos deben ser accesibles por teclado
- Mantén un orden de tabulación lógico
- Proporciona indicadores visuales de foco

## Documentación

### Comentarios en el Código

```javascript
// ✓ Correcto: Comentarios útiles que explican el "por qué"
// Usamos un debounce de 300ms para evitar llamadas excesivas a la API
// cuando el usuario está escribiendo en el campo de búsqueda
const debouncedSearch = debounce(searchSchedules, 300);

/**
 * Obtiene los horarios disponibles para un laboratorio específico
 * @param {string} labId - ID del laboratorio
 * @param {Date} startDate - Fecha de inicio del rango
 * @param {Date} endDate - Fecha de fin del rango
 * @returns {Promise<Array>} Array de horarios disponibles
 */
async function getAvailableSchedules(labId, startDate, endDate) {
  // ...
}

// ✗ Incorrecto: Comentarios redundantes
// Esta función suma dos números
function add(a, b) {
  return a + b; // retorna la suma
}
```

### README y Documentación de Proyecto

- Mantén el README actualizado
- Incluye instrucciones de instalación y configuración
- Documenta APIs y endpoints
- Proporciona ejemplos de uso

### Documentación de API

```javascript
/**
 * @api {get} /api/schedules/:id Obtener horario por ID
 * @apiName GetSchedule
 * @apiGroup Schedules
 * 
 * @apiParam {String} id ID único del horario
 * 
 * @apiSuccess {String} id ID del horario
 * @apiSuccess {String} laboratoryId ID del laboratorio
 * @apiSuccess {Date} startTime Hora de inicio
 * @apiSuccess {Date} endTime Hora de fin
 * 
 * @apiError ScheduleNotFound El horario no fue encontrado
 */
```

## Herramientas Recomendadas

### Linting y Formateo

- **ESLint**: Para mantener consistencia en JavaScript
- **Prettier**: Para formateo automático de código
- **Stylelint**: Para estilos CSS consistentes

```bash
npm install --save-dev eslint prettier stylelint
```

### Pre-commit Hooks

Usa Husky para ejecutar verificaciones antes de commits:

```bash
npm install --save-dev husky lint-staged

# .husky/pre-commit
npm run lint
npm run test
```

## Conclusión

Estas buenas prácticas son lineamientos vivos que deben evolucionar con el proyecto. Todo el equipo debe revisarlas periódicamente y proponer mejoras basadas en experiencias y nuevas tecnologías.

---

**Última actualización**: Noviembre 2025
