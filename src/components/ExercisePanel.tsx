import Editor from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { checkExercise, fileExtension, runOnly, type CheckResult } from '../exercise/check'
import { cargarTiposReact } from '../exercise/monaco'
import { useProgress } from '../store/progress'
import type { Exercise } from '../types'
import { CodeBlock } from './CodeBlock'
import { Markdown } from './Markdown'

interface ExercisePanelProps {
  exercise: Exercise
  index: number
  /** Repaso: empieza desde el código inicial y no guarda nada (ni código, ni intentos, ni pistas). */
  modoRepaso?: boolean
  /** Se llama cada vez que una comprobación pasa. */
  onResuelto?: () => void
}

export function ExercisePanel({ exercise, index, modoRepaso = false, onResuelto }: ExercisePanelProps) {
  const state = useProgress((s) => s.exercises[exercise.id])
  const saveCode = useProgress((s) => s.saveCode)
  const recordAttempt = useProgress((s) => s.recordAttempt)
  const showHint = useProgress((s) => s.showHint)

  const [repaso, setRepaso] = useState({ attempts: 0, hintsShown: 0, passed: false })
  const [code, setCode] = useState(modoRepaso ? exercise.starter : state?.code || exercise.starter)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [solutionOpen, setSolutionOpen] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const preview = useRef<HTMLIFrameElement>(null)

  useEffect(() => () => clearTimeout(saveTimer.current), [])
  useEffect(() => {
    if (exercise.react) void cargarTiposReact()
  }, [exercise.react])

  const progreso = modoRepaso ? repaso : state
  const hintsShown = progreso?.hintsShown ?? 0
  const attempts = progreso?.attempts ?? 0
  const passed = progreso?.passed ?? false
  const ext = fileExtension(exercise)

  function onChange(value: string | undefined) {
    const next = value ?? ''
    setCode(next)
    if (modoRepaso) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveCode(exercise.id, next), 400)
  }

  async function check() {
    setBusy(true)
    const r = await checkExercise(exercise, code, preview.current ?? undefined)
    setResult(r)
    if (modoRepaso) setRepaso((p) => ({ ...p, attempts: p.attempts + 1, passed: p.passed || r.passed }))
    else recordAttempt(exercise.id, r.passed)
    if (r.passed) onResuelto?.()
    setBusy(false)
  }

  async function run() {
    setBusy(true)
    setResult(await runOnly(exercise, code, preview.current ?? undefined))
    setBusy(false)
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50">
      <header className="flex items-center gap-3 border-b border-slate-800 px-5 py-3">
        <span className="text-sm text-slate-500">Ejercicio {index + 1}</span>
        <h3 className="font-semibold text-white">{exercise.title}</h3>
        <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-400">.{ext}</span>
        {passed && <span className="ml-auto text-sm text-emerald-400">✓ Resuelto</span>}
      </header>

      <div className="px-5 py-2">
        <Markdown>{exercise.prompt}</Markdown>
      </div>

      <div className="border-y border-slate-800">
        <Editor
          height={Math.min(420, Math.max(160, code.split('\n').length * 20 + 40))}
          path={`file:///${modoRepaso ? 'repaso' : 'ejercicios'}/${exercise.id}.${ext}`}
          defaultLanguage={exercise.language}
          value={code}
          onChange={onChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Menlo, monospace',
            scrollBeyondLastLine: false,
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12 },
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2 px-5 py-3">
        <button
          onClick={check}
          disabled={busy}
          className="rounded-md bg-brand-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {busy ? 'Comprobando…' : 'Comprobar'}
        </button>
        <button
          onClick={run}
          disabled={busy}
          className="rounded-md border border-slate-700 px-4 py-1.5 text-sm hover:bg-slate-800 disabled:opacity-50"
        >
          Ejecutar
        </button>
        {hintsShown < exercise.hints.length && (
          <button
            onClick={() =>
              modoRepaso ? setRepaso((p) => ({ ...p, hintsShown: p.hintsShown + 1 })) : showHint(exercise.id)
            }
            className="rounded-md border border-slate-700 px-4 py-1.5 text-sm hover:bg-slate-800"
          >
            Pista ({hintsShown}/{exercise.hints.length})
          </button>
        )}
        <button
          onClick={() => setSolutionOpen((o) => !o)}
          disabled={attempts === 0 && !passed}
          title={attempts === 0 ? 'Inténtalo al menos una vez' : undefined}
          className="rounded-md border border-slate-700 px-4 py-1.5 text-sm hover:bg-slate-800 disabled:opacity-40"
        >
          {solutionOpen ? 'Ocultar solución' : 'Ver solución'}
        </button>
        <button
          onClick={() => {
            if (code !== exercise.starter && !confirm('¿Volver al código inicial? Perderás lo que escribiste.')) return
            onChange(exercise.starter)
            setResult(null)
          }}
          className="ml-auto rounded-md px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          Reiniciar
        </button>
      </div>

      {hintsShown > 0 && (
        <ul className="mx-5 mb-3 space-y-1 rounded-lg bg-amber-500/5 p-3 text-sm">
          {exercise.hints.slice(0, hintsShown).map((h, i) => (
            <li key={i} className="text-amber-200/90">
              💡 <Markdown inline>{h}</Markdown>
            </li>
          ))}
        </ul>
      )}

      {solutionOpen && (
        <div className="mx-5 mb-3">
          <CodeBlock code={exercise.solution} lang={fileExtension(exercise)} />
        </div>
      )}

      {exercise.react && (
        <div className="mx-5 mb-3">
          <h4 className="mb-1 text-sm text-slate-400">
            Vista previa <span className="text-slate-600">· pulsa Ejecutar para ver tu componente</span>
          </h4>
          <iframe ref={preview} title="Vista previa" className="h-56 w-full rounded-lg border border-slate-700 bg-white" />
        </div>
      )}

      {result && <ResultView result={result} />}
    </section>
  )
}

