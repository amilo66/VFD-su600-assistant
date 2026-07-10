# 🛠️ Asistente Técnico VFD SU-600

Aplicación web progresiva (PWA) offline para técnicos que trabajan con variadores de frecuencia **SUSWE SU-600**. Diseñada para ser rápida, funcional sin internet y adaptable a otros modelos de variadores.

## 📱 Características

✅ **100% Offline** - Funciona sin conexión a internet (ideal para naves industriales)  
✅ **Instalable** - Se instala como app nativa en Android, iOS y PC  
✅ **Búsqueda inteligente** - Encuentra parámetros y páginas del manual al instante  
✅ **Chat con IA** - Explicaciones de fallos y parámetros usando Groq API  
✅ **Gestión de instalaciones** - Guarda configuraciones de múltiples variadores  
✅ **Favoritos y notas** - Organiza tus parámetros más usados  
✅ **Copia de seguridad** - Exporta/importa todos tus datos en un archivo JSON  
✅ **Manual integrado** - PDF optimizado de 11MB incluido  

## 🚀 Instalación

### En tu móvil Android:

1. Abre Chrome y ve a: **https://amilo66.github.io/VFD-su600-assistant/**
2. Pulsa los **tres puntitos** (⋮) arriba a la derecha
3. Selecciona **"Instalar aplicación"** o **"Añadir a pantalla de inicio"**
4. ¡Listo! Aparecerá el icono en tu menú de apps

### En tu PC (Windows/Mac/Linux):

1. Abre Edge o Chrome
2. Ve a la misma URL
3. Verás un icono de instalación en la barra de direcciones
4. Haz clic en **"Instalar"**

## 📖 Uso básico

### 🔍 Buscar parámetros
- Usa el buscador para encontrar parámetros por código (ej: "F0.03") o por descripción
- Filtra por grupo de parámetros (F0, F1, F2...)
- Accede directamente a la página del manual

### ⭐ Favoritos
- Marca los parámetros que usas frecuentemente
- Se guardan por instalación (puedes tener varios variadores configurados)

### 📝 Notas
- Añade notas personales a cada parámetro
- Apunta valores específicos de tu instalación

###  Múltiples instalaciones
- Crea perfiles para diferentes máquinas o clientes
- Cada instalación tiene sus propios favoritos y notas
- Exporta/importa instalaciones completas

### 🤖 Asistente IA
- Necesitas una API key de Groq (gratuita en https://groq.com)
- Ve a "Configuración IA" e introduce tu clave
- Pregunta sobre fallos, parámetros o cableado

## 🔧 Adaptar para otros variadores

Esta app está diseñada para ser **reutilizable**. Si quieres adaptarla a otro modelo (Siemens, ABB, Danfoss...):

### 1. Estructura de datos
Los parámetros están en `data/parametros/` organizados por grupos (F0.json, F1.json...)

### 2. Scripts de procesamiento
En la carpeta `tools/` encontrarás los scripts Node.js que usamos para:
- Extraer datos del PDF (`traducir_parametros.js`)
- Agrupar parámetros (`agrupar_parametros.js`)
- Ordenar y formatear (`ordenar_parametros.js`)

### 3. Personalizar
- Cambia `manifest.json` (nombre, iconos, colores)
- Modifica el título en `index.html`
- Reemplaza el PDF en la carpeta `manual/`
- Actualiza los grupos de parámetros en `data/grupos/`

### 4. Ejemplo rápido
```bash
# Instalar dependencias (si usas los scripts de tools/)
cd tools
npm install

# Ejecutar scripts de procesamiento
node traducir_parametros.js
node agrupar_parametros.js
