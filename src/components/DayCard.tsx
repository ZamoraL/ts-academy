import { Link } from 'react-router-dom'
import { getUnit } from '../content'
import { formatShort } from '../lib/date'
import { KIND_LABEL } from '../lib/kinds'
import { useProgress } from '../store/progress'
import type { DayKind } from '../types'
import { plural } from './styles'
import { Tag } from './ui'

export function KindBadge({ kind, accent = false }: { kind: DayKind; accent?: boolean }) {
  return <Tag tono={kind === 'study' ? (accent ? 'accent' : 'neutro') : 'support'}>{KIND_LABEL[kind]}</Tag>
}

interface UnitRowProps {
  unitId: string
  /** La siguiente parada: anillo grande y título en negrita. */
  actual?: boolean
  meta?: string
  /** Repaso: estación turquesa. */
  repaso?: boolean
}

/**
 * Parada en un esquema vertical de línea: la vía pasa por la izquierda y cada unidad es una estación.
 * Va dentro de un <ol> o <ul>; la vía se dibuja tramo a tramo para que la lista funcione sola.
 */
export function UnitRow({ unitId, actual = false, meta, repaso = false }: UnitRowProps) {
  const unit = getUnit(unitId)
  const completedAt = useProgress((s) => s.completed[unitId])
  const done = completedAt !== undefined
  const solved = useProgress((s) => unit?.exercises.filter((e) => s.exercises[e.id]?.passed).length ?? 0)
  if (!unit) return null

  const total = unit.exercises.length
  const detalle =
    meta ??
    (done
      ? `hecha ${formatShort(completedAt!)}`
      : solved > 0
        ? `${solved}/${total} ejercicios`
        : [total > 0 && plural(total, 'ejercicio', 'ejercicios'), `${unit.minutes} min`].filter(Boolean).join(' · '))

  const via = repaso ? 'bg-support' : done ? 'bg-accent' : 'bg-border'
  const punto = actual
    ? 'h-4 w-4 border-4 border-accent bg-bg'
    : repaso
      ? 'h-3 w-3 border-[3px] border-support bg-bg'
      : done
        ? 'h-3 w-3 bg-accent ring-[3px] ring-bg'
        : 'h-3 w-3 border-2 border-fg-muted bg-bg'

  return (
    <li className="group/parada relative">
      <span
        className={`absolute top-0 bottom-0 left-[19px] w-1 group-first/parada:top-1/2 group-last/parada:bottom-1/2 ${via}`}
        aria-hidden
      />
      <Link
        to={`/unidad/${unit.id}`}
        data-fila
        aria-current={actual ? 'step' : undefined}
        className="relative flex min-h-12 items-center gap-3 rounded-md py-2 pr-3 pl-2.5 hover:bg-surface-2 focus-visible:bg-surface-2"
      >
        <span className="grid w-5 shrink-0 place-items-center">
          <span
            className={`block rounded-full ${punto}`}
            role="img"
            aria-label={actual ? 'siguiente parada' : repaso ? 'repasar' : done ? 'hecha' : 'pendiente'}
          />
        </span>
        <span className="w-8 shrink-0 font-mono text-xs text-fg-muted">{unit.id}</span>
        <span className={`min-w-0 flex-1 ${done && !actual ? 'text-fg-muted' : ''} ${actual ? 'font-bold' : ''}`}>
          {unit.title}
        </span>
        {unit.kind === 'project' && <Tag>proyecto</Tag>}
        <span className="tabular hidden shrink-0 text-sm text-fg-muted sm:inline">{detalle}</span>
      </Link>
    </li>
  )
}
