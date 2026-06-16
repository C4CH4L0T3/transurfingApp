import { useState } from 'react'
import { useApp, todayKey, addDaysKey, courseCompletedCount } from '../store.jsx'
import { COURSE_TOTAL_DAYS } from '../data.js'
import { Card, ProgressBar, Icon } from '../ui.jsx'

export default function Course78() {
  const { state, update } = useApp()
  const course = state.course
  const completed = courseCompletedCount(state)
  const [selected, setSelected] = useState(course.currentDay)

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
      <header className="px-1 pt-1">
        <h1 className="text-[26px] font-semibold tracking-tight">78 días</h1>
        <p className="mt-1 text-[15px] text-neutral-500 dark:text-neutral-400">
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
        <span className="text-[13px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          Los 78 días
        </span>
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
        <div className="flex items-center justify-between">
          <h2 className="text-[19px] font-semibold">
            Día {selected}
            {isCurrent && (
              <span className="ml-2 rounded-full bg-accent-500/10 px-2 py-0.5 text-[12px] font-semibold text-accent-600 dark:text-accent-400">
                Hoy en el curso
              </span>
            )}
          </h2>
          {sel.completed && <span className="text-[14px] font-medium text-accent-600 dark:text-accent-400">Completado ✓</span>}
        </div>

        {isLocked ? (
          <p className="mt-4 text-[15px] text-neutral-400">
            Este día aún está bloqueado. Completa el día {course.currentDay} para avanzar.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
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
                El principio en tus palabras + tu reflexión
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
