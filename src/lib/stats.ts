import type { ProgressData } from '../store/progress'
import type { Unit } from '../types'

export interface Estadisticas {
  unidades: { hechas: number; total: number }
  ejercicios: { resueltos: number; total: number }
  /** Preguntas acertadas sobre respondidas, solo en quizzes corregidos */
  quizzes: { aciertos: number; respondidas: number }
  repasos: number
}

export function calcularEstadisticas(units: Unit[], progreso: Pick<ProgressData, 'completed' | 'exercises' | 'quizzes' | 'repasos'>): Estadisticas {
  const ejercicios = units.flatMap((u) => u.exercises)
  let aciertos = 0
  let respondidas = 0
  for (const u of units) {
    const q = progreso.quizzes[u.id]
    if (!q?.submitted) continue
    u.quiz.forEach((pregunta, i) => {
      if (q.answers[i] === null || q.answers[i] === undefined) return
      respondidas++
      if (q.answers[i] === pregunta.answer) aciertos++
    })
  }
  return {
    unidades: { hechas: units.filter((u) => u.id in progreso.completed).length, total: units.length },
    ejercicios: { resueltos: ejercicios.filter((e) => progreso.exercises[e.id]?.passed).length, total: ejercicios.length },
    quizzes: { aciertos, respondidas },
    repasos: Object.keys(progreso.repasos ?? {}).length,
  }
}
