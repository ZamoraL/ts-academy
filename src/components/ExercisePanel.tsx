import Editor, { type OnMount } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { checkExercise, fileExtension, runOnly, type CheckResult } from '../exercise/check'
import { cargarTiposReact, temaMonaco } from '../exercise/monaco'
import { useTema } from '../lib/theme'
import { useProgress } from '../store/progress'
import type { Exercise } from '../types'
import { CodeBlock } from './CodeBlock'
import { Markdown } from './Markdown'
import { btn, teclaMod } from './styles'
import { Tag } from './ui'

interface ExercisePanelProps {
  exercise: Exercise
  index: number
  total: number
  /** Repaso: empieza desde el código inicial y no guarda nada (ni código, ni intentos, ni pistas). */
  modoRepaso?: boolean
  /** Se llama cada vez que una comprobación pasa. */
  onResuelto?: () => void
}

export function ExercisePanel({ exercise, index, total, modoRepaso = false, onResuelto }: ExercisePanelProps) {
  const state = useProgress((s) => s.exercises[exercise.id])
  const saveCode = useProgress((s) => s.saveCode)
  const recordAttempt = useProgress((s) => s.recordAttempt)
  const showHint = useProgress((s) => s.showHint)
  const tema = useTema()

  const [repaso, setRepaso] = useState({ attempts: 0, hintsShown: 0, passed: false })
  const [code, setCode] = useState(modoRepaso ? exercise.starter : state?.code || exercise.starter)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [solutionOpen, setSolutionOpen] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const preview = useRef<HTMLIFrameElement>(null)
  // El atajo del editor se registra una vez: llama siempre a la versión actual de `check`.
  const checkRef = useRef<() => void>(() => {})

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
    if (busy) return
    setBusy(true)
    const r = await checkExercise(exercise, code, preview.current ?? undefined)
    setResult(r)
    if (modoRepaso) setRepaso((p) => ({ ...p, attempts: p.attempts + 1, passed: p.passed || r.passed }))
    else recordAttempt(exercise.id, r.passed)
    if (r.passed) onResuelto?.()
    setBusy(false)
  }
  useEffect(() => {
    checkRef.current = () => void check()
  })

  async function run() {
    setBusy(true)
    setResult(await runOnly(exercise, code, preview.current ?? undefined))
    setBusy(false)
  }

  const onMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => checkRef.current())
  }

  return (
    <section className="overflow-hidden rounded-md border border-border bg-surface" aria-labelledby={`ej-${exercise.id}`}>
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-4 py-2.5">
        <span className="tabular font-mono text-xs text-fg-muted">
          {index + 1}/{total}
        </span>
        <h3 id={`ej-${exercise.id}`} className="font-bold">
          {exercise.title}
        </h3>
        <Tag>.{ext}</Tag>
        {passed && <span className="ml-auto font-mono text-xs text-success-ink">✓ resuelto</span>}
      </header>

      <div className="px-4 py-1">
        <Markdown>{exercise.prompt}</Markdown>
      </div>

      <div className="border-y border-border">
        <Editor
          height={Math.min(420, Math.max(160, code.split('\n').length * 20 + 40))}
          path={`file:///${modoRepaso ? 'repaso' : 'ejercicios'}/${exercise.id}.${ext}`}
          defaultLanguage={exercise.language}
          value={code}
          onChange={onChange}
          onMount={onMount}
          theme={temaMonaco(tema)}
          loading={<span className="text-fg-muted">Cargando editor…</span>}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'Geist Mono, Menlo, monospace',
            fontLigatures: false,
            scrollBeyondLastLine: false,
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12 },
            renderLineHighlightOnlyWhenFocus: true,
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <button onClick={check} disabled={busy} className={`${btn.primary} min-w-32 justify-center`}>
          {busy ? 'Comprobando…' : 'Comprobar'}
          {!busy && (
            <kbd className="hidden border-on-accent/30 bg-transparent text-on-accent sm:inline">{teclaMod} ↵</kbd>
          )}
        </button>
        <button onClick={run} disabled={busy} className={btn.secondary}>
          Ejecutar
        </button>
        {hintsShown < exercise.hints.length && (
          <button
            onClick={() =>
              modoRepaso ? setRepaso((p) => ({ ...p, hintsShown: p.hintsShown + 1 })) : showHint(exercise.id)
            }
            className={btn.secondary}
          >
            Pista <span className="tabular font-mono text-xs text-fg-muted">{hintsShown}/{exercise.hints.length}</span>
          </button>
        )}
        <button
          onClick={() => setSolutionOpen((o) => !o)}
          disabled={attempts === 0 && !passed}
          aria-describedby={attempts === 0 && !passed ? `sol-${exercise.id}` : undefined}
          className={btn.secondary}
        >
          {solutionOpen ? 'Ocultar solución' : 'Ver solución'}
        </button>
        {attempts === 0 && !passed && (
          <span id={`sol-${exercise.id}`} className="text-xs text-fg-muted">
            La solución se desbloquea tras un intento.
          </span>
        )}
        <button
          onClick={() => {
            if (code !== exercise.starter && !confirm('¿Volver al código inicial? Perderás lo que escribiste.')) return
            onChange(exercise.starter)
            setResult(null)
          }}
          className={`${btn.ghost} ml-auto`}
        >
          Reiniciar
        </button>
      </div>

      {hintsShown > 0 && (
        <ol className="mx-4 mb-3 divide-y divide-border rounded-sm bg-surface-2 text-sm">
          {exercise.hints.slice(0, hintsShown).map((h, i) => (
            <li key={i} className="flex gap-3 px-3 py-2">
              <span className="shrink-0 font-mono text-xs leading-6 text-fg-muted">pista {i + 1}</span>
              <span className="leading-6">
                <Markdown inline>{h}</Markdown>
              </span>
            </li>
          ))}
        </ol>
      )}

      {solutionOpen && (
        <div className="mx-4 mb-3">
          <CodeBlock code={exercise.solution} lang={fileExtension(exercise)} />
        </div>
      )}

      {exercise.react && (
        <div className="mx-4 mb-4">
          <p className="mb-1 font-mono text-xs text-fg-muted">vista previa · pulsa Ejecutar para ver tu componente</p>
          {/* La vista previa es una página web real: fondo blanco en los dos temas. */}
          <iframe ref={preview} title="Vista previa" className="h-56 w-full rounded-sm border border-border bg-white" />
        </div>
      )}

      <div aria-live="polite">{result && <ResultView result={result} />}</div>
    </section>
  )
}

