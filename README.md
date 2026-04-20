# 🎓 Sistema de Horarios de Laboratorio - UPS (Next.js V2)

Aplicación web moderna para gestionar y visualizar horarios de laboratorios en tiempo real. Esta es la **Versión 2** desarrollada bajo la arquitectura de **Next.js (App Router)**.

## 📋 Características

- ✅ **Vista pública** para estudiantes (solo lectura)
- ✅ **Panel de administración** protegido con contraseña
- ✅ **Actualización en tiempo real** con colores automáticos
- ✅ **Sistema de colores inteligente:**
  - 🟢 Verde: Clase próxima (7-10 min)
  - 🟡 Amarillo: Iniciando ahora (0-7 min)
  - 🔴 Rojo: Clase pasada
  - ⚪ Blanco: Clase futura
- ✅ **Filtrado automático**
- ✅ **Responsive** (funciona en móviles, tablets y escritorio)
- ⚡ **Stack Moderno:** Next.js 15, TypeScript, Tailwind CSS, Lucide React.

## 🚀 Instalación y Despliegue Local

### Requisitos previos
- Node.js 18 o superior
- npm

### Pasos de instalación

1. **Navegar a la carpeta del proyecto**
   ```bash
   cd /ruta/a/tu/proyecto
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar contraseña de administrador**
   La contraseña ya no se maneja por un archivo `.env` inicialmente. Por simplicidad, se encuentra alojada en el código fuente:
   - Ve al archivo `app/api/login/route.ts`
   - Cambia la constante `const ADMIN_PASSWORD = 'admin';` por la contraseña deseada.

4. **Compilar la aplicación para producción**
   Al ser un proyecto Next.js, se necesita compilar antes de ejecutar en producción:
   ```bash
   npm run build
   ```

5. **Iniciar el servidor**
   ```bash
   npm run start
   ```

6. **Acceder a la aplicación**
   - Vista pública: http://localhost:3000
   - Panel admin: http://localhost:3000/admin (Nota: ha cambiado de `admin.html` a la ruta `/admin`)

## 📝 Formato de Datos

*(Nota: Importar los datos sigue la misma mecánica o archivos provistos en la interfaz de administrador de la plataforma)*

## 🌐 Despliegue en Servidor Linux Ubuntu (Red Local)

### 📦 Requisitos del Servidor
- Ubuntu 20.04 o superior
- Acceso root o sudo

### 🔧 Paso 1: Preparar el Servidor Ubuntu

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18.x (LTS) o superior
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Git
sudo apt install -y git
```

### 📂 Paso 2: Transferir el Proyecto

Usa SCP, FileZilla o `git clone` para trasladar el proyecto a `/home/usuario/horarios-laboratorio`.
*(Verifica que poseas una copia local de tus variables de entorno si en el futuro decides añadirlas)*.

### ⚙️ Paso 3: Configurar y Compilar

```bash
# Navegar al proyecto
cd /home/usuario/horarios-laboratorio

# Instalar dependencias
npm install

# Compilar proyecto Next.js (MANDATORIO PARA PRODUCCIÓN)
npm run build
```

### 🚀 Paso 4: Instalar y Configurar PM2

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar la aplicación en modo Next.js con PM2
pm2 start npm --name "horarios-ups" -- start

# Ver estado
pm2 status

# Configurar inicio automático
pm2 startup systemd
pm2 save
```

### 🌐 Paso 5: Configurar Acceso en Red Local

**Verificar IP del servidor:**
```bash
ip addr show
```

**Configurar firewall (si está activo):**
```bash
sudo ufw allow 3000/tcp
```
Acceso: `http://192.168.1.100:3000` (Modifica la IP por tu IP de servidor local).

### 🎯 Paso 6: Reverse Proxy (Opcional - Puerto 80)

Si usas Nginx, la configuración es la misma de la V1, apuntando `proxy_pass http://localhost:3000;`. No hay variación en esto.

### ⚠️ AVISO IMPORTANTE: Almacenamiento de Datos (V2)

En esta nueva versión V2 (Next.js), el almacenamiento fue rediseñado (según `lib/store.ts`):
- Los datos se guardan **EN MEMORIA RAM** del servidor local, no en un archivo `data/horarios.json`.
- **Efecto:** Si reinicias la aplicación con PM2 o el servidor principal se apaga, **perderás el horario cargado** y tendrás que volver a enviarlo o cargarlo desde el panel `/admin`. 
- *(Para tener persistencia, se debe integrar o modificar `lib/store.ts` para conectar con PostgreSQL, Firebase u otro recurso)*.

### 🔄 Comandos de Mantenimiento

```bash
pm2 restart horarios-ups  # Reinicia y BORRA in-memory store
pm2 logs horarios-ups
pm2 monit
```

## 📁 Estructura del Proyecto V2

```text
horarios-laboratorio/
├── app/                   # Next.js App Router (Páginas y APIs)
│   ├── api/               # Backend en Next.js (rutas /api/estado, /api/login...)
│   ├── admin/             # Panel de administración (Frontend)
│   ├── page.tsx           # Vista principal (Frontend)
│   └── globals.css        # Estilos globales y Tailwind
├── components/            # Componentes React (Clock, ScheduleTable...)
├── hooks/                 # Hooks personalizados de lógica
├── lib/                   # Librerías, tipos y Store (Almacenamiento)
├── package.json           # Dependencias
├── next.config.ts         # Configuración del compilador de Next
└── tsconfig.json          # Configuración de TypeScript
```

## 🔒 Seguridad

- ✅ Panel admin en la ruta `/admin` protegido con sesión cifrada vía `Next/Cookies` (JWT/Cookies).
- ✅ Credenciales alojadas en el endpoint `app/api/login/route.ts`.
- ✅ Vista pública (`/`) de recolección de datos libre para usuarios. 

## 📞 Soporte

Desarrollado y mantenido por: **JIO**  
Universidad Politécnica Salesiana  
Año: 2025
