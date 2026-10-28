import type { ProgressData } from '../store/progress'
import type { Pace } from '../types'
import type { ISODate } from './date'

// Un respaldo puede venir de cualquier sitio: se reconstruye campo a campo y solo con ids conocidos.
// El código guardado se ejecuta al pulsar "Comprobar", así que nada se copia sin revisar.

const MAX_CODE = 100_000
const MAX_NOTE = 50_000
const PACES: Pace[] = ['intense', 'daily', 'light']

export interface KnownIds {
  units: ReadonlySet<string>
  exercises: ReadonlySet<string>
}

class Invalido extends Error {}

function check(cond: boolean): asserts cond {
  if (!cond) throw new Invalido()
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isDate(v: unknown): v is ISODate {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)
}

function isCount(v: unknown): v is number {
  return Number.isInteger(v) && (v as number) >= 0 && (v as number) < 1e6
}

/** Copia las entradas cuyo id es conocido, validando cada valor. Los ids desconocidos se descartan. */
function porId<T>(v: unknown, ids: ReadonlySet<string>, valor: (x: unknown) => T): Record<string, T> {
  if (v === undefined) return {}
  check(isRecord(v))
  const out: Record<string, T> = {}
  for (const [id, x] of Object.entries(v)) if (ids.has(id)) out[id] = valor(x)
  return out
}

function config(v: unknown): ProgressData['config'] {
  if (v === null || v === undefined) return null
  check(isRecord(v))
  check(isDate(v.startDate))
  check(Number.isInteger(v.durationWeeks) && (v.durationWeeks as number) >= 1 && (v.durationWeeks as number) <= 520)
  check(PACES.includes(v.pace as Pace))
  return { startDate: v.startDate, durationWeeks: v.durationWeeks as number, pace: v.pace as Pace }
}

/** Devuelve un respaldo limpio, o null si el archivo no tiene el formato de TS Academy. */
export function parseProgressData(value: unknown, ids: KnownIds): ProgressData | null {
  try {
    check(isRecord(value))
    check(isRecord(value.completed) && isRecord(value.exercises) && Array.isArray(value.activity))

    const repasos: Record<ISODate, true> = {}
    if (value.repasos !== undefined) {
      check(isRecord(value.repasos))
      for (const [fecha, hecho] of Object.entries(value.repasos)) {
        check(isDate(fecha) && hecho === true)
        repasos[fecha] = true
      }
    }

    return {
      config: config(value.config),
      completed: porId(value.completed, ids.units, (x) => {
        check(isDate(x))
        return x
      }),
      exercises: porId(value.exercises, ids.exercises, (x) => {
        check(isRecord(x))
        check(typeof x.code === 'string' && x.code.length <= MAX_CODE)
        check(typeof x.passed === 'boolean' && isCount(x.attempts) && isCount(x.hintsShown))
        return { code: x.code, passed: x.passed, attempts: x.attempts, hintsShown: x.hintsShown }
      }),
      quizzes: porId(value.quizzes, ids.units, (x) => {
        check(isRecord(x) && Array.isArray(x.answers) && typeof x.submitted === 'boolean')
        check(x.answers.length <= 50 && x.answers.every((a) => a === null || isCount(a)))
        return { answers: x.answers as (number | null)[], submitted: x.submitted }
      }),
      notes: porId(value.notes, ids.units, (x) => {
        check(typeof x === 'string' && x.length <= MAX_NOTE)
        return x
      }),
      repasos,
      activity: value.activity.map((d) => {
        check(isDate(d))
        return d
      }),
    }
  } catch (e) {
    if (e instanceof Invalido) return null
    throw e
  }
}
