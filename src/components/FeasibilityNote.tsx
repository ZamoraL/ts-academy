import { formatLong } from '../lib/date'
import { PACES, type Schedule } from '../lib/scheduler'

export function FeasibilityNote({ schedule, durationWeeks }: { schedule: Schedule; durationWeeks: number }) {
  const hours = Math.round(schedule.remainingMinutes / 60)
  const reviews = schedule.days.filter((d) => d.kind === 'review').length

  if (schedule.feasible) {
    return (
      <p className="mt-1 text-emerald-400">
        ✓ Te alcanza el tiempo ({hours} h de contenido pendiente)
        {reviews > 0 && `, con ${reviews} días extra de repaso intercalados`}.
      </p>
    )
  }

  const alternatives = schedule.feasiblePaces.map((p) => PACES[p].label)
  return (
    <div className="mt-1 text-amber-400">
      <p>
        ⚠ Con este ritmo no terminas en {durationWeeks} semanas: acabarías el{' '}
        {schedule.projectedEndDate && formatLong(schedule.projectedEndDate)} ({hours} h de contenido).
      </p>
      <p className="mt-1 text-amber-300/80">
        Opciones: ampliar a <strong>{schedule.minWeeksForPace} semanas</strong>
        {alternatives.length > 0 && <> o cambiar a: {alternatives.join(', ')}</>}.
      </p>
    </div>
  )
}
