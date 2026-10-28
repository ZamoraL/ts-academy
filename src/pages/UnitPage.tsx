import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ExercisePanel } from '../components/ExercisePanel'
import { Markdown } from '../components/Markdown'
import { Quiz } from '../components/Quiz'
import { getBlock, getUnit, UNITS } from '../content'
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

  if (!unit) return <p>Unidad no encontrada.</p>

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
  const solved = unit.exercises.filter((e) => exercises[e.id]?.passed).length

  return (
    <article className="space-y-8">
      <header>
        <p className="text-sm text-slate-500">
          {block?.title} · Unidad {index + 1} de {UNITS.length} · {unit.minutes} min
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white">{unit.title}</h1>
        {unit.sources.length > 0 && (
          <p className="mt-2 text-sm text-slate-400">
            Documentación oficial:{' '}
            {unit.sources.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="text-brand-300 underline">
                {s.label} ↗
              </a>
            ))}
          </p>
        )}
      </header>

      {unit.lesson ? (
        <div className="max-w-3xl">
          <Markdown>{unit.lesson}</Markdown>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-700 p-6 text-slate-400">
          {unit.kind === 'project'
            ? 'El enunciado de este proyecto aún no está escrito.'
            : 'El resumen y los ejercicios de esta unidad aún no están escritos.'}
          {unit.sources[0] && (
            <>
              {' '}
              Mientras tanto, lee la sección oficial:{' '}
              <a href={unit.sources[0].url} target="_blank" rel="noreferrer" className="text-brand-300 underline">
                {unit.sources[0].label}
              </a>
              .
            </>
          )}
        </div>
      )}

      {unit.exercises.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">
            Ejercicios{' '}
            <span className="text-base font-normal text-slate-500">
              {solved}/{unit.exercises.length}
            </span>
          </h2>
          {unit.exercises.map((ex, i) => (
            <ExercisePanel key={ex.id} exercise={ex} index={i} onResuelto={alResolver} />
          ))}
        </div>
      )}

      {autocompletada === unit.id && (
        <p role="status" className="rounded-lg border border-emerald-700 bg-emerald-950/40 p-3 text-sm text-emerald-300">
          🎉 Resolviste todos los ejercicios: la unidad quedó marcada como completada.
        </p>
      )}

      {unit.quiz.length > 0 && <Quiz key={unit.id} unitId={unit.id} questions={unit.quiz} />}

      <section>
        <h2 className="mb-2 font-semibold text-white">Mis notas</h2>
        <textarea
          key={unit.id}
          defaultValue={note}
          onBlur={(e) => saveNote(unit.id, e.target.value)}
          rows={4}
          placeholder="Apunta lo que quieras recordar de esta unidad…"
          className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm placeholder:text-slate-600"
        />
      </section>

      <footer className="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-6">
        {completedAt ? (
          <button
            onClick={() => uncompleteUnit(unit.id)}
            className="rounded-md border border-emerald-700 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-950"
          >
            ✓ Completada · desmarcar
          </button>
        ) : (
          <button
            onClick={() => completeUnit(unit.id)}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Marcar como completada
          </button>
        )}
        {!completedAt && solved < unit.exercises.length && (
          <span className="text-sm text-slate-500">
            Te faltan {unit.exercises.length - solved} ejercicios, pero puedes marcarla igual.
          </span>
        )}
        <nav className="ml-auto flex gap-2 text-sm">
          {prev && (
            <Link to={`/unidad/${prev.id}`} className="rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800">
              ← {prev.title}
            </Link>
          )}
          {next && (
            <Link to={`/unidad/${next.id}`} className="rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800">
              {next.title} →
            </Link>
          )}
        </nav>
      </footer>
    </article>
  )
}
