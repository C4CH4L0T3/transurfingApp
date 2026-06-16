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

## App de escritorio (Windows, Electron)

Puedes usarla como una app nativa con su propia ventana, sin abrir el navegador
y sin internet.

```bash
npm run app         # compila y abre la app en una ventana de Electron (para probar)
npm run app:pack    # genera el ejecutable en release/Transformacion-win32-x64/
npm run app:install # empaqueta y copia la app a una ubicación estable (ver abajo)
```

Tras `npm run app:pack`, el ejecutable queda en:

```
release\Transformacion-win32-x64\Transformacion.exe
```

### Ubicación estable + arranque automático

La app "de uso diario" vive en una carpeta estable por usuario, fuera del
proyecto:

```
%LOCALAPPDATA%\Transformacion\Transformacion.exe
```

`npm run app:install` empaqueta y la copia ahí. **Cierra la app antes de
actualizar**, o el copiado fallará por archivo bloqueado. La carpeta `release/`
es solo salida de compilación (regenerable, fuera del repo).

Para que arranque al encender el equipo hay un acceso directo en la carpeta de
Inicio de Windows (`shell:startup`). Para desactivarlo, bórralo de ahí o usa
*Administrador de tareas → Inicio*.

Doble clic para abrirlo. Para tenerlo a mano: clic derecho sobre el `.exe` →
**Enviar a → Escritorio (crear acceso directo)**, o **Anclar a la barra de tareas**.

> Nota: la app de escritorio guarda sus datos por separado de la versión web
> (cada una usa su propio almacenamiento). Usa **Exportar/Importar** (menú ⋯) si
> quieres pasar tu progreso de una a otra. Las fuentes web (Inter) caen a la
> tipografía del sistema cuando no hay internet, sin afectar el diseño.

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
