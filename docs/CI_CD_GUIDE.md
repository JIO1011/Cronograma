# Guía de CI/CD - Cronograma

Esta guía documenta el pipeline de CI/CD implementado en `.github/workflows/ci.yml` y proporciona recomendaciones para configuración de producción.

## Tabla de Contenidos

1. [Resumen del Pipeline](#resumen-del-pipeline)
2. [Jobs Implementados](#jobs-implementados)
3. [Configuración Requerida](#configuración-requerida)
4. [Consideraciones Adicionales](#consideraciones-adicionales)
5. [Recomendaciones de Seguridad](#recomendaciones-de-seguridad)
6. [Monitoreo y Observabilidad](#monitoreo-y-observabilidad)
7. [Estrategia de Deployment](#estrategia-de-deployment)

## Resumen del Pipeline

El pipeline CI/CD implementa las siguientes fases:

```
┌─────────────┐
│   Push/PR   │
└──────┬──────┘
       │
       ├──────────┬──────────┬──────────┐
       ▼          ▼          ▼          ▼
   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
   │ Lint │  │ Test │  │ Sec  │  │Build │
   └───┬──┘  └───┬──┘  └───┬──┘  └───┬──┘
       │         │         │         │
       └────┬────┴────┬────┴─────────┘
            ▼         ▼
        ┌──────┐  ┌──────┐
        │ E2E  │  │ A11y │
        └───┬──┘  └───┬──┘
            │         │
            └────┬────┘
                 ▼
            ┌─────────┐
            │ Deploy  │
            └─────────┘
```

## Jobs Implementados

### 1. **Lint** - Análisis de Código
- ✅ ESLint para calidad de código JavaScript/TypeScript
- ✅ Prettier para consistencia de formato
- ✅ Análisis estático opcional

**Scripts requeridos en package.json:**
```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\""
  }
}
```

### 2. **Test** - Pruebas Automatizadas
- ✅ Tests unitarios con cobertura
- ✅ Tests de integración
- ✅ Matriz de versiones Node.js (16.x, 18.x, 20.x)
- ✅ Reportes de cobertura a Codecov

**Scripts requeridos:**
```json
{
  "scripts": {
    "test": "jest",
    "test:integration": "jest --config jest.integration.config.js"
  }
}
```

**Configuración de cobertura mínima (jest.config.js):**
```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 3. **Security** - Análisis de Seguridad
- ✅ npm audit para vulnerabilidades
- ✅ Snyk para análisis de dependencias
- ✅ CodeQL para análisis de código

**Secrets requeridos:**
- `SNYK_TOKEN`: Token de Snyk (registrarse en https://snyk.io)

### 4. **Build** - Construcción de Producción
- ✅ Build optimizado para producción
- ✅ Análisis de bundle size
- ✅ Generación de artefactos

**Scripts requeridos:**
```json
{
  "scripts": {
    "build": "vite build",  // o "react-scripts build", "next build", etc.
    "analyze:bundle": "source-map-explorer 'build/static/js/*.js'"
  }
}
```

### 5. **E2E** - Tests End-to-End
- ✅ Solo en PRs a main
- ✅ Playwright para tests E2E
- ✅ Retención de screenshots y videos

**Scripts requeridos:**
```json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

### 6. **Accessibility** - Pruebas de Accesibilidad
- ✅ Lighthouse CI para métricas
- ✅ axe-core para WCAG compliance

**Scripts requeridos:**
```json
{
  "scripts": {
    "test:a11y": "jest-axe"
  }
}
```

### 7. **Deploy Staging** - Deploy a Staging
- ✅ Solo en push a develop
- ✅ Smoke tests post-deploy
- ✅ Environment staging en GitHub

### 8. **Deploy Production** - Deploy a Producción
- ✅ Solo en push a main
- ✅ Requiere pasar todos los tests
- ✅ Creación automática de releases
- ✅ Smoke tests post-deploy

## Configuración Requerida

### Secrets de GitHub (Settings → Secrets and variables → Actions)

#### Para Seguridad:
```
SNYK_TOKEN              # Token de Snyk para análisis de seguridad
```

#### Para Deploy (Vercel):
```
VERCEL_TOKEN            # Token de autenticación Vercel
VERCEL_ORG_ID          # ID de organización Vercel
VERCEL_PROJECT_ID      # ID del proyecto Vercel
```

#### Para Deploy (Netlify) - Alternativa:
```
NETLIFY_AUTH_TOKEN     # Token de autenticación Netlify
NETLIFY_SITE_ID        # ID del sitio Netlify
```

#### Para Deploy (AWS) - Alternativa:
```
AWS_ACCESS_KEY_ID      # Clave de acceso AWS
AWS_SECRET_ACCESS_KEY  # Secret de AWS
S3_BUCKET              # Nombre del bucket S3
```

#### Para Notificaciones (Opcional):
```
SLACK_WEBHOOK_URL      # Webhook para notificaciones Slack
LHCI_GITHUB_APP_TOKEN  # Token para Lighthouse CI
```

### Variables de Environment

Configurar en GitHub: Settings → Environments

**Staging:**
- Name: `staging`
- URL: `https://staging.cronograma.app`
- Protection rules: Ninguna (deploy automático)

**Production:**
- Name: `production`
- URL: `https://cronograma.app`
- Protection rules:
  - ✅ Required reviewers (1-2 personas)
  - ✅ Wait timer: 5 minutos
  - ✅ Deployment branches: main only

## Consideraciones Adicionales

### 1. **Package.json Completo**

Asegúrate de tener todos los scripts necesarios:

```json
{
  "name": "cronograma",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:integration": "jest --config jest.integration.config.js",
    "test:e2e": "playwright test",
    "test:a11y": "jest-axe",
    "test:smoke": "playwright test smoke.spec.ts",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "analyze": "eslint . --ext .js,.jsx,.ts,.tsx --format json --output-file eslint-report.json",
    "analyze:bundle": "source-map-explorer 'dist/**/*.js'"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "eslint": "^8.55.0",
    "jest": "^29.7.0",
    "jest-axe": "^8.0.0",
    "prettier": "^3.1.0",
    "source-map-explorer": "^2.5.3"
  }
}
```

### 2. **Archivos de Configuración**

#### .eslintrc.json
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

#### .prettierrc
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

#### playwright.config.ts
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3. **Estructura de Directorios Recomendada**

```
cronograma/
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── utils/
├── tests/
│   ├── unit/
│   └── integration/
├── e2e/
│   ├── smoke.spec.ts
│   └── critical-paths.spec.ts
├── .eslintrc.json
├── .prettierrc
├── jest.config.js
├── playwright.config.ts
└── package.json
```

## Recomendaciones de Seguridad

### 1. **Secrets Management**
- ❌ NUNCA hagas commit de secrets en el código
- ✅ Usa GitHub Secrets para credenciales
- ✅ Rota secrets regularmente (cada 3-6 meses)
- ✅ Usa secrets específicos por environment

### 2. **Dependencias**
```bash
# Ejecutar regularmente
npm audit
npm audit fix

# Actualizar dependencias
npm outdated
npm update

# Usar Dependabot
# Configurar en .github/dependabot.yml
```

#### .github/dependabot.yml
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### 3. **Branch Protection**

Configurar en GitHub: Settings → Branches → Branch protection rules

Para `main`:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
  - lint
  - test
  - security
  - build
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings

### 4. **CodeQL Analysis**
- Ya incluido en el workflow
- Escanea automáticamente en cada push
- Revisa Security → Code scanning alerts

## Monitoreo y Observabilidad

### 1. **Métricas Recomendadas**

```javascript
// Integrar en producción
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 2. **Logging**

```javascript
// Usar structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### 3. **Performance Monitoring**

- ✅ Lighthouse CI en el pipeline
- ✅ Web Vitals tracking
- ✅ Real User Monitoring (RUM)

```javascript
// reportWebVitals.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Enviar a Google Analytics, Sentry, etc.
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Estrategia de Deployment

### GitFlow Simplificado

```
main (producción)
  ↑
  PR + Reviews + Tests
  ↑
develop (staging)
  ↑
  PR
  ↑
feature/* (desarrollo)
```

### Proceso de Deploy

1. **Desarrollo**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   # ... desarrollar ...
   git push origin feature/nueva-funcionalidad
   # Crear PR a develop
   ```

2. **Staging**
   ```bash
   # Merge PR a develop
   # CI/CD automáticamente deploya a staging
   # Validar en https://staging.cronograma.app
   ```

3. **Producción**
   ```bash
   # Crear PR de develop a main
   # Requiere revisión y todos los tests
   # CI/CD automáticamente deploya a producción
   # Crea release tag automáticamente
   ```

### Rollback Strategy

Si hay problemas en producción:

```bash
# Opción 1: Revertir último commit
git revert HEAD
git push origin main

# Opción 2: Revertir a versión anterior
git reset --hard <commit-anterior>
git push --force origin main  # Requiere permisos especiales

# Opción 3: Deployment manual de versión anterior
# Desde GitHub → Releases → Re-run deployment
```

## Optimizaciones Adicionales

### 1. **Cache de Dependencias**
El workflow ya usa caché de npm automáticamente con `actions/setup-node@v4`.

### 2. **Parallel Jobs**
Los jobs lint, test, y security corren en paralelo para velocidad.

### 3. **Conditional Jobs**
- E2E solo en PRs a main
- Deploy staging solo en develop
- Deploy producción solo en main

### 4. **Concurrency Control**
El workflow cancela ejecuciones anteriores si hay un nuevo push.

## Checklist Pre-Producción

Antes de ir a producción, verifica:

- [ ] Todos los secrets están configurados
- [ ] Environments (staging/production) están creados
- [ ] Branch protection rules están activas
- [ ] Dependabot está configurado
- [ ] Monitoreo (Sentry/similar) está configurado
- [ ] Analytics está configurado
- [ ] Dominio y DNS están configurados
- [ ] Certificado SSL/TLS está activo
- [ ] Variables de entorno de producción están configuradas
- [ ] Backup strategy está definida
- [ ] Disaster recovery plan existe
- [ ] Equipo sabe cómo hacer rollback
- [ ] Documentación está actualizada
- [ ] Performance benchmarks están establecidos
- [ ] Alertas y notificaciones están configuradas

## Recursos Adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Última actualización**: Enero 2026
