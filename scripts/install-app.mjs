// Copia la app empaquetada a una ubicación estable por usuario:
//   %LOCALAPPDATA%\Transformacion
// Úsalo después de empaquetar. El script `app:install` hace ambos pasos.
//
// Importante: CIERRA la app antes de actualizar, o el copiado fallará porque
// el ejecutable estará bloqueado por Windows.
import { cpSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import os from 'os'
import path from 'path'

const here = path.dirname(fileURLToPath(import.meta.url))
const src = path.join(here, '..', 'release', 'Transformacion-win32-x64')

const localAppData =
  process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local')
const dest = path.join(localAppData, 'Transformacion')

if (!existsSync(src)) {
  console.error('No se encontró la app empaquetada en:', src)
  console.error('Ejecuta primero "npm run app:pack".')
  process.exit(1)
}

try {
  mkdirSync(dest, { recursive: true })
  cpSync(src, dest, { recursive: true, force: true })
  console.log('✓ App instalada en:', dest)
  console.log('  Ejecutable:', path.join(dest, 'Transformacion.exe'))
} catch (err) {
  console.error('No se pudo copiar. ¿La app está abierta? Ciérrala e intenta de nuevo.')
  console.error(String(err.message || err))
  process.exit(1)
}
