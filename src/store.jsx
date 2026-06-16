import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { STORAGE_KEY } from './config.js'
import {
  DEFAULT_IDENTITY,
  DEFAULT_MORNING_HABITS,
  DEFAULT_LIFE_AREAS,
  DEFAULT_NIGHT_ITEMS,
  DEFAULT_QUOTES,
  DEFAULT_MONTH_GOALS,
  COURSE_TOTAL_DAYS,
} from './data.js'
import { COURSE_78 } from './course78Data.js'

// ---------------------------------------------------------------------------
// Utilidades de fecha (siempre en hora local)
// ---------------------------------------------------------------------------
export function dateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey() {
  return dateKey(new Date())
}

export function addDaysKey(key, delta) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + delta)
  return dateKey(date)
}

export function prettyDate(key = todayKey()) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

// ---------------------------------------------------------------------------
// Estado por defecto
// ---------------------------------------------------------------------------
export function emptyDay() {
  return {
    morning: {}, // habitId -> bool
    lifeAreas: {}, // areaId -> { taskId -> bool }
    night: {}, // itemId -> bool (casillas)
    nightText: {}, // itemId -> string
    intentions: ['', '', ''],
    contactedToday: 0,
    monthDone: false, // día del mes marcado como completado
  }
}

function makeCourseDays() {
  return Array.from({ length: COURSE_TOTAL_DAYS }, (_, i) => {
    const preset = COURSE_78[i] || { title: '', task: '' }
    return {
      title: preset.title || '', // nombre del principio (preestablecido, editable)
      task: preset.task || '', // tarea del día (preestablecida, editable)
      notes: '', // tu reflexión personal
      completed: false,
      completedOn: null, // dateKey en que se completó
    }
  })
}

export function defaultState() {
  return {
    version: 1,
    identity: DEFAULT_IDENTITY,
    morningHabits: DEFAULT_MORNING_HABITS.map((h) => ({ ...h })),
    lifeAreas: DEFAULT_LIFE_AREAS.map((a) => ({ ...a, tasks: a.tasks.map((t) => ({ ...t })) })),
    nightItems: DEFAULT_NIGHT_ITEMS.map((n) => ({ ...n })),
    quotes: DEFAULT_QUOTES.map((q) => ({ ...q })),
    monthGoals: {
      process: [...DEFAULT_MONTH_GOALS.process],
      outcome: [...DEFAULT_MONTH_GOALS.outcome],
    },
    days: {}, // dateKey -> emptyDay()
    followUps: [], // { id, company, dueDate, note, done }
    course: {
      currentDay: 1, // 1..78
      days: makeCourseDays(),
      streak: 0,
      lastCompletedOn: null,
    },
    settings: {
      theme: 'system',
      voiceGreeting: true, // saludo de voz al abrir la app
      name: 'Emmanuel', // tu nombre, para personalizar el saludo
      lastGreetedDate: null, // último día en que ya saludó (para no repetir)
      voiceURI: '', // voz preferida elegida a mano (vacío = automática)
    },
  }
}

// Fusiona el estado guardado con el por defecto para tolerar versiones viejas.
function migrate(saved) {
  const base = defaultState()
  if (!saved || typeof saved !== 'object') return base
  const merged = { ...base, ...saved }
  merged.settings = { ...base.settings, ...(saved.settings || {}) }
  // Si aún no hay nombre definido, usa el predeterminado.
  if (!merged.settings.name) merged.settings.name = base.settings.name
  merged.monthGoals = { ...base.monthGoals, ...(saved.monthGoals || {}) }
  merged.days = saved.days || {}
  merged.followUps = Array.isArray(saved.followUps) ? saved.followUps : []
  merged.quotes = Array.isArray(saved.quotes) && saved.quotes.length ? saved.quotes : base.quotes
  merged.morningHabits = Array.isArray(saved.morningHabits) ? saved.morningHabits : base.morningHabits
  merged.lifeAreas = Array.isArray(saved.lifeAreas) ? saved.lifeAreas : base.lifeAreas
  merged.nightItems = Array.isArray(saved.nightItems) ? saved.nightItems : base.nightItems
  // Curso: combina lo guardado con el contenido por defecto, rellenando los
  // campos vacíos (título y tarea) sin pisar lo que ya hayas editado o escrito.
  const course = saved.course || {}
  const savedDays = Array.isArray(course.days) ? course.days : []
  const days = Array.from({ length: COURSE_TOTAL_DAYS }, (_, i) => {
    const preset = COURSE_78[i] || { title: '', task: '' }
    const d = savedDays[i] || {}
    return {
      title: d.title ? d.title : preset.title || '',
      task: d.task ? d.task : preset.task || '',
      notes: d.notes || '',
      completed: !!d.completed,
      completedOn: d.completedOn || null,
    }
  })
  merged.course = {
    currentDay: course.currentDay || 1,
    days,
    streak: course.streak || 0,
    lastCompletedOn: course.lastCompletedOn || null,
  }
  return merged
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return migrate(JSON.parse(raw))
  } catch {
    return defaultState()
  }
}

