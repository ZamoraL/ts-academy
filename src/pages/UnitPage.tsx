import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ExercisePanel } from '../components/ExercisePanel'
import { Markdown } from '../components/Markdown'
import { Linea, Roundel } from '../components/Linea'
import { Quiz } from '../components/Quiz'
import { btn, link } from '../components/styles'
import { getBlock, getUnit, UNITS } from '../content'
import { formatShort } from '../lib/date'
import { useProgress } from '../store/progress'

export default function UnitPage() {
  const { unitId = '' } = useParams()
  const unit = getUnit(unitId)
  const completedAt = useProgress((s) => s.completed[unitId])
  const exercises = useProgress((s) => s.exercises)
  const note = useProgress((s) => s.notes[unitId] ?? '')
  const completeUnit = useProgress((s) => s.completeUnit)
  const uncompleteUnit = useProgress((s) => s.uncompleteUnit)
  const saveNote = useProgress((s) => s.saveNote)
  const [autocompletada, setAutocompletada] = useState<string | null>(null)
  const [notaGuardada, setNotaGuardada] = useState(false)

  if (!unit) {
    return (
      <div className="space-y-3">
        <h1 className="font-display text-2xl">No existe la estación «{unitId}»</h1>
        <p className="text-fg-muted">
          Puede que el enlace esté mal escrito. Búscala en el{' '}
          <Link to="/temario" className={link}>
            plano
          </Link>
          .
        </p>
      </div>
    )
  }

  // Al resolver el último ejercicio pendiente, la unidad se marca sola (una vez: si la desmarcas, se respeta).
  function alResolver() {
    if (!unit) return
    const { exercises: estado, completed } = useProgress.getState()
    if (unit.id in completed || !unit.exercises.every((e) => estado[e.id]?.passed)) return
    completeUnit(unit.id)
    setAutocompletada(unit.id)
  }

  const index = UNITS.indexOf(unit)
  const prev = UNITS[index - 1]
  const next = UNITS[index + 1]
  const block = getBlock(unit.blockId)
  const enLinea = UNITS.filter((u) => u.blockId === unit.blockId)
  const solved = unit.exercises.filter((e) => exercises[e.id]?.passed).length
  const faltan = unit.exercises.length - solved

  return (
    <article className="space-y-10">
      <header className="space-y-6">
        <div className="space-y-3">
          <Link to="/temario" className="flex w-fit items-center gap-2.5 text-fg-muted hover:text-fg">
            <Roundel id={unit.blockId} activa size="sm" />
            Línea {unit.blockId.toUpperCase()} · {block?.title}
          </Link>
          <h1 className="font-display max-w-[24ch] text-[30px] sm:text-[40px]">{unit.title}</h1>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-fg-muted">
            <span className="tabular">
              <span className="font-mono text-sm">{unit.id}</span> · estación {enLinea.indexOf(unit) + 1} de{' '}
              {enLinea.length}
            </span>
            <span className="tabular">{unit.minutes} min</span>
            {unit.exercises.length > 0 && (
              <span className="tabular">
                {solved}/{unit.exercises.length} ejercicios
              </span>
            )}
            {completedAt && <span className="text-success-ink">✓ hecha el {formatShort(completedAt)}</span>}
            {unit.sources.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className={link}>
                {s.label} ↗
              </a>
            ))}
          </p>
        </div>
        <div className="max-w-3xl">
          <Linea blockId={unit.blockId} actual={unit.id} />
        </div>
      </header>

      {unit.lesson ? (
        <div className="max-w-[68ch] text-base">
          <Markdown>{unit.lesson}</Markdown>
        </div>
      ) : (
        <div className="max-w-[68ch] rounded-sm border border-dashed border-border p-5 text-fg-muted">
          {unit.kind === 'project'
            ? 'El enunciado de este proyecto aún no está escrito.'
            : 'El resumen y los ejercicios de esta unidad aún no están escritos.'}
          {unit.sources[0] && (
            <>
              {' '}
              Mientras tanto, lee la sección oficial:{' '}
              <a href={unit.sources[0].url} target="_blank" rel="noreferrer" className={link}>
                {unit.sources[0].label}
              </a>
              .
            </>
          )}
        </div>
      )}

      {unit.exercises.length > 0 && (
        <section className="space-y-4" aria-labelledby="ejercicios">
          <h2 id="ejercicios" className="font-display flex items-baseline gap-3 text-xl">
            Ejercicios
            <span className="tabular font-sans text-sm font-normal tracking-normal text-fg-muted">
              {solved}/{unit.exercises.length}
            </span>
          </h2>
          {unit.exercises.map((ex, i) => (
            <ExercisePanel key={ex.id} exercise={ex} index={i} total={unit.exercises.length} onResuelto={alResolver} />
          ))}
        </section>
      )}

      {autocompletada === unit.id && (
        <p role="status" className="font-mono text-sm text-success-ink">
          ✓ Resolviste todos los ejercicios: la unidad quedó marcada como completada.
        </p>
      )}

      {unit.quiz.length > 0 && <Quiz key={unit.id} unitId={unit.id} questions={unit.quiz} />}

      <section className="max-w-[68ch]">
        <label htmlFor={`nota-${unit.id}`} className="font-display mb-3 flex items-baseline gap-3 text-xl">
          Mis notas
          <span className="font-sans text-xs font-normal tracking-normal text-fg-muted" aria-live="polite">
            {notaGuardada ? 'Guardado' : 'Se guardan al salir del campo'}
          </span>
        </label>
        <textarea
          id={`nota-${unit.id}`}
          key={unit.id}
          defaultValue={note}
          onFocus={() => setNotaGuardada(false)}
          onBlur={(e) => {
            saveNote(unit.id, e.target.value)
            setNotaGuardada(true)
          }}
          rows={4}
          placeholder="Lo que quieras recordar: una duda, un ejemplo, un enlace…"
          className="w-full rounded-sm border border-border bg-surface p-3 text-base placeholder:text-fg-muted"
        />
      </section>

      <footer className="space-y-6 border-t border-border pt-6">
        <div className="flex flex-wrap items-center gap-3">
          {completedAt ? (
            <button onClick={() => uncompleteUnit(unit.id)} className={btn.secondary}>
              <span className="text-success-ink">✓</span> Completada · desmarcar
            </button>
          ) : (
            <button onClick={() => completeUnit(unit.id)} className={faltan > 0 ? btn.secondary : btn.primary}>
              Marcar como completada
            </button>
          )}
          {!completedAt && faltan > 0 && (
            <span className="text-sm text-fg-muted">
              {faltan === 1 ? 'Te falta 1 ejercicio' : `Te faltan ${faltan} ejercicios`}, pero puedes marcarla igual.
            </span>
          )}
        </div>
        <nav aria-label="Estaciones vecinas" className="grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link to={`/unidad/${prev.id}`} className="rounded-md border border-border px-4 py-3 hover:border-fg-muted">
              <span className="block text-sm text-fg-muted">
                ← Anterior · <span className="font-mono text-xs">{prev.id}</span>
              </span>
              {prev.title}
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link
              to={`/unidad/${next.id}`}
              className="rounded-md border border-border px-4 py-3 text-right hover:border-fg-muted"
            >
              <span className="block text-sm text-fg-muted">
                Siguiente parada · <span className="font-mono text-xs">{next.id}</span> →
              </span>
              {next.title}
            </Link>
          )}
        </nav>
      </footer>
    </article>
  )
}
