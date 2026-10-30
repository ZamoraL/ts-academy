import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { KindBadge } from '../components/DayCard'
import { FeasibilityNote } from '../components/FeasibilityNote'
import { link, plural } from '../components/styles'
import { PageHeader } from '../components/ui'
import { UNITS } from '../content'
import { diffDays, formatLong, formatShort, todayISO } from '../lib/date'
import { useSchedule } from '../lib/useSchedule'
import { useProgress } from '../store/progress'
import type { ScheduledDay } from '../types'

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
    <div className="space-y-8">
      <PageHeader
        title="Horario"
        meta={`Del ${formatLong(config.startDate)} al ${formatLong(schedule.endDate)}. Si te saltas un día, lo pendiente se mueve hacia adelante.`}
      >
        <Link to="/ajustes" className={`${link} text-sm`}>
          Cambiar ritmo o duración
        </Link>
      </PageHeader>
      <FeasibilityNote schedule={schedule} durationWeeks={config.durationWeeks} />

      {weeks.length === 0 && (
        <p className="text-fg-muted">
          No quedan servicios: recorriste todas las estaciones.{' '}
          <Link to="/temario" className={link}>
            Repasa cualquier estación desde el plano
          </Link>
          .
        </p>
      )}

      <div>
      {weeks.map(([week, days], i) => {
        const unidades = days.reduce((n, d) => n + (d.kind === 'study' ? d.unitIds.length : 0), 0)
        return (
          // Las dos primeras semanas abiertas; el resto, resumidas.
          <details key={week} open={i < 2} className="group open:mb-6">
            <summary className="flex min-h-10 items-baseline gap-3 border-b border-border py-2 hover:bg-surface-2">
              <span className="w-4 font-mono text-fg-muted" aria-hidden>
                <span className="group-open:hidden">▸</span>
                <span className="hidden group-open:inline">▾</span>
              </span>
              <h2 className="font-display text-base">Semana {week}</h2>
              <span className="tabular font-mono text-xs text-fg-muted">
                {formatShort(days[0].date)} – {formatShort(days.at(-1)!.date)} · {plural(unidades, 'unidad', 'unidades')}
              </span>
            </summary>
            <ul className="divide-y divide-border">
              {days.map((d) => {
                const esHoy = d.date === today
                return (
                  <li
                    key={d.date}
                    aria-current={esHoy ? 'date' : undefined}
                    className={`flex flex-col gap-1 py-2.5 pl-7 text-sm sm:flex-row sm:items-center sm:gap-3 ${
                      esHoy ? 'rounded-md bg-surface-2 shadow-[inset_4px_0_0_var(--accent)]' : ''
                    } ${d.date > schedule.endDate ? 'text-fg-muted' : ''}`}
                  >
                    <span className="flex w-48 shrink-0 items-center gap-3">
                      <span className={`tabular w-24 first-letter:uppercase ${esHoy ? 'font-bold' : 'text-fg-muted'}`}>
                        {esHoy ? 'Hoy' : formatShort(d.date)}
                      </span>
                      <KindBadge kind={d.kind} accent={esHoy} />
                    </span>
                    <span className="flex min-w-0 flex-wrap gap-x-4 gap-y-1">
                      {d.kind === 'study' ? (
                        d.unitIds.map((id) => (
                          <Link key={id} to={`/unidad/${id}`} className="hover:underline">
                            <span className="mr-1.5 font-mono text-xs text-fg-muted">{id}</span>
                            {titles.get(id)}
                          </Link>
                        ))
                      ) : (
                        <Link to={`/repaso/${d.date}`} className="hover:underline">
                          Repasar {plural(d.unitIds.length, 'estación', 'estaciones')}
                        </Link>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </details>
        )
      })}
      </div>
    </div>
  )
}
