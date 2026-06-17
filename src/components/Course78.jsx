import { useState } from 'react'
import { useApp, todayKey, addDaysKey, courseCompletedCount } from '../store.jsx'
import { COURSE_TOTAL_DAYS } from '../data.js'
import { Card, ProgressBar, Icon, Ornament } from '../ui.jsx'

export default function Course78() {
  const { state, update } = useApp()
  const course = state.course
  const completed = courseCompletedCount(state)
  const [selected, setSelected] = useState(course.currentDay)
  const [showImport, setShowImport] = useState(false)

  // Marca el día actual como hecho y avanza al siguiente, gestionando la racha.
  const completeCurrentAndAdvance = () => {
    update((d) => {
      const c = d.course
      const idx = c.currentDay - 1
      const day = c.days[idx]
      if (!day.completed) {
        day.completed = true
        day.completedOn = todayKey()
        // Racha estilo reto: +1 si fue ayer, 1 si es el primero o hubo salto.
        const t = todayKey()
        if (c.lastCompletedOn === t) {
          // ya contaba hoy, no dupliques
        } else if (c.lastCompletedOn === addDaysKey(t, -1)) {
          c.streak = (c.streak || 0) + 1
        } else {
          c.streak = 1
        }
        c.lastCompletedOn = t
      }
      if (c.currentDay < COURSE_TOTAL_DAYS) c.currentDay += 1
    })
    setSelected((s) => Math.min(s + 1, COURSE_TOTAL_DAYS))
  }

  const updateDayField = (idx, field, value) =>
    update((d) => {
      d.course.days[idx][field] = value
    })

  const toggleCompleted = (idx) =>
    update((d) => {
      const day = d.course.days[idx]
      day.completed = !day.completed
      day.completedOn = day.completed ? todayKey() : null
    })

  const sel = course.days[selected - 1]
  const isCurrent = selected === course.currentDay
  const isLocked = selected > course.currentDay

  return (
    <div className="space-y-5">
      <header className="px-1 pt-2 text-center">
        <h1 className="text-[30px] font-semibold tracking-tight">78 días</h1>
        <Ornament className="mt-2" />
        <p className="mt-2 text-[15px] italic text-neutral-500 dark:text-neutral-400">
          Un principio por día, escrito por ti. El contenido lo pones desde tu libro.
        </p>
      </header>

      {/* Resumen */}
      <Card className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[14px] text-neutral-500 dark:text-neutral-400">Progreso</p>
            <p className="text-[22px] font-semibold tabular-nums">
              {completed} <span className="text-neutral-400">/ {COURSE_TOTAL_DAYS}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[14px] text-neutral-500 dark:text-neutral-400">Racha</p>
            <p className="flex items-center justify-end gap-1 text-[22px] font-semibold tabular-nums text-orange-500">
              <Icon.Flame className="h-5 w-5" />
              {course.streak || 0}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[14px] text-neutral-500 dark:text-neutral-400">Día actual</p>
            <p className="text-[22px] font-semibold tabular-nums">{course.currentDay}</p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={completed} max={COURSE_TOTAL_DAYS} />
        </div>
      </Card>

      {/* Cuadrícula de 78 días */}
      <Card className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Los 78 días
          </span>
          <button
            onClick={() => setShowImport((v) => !v)}
            className="text-[13px] text-accent-600 transition-colors hover:text-accent-700 dark:text-accent-400"
          >
            {showImport ? 'Cerrar' : 'Importar mis notas'}
          </button>
        </div>

        {showImport && <BulkImport update={update} onDone={() => setShowImport(false)} />}

        <div className="mt-4 grid grid-cols-7 gap-2 sm:grid-cols-10 md:grid-cols-12">
          {course.days.map((day, i) => {
            const n = i + 1
            const locked = n > course.currentDay
            const current = n === course.currentDay
            const isSel = n === selected
            return (
              <button
                key={n}
                onClick={() => setSelected(n)}
                disabled={locked}
                title={locked ? `Día ${n} (bloqueado)` : `Día ${n}: ${day.title}`}
                className={
                  'relative flex aspect-square items-center justify-center rounded-xl text-[13px] font-medium transition-all active:scale-95 ' +
                  (day.completed
                    ? 'bg-accent-500 text-white'
                    : locked
                      ? 'cursor-not-allowed bg-neutral-100/60 text-neutral-300 dark:bg-white/[0.03] dark:text-neutral-600'
                      : 'bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80 dark:bg-white/[0.05] dark:text-neutral-300 dark:hover:bg-white/10') +
                  (current && !day.completed ? ' ring-2 ring-accent-400' : '') +
                  (isSel ? ' outline outline-2 outline-offset-2 outline-accent-500' : '')
                }
              >
                {day.completed ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  n
                )}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Editor del día seleccionado */}
      <Card className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                Día {selected}
              </span>
              {isCurrent && (
                <span className="rounded-full bg-accent-500/10 px-2 py-0.5 text-[12px] font-semibold text-accent-600 dark:text-accent-400">
                  Hoy en el curso
                </span>
              )}
            </div>
            <h2 className="mt-1 text-[22px] font-semibold tracking-tight">
              {sel.title || `Día ${selected}`}
            </h2>
          </div>
          {sel.completed && (
            <span className="shrink-0 text-[14px] font-medium text-accent-600 dark:text-accent-400">
              Completado ✓
            </span>
          )}
        </div>

        {isLocked ? (
          <p className="mt-4 text-[15px] text-neutral-400">
            Este día aún está bloqueado. Completa el día {course.currentDay} para avanzar.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Tarea del día, destacada */}
            <div className="rounded-2xl bg-accent-500/[0.07] p-4 ring-1 ring-accent-500/15 dark:bg-accent-500/10">
              <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">
                Tarea de hoy
              </label>
              <textarea
                rows={2}
                value={sel.task}
                onChange={(e) => updateDayField(selected - 1, 'task', e.target.value)}
                placeholder="La acción concreta de hoy…"
                className="w-full resize-none rounded-xl bg-white/70 px-3 py-2 text-[15px] leading-relaxed text-neutral-800 outline-none ring-accent-400 focus:ring-2 dark:bg-black/20 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-neutral-700 dark:text-neutral-200">
                Título del principio
              </label>
              <input
                value={sel.title}
                onChange={(e) => updateDayField(selected - 1, 'title', e.target.value)}
                placeholder="El nombre del principio de hoy…"
                className="w-full rounded-2xl bg-neutral-100/70 px-4 py-3 text-[16px] font-medium outline-none ring-accent-400 focus:ring-2 dark:bg-white/[0.04]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-neutral-700 dark:text-neutral-200">
                Tu reflexión
              </label>
              <textarea
                rows={6}
                value={sel.notes}
                onChange={(e) => updateDayField(selected - 1, 'notes', e.target.value)}
                placeholder="Escribe aquí lo que entendiste y cómo lo aplicas…"
                className="w-full resize-y rounded-2xl bg-neutral-100/70 px-4 py-3 text-[15px] leading-relaxed outline-none ring-accent-400 focus:ring-2 dark:bg-white/[0.04]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <label className="flex items-center gap-2 text-[15px]">
                <input
                  type="checkbox"
                  checked={sel.completed}
                  onChange={() => toggleCompleted(selected - 1)}
                  className="h-5 w-5 accent-[#0a84ff]"
                />
                Marcar este día como completado
              </label>
              {isCurrent && (
                <button
                  onClick={completeCurrentAndAdvance}
                  className="ml-auto rounded-xl bg-accent-500 px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-accent-600 active:scale-[0.98]"
                >
                  {sel.completed ? 'Siguiente día →' : 'Marcar hecho y avanzar →'}
                </button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Importador en bloque: pega tus propias notas y se reparten en los 78 días.
//
// Formato esperado: cada día empieza con un marcador de día y, opcionalmente,
// un título en la misma línea. Las líneas siguientes son la reflexión hasta el
// próximo marcador. Ejemplos de marcadores válidos al inicio de línea:
//   Día 1: Título           |   Day 1 - Título
//   1. Título               |   1) Título            |   1 | Título
// ---------------------------------------------------------------------------
function parseBulk(text) {
  const lines = text.split(/\r?\n/)
  const entries = []
  let current = null
  for (const line of lines) {
    // "Día N", "Day N" seguido de separador opcional y título
    let m = line.match(/^\s*(?:d[íi]a|day)\s*(\d{1,3})\b\s*[-:|.)\]]*\s*(.*)$/i)
    // o simplemente "N." / "N)" / "N|" / "N:" al inicio
    if (!m) m = line.match(/^\s*(\d{1,3})\s*[-:|.)\]]\s*(.*)$/)
    if (m) {
      const day = parseInt(m[1], 10)
      if (day >= 1 && day <= COURSE_TOTAL_DAYS) {
        if (current) entries.push(current)
        current = { day, title: m[2].trim(), notes: [] }
        continue
      }
    }
    if (current) current.notes.push(line)
  }
  if (current) entries.push(current)
  return entries.map((e) => ({
    day: e.day,
    title: e.title,
    notes: e.notes.join('\n').trim(),
  }))
}

function BulkImport({ update, onDone }) {
  const [text, setText] = useState('')
  const [overwrite, setOverwrite] = useState(false)
  const parsed = parseBulk(text)

  const apply = () => {
    if (!parsed.length) return
    update((d) => {
      for (const e of parsed) {
        const day = d.course.days[e.day - 1]
        if (!day) continue
        if (overwrite || !day.title) day.title = e.title || day.title
        if (overwrite || !day.notes) day.notes = e.notes || day.notes
      }
    })
    onDone()
  }

  return (
    <div className="mt-4 space-y-3 rounded-2xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <p className="text-[14px] text-neutral-600 dark:text-neutral-300">
        Pega <strong>tus propias notas</strong>. Cada día empieza con su número y,
        opcionalmente, un título. Las líneas siguientes son tu reflexión.
      </p>
      <pre className="overflow-x-auto rounded-xl bg-neutral-100/70 px-3 py-2 text-[12px] leading-relaxed text-neutral-500 dark:bg-white/[0.04]">
{`Día 1: Título que tú escribes
Tu reflexión con tus palabras…
puede ocupar varias líneas.

Día 2 - Otro título
Más reflexión tuya.`}
      </pre>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Pega aquí tus notas…"
        className="w-full resize-y rounded-2xl bg-neutral-100/70 px-4 py-3 text-[14px] leading-relaxed outline-none ring-accent-400 focus:ring-2 dark:bg-white/[0.04]"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-[14px] text-neutral-600 dark:text-neutral-300">
          <input
            type="checkbox"
            checked={overwrite}
            onChange={(e) => setOverwrite(e.target.checked)}
            className="h-4 w-4 accent-[#0a84ff]"
          />
          Sobrescribir días que ya tengan texto
        </label>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-neutral-400">
            {parsed.length > 0 ? `${parsed.length} días detectados` : 'Nada detectado aún'}
          </span>
          <button
            onClick={apply}
            disabled={!parsed.length}
            className="rounded-xl bg-accent-500 px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-accent-600 disabled:opacity-40"
          >
            Cargar
          </button>
        </div>
      </div>
    </div>
  )
}
