import type { Pace } from '../types'
import { addDays, weekday, type ISODate } from './date'
import { PACES } from './scheduler'

/**
 * Días seguidos con actividad, contando hacia atrás desde hoy.
 * Los días de descanso del ritmo no rompen la racha, y hoy aún sin actividad tampoco.
 */
export function computeStreak(activity: ISODate[], today: ISODate, pace: Pace): number {
  const active = new Set(activity)
  const info = PACES[pace]
  const isPlanned = (d: ISODate) =>
    info.studyWeekdays.includes(weekday(d)) || info.practiceWeekdays.includes(weekday(d))

  let streak = 0
  // Límite de seguridad: nunca más de 2 años hacia atrás.
  for (let i = 0, d = today; i < 730; i++, d = addDays(d, -1)) {
    if (active.has(d)) streak++
    else if (d === today || !isPlanned(d)) continue
    else break
  }
  return streak
}
