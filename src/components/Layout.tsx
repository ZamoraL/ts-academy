import { NavLink, Outlet } from 'react-router-dom'
import { UNITS } from '../content'
import { useProgress } from '../store/progress'
import { CommandPalette } from './CommandPalette'
import { teclaMod } from './styles'

const NAV = [
  { to: '/', label: 'Hoy', end: true },
  { to: '/temario', label: 'Plano' },
  { to: '/plan', label: 'Horario' },
  { to: '/ajustes', label: 'Ajustes' },
]

export function Layout() {
  const done = useProgress((s) => Object.keys(s.completed).length)

  return (
    <div className="min-h-screen">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-20 focus:bg-surface focus:px-3 focus:py-2"
      >
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-10 border-b border-border bg-bg">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 px-4 sm:px-6">
          <NavLink to="/" className="flex h-14 items-center gap-2">
            <span className="font-display grid h-8 w-8 place-items-center rounded-full bg-fg text-[11px] text-bg" aria-hidden>
              TS
            </span>
            <span className="font-display text-sm">Academy</span>
          </NavLink>
          <nav aria-label="Principal" className="order-last -mx-2 flex w-full sm:order-none sm:mx-0 sm:w-auto">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex h-11 items-center border-b-4 px-2 sm:h-14 sm:px-3 ${
                    isActive ? 'border-accent font-bold text-fg' : 'border-transparent text-fg-muted hover:text-fg'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <span className="tabular hidden text-sm text-fg-muted sm:inline" title="Estaciones recorridas">
              {done}/{UNITS.length} estaciones
            </span>
            <button
              onClick={() => window.dispatchEvent(new Event('abrir-buscador'))}
              className="flex h-9 items-center gap-2 rounded-md border border-border px-2.5 text-sm text-fg-muted hover:text-fg"
            >
              <span className="hidden sm:inline">Buscar estación</span>
              <span className="sm:hidden">Buscar</span>
              <kbd className="hidden sm:inline">{teclaMod} K</kbd>
            </button>
          </div>
        </div>
      </header>
      <main id="contenido" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
      <CommandPalette />
    </div>
  )
}
