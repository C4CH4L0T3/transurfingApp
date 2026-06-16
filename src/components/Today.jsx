import { useState } from 'react'
import {
  useApp,
  getDay,
  prettyDate,
  morningStreak,
  morningComplete,
} from '../store.jsx'
import { Card, Check, Icon } from '../ui.jsx'
import EditableTaskList from './EditableTaskList.jsx'
import DailyQuote from './DailyQuote.jsx'
import Prospecting from './Prospecting.jsx'
import NightProtocol from './NightProtocol.jsx'

export default function Today() {
  const { state, today } = useApp()

  return (
    <div className="space-y-5">
      <IdentityHeader />
      <DailyQuote />
      <MorningProtocol />
      <Prospecting />
      <LifeAreas />
      <NightProtocol />
    </div>
  )
}

// --- Declaración de identidad (editable en línea) ---
function IdentityHeader() {
  const { state, update, today } = useApp()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(state.identity)
  const streak = morningStreak(state)

  const save = () => {
    update((d) => {
      d.identity = draft.trim() || d.identity
    })
    setEditing(false)
  }

  return (
    <header className="px-1 pt-1">
      <div className="flex items-center justify-between">
        <p className="text-[15px] capitalize text-neutral-500 dark:text-neutral-400">
          {prettyDate(today)}
        </p>
        {streak > 0 && (
          <span className="flex items-center gap-1 text-[14px] font-medium text-orange-500">
            <Icon.Flame className="h-4 w-4" />
            {streak} {streak === 1 ? 'día' : 'días'}
          </span>
        )}
      </div>

      {!editing ? (
        <button
          onClick={() => {
            setDraft(state.identity)
            setEditing(true)
          }}
          className="group mt-2 block w-full text-left"
        >
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-neutral-900 transition-colors group-hover:text-accent-600 dark:text-white sm:text-[30px]">
            {state.identity}
          </h1>
          <span className="mt-1 inline-block text-[13px] text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100">
            Toca para editar
          </span>
        </button>
      ) : (
        <div className="mt-2">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-2xl bg-white px-4 py-3 text-[22px] font-semibold leading-tight tracking-tight outline-none ring-2 ring-accent-400 dark:bg-[#1c1c1e]"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={save}
              className="rounded-xl bg-accent-500 px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-accent-600"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-xl px-4 py-2 text-[14px] font-medium text-neutral-500 transition-colors hover:bg-neutral-200/70 dark:hover:bg-white/10"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

// --- Protocolo de mañana ---
function MorningProtocol() {
  const { state, today, updateDay, update } = useApp()
  const day = getDay(state, today)
  const done = state.morningHabits.filter((h) => day.morning[h.id]).length
  const complete = morningComplete(state, today)

  const toggle = (id) =>
    updateDay(today, (d) => {
      d.morning[id] = !d.morning[id]
    })

  const add = (label) =>
    update((d) => {
      d.morningHabits.push({ id: 'm' + Date.now(), label })
    })

  const remove = (id) =>
    update((d) => {
      d.morningHabits = d.morningHabits.filter((h) => h.id !== id)
    })

  return (
    <Card className="p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          Protocolo de mañana
        </span>
        <span
          className={
            'text-[13px] font-medium tabular-nums ' +
            (complete ? 'text-accent-600 dark:text-accent-400' : 'text-neutral-400')
          }
        >
          {done}/{state.morningHabits.length}
          {complete && ' ✓'}
        </span>
      </div>
      <div className="mt-3">
        <EditableTaskList
          items={state.morningHabits}
          isChecked={(id) => !!day.morning[id]}
          onToggle={toggle}
          onAdd={add}
          onRemove={remove}
        />
      </div>
    </Card>
  )
}

// --- Cuatro áreas de vida ---
function LifeAreas() {
  const { state, today, updateDay, update } = useApp()
  const day = getDay(state, today)

  const toggle = (areaId, taskId) =>
    updateDay(today, (d) => {
      if (!d.lifeAreas[areaId]) d.lifeAreas[areaId] = {}
      d.lifeAreas[areaId][taskId] = !d.lifeAreas[areaId][taskId]
    })

  const add = (areaId, label) =>
    update((d) => {
      const area = d.lifeAreas.find((a) => a.id === areaId)
      if (area) area.tasks.push({ id: areaId + Date.now(), label })
    })

  const remove = (areaId, taskId) =>
    update((d) => {
      const area = d.lifeAreas.find((a) => a.id === areaId)
      if (area) area.tasks = area.tasks.filter((t) => t.id !== taskId)
    })

  return (
    <div>
      <p className="mb-3 px-1 text-[13px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        Áreas de vida
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {state.lifeAreas.map((area) => (
          <Card key={area.id} className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">{area.emoji}</span>
              <h3 className="text-[17px] font-semibold">{area.name}</h3>
            </div>
            <div className="mt-3">
              <EditableTaskList
                items={area.tasks}
                isChecked={(id) => !!(day.lifeAreas[area.id] && day.lifeAreas[area.id][id])}
                onToggle={(id) => toggle(area.id, id)}
                onAdd={(label) => add(area.id, label)}
                onRemove={(id) => remove(area.id, id)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
