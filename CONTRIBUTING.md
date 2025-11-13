# Guía de Contribución - Cronograma

¡Gracias por tu interés en contribuir a Cronograma! Este documento proporciona directrices para contribuir al proyecto.

## Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
3. [Proceso de Desarrollo](#proceso-de-desarrollo)
4. [Estándares de Código](#estándares-de-código)
5. [Proceso de Pull Request](#proceso-de-pull-request)
6. [Reportar Bugs](#reportar-bugs)
7. [Sugerir Mejoras](#sugerir-mejoras)

## Código de Conducta

Este proyecto se adhiere a un Código de Conducta. Al participar, se espera que lo respetes. Por favor, lee [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) para más detalles.

## ¿Cómo Puedo Contribuir?

Hay muchas formas de contribuir a Cronograma:

- 🐛 Reportar bugs
- 💡 Sugerir nuevas características
- 📝 Mejorar la documentación
- 🔧 Corregir bugs existentes
- ✨ Implementar nuevas características
- 🧪 Escribir o mejorar tests
- 👀 Revisar Pull Requests

## Proceso de Desarrollo

### 1. Fork y Clone

```bash
# Haz fork del repositorio desde GitHub

# Clona tu fork
git clone https://github.com/TU_USUARIO/Cronograma.git
cd Cronograma

# Agrega el repositorio original como upstream
git remote add upstream https://github.com/JIO1011/Cronograma.git
```

### 2. Configura tu Entorno

```bash
# Instala las dependencias
npm install

# Copia el archivo de configuración de ejemplo
cp .env.example .env

# Edita .env con tus configuraciones locales
```

### 3. Crea una Rama

Crea una rama para tu trabajo siguiendo la convención de nombres:

```bash
# Para nuevas características
git checkout -b feature/nombre-descriptivo

# Para corrección de bugs
git checkout -b bugfix/descripcion-bug

# Para mejoras en documentación
git checkout -b docs/descripcion-mejora
```

### 4. Desarrolla

- Escribe código limpio y legible
- Sigue las [Buenas Prácticas](BEST_PRACTICES.md)
- Agrega tests para nuevo código
- Actualiza la documentación si es necesario

### 5. Prueba tu Código

```bash
# Ejecuta tests
npm test

# Ejecuta linter
npm run lint

# Ejecuta el proyecto localmente
npm run dev
```

### 6. Commit

Sigue las convenciones de commit del proyecto:

```bash
git add .
git commit -m "feat: descripción breve de tu cambio"
```

Tipos de commit:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, punto y coma faltante, etc
- `refactor`: Refactorización de código
- `test`: Agregar tests faltantes
- `chore`: Actualizar tareas de build, configuración, etc

### 7. Mantén tu Fork Actualizado

```bash
# Obtén los últimos cambios del repositorio original
git fetch upstream

# Merge cambios de main
git checkout main
git merge upstream/main

# Actualiza tu rama de trabajo
git checkout feature/tu-caracteristica
git rebase main
```

### 8. Push y Pull Request

```bash
# Push a tu fork
git push origin feature/tu-caracteristica

# Ve a GitHub y crea un Pull Request desde tu fork
```

## Estándares de Código

### JavaScript/TypeScript

- Usa sintaxis ES6+ moderna
- Sigue las reglas de ESLint configuradas
- Usa nombres descriptivos para variables y funciones
- Escribe funciones pequeñas y enfocadas

```javascript
// ✓ Correcto
const calculateTotalHours = (schedule) => {
  return schedule.reduce((total, entry) => {
    const hours = (entry.endTime - entry.startTime) / 3600000;
    return total + hours;
  }, 0);
};

// ✗ Incorrecto
const calc = (s) => {
  let t = 0;
  for (let i = 0; i < s.length; i++) {
    t += (s[i].e - s[i].s) / 3600000;
  }
  return t;
};
```

### HTML/CSS

- Usa semántica HTML5
- Sigue metodología BEM para clases CSS
- Usa CSS moderno (Flexbox, Grid)
- Asegura accesibilidad (ARIA, alt text, etc.)

```html
<!-- ✓ Correcto -->
<article class="schedule-card">
  <header class="schedule-card__header">
    <h2 class="schedule-card__title">Laboratorio A</h2>
  </header>
  <div class="schedule-card__content">
    <time datetime="2025-11-13T09:00">9:00 AM</time>
  </div>
</article>

<!-- ✗ Incorrecto -->
<div class="sc">
  <div class="sc-h">
    <div class="title">Laboratorio A</div>
  </div>
  <div class="sc-c">
    <span>9:00 AM</span>
  </div>
</div>
```

### Tests

- Escribe tests para toda lógica nueva
- Usa nombres descriptivos para tests
- Sigue el patrón AAA (Arrange, Act, Assert)

```javascript
describe('ScheduleService', () => {
  describe('getAvailableSlots', () => {
    it('debería retornar slots disponibles para fecha válida', async () => {
      // Arrange
      const date = new Date('2025-11-13');
      const labId = 'lab-001';
      
      // Act
      const slots = await getAvailableSlots(labId, date);
      
      // Assert
      expect(slots).toBeDefined();
      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0]).toHaveProperty('startTime');
      expect(slots[0]).toHaveProperty('endTime');
    });

    it('debería retornar array vacío si no hay slots disponibles', async () => {
      const date = new Date('2025-12-25'); // Día festivo
      const labId = 'lab-001';
      
      const slots = await getAvailableSlots(labId, date);
      
      expect(slots).toEqual([]);
    });
  });
});
```

## Proceso de Pull Request

### Antes de Crear el PR

✅ Checklist:

- [ ] El código compila sin errores
- [ ] Todos los tests pasan
- [ ] Se agregaron tests para nuevo código
- [ ] El código sigue los estándares del proyecto
- [ ] La documentación está actualizada
- [ ] Los commits siguen la convención
- [ ] La rama está actualizada con main

### Crear el Pull Request

1. **Título Descriptivo**: Usa formato `tipo: descripción breve`
   ```
   feat: agregar filtro de búsqueda por fecha
   ```

2. **Descripción Completa**: Incluye:
   - Qué cambia este PR
   - Por qué es necesario
   - Cómo se probó
   - Screenshots (si aplica)
   - Referencias a issues relacionados

3. **Plantilla de PR**:
   ```markdown
   ## Descripción
   Breve descripción de los cambios

   ## Tipo de Cambio
   - [ ] Bug fix
   - [ ] Nueva característica
   - [ ] Breaking change
   - [ ] Documentación

   ## ¿Cómo se Probó?
   Describe las pruebas realizadas

   ## Checklist
   - [ ] Tests pasan localmente
   - [ ] Código sigue estándares del proyecto
   - [ ] Documentación actualizada
   - [ ] Sin conflictos con main

   ## Screenshots (si aplica)

   ## Issues Relacionados
   Fixes #123
   ```

### Durante la Revisión

- Responde a comentarios constructivamente
- Realiza cambios solicitados prontamente
- Mantén la discusión enfocada y profesional
- Haz push de cambios a la misma rama

### Después del Merge

- Elimina tu rama local y remota
- Actualiza tu fork con los cambios de main
- ¡Celebra tu contribución! 🎉

## Reportar Bugs

### Antes de Reportar

- Verifica que el bug no haya sido reportado antes
- Confirma que el bug existe en la última versión
- Recopila información sobre el bug

### Crear un Reporte de Bug

Usa esta plantilla:

```markdown
## Descripción del Bug
Descripción clara y concisa del bug

## Pasos para Reproducir
1. Ve a '...'
2. Haz click en '...'
3. Scroll hasta '...'
4. Observa el error

## Comportamiento Esperado
Describe qué esperabas que sucediera

## Comportamiento Actual
Describe qué sucedió realmente

## Screenshots
Si aplica, agrega screenshots

## Entorno
- OS: [ej: Windows 10, macOS 12.0]
- Navegador: [ej: Chrome 95, Firefox 94]
- Versión: [ej: 1.2.3]

## Información Adicional
Cualquier otro contexto relevante
```

## Sugerir Mejoras

### Proponer Nueva Característica

```markdown
## Resumen de la Característica
Descripción breve de la característica propuesta

## Motivación
¿Por qué esta característica es útil?
¿Qué problema resuelve?

## Descripción Detallada
Descripción completa de cómo debería funcionar

## Alternativas Consideradas
¿Qué otras soluciones consideraste?

## Información Adicional
Screenshots, mockups, ejemplos, etc.
```

## Preguntas

Si tienes preguntas, puedes:

- Revisar la [documentación](README.md)
- Buscar en issues cerrados
- Crear un nuevo issue con la etiqueta `question`
- Contactar a los mantenedores

## Reconocimientos

Todas las contribuciones son valoradas y reconocidas. Los contribuidores serán listados en el archivo CONTRIBUTORS.md.

---

¡Gracias por contribuir a Cronograma! 🚀
