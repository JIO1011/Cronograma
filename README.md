# Sistema de Horarios UPS - Prácticas de Laboratorio

**Sistema web de "Digital Signage" desarrollado con Next.js y Tailwind CSS para mostrar en tiempo real los horarios de laboratorios de la Universidad Politécnica Salesiana. Cuenta con una vista pública de pantalla única que se actualiza automáticamente y filtra las clases por proximidad de horario (usando indicadores de color), junto con un panel de administración seguro que permite a los coordinadores cargar los horarios de manera masiva mediante formato CSV.**

Un sistema web de pantalla única (Digital Signage) diseñado para mostrar en tiempo real los horarios de prácticas de laboratorio de la Universidad Politécnica Salesiana (UPS). El sistema está optimizado para ser visualizado en pantallas de pasillos o laboratorios sin necesidad de interacción manual (no-scroll).

## 🚀 Características Principales

El proyecto se divide en dos módulos principales:

### 1. Vista Pública (Digital Signage)
- **Pantalla Única:** Diseño responsivo que se ajusta al 100% del alto de la pantalla, eliminando la necesidad de hacer scroll.
- **Reloj en Tiempo Real:** Muestra la hora exacta y la fecha actual en formato extendido.
- **Filtro de Proximidad Inteligente:** No satura la pantalla con todo el horario del día. Solo muestra las clases relevantes que están por iniciar (hasta 20 minutos antes) o que acaban de empezar (hasta 120 minutos después).
- **Indicadores de Estado por Color:**
  - 🟢 **Verde:** Ingreso habilitado (clase próxima a iniciar).
  - 🟡 **Amarillo:** Iniciando ahora (0-7 minutos desde la hora de inicio).
  - 🔴 **Rojo:** En curso o finalizada (más de 7 minutos).
- **Sincronización Automática:** La pantalla hace *polling* cada 30 segundos al servidor para reflejar los cambios realizados por coordinación sin necesidad de recargar la página manualmente.

### 2. Panel de Administración
- **Acceso Seguro:** Protegido mediante login con contraseña y cookies seguras.
- **Carga Masiva (CSV):** Permite a los coordinadores actualizar los horarios de cualquier día (Lunes a Viernes) simplemente pegando texto en formato CSV (`MATERIA,PROFESOR,LABORATORIO,HORA,ENCARGADO`).
- **Vista Previa:** Muestra una tabla con los horarios actualmente guardados en el sistema para facilitar la verificación.

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Iconos:** Lucide React
- **Procesamiento de Datos:** PapaParse (para la lectura de CSV)
- **Manejo de Fechas:** date-fns

## 📁 Estructura del Proyecto

- `/app/page.tsx`: Vista pública principal (Digital Signage).
- `/app/admin/page.tsx`: Panel de administración protegido.
- `/app/api/*`: Endpoints del backend (estado, horarios, login).
- `/components/*`: Componentes reutilizables (Reloj, Tabla de Horarios).
- `/lib/store.ts`: Almacenamiento en memoria del servidor para sincronización entre clientes.
- `/middleware.ts`: Protección de rutas administrativas.

## ⚙️ Endpoints de la API

- `GET /api/estado`: Endpoint de monitoreo para verificar que el servidor está activo.
- `GET /api/horarios`: Retorna el JSON con todos los horarios guardados.
- `POST /api/horarios`: (Protegido) Sobrescribe los horarios de un día específico.
- `POST /api/login`: Autentica al administrador y establece la cookie de sesión.

## 📝 Formato de Carga (CSV)

Para actualizar los horarios en el panel de administración, se debe usar el siguiente formato sin encabezados:

```csv
Anatomía 1,Biomedicina - Kerly Bolaños,ANATOMÍA,07:00,FERNANDO VELASCO
Microbiología 1,Odontología - Willy Bustillos,MICROBIOLOGÍA,07:00,TANIA ZURITA
Sistemas Electrónicos,Biomedicina - Santiago Nuñez,BIOINSTRUMENTACIÓN,09:00,FERNANDO VELASCO
```

## 🔒 Notas de Seguridad y Despliegue

Actualmente, el sistema utiliza almacenamiento en memoria (`lib/store.ts`) y una contraseña estática en el código para facilitar el despliegue rápido en contenedores simples (como un solo instance de Cloud Run). 

Para entornos de producción con múltiples instancias o requerimientos de persistencia a largo plazo, se recomienda conectar el store a una base de datos real (como PostgreSQL, Redis o Firebase) y utilizar variables de entorno (`.env`) para la gestión de contraseñas.
