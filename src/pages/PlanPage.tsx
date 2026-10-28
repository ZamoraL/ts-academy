import { useMemo } from 'react'
import { KindBadge } from '../components/DayCard'
import { FeasibilityNote } from '../components/FeasibilityNote'
import { UNITS } from '../content'
import { diffDays, formatLong, formatShort, todayISO } from '../lib/date'
import { useSchedule } from '../lib/useSchedule'
import { useProgress } from '../store/progress'
import type { ScheduledDay } from '../types'
import { Link } from 'react-router-dom'

const titles = new Map(UNITS.map((u) => [u.id, u.title]))

export function PlanPage() {
  const schedule = useSchedule()
  const config = useProgress((s) => s.config)!
  const today = todayISO()

  const weeks = useMemo(() => {
    const groups = new Map<number, ScheduledDay[]>()
    for (const day of schedule?.days ?? []) {
      const week = Math.floor(diffDays(config.startDate, day.date) / 7) + 1
      groups.set(week, [...(groups.get(week) ?? []), day])
    }
    return [...groups.entries()]
  }, [schedule, config.startDate])

  if (!schedule) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Plan de estudio</h1>
        <p className="mt-1 text-sm text-slate-400">
          Del {formatLong(config.startDate)} al {formatLong(schedule.endDate)}. El plan se recalcula solo: si te saltas
          un día, lo pendiente se mueve hacia adelante.
        </p>
        <div className="mt-2 text-sm">
          <FeasibilityNote schedule={schedule} durationWeeks={config.durationWeeks} />
        </div>
      </div>

      {weeks.map(([week, days]) => (
        <section key={week}>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Semana {week}</h2>
          <ul className="divide-y divide-slate-800 rounded-xl border border-slate-800">
            {days.map((d) => (
              <li
                key={d.date}
                className={`flex flex-col gap-1 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:gap-3 ${
                  d.date === today ? 'bg-brand-500/5' : ''
                } ${d.date > schedule.endDate ? 'opacity-60' : ''}`}
              >
                <span className="w-28 shrink-0 text-slate-400">
                  {d.date === today ? 'Hoy' : formatShort(d.date)}
                </span>
                <KindBadge kind={d.kind} />
                <span className="flex flex-wrap gap-x-3 text-slate-300">
                  {d.kind === 'study'
                    ? d.unitIds.map((id) => (
                        <Link key={id} to={`/unidad/${id}`} className="hover:text-white hover:underline">
                          {titles.get(id)}
                        </Link>
                      ))
                    : (
                      <Link to={`/repaso/${d.date}`} className="hover:text-white hover:underline">
                        Repasar {d.unitIds.length === 1 ? '1 unidad' : `${d.unitIds.length} unidades`}
                      </Link>
                    )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
