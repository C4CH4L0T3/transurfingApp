import { useState } from 'react'
import { Check, Icon } from '../ui.jsx'

// Lista de tareas marcables con modo de edición (agregar / quitar).
// Reutilizada por el protocolo de mañana y por las áreas de vida.
export default function EditableTaskList({ items, isChecked, onToggle, onAdd, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const add = () => {
    const label = draft.trim()
    if (!label) return
    onAdd(label)
    setDraft('')
  }

  return (
    <div>
      <div className="-mx-1 space-y-0.5">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-1">
            <Check checked={isChecked(it.id)} onChange={() => onToggle(it.id)} className="flex-1">
              {it.label}
            </Check>
            {editing && (
              <button
                onClick={() => onRemove(it.id)}
                aria-label="Quitar"
                className="shrink-0 rounded-full p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
              >
                <Icon.Trash />
              </button>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div className="mt-2 flex items-center gap-2 px-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Nuevo hábito…"
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

      <button
        onClick={() => setEditing((v) => !v)}
        className="mt-2 px-2 text-[13px] text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-200"
      >
        {editing ? 'Listo' : 'Editar'}
      </button>
    </div>
  )
}
