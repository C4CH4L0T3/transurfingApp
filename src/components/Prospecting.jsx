import { useState } from 'react'
import { useApp, getDay, totalContacted, pendingFollowUps, todayKey } from '../store.jsx'
import { Card, ProgressBar, Icon } from '../ui.jsx'
import {
  PROSPECTING_GOAL,
  DAILY_PROSPECTING_MIN,
  DAILY_PROSPECTING_MAX,
} from '../config.js'

export default function Prospecting() {
  const { state, today, updateDay, update } = useApp()
  const day = getDay(state, today)
  const total = totalContacted(state)
  const pending = pendingFollowUps(state, today)
  const [showAdd, setShowAdd] = useState(false)

  const setCount = (n) =>
    updateDay(today, (d) => {
      d.contactedToday = Math.max(0, n)
    })

  const toggleFollow = (id) =>
    update((d) => {
      const f = d.followUps.find((x) => x.id === id)
      if (f) f.done = !f.done
    })

  const removeFollow = (id) =>
    update((d) => {
      d.followUps = d.followUps.filter((x) => x.id !== id)
    })

  return (
    <Card className="p-6 sm:p-7">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          Prospección
        </span>
      </div>

      {/* Contador del día */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-[14px] text-neutral-500 dark:text-neutral-400">Contactadas hoy</p>
          <p className="text-[13px] text-neutral-400">
            Meta diaria: {DAILY_PROSPECTING_MIN}–{DAILY_PROSPECTING_MAX}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCount(day.contactedToday - 1)}
            aria-label="Restar"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 active:scale-95 dark:bg-white/10 dark:text-neutral-300"
          >
            <Icon.Minus />
          </button>
          <span className="w-10 text-center text-3xl font-semibold tabular-nums">
            {day.contactedToday}
          </span>
          <button
            onClick={() => setCount(day.contactedToday + 1)}
            aria-label="Sumar"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-500 text-white transition-colors hover:bg-accent-600 active:scale-95"
          >
            <Icon.Plus />
          </button>
        </div>
      </div>

      {/* Progreso global sobre las 100 empresas */}
      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-[14px] text-neutral-500 dark:text-neutral-400">
            Progreso del mes
          </p>
          <p className="text-[14px] font-medium tabular-nums">
            {Math.min(total, PROSPECTING_GOAL)} / {PROSPECTING_GOAL}
          </p>
        </div>
        <ProgressBar value={total} max={PROSPECTING_GOAL} />
      </div>

      {/* Seguimientos */}
      <div className="mt-6 border-t border-neutral-200/70 pt-5 dark:border-white/10">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-medium">
            Seguimientos pendientes hoy
            {pending.length > 0 && (
              <span className="ml-2 rounded-full bg-accent-500/10 px-2 py-0.5 text-[12px] font-semibold text-accent-600 dark:text-accent-400">
                {pending.length}
              </span>
            )}
          </p>
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="text-[13px] text-accent-600 transition-colors hover:text-accent-700 dark:text-accent-400"
          >
            {showAdd ? 'Cerrar' : '+ Programar'}
          </button>
        </div>

        {showAdd && <AddFollowUp update={update} onDone={() => setShowAdd(false)} />}

        {pending.length === 0 ? (
          <p className="mt-3 text-[14px] text-neutral-400">Nada pendiente. 👌</p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {pending.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-3 rounded-2xl bg-neutral-100/70 px-3 py-2.5 dark:bg-white/[0.04]"
              >
                <input
                  type="checkbox"
                  checked={!!f.done}
                  onChange={() => toggleFollow(f.id)}
                  className="h-5 w-5 shrink-0 accent-[#0a84ff]"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] text-neutral-800 dark:text-neutral-100">
                    {f.company}
                  </p>
                  {f.note && <p className="truncate text-[13px] text-neutral-400">{f.note}</p>}
                </div>
                <span className="shrink-0 text-[12px] text-neutral-400">
                  {f.dueDate < today ? 'Vencido' : 'Hoy'}
                </span>
                <button
                  onClick={() => removeFollow(f.id)}
                  aria-label="Eliminar"
                  className="shrink-0 rounded-full p-1.5 text-neutral-400 transition-colors hover:text-red-500"
                >
                  <Icon.Trash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}

function AddFollowUp({ update, onDone }) {
  const [company, setCompany] = useState('')
  const [note, setNote] = useState('')
  const [dueDate, setDueDate] = useState(todayKey())

  const add = () => {
    if (!company.trim()) return
    update((d) => {
      d.followUps.push({
        id: 'f' + Date.now() + Math.floor(performance.now()),
        company: company.trim(),
        note: note.trim(),
        dueDate,
        done: false,
      })
    })
    onDone()
  }

  return (
    <div className="mt-3 space-y-2 rounded-2xl border border-dashed border-neutral-300 p-3 dark:border-neutral-700">
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Empresa"
        className="w-full rounded-xl bg-neutral-100/70 px-3 py-2 text-[14px] outline-none ring-accent-400 focus:ring-2 dark:bg-white/[0.04]"
      />
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Nota (opcional)"
        className="w-full rounded-xl bg-neutral-100/70 px-3 py-2 text-[14px] outline-none ring-accent-400 focus:ring-2 dark:bg-white/[0.04]"
      />
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="flex-1 rounded-xl bg-neutral-100/70 px-3 py-2 text-[14px] outline-none ring-accent-400 focus:ring-2 dark:bg-white/[0.04]"
        />
        <button
          onClick={add}
          className="rounded-xl bg-accent-500 px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-accent-600"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
