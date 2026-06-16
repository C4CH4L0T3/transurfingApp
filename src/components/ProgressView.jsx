import {
  useApp,
  morningStreak,
  totalContacted,
  monthStreak,
  courseCompletedCount,
} from '../store.jsx'
import { PROSPECTING_GOAL } from '../config.js'
import { COURSE_TOTAL_DAYS } from '../data.js'
import { Card, ProgressBar, Icon } from '../ui.jsx'

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
      <header className="px-1 pt-1">
        <h1 className="text-[26px] font-semibold tracking-tight">Progreso</h1>
        <p className="mt-1 text-[15px] text-neutral-500 dark:text-neutral-400">
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
    </div>
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
