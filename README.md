<div align="center">

# 🏛️ Sistema de Gestión para Comisaría Ejidal/Comunal

**Plataforma web integral para la modernización administrativa de comisarías ejidales y comunales**

Digitaliza procesos que tradicionalmente se llevan en papel y centraliza la información del núcleo agrario en un solo sistema, accesible y seguro.

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)

![Status](https://img.shields.io/badge/estado-en%20desarrollo-F59E0B?style=flat-square)
![License](https://img.shields.io/badge/uso-interno-8B5CF6?style=flat-square)
![Made in](https://img.shields.io/badge/hecho%20en-Chiapas%2C%20México-16A34A?style=flat-square)

</div>

---

## 📋 Descripción

Este sistema permite a las autoridades de una Comisaría Ejidal o de Bienes Comunales llevar el control administrativo, jurídico y financiero del núcleo agrario desde una sola plataforma, sustituyendo el manejo en papel por expedientes digitales, trazabilidad de pagos y respaldo de decisiones asamblearias.

## ✨ Funcionalidades principales

### 👥 Padrón de comuneros y ejidatarios
- Expedientes digitales individuales por comunero/ejidatario.
- Historial completo de parcelas asociadas, pagos y actos jurídicos.
- Alta, edición y consulta de datos personales y documentación.
- Captura de fotografía vía cámara del dispositivo para el expediente.

### 🗺️ Registro y seguimiento de parcelas comunales
- Control de superficie, uso de suelo, ubicación y titular de cada parcela/lote.
- Asignación y reasignación de titulares.
- Vinculación directa con el expediente del comunero correspondiente.

### 💰 Pagos prediales
- Registro y control de cobros prediales.
- Historial de adeudos por comunero y por parcela.
- Generación y resguardo de comprobantes de pago.

### 📜 Actas y acuerdos de asamblea
- Documentación digital de las decisiones tomadas en asamblea.
- Resguardo histórico de actas y acuerdos comunitarios.
- Consulta rápida por fecha, tema o participantes.

### ⚖️ Multas y sanciones
- Registro de multas y sanciones vinculado directamente al expediente del comunero.
- Seguimiento del estado de cada sanción (pendiente, pagada, condonada, etc.).

### 🔐 Acceso y seguridad
- Autenticación de usuarios con manejo de sesión.
- Panel con accesos rápidos y estadísticas generales (dashboard).

---

## 🛠️ Stack tecnológico

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Arquitectura:** Basada en features (`src/features/`)
- **Fuente:** [Geist](https://vercel.com/font) vía `next/font`

---

## 🚀 Puesta en marcha

### Requisitos previos
- Node.js 18 o superior
- npm, yarn, pnpm o bun

### Instalación

```bash
git clone <https://github.com/Isaili/comuneros.git>
cd <Comuneros>
npm install
```

### Entorno de desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

> ⚠️ Algunas funcionalidades (como la captura de fotografía por cámara) requieren HTTPS local. Si es tu caso, ejecuta el servidor con `--experimental-https`.

Puedes comenzar a editar la página modificando `app/page.tsx`. Los cambios se reflejan automáticamente.

---

## 📁 Estructura del proyecto

```
src/
├── app/                # Rutas y páginas (App Router)
├── features/           # Módulos por dominio (comuneros, parcelas, pagos, actas, multas...)
├── components/         # Componentes compartidos/UI
└── lib/                # Utilidades, clientes API, helpers
```

---

## 🗺️ Roadmap

- [ ] Resolver errores 500 en endpoints `/api/comuneros` y `/api/vecindarios`
- [ ] Reportes exportables (PDF/Excel) de pagos y padrón
- [ ] Notificaciones de adeudos
- [ ] Roles y permisos diferenciados por tipo de usuario

---

## 📚 Recursos de Next.js

- [Documentación de Next.js](https://nextjs.org/docs) — características y API.
- [Aprende Next.js](https://nextjs.org/learn) — tutorial interactivo.
- [Repositorio de Next.js en GitHub](https://github.com/vercel/next.js)

## ☁️ Despliegue

La forma más sencilla de desplegar esta aplicación es mediante la [plataforma de Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), creadores de Next.js.

---

## 📄 Licencia

Proyecto de uso interno para la Comisaría de Bienes Comunales. Todos los derechos reservados.[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

