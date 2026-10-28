import { describe, expect, it } from 'vitest'
import { computeStreak } from './streak'

// 2026-11-09 es lunes
describe('computeStreak', () => {
  it('cuenta días seguidos', () => {
    expect(computeStreak(['2026-11-03', '2026-11-04', '2026-11-05'], '2026-11-05', 'daily')).toBe(3)
  })

  it('hoy sin actividad no rompe la racha', () => {
    expect(computeStreak(['2026-11-03', '2026-11-04'], '2026-11-05', 'daily')).toBe(2)
  })

  it('el fin de semana no rompe la racha en ritmo light', () => {
    expect(computeStreak(['2026-11-05', '2026-11-06', '2026-11-09'], '2026-11-09', 'light')).toBe(3)
  })

  it('un día de estudio sin actividad rompe la racha', () => {
    expect(computeStreak(['2026-11-03', '2026-11-05'], '2026-11-05', 'daily')).toBe(1)
  })
})
