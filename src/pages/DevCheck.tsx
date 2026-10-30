import { useEffect, useState } from 'react'
import { EXERCISES } from '../content'
import { checkExercise, type CheckResult } from '../exercise/check'

// Solo en desarrollo: verifica que cada solución pase y cada código inicial falle.
interface Row {
  id: string
  solution: CheckResult
  starter: CheckResult
}

function describe(r: CheckResult): string {
  return [
    ...r.typeErrors.map((e) => `tipo L${e.line}: ${e.message}`),
    ...(r.runtimeError ? [`runtime: ${r.runtimeError}`] : []),
    ...r.tests.filter((t) => !t.passed).map((t) => `test "${t.name}": ${t.error}`),
  ].join(' | ')
}

export default function DevCheck() {
  const [rows, setRows] = useState<Row[]>([])
  const [done, setDone] = useState(false)

  // ?prefijo=g limita la verificación a los ejercicios cuyo id empieza así.
  const prefijo = new URLSearchParams(location.search).get('prefijo') ?? ''
  const ejercicios = EXERCISES.filter((e) => e.id.startsWith(prefijo))

  useEffect(() => {
    let cancelled = false
    void (async () => {
      for (const ex of ejercicios) {
        const solution = await checkExercise(ex, ex.solution)
        const starter = await checkExercise(ex, ex.starter)
        if (cancelled) return
        setRows((r) => [...r, { id: ex.id, solution, starter }])
      }
      setDone(true)
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefijo])

  const ok = rows.filter((r) => r.solution.passed && !r.starter.passed).length
  return (
    <div className="space-y-4 font-mono text-sm">
      <h1 id="summary" data-done={done} className="text-lg font-bold">
        {done ? `OK ${ok}/${rows.length}` : `Verificando ${rows.length}/${ejercicios.length}…`}
      </h1>
      <ul className="space-y-2">
        {rows.map((r) => {
          const good = r.solution.passed && !r.starter.passed
          return (
            <li key={r.id} className={good ? 'text-success-ink' : 'text-danger-ink'} data-row={good ? 'ok' : 'fail'}>
              {good ? '✓' : '✗'} {r.id}
              {!r.solution.passed && <div>solución falla → {describe(r.solution)}</div>}
              {r.starter.passed && <div>el código inicial ya pasa</div>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
