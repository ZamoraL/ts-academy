import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExercisePanel } from '../components/ExercisePanel'
import { Quiz } from '../components/Quiz'
import { btn, link, plural } from '../components/styles'
import { PageHeader } from '../components/ui'
import { KIND_HINT } from '../lib/kinds'
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
        <h1 className="text-2xl font-bold">No hay repaso ese día</h1>
        <p className="text-fg-muted">
          El {fecha} no tiene un repaso planificado; puede que el plan se haya recalculado.{' '}
          <Link to="/plan" className={link}>
            Ver el plan
          </Link>
        </p>
      </div>
    )
  }

  const unidades = dia.unitIds.map(getUnit).filter((u): u is Unit => u !== undefined)
  const titulo = dia.kind === 'practice' ? 'Práctica semanal' : 'Repaso'

  return (
    <div className="space-y-8">
      <PageHeader title={titulo} meta={<span className="first-letter:uppercase">{formatLong(fecha)}</span>} />
      <p className="max-w-[68ch] text-base">
        {KIND_HINT[dia.kind]} Empiezas <strong className="font-bold">desde el código inicial</strong>; tu código
        guardado en cada unidad no se modifica.
      </p>

      {unidades.length === 0 ? (
        <p className="text-fg-muted">
          Todavía no hay unidades que repasar: aparecen aquí a medida que completas lecciones.
        </p>
      ) : (
        <div className="divide-y divide-border border-y border-border">
          {unidades.map((u) => (
            <UnidadRepaso key={u.id} unidad={u} />
          ))}
        </div>
      )}

      <footer className="border-t border-border pt-6">
        {hecho ? (
          <p className="font-mono text-success-ink">✓ {titulo} terminado</p>
        ) : (
          <button
            onClick={() => {
              completeReview(fecha)
              navigate('/')
            }}
            className={btn.primary}
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
    <section>
      <button
        onClick={() => setAbierta((a) => !a)}
        aria-expanded={abierta}
        className="flex min-h-12 w-full flex-wrap items-center gap-x-3 gap-y-1 px-1 py-2 text-left hover:bg-surface-2"
      >
        <span className="w-4 font-mono text-fg-muted" aria-hidden>
          {abierta ? '▾' : '▸'}
        </span>
        <span className="w-8 font-mono text-xs text-fg-muted">{unidad.id}</span>
        <span className="font-bold">{unidad.title}</span>
        <span className="tabular ml-auto font-mono text-xs text-fg-muted">
          {total > 0 && `${resueltos.size}/${total} ejercicios · `}
          {plural(unidad.quiz.length, 'pregunta', 'preguntas')}
        </span>
      </button>
      {abierta && (
        <div className="space-y-6 pt-2 pb-6 sm:pl-16">
          <Link to={`/unidad/${unidad.id}`} className={`${link} text-sm`}>
            Releer la lección
          </Link>
          {unidad.exercises.map((ex, i) => (
            <ExercisePanel
              key={ex.id}
              exercise={ex}
              index={i}
              total={total}
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
