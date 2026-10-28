import type { Pace, PlanConfig, ScheduledDay, Unit } from '../types'
import { addDays, diffDays, maxDate, weekday, type ISODate } from './date'

export interface PaceInfo {
  label: string
  description: string
  minutesPerDay: number
  /** Días con contenido nuevo (0 = domingo) */
  studyWeekdays: number[]
  /** Días de práctica semanal: rehacer ejercicios de la semana */
  practiceWeekdays: number[]
}

export const PACES: Record<Pace, PaceInfo> = {
  intense: {
    label: '5 días + práctica el sábado',
    description: 'Lunes a viernes ~1 h de lección. Sábado práctica de la semana. Domingo descanso.',
    minutesPerDay: 60,
    studyWeekdays: [1, 2, 3, 4, 5],
    practiceWeekdays: [6],
  },
  daily: {
    label: '7 días ~45 min',
    description: 'Lección nueva todos los días, sesiones medianas.',
    minutesPerDay: 45,
    studyWeekdays: [0, 1, 2, 3, 4, 5, 6],
    practiceWeekdays: [],
  },
  light: {
    label: '5 días ~30 min',
    description: 'Lunes a viernes, sesiones cortas. Fines de semana libres.',
    minutesPerDay: 30,
    studyWeekdays: [1, 2, 3, 4, 5],
    practiceWeekdays: [],
  },
}

export const DURATION_PRESETS = [
  { label: '3 meses', weeks: 13 },
  { label: '6 meses', weeks: 26 },
  { label: '1 año', weeks: 52 },
]

export interface ScheduleInput {
  units: Unit[]
  config: PlanConfig
  /** unitId -> fecha en que se completó */
  completed: Record<string, ISODate>
  today: ISODate
}

export interface Schedule {
  days: ScheduledDay[]
  endDate: ISODate
  /** Último día con contenido nuevo planificado */
  projectedEndDate: ISODate | null
  feasible: boolean
  remainingMinutes: number
  /** Semanas mínimas (desde la fecha de inicio) para terminar con este ritmo */
  minWeeksForPace: number
  /** Ritmos con los que sí se termina dentro de la duración elegida */
  feasiblePaces: Pace[]
}

export function planEndDate(config: PlanConfig): ISODate {
  return addDays(config.startDate, config.durationWeeks * 7 - 1)
}

/** Agrupa unidades en sesiones diarias sin superar la capacidad. */
export function packUnits(units: Unit[], capacity: number, firstDayUsed = 0): Unit[][] {
  const groups: Unit[][] = []
  let current: Unit[] = []
  let used = firstDayUsed
  for (const unit of units) {
    if (used + unit.minutes > capacity && (current.length > 0 || used > 0)) {
      groups.push(current)
      current = []
      used = 0
    }
    current.push(unit)
    used += unit.minutes
  }
  if (current.length > 0) groups.push(current)
  return groups
}

function isStudyDay(date: ISODate, pace: PaceInfo): boolean {
  return pace.studyWeekdays.includes(weekday(date))
}

function countStudyDays(from: ISODate, to: ISODate, pace: PaceInfo): number {
  let n = 0
  for (let d = from; d <= to; d = addDays(d, 1)) if (isStudyDay(d, pace)) n++
  return n
}

/** Fecha del n-ésimo día de estudio (1-indexado) a partir de `from`. */
function nthStudyDay(from: ISODate, n: number, pace: PaceInfo): ISODate {
  let d = from
  let count = 0
  for (;;) {
    if (isStudyDay(d, pace) && ++count === n) return d
    d = addDays(d, 1)
  }
}

interface Simulation {
  groups: Unit[][]
  /** Días de estudio disponibles hasta la fecha final */
  available: number
}

function simulate(input: ScheduleInput, paceKey: Pace, from: ISODate): Simulation {
  const pace = PACES[paceKey]
  const remaining = input.units.filter((u) => !(u.id in input.completed))
  const doneToday = input.units
    .filter((u) => input.completed[u.id] === from)
    .reduce((sum, u) => sum + u.minutes, 0)
  // Lo hecho hoy ocupa la capacidad de hoy, solo si hoy es día de estudio.
  const firstDayUsed = isStudyDay(from, pace) ? doneToday : 0
  const groups = packUnits(remaining, pace.minutesPerDay, firstDayUsed)
  const available = countStudyDays(from, planEndDate(input.config), pace)
  return { groups, available }
}

export function buildSchedule(input: ScheduleInput): Schedule {
  const { config, today } = input
  const pace = PACES[config.pace]
  const from = maxDate(today, config.startDate)
  const endDate = planEndDate(config)
  const { groups, available } = simulate(input, config.pace, from)
  const unitsById = new Map(input.units.map((u) => [u.id, u]))
  const minutesOf = (ids: string[]) => ids.reduce((s, id) => s + (unitsById.get(id)?.minutes ?? 0), 0)

  const M = groups.length
  const N = Math.max(available, M)
  // Posición (entre los N días de estudio) de cada grupo; los huecos son días de repaso.
  const groupAt = new Map<number, number>()
  for (let j = 0; j < M; j++) groupAt.set(Math.floor((j * N) / M), j)

  const days: ScheduledDay[] = []
  const sinceReview: string[] = []
  const sincePractice: string[] = []
  // Unidades hechas recientemente cuentan para la práctica de esta semana.
  for (const [id, date] of Object.entries(input.completed)) {
    if (diffDays(date, from) < 7 && diffDays(date, from) >= 0) sincePractice.push(id)
  }

  let studyIndex = 0
  const lastStudyDate = M > 0 ? nthStudyDay(from, N, pace) : from
  for (let d = from; M > 0 && d <= lastStudyDate; d = addDays(d, 1)) {
    if (isStudyDay(d, pace)) {
      const j = groupAt.get(studyIndex)
      if (j !== undefined) {
        const ids = groups[j].map((u) => u.id)
        days.push({ date: d, kind: 'study', unitIds: ids, minutes: minutesOf(ids) })
        sinceReview.push(...ids)
        sincePractice.push(...ids)
      } else {
        const ids = sinceReview.splice(0)
        days.push({ date: d, kind: 'review', unitIds: ids, minutes: pace.minutesPerDay })
      }
      studyIndex++
    } else if (pace.practiceWeekdays.includes(weekday(d)) && sincePractice.length > 0) {
      const ids = sincePractice.splice(0)
      days.push({ date: d, kind: 'practice', unitIds: ids, minutes: pace.minutesPerDay })
    }
  }

  const studyDays = days.filter((d) => d.kind === 'study')
  const projectedEndDate = studyDays.length > 0 ? studyDays[studyDays.length - 1].date : null
  const feasible = M <= available

  const minWeeksFor = (p: Pace): number => {
    const sim = simulate(input, p, from)
    if (sim.groups.length === 0) return Math.ceil((diffDays(config.startDate, from) + 1) / 7)
    const last = nthStudyDay(from, sim.groups.length, PACES[p])
    return Math.ceil((diffDays(config.startDate, last) + 1) / 7)
  }

  return {
    days,
    endDate,
    projectedEndDate,
    feasible,
    remainingMinutes: groups.flat().reduce((s, u) => s + u.minutes, 0),
    minWeeksForPace: minWeeksFor(config.pace),
    feasiblePaces: (Object.keys(PACES) as Pace[]).filter((p) => {
      const sim = simulate(input, p, from)
      return sim.groups.length <= sim.available
    }),
  }
}
