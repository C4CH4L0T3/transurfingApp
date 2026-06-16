# Transformación · App diaria

App web personal (uso individual, sin login ni servidor) para sostener un plan de
transformación. Todo se guarda en tu navegador (`localStorage`). Pensada para abrirse
y marcar lo de hoy en segundos. Diseño limpio, calmado, con modo claro y oscuro.

## Cómo iniciarla localmente

Necesitas [Node.js](https://nodejs.org) 18 o superior.

```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Arrancar en modo desarrollo
npm run dev
```

Abre la URL que aparece en la terminal (normalmente http://localhost:5173).

### Para usarla a diario sin la terminal

```bash
npm run build      # genera la carpeta dist/
npm run preview    # sirve la versión final en local
```

La carpeta `dist/` es estática: puedes subirla a cualquier hosting (Netlify, Vercel,
GitHub Pages) o abrirla desde un servidor estático.

## Secciones

- **Hoy** — declaración de identidad, frase del día, protocolo de mañana, prospección
  (contador diario + progreso sobre 100 empresas + seguimientos), áreas de vida y
  protocolo de noche.
- **Mes** — metas de proceso y de resultado + calendario para marcar cada día y ver la racha.
- **78 días** — contenedor vacío (Día 1 a 78). Tú escribes el título y la reflexión de
  cada día desde tu propia copia del libro. Incluye racha y barra de progreso.
- **Progreso** — rachas, total de empresas contactadas y avance hacia las metas.

## Tus datos

- Todo vive en `localStorage`, así que el progreso persiste entre días.
- Al cambiar de día, las casillas diarias se reinician; las rachas, contadores
  acumulados y notas se conservan.
- Menú **⋯** (arriba a la derecha): **Exportar respaldo** (JSON, incluye las notas de
  los 78 días), **Importar respaldo** y **Reiniciar todo**.

## El plan en PDF

El botón **“Ver el plan”** abre `public/plan.pdf` en una pestaña nueva.
Para cambiar el archivo, reemplaza `public/plan.pdf` o edita la constante
`PLAN_PDF_PATH` en [`src/config.js`](src/config.js).

## Personalizar el contenido

- Frases, hábitos, áreas de vida y metas son editables desde la propia interfaz.
- Los valores iniciales viven en [`src/data.js`](src/data.js).
- Metas diarias de prospección y la ruta del PDF, en [`src/config.js`](src/config.js).

## Stack

React + Vite + Tailwind CSS v4. Sin backend, sin cuentas, sin analítica.
