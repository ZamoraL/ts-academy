import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExercisePanel } from '../components/ExercisePanel'
import { Quiz } from '../components/Quiz'
import { getUnit } from '../content'
import { formatLong } from '../lib/date'
import { useSchedule } from '../lib/useSchedule'
import { useProgress } from '../store/progress'
import type { Unit } from '../types'

export default function ReviewPage() {
  const { fecha = '' } = useParams()
  const schedule = useSchedule()
  const hecho = useProgress((s) => fecha in s.repasos)
  const completeReview = useProgress((s) => s.completeReview)
  const navigate = useNavigate()

  const dia = schedule?.days.find((d) => d.date === fecha && d.kind !== 'study')
  if (!dia) {
    return (
      <div className="space-y-3">
        <p className="text-slate-300">No hay un repaso planificado para esta fecha.</p>
        <Link to="/plan" className="text-brand-300 underline">
          Ver el plan
        </Link>
      </div>
    )
  }

  const unidades = dia.unitIds.map(getUnit).filter((u): u is Unit => u !== undefined)
  const titulo = dia.kind === 'practice' ? 'Práctica semanal' : 'Repaso'

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-slate-500 first-letter:uppercase">{formatLong(fecha)}</p>
        <h1 className="text-2xl font-bold text-white">{titulo}</h1>
        <p className="mt-1 text-sm text-slate-400">
          Rehaz los ejercicios <strong className="text-slate-200">desde el código inicial</strong>, sin mirar tu
          solución anterior, y repite los quizzes. Tu código guardado en cada unidad no se modifica. Si algo cuesta,
          vuelve a la lección.
        </p>
      </header>

      {unidades.length === 0 && <p className="text-slate-400">No hay unidades que repasar todavía.</p>}

      {unidades.map((u) => (
        <UnidadRepaso key={u.id} unidad={u} />
      ))}

      <footer className="border-t border-slate-800 pt-6">
        {hecho ? (
          <p className="text-emerald-400">✓ Repaso terminado</p>
        ) : (
          <button
            onClick={() => {
              completeReview(fecha)
              navigate('/')
            }}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Terminar {titulo.toLowerCase()}
          </button>
        )}
      </footer>
    </div>
  )
}

/** Cada unidad se despliega bajo demanda: montar muchos editores a la vez es pesado. */
function UnidadRepaso({ unidad }: { unidad: Unit }) {
  const [abierta, setAbierta] = useState(false)
  const [resueltos, setResueltos] = useState<Set<string>>(new Set())
  const total = unidad.exercises.length

  return (
    <section className="rounded-xl border border-slate-800">
      <button
        onClick={() => setAbierta((a) => !a)}
        aria-expanded={abierta}
        className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left hover:bg-slate-900"
      >
        <span className="text-slate-500">{abierta ? '▾' : '▸'}</span>
        <span className="font-medium text-white">{unidad.title}</span>
        <span className="ml-auto text-xs text-slate-500">
          {total > 0 && `${resueltos.size}/${total} ejercicios · `}
          {unidad.quiz.length} preguntas
        </span>
      </button>
      {abierta && (
        <div className="space-y-6 border-t border-slate-800 p-4">
          <Link to={`/unidad/${unidad.id}`} className="text-sm text-brand-300 underline">
            Releer la lección
          </Link>
          {unidad.exercises.map((ex, i) => (
            <ExercisePanel
              key={ex.id}
              exercise={ex}
              index={i}
              modoRepaso
              onResuelto={() => setResueltos((r) => new Set(r).add(ex.id))}
            />
          ))}
          {unidad.quiz.length > 0 && <Quiz unitId={unidad.id} questions={unidad.quiz} nuevo />}
        </div>
      )}
    </section>
  )
}
