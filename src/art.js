// ---------------------------------------------------------------------------
// Galería rotativa: una obra renacentista (dominio público) por día.
// El "Día 1" se ancla a PROGRAM_START (ver config.js), no a hoy.
// ---------------------------------------------------------------------------
import { PROGRAM_START } from './config.js'
import { todayKey } from './store.jsx'

import venus from './assets/art/01-venus.jpg'
import primavera from './assets/art/02-primavera.jpg'
import monalisa from './assets/art/03-monalisa.jpg'
import athens from './assets/art/04-athens.jpg'
import adam from './assets/art/05-adam.jpg'
import annunciation from './assets/art/06-annunciation.jpg'
import venusUrbino from './assets/art/07-venus_urbino.jpg'

// `pos` = object-position para encuadrar bien la franja del hero.
export const ART = [
  { src: venus, title: 'El nacimiento de Venus', author: 'Sandro Botticelli · c. 1485', pos: 'center 30%' },
  { src: primavera, title: 'La primavera', author: 'Sandro Botticelli · c. 1480', pos: 'center 30%' },
  { src: monalisa, title: 'La Gioconda', author: 'Leonardo da Vinci · c. 1503', pos: 'center 22%' },
  { src: athens, title: 'La escuela de Atenas', author: 'Rafael · 1509–1511', pos: 'center 40%' },
  { src: adam, title: 'La creación de Adán', author: 'Miguel Ángel · c. 1512', pos: 'center 50%' },
  { src: annunciation, title: 'La Anunciación', author: 'Leonardo da Vinci · c. 1472', pos: 'center 55%' },
  { src: venusUrbino, title: 'Venus de Urbino', author: 'Tiziano · 1538', pos: 'center 35%' },
]

// Días enteros entre dos fechas 'YYYY-MM-DD'.
function daysBetween(aKey, bKey) {
  const [ay, am, ad] = aKey.split('-').map(Number)
  const [by, bm, bd] = bKey.split('-').map(Number)
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000)
}

// Devuelve la obra del día indicado (por defecto hoy) y el número de día.
// dayNumber = 1 el día de inicio (PROGRAM_START); 0 o negativo antes de empezar.
export function artForDay(key = todayKey()) {
  const idx = daysBetween(PROGRAM_START, key) // 0 el día de inicio
  const n = ART.length
  const i = ((idx % n) + n) % n
  return { ...ART[i], dayNumber: idx + 1, started: idx >= 0 }
}
