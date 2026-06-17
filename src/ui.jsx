// ---------------------------------------------------------------------------
// Piezas de interfaz reutilizables (estilo limpio y minimalista)
// ---------------------------------------------------------------------------

export function Card({ children, className = '', ...props }) {
  return (
    <div className={'surface rounded-3xl ' + className} {...props}>
      {children}
    </div>
  )
}

export function SectionLabel({ children }) {
  return (
    <h2 className="overline text-[12px] text-accent-700 dark:text-accent-400">{children}</h2>
  )
}

// Ornamento dorado centrado (fleurón) para acompañar títulos.
export function Ornament({ className = '' }) {
  return (
    <div className={'flex items-center justify-center gap-3 text-accent-500/70 ' + className}>
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent-500/50" />
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M12 2c1.2 3 2.8 4.6 5.8 5.8C14.8 9 13.2 10.6 12 13.6 10.8 10.6 9.2 9 6.2 7.8 9.2 6.6 10.8 5 12 2z" />
        <circle cx="12" cy="19" r="1.6" />
      </svg>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent-500/50" />
    </div>
  )
}

// Casilla marcable con etiqueta. Toda la fila es clicable.
export function Check({ checked, onChange, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={
        'group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ' +
        'hover:bg-neutral-100/80 dark:hover:bg-white/[0.04] ' +
        className
      }
    >
      <span
        className={
          'flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border transition-all duration-200 ' +
          (checked
            ? 'border-accent-500 bg-accent-500 text-white'
            : 'border-neutral-300 dark:border-neutral-600 group-hover:border-accent-400')
        }
      >
        <svg
          viewBox="0 0 24 24"
          className={
            'h-3.5 w-3.5 transition-all duration-200 ' +
            (checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0')
          }
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span
        className={
          'text-[15px] leading-snug transition-colors ' +
          (checked
            ? 'text-neutral-400 line-through dark:text-neutral-500'
            : 'text-neutral-800 dark:text-neutral-100')
        }
      >
        {children}
      </span>
    </button>
  )
}

export function ProgressBar({ value, max = 100, className = '' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className={'h-2 w-full overflow-hidden rounded-full bg-neutral-200/80 dark:bg-white/10 ' + className}>
      <div
        className="h-full rounded-full bg-accent-500 transition-[width] duration-500 ease-out"
        style={{ width: pct + '%' }}
      />
    </div>
  )
}

// Botón redondo de acción (icono).
export function IconButton({ children, label, active, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={
        'flex h-9 w-9 items-center justify-center rounded-full transition-colors ' +
        (active
          ? 'bg-accent-500 text-white'
          : 'text-neutral-500 hover:bg-neutral-200/70 dark:text-neutral-400 dark:hover:bg-white/10')
      }
      {...props}
    >
      {children}
    </button>
  )
}

// --- Iconos (trazo) ---
export const Icon = {
  Sun: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  Moon: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" {...p}>
      <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
    </svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="h-5 w-5" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Minus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="h-5 w-5" {...p}>
      <path d="M5 12h14" />
    </svg>
  ),
  Trash: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" {...p}>
      <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    </svg>
  ),
  External: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" {...p}>
      <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    </svg>
  ),
  Menu: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Flame: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" {...p}>
      <path d="M12 2c0 3-4 4-4 8a4 4 0 008 0c0-1-1-2-1-2 2 1 3 3 3 5a6 6 0 11-12 0c0-5 6-6 6-11z" />
    </svg>
  ),
  Speaker: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" {...p}>
      <path d="M11 5L6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
    </svg>
  ),
  Stop: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" {...p}>
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
    </svg>
  ),
  Clock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
}