function ResultView({ result }: { result: CheckResult }) {
  const hasChecks = result.tests.length > 0 || result.typeErrors.length > 0 || result.passed
  const pasan = result.tests.filter((t) => t.passed).length
  return (
    <div className="space-y-3 border-t border-border px-4 py-4 font-mono text-[13px]">
      {hasChecks && (
        <p className="flex items-center gap-3">
          <span
            className={`rounded-full px-2 py-0.5 font-sans text-xs font-bold ${
              result.passed ? 'bg-success text-on-success' : 'bg-danger text-on-danger'
            }`}
          >
            {result.passed ? 'aprobado' : 'no pasa'}
          </span>
          <span className="font-sans text-sm">
            {result.passed
              ? 'Correcto: todos los chequeos pasan.'
              : result.tests.length > 0
                ? `${pasan} de ${result.tests.length} ${result.tests.length === 1 ? 'chequeo pasa' : 'chequeos pasan'}. Revisa los que fallan:`
                : 'Aún no. Revisa los detalles:'}
          </span>
        </p>
      )}

      {result.typeErrors.length > 0 && (
        <ul className="space-y-1">
          {result.typeErrors.map((e, i) => (
            <li key={i} className="flex gap-3 whitespace-pre-wrap">
              <span className="shrink-0 text-danger-ink">{e.inTests ? 'tipos' : `L${e.line}`}</span>
              <span>
                {e.inTests && e.message.startsWith("Unused '@ts-expect-error'")
                  ? 'Se esperaba un error de tipo y no lo hubo: tu tipo es demasiado permisivo.'
                  : e.message}
              </span>
            </li>
          ))}
        </ul>
      )}

      {result.runtimeError && (
        <p className="flex gap-3 whitespace-pre-wrap">
          <span className="shrink-0 text-danger-ink">error</span>
          <span>{result.runtimeError}</span>
        </p>
      )}

      {result.tests.length > 0 && (
        <ul className="space-y-1">
          {result.tests.map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className={`shrink-0 ${t.passed ? 'text-success-ink' : 'text-danger-ink'}`}>
                {t.passed ? '✓' : '✗'}
              </span>
              <span className="min-w-0 [overflow-wrap:anywhere]">
                {t.name}
                {t.error && <span className="text-fg-muted"> — {t.error}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div>
        <p className="mb-1 text-xs text-fg-muted">consola</p>
        <pre className="max-h-48 overflow-auto rounded-sm bg-surface-2 p-3 text-xs">
          {result.logs.length > 0 ? result.logs.join('\n') : <span className="text-fg-muted">(sin salida)</span>}
        </pre>
      </div>
    </div>
  )
}
