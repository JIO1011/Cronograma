# 🎓 Sistema de Horarios de Laboratorio - UPS

Aplicación web moderna para gestionar y visualizar horarios de laboratorios en tiempo real.

## 📋 Características

- ✅ **Vista pública** para estudiantes (solo lectura)
- ✅ **Panel de administración** protegido con contraseña
- ✅ **Actualización en tiempo real** con colores automáticos
- ✅ **Sistema de colores inteligente:**
  - 🟢 Verde: Clase próxima (7-10 min)
  - 🟡 Amarillo: Iniciando ahora (0-7 min)
  - 🔴 Rojo: Clase pasada
  - ⚪ Blanco: Clase futura
- ✅ **Filtrado automático** (muestra solo clases cercanas ±2 horas)
- ✅ **Responsive** (funciona en móviles, tablets y escritorio)

## 🚀 Instalación

### Requisitos previos
- Node.js 14 o superior
- npm

### Pasos de instalación

1. **Navegar a la carpeta del proyecto**
   ```powershell
   cd C:\Users\jinlago\Documents\horarios-laboratorio
   ```

2. **Instalar dependencias**
   ```powershell
   npm install
   ```

3. **Configurar contraseña de administrador**
   - Editar el archivo `.env`
   - Cambiar `ADMIN_PASSWORD=admin123` por tu contraseña segura

4. **Iniciar el servidor**
   ```powershell
   npm start
   ```

5. **Acceder a la aplicación**
   - Vista pública: http://localhost:3000
   - Panel admin: http://localhost:3000/admin.html

## 📝 Formato de Datos

Cada clase debe ingresarse en el siguiente formato (separado por comas):

```
MATERIA,PROFESOR,LABORATORIO,HORA,ENCARGADO
```

**Ejemplo:**
```
FISIOLOGÍA (1G7A),ODONTO-PINEDA S.,HISTOLOGÍA BUCODENTAL B31,09:00,Jorge
ANATOMÍA,Dr. LÓPEZ M.,LAB A12,11:00,María
BIOQUÍMICA,Dra. PÉREZ A.,LAB B05,14:00,Jorge
```

**Importante:**
- La hora debe estar en formato 24h (HH:MM)
- Una clase por línea
- No dejar espacios al inicio o final

## 🔧 Uso del Panel de Administración

1. Acceder a http://localhost:3000/admin.html
2. Ingresar la contraseña configurada en `.env`
3. Ingresar los horarios por día
4. Click en "💾 GUARDAR Y PUBLICAR"
5. Los cambios se reflejan instantáneamente en la vista pública

## 🌐 Despliegue en Servidor Linux Ubuntu (Red Local)

### 📦 Requisitos del Servidor
- Ubuntu 20.04 o superior
- Acceso root o sudo
- Conexión a internet (para instalación inicial)

### 🔧 Paso 1: Preparar el Servidor Ubuntu

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version

# Instalar Git (para transferir archivos)
sudo apt install -y git
```

### 📂 Paso 2: Transferir el Proyecto al Servidor

**Opción A: Usando SCP desde Windows**
```powershell
# Desde tu PC Windows (en PowerShell)
# Reemplaza: usuario, ip-servidor, /ruta/destino
scp -r C:\Users\jinlago\Documents\horarios-laboratorio usuario@ip-servidor:/home/usuario/
```

**Opción B: Usando Git**
```bash
# En el servidor Ubuntu
cd /home/usuario
git clone <url-repositorio> horarios-laboratorio
```

**Opción C: Usando WinSCP o FileZilla**
- Conectar al servidor Ubuntu con WinSCP/FileZilla
- Copiar la carpeta `horarios-laboratorio` a `/home/usuario/`

### ⚙️ Paso 3: Configurar la Aplicación

```bash
# Navegar al proyecto
cd /home/usuario/horarios-laboratorio

# Instalar dependencias
npm install

# Crear archivo .env
nano .env
```

**Contenido del archivo `.env`:**
```env
PORT=3000
ADMIN_PASSWORD=TuContraseñaSegura123
```

Guardar: `Ctrl + O`, `Enter`, salir: `Ctrl + X`

```bash
# Crear carpeta de datos
mkdir -p data

# Dar permisos
chmod -R 755 /home/usuario/horarios-laboratorio
```

### 🚀 Paso 4: Instalar y Configurar PM2

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar la aplicación
pm2 start server.js --name horarios-ups

# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs horarios-ups

# Configurar inicio automático al reiniciar el servidor
pm2 startup systemd
# Copiar y ejecutar el comando que PM2 te muestra

# Guardar configuración
pm2 save
```

### 🌐 Paso 5: Configurar Acceso en Red Local

