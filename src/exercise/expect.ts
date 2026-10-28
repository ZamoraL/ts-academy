// Mini librería de tests compartida por el worker (JS/TS) y el sandbox de React.

export interface TestResult {
  name: string
  passed: boolean
  error?: string
}

export interface RunResponse {
  logs: string[]
  tests: TestResult[]
  /** Error lanzado fuera de un test (sintaxis, excepción en el código del usuario) */
  error?: string
}

export function format(value: unknown): string {
  if (typeof value === 'string') return value
  if (value === undefined) return 'undefined'
  if (typeof value === 'function') return `[Function ${value.name || 'anónima'}]`
  if (value instanceof Error) return `${value.name}: ${value.message}`
  if (typeof Element !== 'undefined' && value instanceof Element) return `<${value.tagName.toLowerCase()}>`
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

// En mensajes de tests los strings van entre comillas para distinguir "" de "nada".
function show(value: unknown): string {
  return typeof value === 'string' ? JSON.stringify(value) : format(value)
}

function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const ka = Object.keys(a)
  const kb = Object.keys(b)
  if (ka.length !== kb.length) return false
  return ka.every((k) => isEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]))
}

function textOf(value: unknown): string {
  if (typeof Node !== 'undefined' && value instanceof Node) return (value.textContent ?? '').replace(/\s+/g, ' ').trim()
  return String(value)
}

export function makeExpect(actual: unknown) {
  const fail = (msg: string): never => {
    throw new Error(msg)
  }
  return {
    toBe(expected: unknown) {
      if (!Object.is(actual, expected)) fail(`Se esperaba ${show(expected)}, se obtuvo ${show(actual)}`)
    },
    toEqual(expected: unknown) {
      if (!isEqual(actual, expected)) fail(`Se esperaba ${show(expected)}, se obtuvo ${show(actual)}`)
    },
    toBeTruthy() {
      if (!actual) fail(`Se esperaba un valor truthy, se obtuvo ${show(actual)}`)
    },
    toBeFalsy() {
      if (actual) fail(`Se esperaba un valor falsy, se obtuvo ${show(actual)}`)
    },
    toBeNull() {
      if (actual !== null) fail(`Se esperaba null, se obtuvo ${show(actual)}`)
    },
    toContain(item: unknown) {
      const ok = Array.isArray(actual) ? actual.some((x) => isEqual(x, item)) : String(actual).includes(String(item))
      if (!ok) fail(`Se esperaba que ${show(actual)} contuviera ${show(item)}`)
    },
    toHaveLength(n: number) {
      const len = (actual as { length?: unknown } | null)?.length
      if (len !== n) fail(`Se esperaba longitud ${n}, se obtuvo ${show(len)}`)
    },
    toThrow() {
      if (typeof actual !== 'function') return fail('toThrow necesita una función')
      try {
        actual()
      } catch {
        return
      }
      fail('Se esperaba que lanzara un error')
    },
    /** Solo React: compara el texto visible de un elemento (espacios normalizados). */
    toHaveTextContent(expected: string) {
      const text = textOf(actual)
      if (!text.includes(expected)) fail(`Se esperaba el texto ${show(expected)}, el elemento tiene ${show(text)}`)
    },
    /** Solo React: el elemento está deshabilitado. */
    toBeDisabled() {
      if (!(actual instanceof HTMLElement) || !actual.matches(':disabled'))
        fail(`Se esperaba un elemento deshabilitado: ${format(actual)}`)
    },
    /** Solo React: valor de un input/textarea/select. */
    toHaveValue(expected: string | number) {
      const v = (actual as HTMLInputElement | null)?.value
      if (String(v) !== String(expected)) fail(`Se esperaba el valor ${show(expected)}, se obtuvo ${show(v)}`)
    },
  }
}

/** Ejecuta los tests registrados en orden; `after` corre tras cada uno (limpieza). */
export async function runTests(
  tests: { name: string; fn: () => unknown }[],
  after?: () => void,
): Promise<TestResult[]> {
  const results: TestResult[] = []
  for (const t of tests) {
    try {
      await t.fn()
      results.push({ name: t.name, passed: true })
    } catch (e) {
      results.push({ name: t.name, passed: false, error: e instanceof Error ? e.message : format(e) })
    } finally {
      after?.()
    }
  }
  return results
}
