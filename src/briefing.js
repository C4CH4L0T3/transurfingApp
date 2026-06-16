// ---------------------------------------------------------------------------
// Asistente de voz: arma el resumen del día y lo dice en voz alta.
// Usa la síntesis de voz del sistema (Web Speech API), sin internet.
// ---------------------------------------------------------------------------
import {
  prettyDate,
  todayKey,
  getDay,
  totalContacted,
  pendingFollowUps,
} from './store.jsx'
import {
  PROSPECTING_GOAL,
  DAILY_PROSPECTING_MIN,
  DAILY_PROSPECTING_MAX,
} from './config.js'

// Construye el texto del saludo + resumen, a partir de tus datos del día.
export function buildBriefingText(state) {
  const parts = []
  const name = (state.settings.name || '').trim()
  parts.push(name ? `Buenos días, ${name}.` : 'Buenos días.')

  const today = todayKey()
  parts.push(`Hoy es ${prettyDate(today)}.`)

  if (state.identity) parts.push(`Recuerda: ${state.identity}`)

  // Principio del curso de 78 días
  const n = state.course.currentDay
  const cd = state.course.days[n - 1]
  if (cd && (cd.title || cd.task)) {
    let line = `Tu principio de hoy, día ${n} de 78`
    if (cd.title) line += `: ${cd.title}`
    parts.push(line + '.')
    if (cd.task) parts.push(cd.task)
  }

  // Protocolo de mañana
  const day = getDay(state, today)
  const totalH = state.morningHabits.length
  const doneH = state.morningHabits.filter((h) => day.morning[h.id]).length
  if (totalH > 0) {
    if (doneH >= totalH) {
      parts.push('Ya completaste tu protocolo de mañana. Bien hecho.')
    } else {
      const faltan = totalH - doneH
      parts.push(
        `Te ${faltan === 1 ? 'falta' : 'faltan'} ${faltan} de ${totalH} ${
          faltan === 1 ? 'hábito' : 'hábitos'
        } del protocolo de mañana.`,
      )
    }
  }

  // Prospección
  parts.push(
    `En prospección, tu meta de hoy es contactar entre ${DAILY_PROSPECTING_MIN} y ${DAILY_PROSPECTING_MAX} empresas.`,
  )
  const contactedToday = day.contactedToday || 0
  if (contactedToday > 0) {
    parts.push(`Llevas ${contactedToday} ${contactedToday === 1 ? 'empresa' : 'empresas'} hoy.`)
  }
  const total = Math.min(totalContacted(state), PROSPECTING_GOAL)
  parts.push(`En el mes vas ${total} de ${PROSPECTING_GOAL}.`)

  // Seguimientos
  const pend = pendingFollowUps(state, today)
  if (pend.length === 1) {
    parts.push(`Tienes un seguimiento pendiente para hoy: ${pend[0].company}.`)
  } else if (pend.length > 1) {
    const names = pend
      .slice(0, 3)
      .map((f) => f.company)
      .join(', ')
    parts.push(`Tienes ${pend.length} seguimientos pendientes para hoy${names ? ': ' + names : ''}.`)
  }

  parts.push('Enfócate en el proceso. Vamos por un gran día.')

  return parts.join(' ')
}

// Carga las voces disponibles (pueden llegar de forma asíncrona).
function loadVoices() {
  return new Promise((resolve) => {
    const v = window.speechSynthesis.getVoices()
    if (v && v.length) return resolve(v)
    const handler = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler)
      resolve(window.speechSynthesis.getVoices())
    }
    window.speechSynthesis.addEventListener('voiceschanged', handler)
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1200)
  })
}

// Elige una voz en español, dando preferencia a voces femeninas conocidas.
export function pickSpanishVoice(voices) {
  const es = voices.filter((v) => (v.lang || '').toLowerCase().startsWith('es'))
  if (!es.length) return null
  const prefer = [
    'helena', 'sabina', 'laura', 'paulina', 'dalia', 'ximena', 'elvira',
    'monica', 'mónica', 'marisol', 'luciana', 'esperanza', 'female', 'mujer',
  ]
  const female = es.find((v) => prefer.some((p) => v.name.toLowerCase().includes(p)))
  // Preferimos español de América Latina si existe, luego cualquiera.
  const latam = es.find((v) => /es[-_](mx|co|us|la|ar|cl)/i.test(v.lang))
  return female || latam || es[0]
}

// Dice el texto en voz alta. handlers: { onstart, onend }
export async function speak(text, handlers = {}) {
  if (!('speechSynthesis' in window)) return false
  try {
    window.speechSynthesis.cancel()
    const voices = await loadVoices()
    const utter = new SpeechSynthesisUtterance(text)
    const voice = pickSpanishVoice(voices)
    if (voice) {
      utter.voice = voice
      utter.lang = voice.lang
    } else {
      utter.lang = 'es-ES'
    }
    utter.rate = 1.0
    utter.pitch = 1.05
    utter.onstart = () => handlers.onstart && handlers.onstart()
    utter.onend = () => handlers.onend && handlers.onend()
    utter.onerror = () => handlers.onend && handlers.onend()
    window.speechSynthesis.speak(utter)
    return true
  } catch {
    return false
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

export function speechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
