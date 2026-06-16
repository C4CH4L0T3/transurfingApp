import { useEffect, useRef, useState } from 'react'
import { useApp, defaultState, todayKey } from '../store.jsx'
import { Icon } from '../ui.jsx'
import { getSpanishVoices } from '../briefing.js'

export default function DataMenu() {
  const { state, setState, update } = useApp()
  const [open, setOpen] = useState(false)
  const fileRef = useRef(null)
  const menuRef = useRef(null)

  const toggleGreeting = () =>
    update((d) => {
      d.settings.voiceGreeting = !d.settings.voiceGreeting
    })

  const editName = () => {
    const current = state.settings.name || ''
    const next = window.prompt('¿Cómo quieres que te salude la asistente?', current)
    if (next === null) return // canceló
    update((d) => {
      d.settings.name = next.trim()
    })
  }

  // Voces en español disponibles, para que elijas la más natural.
  const [voices, setVoices] = useState([])
  useEffect(() => {
    let alive = true
    getSpanishVoices().then((vs) => alive && setVoices(vs))
    return () => {
      alive = false
    }
  }, [])

  const setVoice = (uri) =>
    update((d) => {
      d.settings.voiceURI = uri
    })

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Exporta TODO el estado (incluye notas de los 78 días) como JSON.
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transformacion-respaldo-${todayKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  const importJSON = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!data || typeof data !== 'object') throw new Error('formato')
        setState(data)
        alert('Respaldo importado correctamente.')
      } catch {
        alert('No se pudo leer el archivo. Asegúrate de que sea un respaldo válido.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
    setOpen(false)
  }

  const reset = () => {
    if (
      confirm(
        '¿Reiniciar todos los datos? Esto borra hábitos, rachas, contadores y las notas de los 78 días. No se puede deshacer.',
      )
    ) {
      setState(defaultState())
      setOpen(false)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Datos"
        title="Datos"
        className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200/70 dark:text-neutral-400 dark:hover:bg-white/10"
      >
        <Icon.Menu />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:bg-[#2c2c2e] dark:ring-white/10">
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            Asistente de voz
          </p>
          <MenuItem onClick={toggleGreeting}>
            Saludo al abrir
            <span className="ml-2 text-[13px] text-neutral-400">
              {state.settings.voiceGreeting ? 'Activado' : 'Desactivado'}
            </span>
          </MenuItem>
          <MenuItem onClick={editName}>
            Mi nombre
            <span className="ml-2 text-[13px] text-neutral-400">
              {state.settings.name ? state.settings.name : 'sin definir'}
            </span>
          </MenuItem>
          <div className="px-3 py-2">
            <label className="mb-1 block text-[12px] text-neutral-500">Voz</label>
            <select
              value={state.settings.voiceURI || ''}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full rounded-lg bg-neutral-100 px-2 py-1.5 text-[13px] outline-none dark:bg-white/10"
            >
              <option value="">Automática (mejor disponible)</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name}
                </option>
              ))}
            </select>
            {voices.length === 0 && (
              <p className="mt-1 text-[11px] text-neutral-400">
                No se detectaron voces en español.
              </p>
            )}
          </div>
          <div className="my-1 h-px bg-neutral-200/70 dark:bg-white/10" />
          <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            Datos
          </p>
          <MenuItem onClick={exportJSON}>Exportar respaldo (.json)</MenuItem>
          <MenuItem onClick={() => fileRef.current?.click()}>Importar respaldo…</MenuItem>
          <div className="my-1 h-px bg-neutral-200/70 dark:bg-white/10" />
          <MenuItem onClick={reset} danger>
            Reiniciar todo
          </MenuItem>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        onChange={importJSON}
        className="hidden"
      />
    </div>
  )
}

function MenuItem({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={
        'w-full rounded-xl px-3 py-2.5 text-left text-[14px] transition-colors ' +
        (danger
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
          : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-white/10')
      }
    >
      {children}
    </button>
  )
}
