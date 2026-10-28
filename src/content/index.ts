import type { Exercise, QuizQuestion, Unit } from '../types'
import { BLOCKS, OUTLINE } from './outline'
import { unitsA } from './units/a'
import { unitsA2 } from './units/a2'
import { unitsA3 } from './units/a3'
import { unitsB } from './units/b'
import { unitsC } from './units/c'
import { unitsD } from './units/d'
import { unitsE } from './units/e'
import { unitsF } from './units/f'
import { unitsG } from './units/g'
import { unitsH } from './units/h'
import { unitsI } from './units/i'
import { unitsTS } from './units/ts'

export { BLOCKS }

/** Contenido propio de una unidad; el resto (título, fuentes...) viene del outline. */
export interface UnitContent {
  /** Si falta, se usa `lessons/<id>.md` */
  lesson?: string
  exercises: Exercise[]
  quiz: QuizQuestion[]
}

export const CONTENT: Record<string, UnitContent> = { ...unitsA, ...unitsA2, ...unitsA3, ...unitsB, ...unitsC, ...unitsD, ...unitsE, ...unitsF, ...unitsG, ...unitsH, ...unitsI, ...unitsTS }

const lessonFiles = import.meta.glob<string>('./lessons/*.md', { query: '?raw', import: 'default', eager: true })
export const LESSONS: Record<string, string> = Object.fromEntries(
  Object.entries(lessonFiles).map(([path, text]) => [path.slice('./lessons/'.length, -'.md'.length), text]),
)

export const UNITS: Unit[] = OUTLINE.map((entry) => {
  const content = CONTENT[entry.id]
  const lesson = content?.lesson ?? LESSONS[entry.id]
  return { ...entry, lesson: lesson?.trim(), exercises: content?.exercises ?? [], quiz: content?.quiz ?? [] }
})

const byId = new Map(UNITS.map((u) => [u.id, u]))

export function getUnit(id: string): Unit | undefined {
  return byId.get(id)
}

export function getBlock(id: string) {
  return BLOCKS.find((b) => b.id === id)
}

export const EXERCISES: Exercise[] = UNITS.flatMap((u) => u.exercises)
