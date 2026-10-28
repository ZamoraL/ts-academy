import { describe, expect, it } from 'vitest'
import { parseProgressData } from './importProgress'

const ids = { units: new Set(['a01', 'a02']), exercises: new Set(['a01-e1']) }

const valido = {
  config: { startDate: '2026-01-05', durationWeeks: 13, pace: 'daily' },
  completed: { a01: '2026-01-05' },
  exercises: { 'a01-e1': { code: 'let x = 1', passed: true, attempts: 2, hintsShown: 0 } },
  quizzes: { a01: { answers: [1, null], submitted: true } },
  notes: { a02: 'nota' },
  repasos: { '2026-01-10': true },
  activity: ['2026-01-05'],
}

describe('parseProgressData', () => {
  it('acepta un respaldo exportado', () => {
    expect(parseProgressData(valido, ids)).toEqual(valido)
  })

  it('acepta respaldos antiguos sin repasos, quizzes ni notas', () => {
    const { repasos: _r, quizzes: _q, notes: _n, ...antiguo } = valido
    expect(parseProgressData(antiguo, ids)).toMatchObject({ repasos: {}, quizzes: {}, notes: {} })
  })

  it('descarta ids desconocidos y campos extra', () => {
    const data = parseProgressData(
      {
        ...valido,
        extra: 1,
        completed: { a01: '2026-01-05', zz99: '2026-01-05' },
        exercises: { ...valido.exercises, 'a01-e1': { ...valido.exercises['a01-e1'], extra: 'x' } },
      },
      ids,
    )
    expect(data).not.toHaveProperty('extra')
    expect(data?.completed).toEqual({ a01: '2026-01-05' })
    expect(data?.exercises['a01-e1']).not.toHaveProperty('extra')
  })

  it('no deja pasar __proto__', () => {
    const data = parseProgressData(JSON.parse(`{"completed":{"__proto__":{"x":1}},"exercises":{},"activity":[]}`), ids)
    expect(Object.getPrototypeOf(data!.completed)).toBe(Object.prototype)
    expect(data!.completed).toEqual({})
  })

  it.each([
    ['no es objeto', 'hola'],
    ['sin activity', { completed: {}, exercises: {} }],
    ['código no es texto', { ...valido, exercises: { 'a01-e1': { ...valido.exercises['a01-e1'], code: 1 } } }],
    ['código enorme', { ...valido, exercises: { 'a01-e1': { ...valido.exercises['a01-e1'], code: 'x'.repeat(200_000) } } }],
    ['fecha inválida', { ...valido, activity: ['ayer'] }],
    ['ritmo desconocido', { ...valido, config: { ...valido.config, pace: 'turbo' } }],
    ['respuesta de quiz inválida', { ...valido, quizzes: { a01: { answers: ['a'], submitted: true } } }],
  ])('rechaza: %s', (_, value) => {
    expect(parseProgressData(value, ids)).toBeNull()
  })
})
