import { formatLong } from '../lib/date'
import { PACES, type Schedule } from '../lib/scheduler'

export function FeasibilityNote({ schedule, durationWeeks }: { schedule: Schedule; durationWeeks: number }) {
  const hours = Math.round(schedule.remainingMinutes / 60)
  const reviews = schedule.days.filter((d) => d.kind === 'review').length

  if (schedule.feasible) {
    return (
      <p className="text-fg-muted">
        <span className="text-success-ink">✓</span> Te alcanza el tiempo: {hours} h de contenido pendiente
        {reviews > 0 && `, con ${reviews === 1 ? '1 día' : `${reviews} días`} extra de repaso`}.
      </p>
    )
  }

  const alternatives = schedule.feasiblePaces.map((p) => PACES[p].label)
  return (
    <div>
      <p>
        <span className="font-mono text-danger-ink">!</span> Con este ritmo no terminas en {durationWeeks} semanas:
        acabarías el {schedule.projectedEndDate && formatLong(schedule.projectedEndDate)} ({hours} h de contenido).
      </p>
      <p className="mt-1 text-fg-muted">
        Puedes ampliar a <strong className="font-bold text-fg">{schedule.minWeeksForPace} semanas</strong>
        {alternatives.length > 0 && <> o cambiar a: {alternatives.join(', ')}</>}.
      </p>
    </div>
  )
}
