import type { ISODate } from './lib/date'

export type Language = 'javascript' | 'typescript'

export interface Exercise {
  id: string
  title: string
  /** Enunciado en markdown */
  prompt: string
  language: Language
  /**
   * Ejercicio de React: el archivo es .jsx/.tsx y se ejecuta en un iframe con vista previa.
   * Los tests tienen `render`, `screen`, `fireEvent`, `userEvent`, `act`, `waitFor` y `within`
   * de Testing Library. Si el código exporta un componente por defecto, se muestra en la vista previa.
   */
  react?: boolean
  starter: string
  solution: string
  hints: string[]
  /** Código de tests de runtime (usa `test` y `expect`). Se ejecuta tras el código del usuario. */
  tests?: string
  /** Código de tests de tipos (solo TS). Se comprueba con el compilador, nunca se ejecuta. */
  typeTests?: string
  /** Si es true (por defecto en TS), el código del usuario no puede tener errores de tipo. */
  requireNoTypeErrors?: boolean
}

export interface QuizQuestion {
  question: string
  /** Bloque de código opcional mostrado con la pregunta */
  code?: string
  options: string[]
  answer: number
  explanation: string
}

export type UnitKind = 'lesson' | 'project'

export interface Unit {
  id: string
  blockId: string
  title: string
  kind: UnitKind
  /** Duración estimada; siempre <= 30 para que encaje en cualquier ritmo */
  minutes: number
  /** Enlaces a la documentación oficial */
  sources: { label: string; url: string }[]
  /** Lección en markdown. Si falta, la unidad aún no tiene contenido propio. */
  lesson?: string
  exercises: Exercise[]
  quiz: QuizQuestion[]
}

export interface Block {
  id: string
  title: string
  description: string
}

export type Pace = 'intense' | 'daily' | 'light'

export interface PlanConfig {
  startDate: ISODate
  durationWeeks: number
  pace: Pace
}

export type DayKind = 'study' | 'review' | 'practice'

export interface ScheduledDay {
  date: ISODate
  kind: DayKind
  /** En 'study': unidades nuevas. En 'review'/'practice': unidades a repasar. */
  unitIds: string[]
  minutes: number
}