// ---------------------------------------------------------------------------
// Context / Provider
// ---------------------------------------------------------------------------
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [today, setToday] = useState(todayKey())

  // Persistencia en localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* almacenamiento lleno o no disponible */
    }
  }, [state])

  // Tema (clase .dark en <html>).
  useEffect(() => {
    const apply = () => {
      const theme = state.settings.theme
      const dark =
        theme === 'dark' ||
        (theme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => state.settings.theme === 'system' && apply()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [state.settings.theme])

  // Detecta el cambio de día real para refrescar la pantalla "Hoy".
  const lastSeen = useRef(today)
  useEffect(() => {
    const tick = () => {
      const k = todayKey()
      if (k !== lastSeen.current) {
        lastSeen.current = k
        setToday(k)
      }
    }
    const interval = setInterval(tick, 30 * 1000)
    const onFocus = () => tick()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [])

  // Actualiza el estado de forma inmutable mediante un "borrador" clonado.
  const update = (mutator) => {
    setState((prev) => {
      const draft = structuredClone(prev)
      mutator(draft)
      return draft
    })
  }

  // Asegura que exista el registro del día indicado y lo entrega al mutador.
  const updateDay = (key, mutator) => {
    update((draft) => {
      if (!draft.days[key]) draft.days[key] = emptyDay()
      mutator(draft.days[key], draft)
    })
  }

  const value = useMemo(
    () => ({ state, setState, update, updateDay, today, setToday }),
    [state, today],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return ctx
}

// ---------------------------------------------------------------------------
// Lecturas derivadas (selectores)
// ---------------------------------------------------------------------------
export function getDay(state, key) {
  return state.days[key] || emptyDay()
}

// ¿El protocolo de mañana de ese día está completo?
export function morningComplete(state, key) {
  const day = state.days[key]
  if (!day) return false
  return state.morningHabits.length > 0 && state.morningHabits.every((h) => day.morning[h.id])
}

// Racha de días consecutivos con protocolo de mañana completo (hasta hoy o ayer).
export function morningStreak(state) {
  let streak = 0
  let key = todayKey()
  // Si hoy aún no está completo, la racha puede venir desde ayer.
  if (!morningComplete(state, key)) key = addDaysKey(key, -1)
  while (morningComplete(state, key)) {
    streak += 1
    key = addDaysKey(key, -1)
  }
  return streak
}

// Total de empresas contactadas (suma de todos los días).
export function totalContacted(state) {
  return Object.values(state.days).reduce((sum, d) => sum + (d.contactedToday || 0), 0)
}

// Seguimientos pendientes para hoy (vencen hoy o antes y no están hechos).
export function pendingFollowUps(state, key = todayKey()) {
  return state.followUps.filter((f) => !f.done && f.dueDate && f.dueDate <= key)
}

// Racha de días del mes marcados como completados (hasta hoy o ayer).
export function monthStreak(state) {
  let streak = 0
  let key = todayKey()
  if (!state.days[key]?.monthDone) key = addDaysKey(key, -1)
  while (state.days[key]?.monthDone) {
    streak += 1
    key = addDaysKey(key, -1)
  }
  return streak
}

export function courseCompletedCount(state) {
  return state.course.days.filter((d) => d.completed).length
}
