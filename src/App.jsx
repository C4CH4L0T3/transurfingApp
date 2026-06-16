import { useState } from 'react'
import { AppProvider, useApp } from './store.jsx'
import { PLAN_PDF_PATH } from './config.js'
import { IconButton, Icon } from './ui.jsx'
import DataMenu from './components/DataMenu.jsx'
import Assistant from './components/Assistant.jsx'
import Today from './components/Today.jsx'
import MonthGoals from './components/MonthGoals.jsx'
import Course78 from './components/Course78.jsx'
import ProgressView from './components/ProgressView.jsx'

const TABS = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'mes', label: 'Mes' },
  { id: 'curso', label: '78 días' },
  { id: 'progreso', label: 'Progreso' },
]

function ThemeToggle() {
  const { state, update } = useApp()
  const isDark = document.documentElement.classList.contains('dark')
  const toggle = () =>
    update((d) => {
      d.settings.theme = isDark ? 'light' : 'dark'
    })
  return (
    <IconButton label="Cambiar tema" onClick={toggle}>
      {isDark ? <Icon.Sun /> : <Icon.Moon />}
    </IconButton>
  )
}

function Shell() {
  const [tab, setTab] = useState('hoy')

  return (
    <div className="min-h-screen pb-20">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 border-b border-black/[0.05] bg-[#f5f5f7]/80 backdrop-blur-xl dark:border-white/[0.06] dark:bg-black/70">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500 text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Transformación</span>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={PLAN_PDF_PATH}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-200/70 dark:text-neutral-300 dark:hover:bg-white/10 sm:flex"
            >
              <Icon.External />
              Ver el plan
            </a>
            <a
              href={PLAN_PDF_PATH}
              target="_blank"
              rel="noreferrer"
              aria-label="Ver el plan completo"
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200/70 dark:text-neutral-400 dark:hover:bg-white/10 sm:hidden"
            >
              <Icon.External />
            </a>
            <Assistant />
            <ThemeToggle />
            <DataMenu />
          </div>
        </div>

        {/* Navegación por pestañas */}
        <nav className="mx-auto max-w-2xl px-4 pb-3">
          <div className="flex gap-1 rounded-2xl bg-neutral-200/60 p-1 dark:bg-white/[0.06]">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={
                  'flex-1 rounded-xl px-3 py-2 text-[14px] font-medium transition-all ' +
                  (tab === t.id
                    ? 'bg-white text-neutral-900 shadow-sm dark:bg-[#3a3a3c] dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200')
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        <div key={tab} className="animate-fade-in">
          {tab === 'hoy' && <Today />}
          {tab === 'mes' && <MonthGoals />}
          {tab === 'curso' && <Course78 />}
          {tab === 'progreso' && <ProgressView />}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
