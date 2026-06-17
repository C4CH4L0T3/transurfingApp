import { useState } from 'react'
import {
  useApp,
  morningStreak,
  totalContacted,
  monthStreak,
  courseCompletedCount,
  lifeAreaProgress,
} from '../store.jsx'
import { PROSPECTING_GOAL } from '../config.js'
import { COURSE_TOTAL_DAYS } from '../data.js'
import { Card, ProgressBar, Icon, Ornament } from '../ui.jsx'

function Stat({ label, value, sub, flame }) {
  return (
    <Card className="p-6">
      <p className="text-[14px] text-neutral-500 dark:text-neutral-400">{label}</p>
      <p
        className={
          'mt-1 flex items-center gap-1.5 text-[34px] font-semibold tabular-nums ' +
          (flame ? 'text-orange-500' : '')
        }
      >
        {flame && <Icon.Flame className="h-7 w-7" />}
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[13px] text-neutral-400">{sub}</p>}
    </Card>
  )
}

export default function ProgressView() {
  const { state } = useApp()
  const total = totalContacted(state)
  const mStreak = morningStreak(state)
  const completed = courseCompletedCount(state)

  return (
    <div className="space-y-5">
      <header className="px-1 pt-2 text-center">
        <h1 className="text-[30px] font-semibold tracking-tight">Progreso</h1>
        <Ornament className="mt-2" />
        <p className="mt-2 text-[15px] italic text-neutral-500 dark:text-neutral-400">
          La constancia, vista de un vistazo.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <Stat
          label="Racha de mañana"
          value={mStreak}
          sub={mStreak === 1 ? 'día seguido' : 'días seguidos'}
          flame
        />
        <Stat
          label="Racha 78 días"
          value={state.course.streak || 0}
          sub={(state.course.streak || 0) === 1 ? 'día seguido' : 'días seguidos'}
          flame
        />
        <Stat label="Empresas contactadas" value={total} sub={`de ${PROSPECTING_GOAL} este mes`} />
        <Stat
          label="Día del curso"
          value={state.course.currentDay}
          sub={`de ${COURSE_TOTAL_DAYS}`}
        />
      </div>

      <Card className="p-6 sm:p-7">
        <span className="text-[13px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          Avance hacia las metas
        </span>

        <div className="mt-5 space-y-5">
          <Bar
            label="Prospección del mes"
            value={Math.min(total, PROSPECTING_GOAL)}
            max={PROSPECTING_GOAL}
            display={`${Math.min(total, PROSPECTING_GOAL)} / ${PROSPECTING_GOAL}`}
          />
          <Bar
            label="Curso de 78 días"
            value={completed}
            max={COURSE_TOTAL_DAYS}
            display={`${completed} / ${COURSE_TOTAL_DAYS}`}
          />
          <Bar
            label="Día del mes alcanzado"
            value={state.course.currentDay}
            max={COURSE_TOTAL_DAYS}
            display={`${state.course.currentDay} / ${COURSE_TOTAL_DAYS}`}
          />
        </div>
      </Card>

      <LifeBalance />
    </div>
  )
}

// --- Radar de equilibrio: compara las áreas de vida por tareas completadas ---
function LifeBalance() {
  const { state } = useApp()
  const [days, setDays] = useState(7)
  const areas = lifeAreaProgress(state, days)
  const anyData = areas.some((a) => a.completed > 0)

  // Geometría del radar (4 ejes: arriba, derecha, abajo, izquierda)
  const cx = 140
  const cy = 120
  const R = 78
  const point = (i, r) => {
    const ang = ((-90 + i * 90) * Math.PI) / 180
    return [cx + Math.cos(ang) * R * r, cy + Math.sin(ang) * R * r]
  }
  const ring = (r) =>
    areas.map((_, i) => point(i, r).map((n) => n.toFixed(1)).join(',')).join(' ')
  const dataPoly = areas.map((a, i) => point(i, a.rate).map((n) => n.toFixed(1)).join(',')).join(' ')

  const labelAnchor = ['middle', 'start', 'middle', 'end']
  const labelPt = areas.map((_, i) => point(i, 1.0))

  return (
    <Card className="p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="overline text-[12px] text-accent-700 dark:text-accent-400">
          Equilibrio de vida
        </span>
        <div className="flex gap-1 rounded-full border border-accent-700/15 bg-neutral-200/40 p-0.5 text-[13px] dark:border-accent-400/10 dark:bg-white/[0.05]">
          {[7, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={
                'rounded-full px-3 py-1 transition-colors ' +
                (days === d
                  ? 'bg-gradient-to-b from-accent-400 to-accent-600 text-[#2a2015]'
                  : 'text-neutral-500 hover:text-accent-700 dark:text-neutral-400')
              }
            >
              {d} días
            </button>
          ))}
        </div>
      </div>

      <p className="mt-1 text-[13px] text-neutral-400">
        Proporción de tareas completadas en cada área (últimos {days} días).
      </p>

      <div className="mt-2">
        <svg viewBox="0 0 280 240" className="mx-auto w-full max-w-sm">
          {/* Anillos de referencia */}
          {[0.25, 0.5, 0.75, 1].map((r) => (
            <polygon
              key={r}
              points={ring(r)}
              fill="none"
              stroke="currentColor"
              className="text-accent-700/15 dark:text-accent-300/15"
              strokeWidth="1"
            />
          ))}
          {/* Ejes */}
          {areas.map((_, i) => {
            const [x, y] = point(i, 1)
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="currentColor"
                className="text-accent-700/15 dark:text-accent-300/15"
                strokeWidth="1"
              />
            )
          })}
          {/* Polígono de datos */}
          <polygon
            points={dataPoly}
            className="fill-accent-500/25 text-accent-500"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {areas.map((a, i) => {
            const [x, y] = point(i, a.rate)
            return <circle key={a.id} cx={x} cy={y} r="3" className="fill-accent-600" />
          })}
          {/* Etiquetas */}
          {areas.map((a, i) => {
            const [x, y] = labelPt[i]
            const dy = i === 0 ? -10 : i === 2 ? 20 : 4
            const dx = i === 1 ? 10 : i === 3 ? -10 : 0
            return (
              <text
                key={a.id}
                x={x + dx}
                y={y + dy}
                textAnchor={labelAnchor[i]}
                className="fill-neutral-600 text-[12px] dark:fill-neutral-300"
                style={{ fontWeight: 600 }}
              >
                {a.emoji} {a.name}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Detalle por área */}
      <div className="mt-2 space-y-3">
        {areas.map((a) => (
          <div key={a.id}>
            <div className="mb-1 flex items-baseline justify-between">
              <p className="text-[14px] text-neutral-700 dark:text-neutral-200">
                {a.emoji} {a.name}
              </p>
              <p className="text-[13px] tabular-nums text-neutral-500">
                {a.completed} tareas · {Math.round(a.rate * 100)}%
              </p>
            </div>
            <ProgressBar value={a.completed} max={a.possible || 1} />
          </div>
        ))}
      </div>

      {!anyData && (
        <p className="mt-4 text-center text-[13px] italic text-neutral-400">
          Aún no hay tareas marcadas en este período. El gráfico se llena a medida que
          completas tus áreas día a día.
        </p>
      )}
    </Card>
  )
}

function Bar({ label, value, max, display }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-[15px] text-neutral-700 dark:text-neutral-200">{label}</p>
        <p className="text-[14px] font-medium tabular-nums text-neutral-500">{display}</p>
      </div>
      <ProgressBar value={value} max={max} />
    </div>
  )
}
