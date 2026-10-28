import { describe, expect, it } from 'vitest'
import type { Unit } from '../types'
import { addDays, weekday } from './date'
import { buildSchedule, packUnits, planEndDate } from './scheduler'

function makeUnits(n: number, minutes = 30): Unit[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `u${i}`,
    blockId: 'b',
    title: `Unidad ${i}`,
    kind: 'lesson' as const,
    minutes,
    sources: [],
    exercises: [],
    quiz: [],
  }))
}

// 2026-11-02 es lunes
const MONDAY = '2026-11-02'

describe('packUnits', () => {
  it('agrupa sin superar la capacidad', () => {
    const groups = packUnits(makeUnits(5), 60)
    expect(groups.map((g) => g.length)).toEqual([2, 2, 1])
  })

  it('respeta lo ya usado el primer día', () => {
    const groups = packUnits(makeUnits(3), 60, 30)
    expect(groups.map((g) => g.length)).toEqual([1, 2])
  })

  it('si el primer día ya está lleno, empieza en el siguiente', () => {
    const groups = packUnits(makeUnits(2), 30, 30)
    expect(groups[0]).toEqual([])
    expect(groups.slice(1).map((g) => g.length)).toEqual([1, 1])
  })
})

describe('buildSchedule', () => {
  it('ritmo intense: lunes a viernes estudio, sábado práctica, domingo libre', () => {
    const s = buildSchedule({
      units: makeUnits(20),
      config: { startDate: MONDAY, durationWeeks: 2, pace: 'intense' },
      completed: {},
      today: MONDAY,
    })
    expect(s.feasible).toBe(true)
    const kinds = s.days.map((d) => [weekday(d.date), d.kind])
    expect(kinds.slice(0, 6)).toEqual([
      [1, 'study'],
      [2, 'study'],
      [3, 'study'],
      [4, 'study'],
      [5, 'study'],
      [6, 'practice'],
    ])
    expect(s.days.some((d) => weekday(d.date) === 0)).toBe(false)
    expect(s.days[5].unitIds).toHaveLength(10)
  })

  it('sin tiempo suficiente marca no viable y sugiere semanas mínimas', () => {
    const s = buildSchedule({
      units: makeUnits(40),
      config: { startDate: MONDAY, durationWeeks: 2, pace: 'light' },
      completed: {},
      today: MONDAY,
    })
    expect(s.feasible).toBe(false)
    expect(s.minWeeksForPace).toBe(8)
    expect(s.projectedEndDate! > planEndDate({ startDate: MONDAY, durationWeeks: 2, pace: 'light' })).toBe(true)
    expect(s.days.filter((d) => d.kind === 'study')).toHaveLength(40)
  })

  it('con tiempo de sobra intercala días de repaso', () => {
    const s = buildSchedule({
      units: makeUnits(5),
      config: { startDate: MONDAY, durationWeeks: 2, pace: 'light' },
      completed: {},
      today: MONDAY,
    })
    expect(s.feasible).toBe(true)
    expect(s.days.filter((d) => d.kind === 'study')).toHaveLength(5)
    expect(s.days.filter((d) => d.kind === 'review')).toHaveLength(5)
    expect(s.days[0].kind).toBe('study')
    expect(s.days[1]).toMatchObject({ kind: 'review', unitIds: ['u0'] })
  })

  it('recalcula desde hoy excluyendo lo completado', () => {
    const today = addDays(MONDAY, 7)
    const s = buildSchedule({
      units: makeUnits(4),
      config: { startDate: MONDAY, durationWeeks: 1, pace: 'daily' },
      completed: { u0: MONDAY, u1: MONDAY },
      today,
    })
    expect(s.days[0].date).toBe(today)
    expect(s.days.flatMap((d) => (d.kind === 'study' ? d.unitIds : []))).toEqual(['u2', 'u3'])
  })

  it('lo completado hoy ocupa la capacidad de hoy', () => {
    const s = buildSchedule({
      units: makeUnits(4),
      config: { startDate: MONDAY, durationWeeks: 4, pace: 'light' },
      completed: { u0: MONDAY },
      today: MONDAY,
    })
    const firstStudy = s.days.find((d) => d.kind === 'study' && d.unitIds.length > 0)!
    expect(firstStudy.date).not.toBe(MONDAY)
  })

  it('todo completado: plan vacío', () => {
    const s = buildSchedule({
      units: makeUnits(2),
      config: { startDate: MONDAY, durationWeeks: 1, pace: 'daily' },
      completed: { u0: MONDAY, u1: MONDAY },
      today: MONDAY,
    })
    expect(s.days).toEqual([])
    expect(s.feasible).toBe(true)
  })
})
