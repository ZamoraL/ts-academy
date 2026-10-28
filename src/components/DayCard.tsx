import { Link } from 'react-router-dom'
import { getUnit } from '../content'
import { formatLong } from '../lib/date'
import { useProgress } from '../store/progress'
import type { DayKind, ScheduledDay } from '../types'

const KIND_LABEL: Record<DayKind, string> = {
  study: 'Lección',
  review: 'Repaso',
  practice: 'Práctica semanal',
}

const KIND_STYLE: Record<DayKind, string> = {
  study: 'bg-brand-500/15 text-brand-300',
  review: 'bg-violet-500/15 text-violet-300',
  practice: 'bg-amber-500/15 text-amber-300',
}

const KIND_HINT: Record<DayKind, string> = {
  study: '',
  review: 'Relee estas unidades, repite el quiz y rehaz los ejercicios sin mirar tu solución anterior.',
  practice: 'Rehaz los ejercicios de la semana desde cero. Si alguno cuesta, vuelve a la lección.',
}

export function KindBadge({ kind }: { kind: DayKind }) {
  return <span className={`rounded px-2 py-0.5 text-xs font-medium ${KIND_STYLE[kind]}`}>{KIND_LABEL[kind]}</span>
}

export function DayCard({ day, title }: { day: ScheduledDay; title?: string }) {
  const repasoHecho = useProgress((s) => day.date in s.repasos)
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-white">{title ?? formatLong(day.date)}</h2>
        <KindBadge kind={day.kind} />
        <span className="text-sm text-slate-500">~{day.minutes} min</span>
        {day.kind !== 'study' &&
          (repasoHecho ? (
            <span className="ml-auto text-sm text-emerald-400">✓ Hecho</span>
          ) : (
            <Link
              to={`/repaso/${day.date}`}
              className="ml-auto rounded-md bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              Empezar {day.kind === 'practice' ? 'práctica' : 'repaso'}
            </Link>
          ))}
      </div>
      {KIND_HINT[day.kind] && <p className="mb-3 text-sm text-slate-400">{KIND_HINT[day.kind]}</p>}
      <ul className="space-y-2">
        {day.unitIds.map((id) => (
          <UnitRow key={id} unitId={id} />
        ))}
      </ul>
    </section>
  )
}

export function UnitRow({ unitId }: { unitId: string }) {
  const unit = getUnit(unitId)
  const done = useProgress((s) => unitId in s.completed)
  if (!unit) return null
  return (
    <li>
      <Link
        to={`/unidad/${unit.id}`}
        className="flex items-center gap-3 rounded-lg border border-slate-800 px-3 py-2 hover:border-slate-600 hover:bg-slate-800/50"
      >
        <span
          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-xs ${
            done ? 'border-emerald-500 bg-emerald-500 text-slate-950' : 'border-slate-600'
          }`}
        >
          {done && '✓'}
        </span>
        <span className={done ? 'text-slate-400 line-through' : 'text-slate-100'}>{unit.title}</span>
        {unit.kind === 'project' && <span className="text-xs text-amber-400">proyecto</span>}
        <span className="ml-auto flex shrink-0 gap-3 text-xs text-slate-500">
          {unit.exercises.length > 0 && <span>{unit.exercises.length} ejercicios</span>}
          {!unit.lesson && <span>contenido pendiente</span>}
          <span>{unit.minutes} min</span>
        </span>
      </Link>
    </li>
  )
}
