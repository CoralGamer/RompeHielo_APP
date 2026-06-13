# RompeHielo 🧊🎙️

**RompeHielo** es una aplicación web minimalista, moderna y de alto impacto visual diseñada para entrenar la oratoria, estructurar ideas al vuelo y perfeccionar la improvisación al hablar en público. 

Este proyecto nació de una charla de necesidades compartida entre **Susan y Nicolás**, con la visión de crear una herramienta libre de distracciones, rápida y 100% enfocada en la práctica constante de discursos rápidos.

---

## 🚀 Características Principales

### 1. Bolsa de Temas (Lluvia de Ideas)
- Ingresa tus propios temas o ideas (uno por línea) para sortear en la ruleta.
- Admite la carga de listas personalizadas subiendo archivos de texto plano `.txt`.
- Cuenta en tiempo real con un contador integrado de los temas cargados.

### 2. Ruleta de Selección con Inercia
- Al hacer clic en **¡Sortear Tema!**, el selector gira a gran velocidad alternando las ideas de tu bolsa.
- Utiliza un sistema de **desaceleración exponencial** para emular la fricción de una ruleta física real, aumentando la tensión dramática del sorteo.
- Incluye efectos de sonido sintéticos (ticks de oscilador) durante el giro y chimes armónicos al detenerse.

### 3. Temporizador Orgánico Configurable
- Establece el tiempo límite de práctica.
- Cuenta con selectores rápidos (1 min, 2 min, 3 min, 5 min, 10 min) y configuración de minutos personalizados.
- Alerta visual con animación pulsante roja e indicaciones acústicas en los últimos 10 segundos del discurso.

### 4. Grabadora de Prácticas con Onda de Audio
- Grabación de voz en formato de audio estándar utilizando la API `MediaRecorder` del navegador.
- **Visualizador de Onda Real**: Dibuja una representación gráfica vibrante de las frecuencias de tu voz en tiempo real sobre un elemento `<canvas>` (sin librerías externas).
- Guarda y asocia automáticamente la grabación al tema sorteado. Puedes reproducirla directamente desde la aplicación para evaluar tus muletillas, pausas, tono y ritmo de hablar.

---

## 🛡️ Privacidad Absoluta (Offline-First)

Tus discursos y tu voz te pertenecen exclusivamente a ti. La aplicación opera bajo un concepto estricto de privacidad local:
- **Sin servidores ni nube:** No enviamos tus archivos de voz a ningún servidor externo. El procesamiento es directo en el navegador de tu dispositivo.
- **IndexedDB + LocalStorage:** Guardamos el historial de temas y metadatos en `localStorage` y los audios grabados en formato binario puro (Blobs) en la base de datos interna **IndexedDB**.
- **Límite de Espacio:** El volumen de discursos que puedes almacenar dependerá exclusivamente del espacio de almacenamiento libre de tu dispositivo.
- **Peligro de Pérdida de Datos:** Dado que no existe una cuenta centralizada en la nube, **si borras la caché de navegación, cookies o restableces los datos de tu navegador, perderás toda tu información y grabaciones**.
- **Acceso Único:** Solo verás tus discursos grabados desde el mismo dispositivo y navegador desde el cual practicaste.

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4 (con soporte completo para Modo Claro y Modo Oscuro)
- **Iconografía**: `lucide-react`
- **Audio y Micrófono**: APIs nativas del navegador (`MediaRecorder`, `Web Audio API` y `Canvas2D`)

---

## 💻 Instalación y Ejecución Local

Para ejecutar RompeHielo en tu propia computadora, sigue los siguientes pasos:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/CoralGamer/RompeHielo_APP.git
   cd RompeHielo_APP
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para interactuar con la aplicación.

4. **Compilar para producción**:
   ```bash
   npm run build
   ```

---

## 📄 Licencia

El uso personal, educativo y sin fines de lucro de este Software es completamente libre. Queda **estrictamente prohibida la explotación o distribución comercial** del mismo sin el consentimiento previo por escrito de los titulares de los derechos de autor. Consulta el archivo [LICENSE](./LICENSE) para más detalles.
