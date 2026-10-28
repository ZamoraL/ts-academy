import { NavLink, Outlet } from 'react-router-dom'
import { UNITS } from '../content'
import { todayISO } from '../lib/date'
import { computeStreak } from '../lib/streak'
import { useProgress } from '../store/progress'

const NAV = [
  { to: '/', label: 'Hoy', end: true },
  { to: '/plan', label: 'Plan' },
  { to: '/temario', label: 'Temario' },
  { to: '/ajustes', label: 'Ajustes' },
]

export function Layout() {
  const completed = useProgress((s) => s.completed)
  const activity = useProgress((s) => s.activity)
  const pace = useProgress((s) => s.config?.pace ?? 'daily')
  const done = Object.keys(completed).length
  const percent = Math.round((done / UNITS.length) * 100)
  const streak = computeStreak(activity, todayISO(), pace)

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 font-semibold text-white">
            <span className="grid h-7 w-7 place-items-center rounded bg-brand-500 text-xs font-bold">TS</span>
            Academy
          </NavLink>
          <nav className="flex gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4 text-sm text-slate-400">
            <span title="Racha de días">🔥 {streak}</span>
            <span className="flex items-center gap-2" title={`${done} de ${UNITS.length} unidades`}>
              <span className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-800">
                <span className="block h-full bg-brand-400" style={{ width: `${percent}%` }} />
              </span>
              {percent}%
            </span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
