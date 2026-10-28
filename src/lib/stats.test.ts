import { describe, expect, it } from 'vitest'
import type { Unit } from '../types'
import { calcularEstadisticas } from './stats'

const unidad = (id: string, ejercicios: string[], respuestas: number[]): Unit => ({
  id,
  blockId: 'b',
  title: id,
  kind: 'lesson',
  minutes: 30,
  sources: [],
  exercises: ejercicios.map((e) => ({ id: e, title: e, prompt: '', language: 'javascript', starter: '', solution: '', hints: [] })),
  quiz: respuestas.map((answer) => ({ question: '?', options: ['a', 'b'], answer, explanation: '' })),
})

describe('calcularEstadisticas', () => {
  it('cuenta unidades, ejercicios, aciertos y repasos', () => {
    const units = [unidad('u1', ['e1', 'e2'], [0, 1]), unidad('u2', ['e3'], [1])]
    const s = calcularEstadisticas(units, {
      completed: { u1: '2026-01-01' },
      exercises: { e1: { code: '', passed: true, attempts: 1, hintsShown: 0 }, e3: { code: '', passed: false, attempts: 2, hintsShown: 0 } },
      quizzes: { u1: { answers: [0, 0], submitted: true }, u2: { answers: [1], submitted: false } },
      repasos: { '2026-01-02': true },
    })
    expect(s).toEqual({
      unidades: { hechas: 1, total: 2 },
      ejercicios: { resueltos: 1, total: 3 },
      quizzes: { aciertos: 1, respondidas: 2 },
      repasos: 1,
    })
  })
})
