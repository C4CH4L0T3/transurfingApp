import { useState } from 'react'
import { useApp, dateKey, todayKey, monthStreak } from '../store.jsx'
import { Card, Icon } from '../ui.jsx'

export default function MonthGoals() {
  const { state } = useApp()
  const streak = monthStreak(state)

  return (
    <div className="space-y-5">
      <header className="px-1 pt-1">
        <h1 className="text-[26px] font-semibold tracking-tight">Metas del mes</h1>
        <p className="mt-1 text-[15px] text-neutral-500 dark:text-neutral-400">
          Lo que controlas es el proceso. El resultado llega como consecuencia.
        </p>
      </header>

      <GoalCard title="Metas de proceso" subtitle="Lo que controlo" field="process" accent />
      <GoalCard title="Metas de resultado" subtitle="La consecuencia" field="outcome" />

      <Card className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Calendario del mes
          </span>
          {streak > 0 && (
            <span className="flex items-center gap-1 text-[14px] font-medium text-orange-500">
              <Icon.Flame className="h-4 w-4" />
              {streak} {streak === 1 ? 'día' : 'días'} de racha
            </span>
          )}
        </div>
        <p className="mt-1 text-[13px] text-neutral-400">
          Marca cada día que cumpliste tu proceso. La racha se construye día a día.
        </p>
        <MonthCalendar />
      </Card>
    </div>
  )
}

function GoalCard({ title, subtitle, field, accent }) {
  const { state, update } = useApp()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const goals = state.monthGoals[field] || []

  const add = () => {
    const v = draft.trim()
    if (!v) return
    update((d) => d.monthGoals[field].push(v))
    setDraft('')
  }
  const remove = (i) => update((d) => d.monthGoals[field].splice(i, 1))

  return (
    <Card className="p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[17px] font-semibold">{title}</h2>
          <p className="text-[13px] text-neutral-400">{subtitle}</p>
        </div>
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-[13px] text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          {editing ? 'Listo' : 'Editar'}
        </button>
      </div>

      <ul className="mt-4 space-y-2.5">
        {goals.map((g, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={
                'mt-1.5 h-2 w-2 shrink-0 rounded-full ' +
                (accent ? 'bg-accent-500' : 'bg-neutral-300 dark:bg-neutral-600')
              }
            />
            <span className="flex-1 text-[15px] leading-snug text-neutral-800 dark:text-neutral-100">
              {g}
            </span>
            {editing && (
              <button
                onClick={() => remove(i)}
                aria-label="Eliminar meta"
                className="shrink-0 rounded-full p-1.5 text-neutral-400 transition-colors hover:text-red-500"
              >
                <Icon.Trash />
              </button>
            )}
          </li>
        ))}
      </ul>

      {editing && (
        <div className="mt-4 flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Nueva meta…"
            className="flex-1 rounded-xl bg-neutral-100/70 px-3 py-2 text-[14px] outline-none ring-accent-400 focus:ring-2 dark:bg-white/[0.04]"
          />
          <button
            onClick={add}
            className="rounded-xl bg-accent-500 px-3 py-2 text-[14px] font-medium text-white transition-colors hover:bg-accent-600"
          >
            Añadir
          </button>
        </div>
      )}
    </Card>
  )
}

const MONTH_NAMES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]
const WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function MonthCalendar() {
  const { state, update } = useApp()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth()) // 0-11
  const tKey = todayKey()

  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Lunes = 0 … Domingo = 6
  const startOffset = (firstDay.getDay() + 6) % 7

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const prev = () => {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else setMonth((m) => m - 1)
  }
  const next = () => {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else setMonth((m) => m + 1)
  }

  const toggleDay = (key) =>
    update((d) => {
      if (!d.days[key]) d.days[key] = emptyDayLite()
      d.days[key].monthDone = !d.days[key].monthDone
    })

  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={prev}
          className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-200/70 dark:hover:bg-white/10"
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <p className="text-[15px] font-medium capitalize">
          {MONTH_NAMES[month]} {year}
        </p>
        <button
          onClick={next}
          className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-200/70 dark:hover:bg-white/10"
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {WEEK.map((w) => (
          <div key={w} className="pb-1 text-[12px] font-medium text-neutral-400">
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={'e' + i} />
          const key = dateKey(new Date(year, month, d))
          const done = state.days[key]?.monthDone
          const isToday = key === tKey
          return (
            <button
              key={key}
              onClick={() => toggleDay(key)}
              className={
                'flex aspect-square items-center justify-center rounded-xl text-[14px] font-medium transition-all active:scale-95 ' +
                (done
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'bg-neutral-100/70 text-neutral-600 hover:bg-neutral-200/70 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/10') +
                (isToday && !done ? ' ring-2 ring-accent-400' : '')
              }
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Estructura mínima de un día (evita importar emptyDay para no acoplar).
function emptyDayLite() {
  return {
    morning: {},
    lifeAreas: {},
    night: {},
    nightText: {},
    intentions: ['', '', ''],
    contactedToday: 0,
    monthDone: false,
  }
}
