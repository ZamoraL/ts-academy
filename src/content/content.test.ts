import { describe, expect, it } from 'vitest'
import { CONTENT, EXERCISES, LESSONS, UNITS } from './index'
import { OUTLINE } from './outline'

describe('contenido', () => {
  it('cada unidad con contenido existe en el outline', () => {
    const ids = new Set(OUTLINE.map((e) => e.id))
    for (const id of Object.keys(CONTENT)) expect(ids.has(id), id).toBe(true)
  })

  it('cada lección .md corresponde a una unidad del outline', () => {
    const ids = new Set(OUTLINE.map((e) => e.id))
    for (const id of Object.keys(LESSONS)) expect(ids.has(id), id).toBe(true)
  })

  it('cada unidad con ejercicios tiene lección', () => {
    for (const u of UNITS) if (u.exercises.length > 0) expect(Boolean(u.lesson), u.id).toBe(true)
  })

  it('cada id de unidad empieza por su bloque y tiene formato fijo', () => {
    for (const e of OUTLINE) expect(e.id, e.id).toMatch(new RegExp(`^${e.blockId}\\d{2}$`))
  })

  it('cada ejercicio usa el id de su unidad como prefijo', () => {
    for (const u of UNITS) for (const e of u.exercises) expect(e.id.startsWith(`${u.id}-`), e.id).toBe(true)
  })

  it('ids de unidades y ejercicios son únicos', () => {
    expect(new Set(UNITS.map((u) => u.id)).size).toBe(UNITS.length)
    expect(new Set(EXERCISES.map((e) => e.id)).size).toBe(EXERCISES.length)
  })

  it('ninguna unidad supera 30 minutos', () => {
    for (const u of UNITS) expect(u.minutes).toBeLessThanOrEqual(30)
  })

  it('las respuestas de los quizzes son índices válidos', () => {
    for (const u of UNITS)
      for (const q of u.quiz) expect(q.answer, q.question).toBeLessThan(q.options.length)
  })

  it('cada ejercicio tiene alguna verificación', () => {
    for (const e of EXERCISES) expect(Boolean(e.tests || e.typeTests), e.id).toBe(true)
  })
})
