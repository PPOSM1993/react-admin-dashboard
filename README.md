# React Admin Dashboard – Sistema de Gestión Completo

Aplicación web frontend desarrollada con **React JS** y **Tailwind CSS** para gestión de productos, reportes, trabajadores, inventarios, órdenes y más.

---

## 🧾 Descripción

Esta aplicación es un sistema completo de administración que incluye funcionalidades modernas para gestionar múltiples módulos de forma eficiente:

- 🔐 Autenticación con login, registro y recuperación de contraseña.
- 🌓 Tema oscuro / claro con persistencia usando localStorage.
- 💬 Modales animados para creación, edición, visualización y eliminación de registros.
- 📊 Listados con paginación, ordenamiento y filtros por categoría, estado, fecha, etc.
- 📱 Diseño 100% responsive.
- ⚙️ Validación de formularios con mensajes de error en tiempo real.
- 🔗 Botón de login con Google (simulado, sin conexión real).
- 🎨 Interfaz profesional y amigable al usuario.

---

## 🚀 Tecnologías Usadas
- ⚡ React + Vite
- 🎨 Tailwind CSS (modo oscuro y claro)
- 📊 Lucide Icons + Framer Motion
- 🧠 Componentes modulares: Usuarios, Productos, Ventas, Reportes, Pagos, OT y más
- ✅ Modal de creación, edición, eliminación y visualización
- 🧱 Sidebar responsivo con roles
- 💡 Header con modo oscuro y logout
- 📱 100% Responsive


---

## 📦 Instalación y Ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/react-admin-dashboard.git
   cd react-admin-dashboard

npm install
# Instala las dependencias necesarias

npm run dev
# Inicia el servidor de desarrollo en modo local

http://localhost:5173
# Abrir navegador y escribir la URL para ver la aplicación en acción

📂 Estructura del Proyecto
react-admin-dashboard/
├── node_modules/             # Dependencias instaladas
├── public/                   # Archivos públicos (favicon, etc.)
├── src/                      # Carpeta principal del proyecto
│   ├── assets/               # Imágenes, logos, íconos
│   ├── components/           # Componentes reutilizables como Products, Reports, Inventory, etc.
│   ├── hooks/                # Hooks personalizados
│   ├── layout/               # Layout general (Navbar, Sidebar, etc.)
│   ├── pages/                # Páginas como Login, Register, ForgotPassword
│   ├── router/               # Definición de rutas con React Router
│   ├── utils/                # Funciones auxiliares o helpers
│   ├── App.jsx               # Componente raíz de la aplicación
│   ├── main.jsx              # Punto de entrada (montaje en DOM)
│   ├── index.css             # Estilos base + Tailwind
│   └── index.js              # Archivo index (probablemente legacy, se puede revisar)
├── .eslintrc.cjs             # Configuración de ESLint
├── index.html                # HTML base usado por Vite
├── package.json              # Dependencias, scripts, metadatos
├── package-lock.json         # Lockfile de NPM
├── postcss.config.js         # Configuración de PostCSS (para Tailwind)
├── tailwind.config.js        # Configuración de Tailwind
├── vite.config.js            # Configuración de Vite
└── README.md                 # Documentación del proyecto
