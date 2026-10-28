import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { todayISO, type ISODate } from '../lib/date'
import type { PlanConfig } from '../types'

export interface ExerciseState {
  code: string
  passed: boolean
  attempts: number
  hintsShown: number
}

export interface QuizState {
  answers: (number | null)[]
  submitted: boolean
}

export interface ProgressData {
  config: PlanConfig | null
  completed: Record<string, ISODate>
  exercises: Record<string, ExerciseState>
  quizzes: Record<string, QuizState>
  notes: Record<string, string>
  /** Días de repaso o práctica terminados */
  repasos: Record<ISODate, true>
  /** Días con alguna actividad (para la racha) */
  activity: ISODate[]
}

interface ProgressActions {
  setConfig(config: PlanConfig): void
  completeUnit(unitId: string): void
  uncompleteUnit(unitId: string): void
  saveCode(exerciseId: string, code: string): void
  recordAttempt(exerciseId: string, passed: boolean): void
  showHint(exerciseId: string): void
  saveQuiz(unitId: string, quiz: QuizState): void
  saveNote(unitId: string, note: string): void
  completeReview(date: ISODate): void
  importData(data: ProgressData): void
  reset(): void
}

const EMPTY: ProgressData = {
  config: null,
  completed: {},
  exercises: {},
  quizzes: {},
  notes: {},
  repasos: {},
  activity: [],
}

const EMPTY_EXERCISE: ExerciseState = { code: '', passed: false, attempts: 0, hintsShown: 0 }

function withActivity(activity: ISODate[]): ISODate[] {
  const today = todayISO()
  return activity.includes(today) ? activity : [...activity, today]
}

export const useProgress = create<ProgressData & ProgressActions>()(
  persist(
    (set) => ({
      ...EMPTY,
      setConfig: (config) => set({ config }),
      completeUnit: (unitId) =>
        set((s) => ({ completed: { ...s.completed, [unitId]: todayISO() }, activity: withActivity(s.activity) })),
      uncompleteUnit: (unitId) =>
        set((s) => {
          const { [unitId]: _removed, ...completed } = s.completed
          return { completed }
        }),
      saveCode: (id, code) =>
        set((s) => ({ exercises: { ...s.exercises, [id]: { ...EMPTY_EXERCISE, ...s.exercises[id], code } } })),
      recordAttempt: (id, passed) =>
        set((s) => {
          const prev = { ...EMPTY_EXERCISE, ...s.exercises[id] }
          return {
            exercises: { ...s.exercises, [id]: { ...prev, attempts: prev.attempts + 1, passed: prev.passed || passed } },
            activity: withActivity(s.activity),
          }
        }),
      showHint: (id) =>
        set((s) => {
          const prev = { ...EMPTY_EXERCISE, ...s.exercises[id] }
          return { exercises: { ...s.exercises, [id]: { ...prev, hintsShown: prev.hintsShown + 1 } } }
        }),
      saveQuiz: (unitId, quiz) =>
        set((s) => ({ quizzes: { ...s.quizzes, [unitId]: quiz }, activity: withActivity(s.activity) })),
      saveNote: (unitId, note) => set((s) => ({ notes: { ...s.notes, [unitId]: note } })),
      completeReview: (date) =>
        set((s) => ({ repasos: { ...s.repasos, [date]: true }, activity: withActivity(s.activity) })),
      importData: (data) => set({ ...EMPTY, ...data }),
      reset: () => set(EMPTY),
    }),
    { name: 'ts-academy-progress', version: 1 },
  ),
)

export function exportProgress(): ProgressData {
  const { config, completed, exercises, quizzes, notes, repasos, activity } = useProgress.getState()
  return { config, completed, exercises, quizzes, notes, repasos, activity }
}
