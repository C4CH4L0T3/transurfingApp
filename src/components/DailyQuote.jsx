import { useState } from 'react'
import { useApp, todayKey } from '../store.jsx'
import { Card, Icon } from '../ui.jsx'

// Elige una frase distinta por día, de forma estable (misma frase todo el día).
function quoteOfTheDay(quotes) {
  if (!quotes.length) return null
  const [y, m, d] = todayKey().split('-').map(Number)
  // Número de día absoluto -> índice rotativo determinista.
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86400000)
  return quotes[((dayNumber % quotes.length) + quotes.length) % quotes.length]
}

export default function DailyQuote() {
  const { state, update } = useApp()
  const [editing, setEditing] = useState(false)
  const q = quoteOfTheDay(state.quotes)

  return (
    <Card className="p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-accent-500">
          Frase del día
        </div>
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-[13px] text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          {editing ? 'Listo' : 'Editar frases'}
        </button>
      </div>

      {!editing && q && (
        <figure className="mt-3">
          <blockquote className="text-[19px] font-medium leading-relaxed text-neutral-800 dark:text-neutral-100">
            “{q.text}”
          </blockquote>
          <figcaption className="mt-2 text-[14px] text-neutral-500 dark:text-neutral-400">
            — {q.author}
            {q.source ? `, ${q.source}` : ''}
          </figcaption>
        </figure>
      )}

      {!editing && !q && (
        <p className="mt-3 text-[15px] text-neutral-500">
          No hay frases. Pulsa “Editar frases” para agregar la primera.
        </p>
      )}

      {editing && <QuoteEditor state={state} update={update} />}
    </Card>
  )
}

function QuoteEditor({ state, update }) {
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [source, setSource] = useState('')

  const add = () => {
    if (!text.trim()) return
    update((d) => {
      d.quotes.push({ text: text.trim(), author: author.trim(), source: source.trim() })
    })
    setText('')
    setAuthor('')
    setSource('')
  }

  const remove = (i) => update((d) => d.quotes.splice(i, 1))

  return (
    <div className="mt-4 space-y-4">
      <ul className="space-y-2">
        {state.quotes.map((q, i) => (
          <li
            key={i}
            className="flex items-start justify-between gap-3 rounded-2xl bg-neutral-100/70 px-4 py-3 dark:bg-white/[0.04]"
          >
            <div className="text-[14px]">
              <p className="text-neutral-800 dark:text-neutral-100">“{q.text}”</p>
              <p className="mt-0.5 text-[13px] text-neutral-500">
                — {q.author}
                {q.source ? `, ${q.source}` : ''}
              </p>
            </div>
            <button
              onClick={() => remove(i)}
              aria-label="Eliminar frase"
              className="shrink-0 rounded-full p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
            >
              <Icon.Trash />
            </button>
          </li>
        ))}
      </ul>

      <div className="space-y-2 rounded-2xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe la frase…"
          rows={2}
          className="w-full resize-none rounded-xl bg-neutral-100/70 px-3 py-2 text-[15px] outline-none ring-accent-400 focus:ring-2 dark:bg-white/[0.04]"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Autor"
            className="flex-1 rounded-xl bg-neutral-100/70 px-3 py-2 text-[14px] outline-none ring-accent-400 focus:ring-2 dark:bg-white/[0.04]"
          />
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Fuente / libro (opcional)"
            className="flex-1 rounded-xl bg-neutral-100/70 px-3 py-2 text-[14px] outline-none ring-accent-400 focus:ring-2 dark:bg-white/[0.04]"
          />
        </div>
        <button
          onClick={add}
          className="rounded-xl bg-accent-500 px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-accent-600"
        >
          Agregar frase
        </button>
      </div>
    </div>
  )
}
