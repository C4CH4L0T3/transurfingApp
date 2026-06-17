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

const THEME_ORDER = ['time', 'light', 'dark']
const THEME_LABEL = {
  time: 'Automático (según la hora)',
  light: 'Modo claro',
  dark: 'Modo oscuro',
}

function ThemeToggle() {
  const { state, update } = useApp()
  const theme = state.settings.theme
  const cycle = () =>
    update((d) => {
      const i = THEME_ORDER.indexOf(d.settings.theme)
      d.settings.theme = THEME_ORDER[(i + 1) % THEME_ORDER.length] || 'time'
    })
  return (
    <IconButton label={THEME_LABEL[theme] || 'Cambiar tema'} onClick={cycle}>
      {theme === 'time' ? <Icon.Clock /> : theme === 'dark' ? <Icon.Moon /> : <Icon.Sun />}
    </IconButton>
  )
}

function Shell() {
  const [tab, setTab] = useState('hoy')

  return (
    <div className="min-h-screen pb-20">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 border-b border-accent-700/15 bg-[#e9dcbf]/85 backdrop-blur-xl dark:border-accent-400/15 dark:bg-[#15100a]/85">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-accent-500/50 bg-gradient-to-b from-accent-300 to-accent-600 text-[#2a2015] shadow-sm">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-roman text-[15px] font-semibold tracking-[0.12em] text-neutral-800 dark:text-neutral-100">
              RENACIMIENTO
            </span>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={PLAN_PDF_PATH}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] text-neutral-600 transition-colors hover:bg-accent-500/10 hover:text-accent-700 dark:text-neutral-300 dark:hover:text-accent-300 sm:flex"
            >
              <Icon.External />
              Ver el plan
            </a>
            <a
              href={PLAN_PDF_PATH}
              target="_blank"
              rel="noreferrer"
              aria-label="Ver el plan completo"
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-accent-500/10 hover:text-accent-700 dark:text-neutral-400 dark:hover:text-accent-300 sm:hidden"
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
          <div className="flex gap-1 rounded-full border border-accent-700/15 bg-neutral-200/50 p-1 dark:border-accent-400/10 dark:bg-white/[0.05]">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={
                  'flex-1 rounded-full px-3 py-2 text-[14px] font-medium tracking-wide transition-all ' +
                  (tab === t.id
                    ? 'bg-gradient-to-b from-accent-400 to-accent-600 text-[#2a2015] shadow-sm'
                    : 'text-neutral-600 hover:text-accent-700 dark:text-neutral-300 dark:hover:text-accent-300')
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