function ResultView({ result }: { result: CheckResult }) {
  const hasChecks = result.tests.length > 0 || result.typeErrors.length > 0 || result.passed
  return (
    <div className="space-y-3 border-t border-slate-800 px-5 py-4 text-sm">
      {hasChecks && (
        <p className={result.passed ? 'font-medium text-emerald-400' : 'font-medium text-red-400'}>
          {result.passed ? '✓ ¡Correcto! Todos los chequeos pasan.' : '✗ Aún no. Revisa los detalles:'}
        </p>
      )}

      {result.typeErrors.length > 0 && (
        <div>
          <h4 className="mb-1 text-slate-400">Errores de tipo</h4>
          <ul className="space-y-1 font-mono text-xs">
            {result.typeErrors.map((e, i) => (
              <li key={i} className="whitespace-pre-wrap text-red-300">
                {e.inTests ? '[test de tipos] ' : `línea ${e.line}: `}
                {e.inTests && e.message.startsWith("Unused '@ts-expect-error'")
                  ? 'Se esperaba un error de tipo y no lo hubo: tu tipo es demasiado permisivo.'
                  : e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.runtimeError && (
        <p className="whitespace-pre-wrap font-mono text-xs text-red-300">Error al ejecutar: {result.runtimeError}</p>
      )}

      {result.tests.length > 0 && (
        <ul className="space-y-1">
          {result.tests.map((t, i) => (
            <li key={i} className={t.passed ? 'text-emerald-300' : 'text-red-300'}>
              {t.passed ? '✓' : '✗'} {t.name}
              {t.error && <span className="ml-2 text-slate-400">— {t.error}</span>}
            </li>
          ))}
        </ul>
      )}

      <div>
        <h4 className="mb-1 text-slate-400">Consola</h4>
        <pre className="max-h-48 overflow-auto rounded bg-slate-950 p-3 font-mono text-xs text-slate-300">
          {result.logs.length > 0 ? result.logs.join('\n') : '(sin salida)'}
        </pre>
      </div>
    </div>
  )
}
