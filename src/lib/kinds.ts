import type { DayKind } from '../types'

export const KIND_LABEL: Record<DayKind, string> = {
  study: 'lección',
  review: 'repaso',
  practice: 'práctica',
}

export const KIND_HINT: Record<DayKind, string> = {
  study: '',
  review: 'Relee estas unidades, repite el quiz y rehaz los ejercicios sin mirar tu solución anterior.',
  practice: 'Rehaz los ejercicios de la semana desde cero. Si alguno cuesta, vuelve a la lección.',
}
