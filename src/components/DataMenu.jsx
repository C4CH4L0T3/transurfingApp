import { useEffect, useRef, useState } from 'react'
import { useApp, defaultState, todayKey } from '../store.jsx'
import { Icon } from '../ui.jsx'

export default function DataMenu() {
  const { state, setState } = useApp()
  const [open, setOpen] = useState(false)
  const fileRef = useRef(null)
  const menuRef = useRef(null)

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
        <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:bg-[#2c2c2e] dark:ring-white/10">
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