**Verificar IP del servidor:**
```bash
ip addr show
# Buscar la IP local (ejemplo: 192.168.1.100)
```

**Configurar firewall (si está activo):**
```bash
# Permitir el puerto 3000
sudo ufw allow 3000/tcp

# Ver estado del firewall
sudo ufw status
```

### 🔗 Paso 6: Acceder desde la Red Local

Desde cualquier PC en la misma red:
- Vista pública: `http://192.168.1.100:3000`
- Panel admin: `http://192.168.1.100:3000/admin.html`

*(Reemplaza `192.168.1.100` con la IP real de tu servidor)*

### 🎯 Paso 7: Configurar Puerto 80 (Opcional)

Para acceder sin el puerto `:3000`:

```bash
# Instalar Nginx
sudo apt install -y nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/horarios-ups
```

**Contenido del archivo:**
```nginx
server {
    listen 80;
    server_name 192.168.1.100;  # IP de tu servidor

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar configuración
sudo ln -s /etc/nginx/sites-available/horarios-ups /etc/nginx/sites-enabled/

# Eliminar configuración por defecto
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Habilitar inicio automático
sudo systemctl enable nginx
```

Ahora puedes acceder: `http://192.168.1.100` (sin puerto)

### 🔄 Comandos de Mantenimiento

```bash
# Ver estado de la aplicación
pm2 status

# Reiniciar aplicación
pm2 restart horarios-ups

# Detener aplicación
pm2 stop horarios-ups

# Ver logs
pm2 logs horarios-ups

# Ver logs en tiempo real
pm2 logs horarios-ups --lines 100

# Monitorear recursos
pm2 monit

# Reiniciar servidor Ubuntu
sudo reboot
# PM2 iniciará automáticamente la app al reiniciar
```

### 💾 Backup de Datos

```bash
# Hacer backup del archivo de horarios
cp /home/usuario/horarios-laboratorio/data/horarios.json \
   /home/usuario/backup-horarios-$(date +%Y%m%d).json

# Automatizar backup diario (opcional)
# Editar crontab
crontab -e

# Agregar esta línea (backup a las 2 AM todos los días)
0 2 * * * cp /home/usuario/horarios-laboratorio/data/horarios.json /home/usuario/backup-horarios-$(date +\%Y\%m\%d).json
```

### 🐛 Solución de Problemas

**La aplicación no inicia:**
```bash
pm2 logs horarios-ups --err
```

**No puedo acceder desde otros PCs:**
```bash
# Verificar que el servidor escucha en todas las interfaces
netstat -tuln | grep 3000

# Verificar firewall
sudo ufw status

# Desactivar firewall temporalmente (para pruebas)
sudo ufw disable
```

**Actualizar la aplicación:**
```bash
cd /home/usuario/horarios-laboratorio
pm2 stop horarios-ups
git pull  # O copiar archivos nuevos
npm install
pm2 restart horarios-ups
```

### 📊 Verificar que Todo Funciona

```bash
# 1. Verificar Node.js
node --version

# 2. Verificar PM2
pm2 status

# 3. Verificar que la app responde
curl http://localhost:3000/api/estado

# 4. Verificar Nginx (si lo instalaste)
sudo systemctl status nginx
```

---

**✅ ¡Despliegue Completo!** Tu aplicación ahora está corriendo 24/7 en el servidor Ubuntu.

## 📁 Estructura del Proyecto

```
horarios-laboratorio/
├── server.js              # Backend API REST
├── package.json           # Dependencias
├── .env                   # Configuración (contraseña)
├── data/
│   └── horarios.json      # Datos almacenados
└── public/                # Frontend
    ├── index.html         # Vista pública
    ├── admin.html         # Panel admin
    ├── css/
    │   └── styles.css     # Estilos
    └── js/
        ├── app.js         # Cliente público
        └── admin.js       # Cliente admin
```

## 🔒 Seguridad

- ✅ Panel admin protegido con contraseña
- ✅ API POST requiere autenticación
- ✅ Vista pública sin autenticación (solo lectura)
- ⚠️ **Cambiar la contraseña por defecto en `.env`**

## 🛠️ Mantenimiento

### Ver logs del servidor
```powershell
pm2 logs horarios-ups
```

### Reiniciar servidor
```powershell
pm2 restart horarios-ups
```

### Detener servidor
```powershell
pm2 stop horarios-ups
```

### Backup de datos
El archivo `data/horarios.json` contiene todos los horarios. Hacer backup regularmente.

## 📞 Soporte

Desarrollado por: **JIO**  
Universidad Politécnica Salesiana  
Año: 2025

---

**¡Listo para usar!** 🚀
