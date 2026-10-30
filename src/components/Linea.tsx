import { Link } from 'react-router-dom'
import { getBlock, UNITS } from '../content'
import { useProgress } from '../store/progress'

/** Rótulo de línea: la letra del bloque en un círculo, como en la señalética del metro. */
export function Roundel({ id, activa = false, size = 'md' }: { id: string; activa?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: 'h-6 w-6 text-[11px]', md: 'h-8 w-8 text-sm', lg: 'h-11 w-11 text-lg' }[size]
  return (
    <span
      className={`font-display grid shrink-0 place-items-center rounded-full uppercase ${dims} ${
        activa ? 'bg-accent text-on-accent' : 'bg-fg text-bg'
      }`}
      aria-hidden
    >
      {id}
    </span>
  )
}

interface LineaProps {
  blockId: string
  /** Estación marcada con «estás aquí». */
  actual?: string
  /** Sin enlaces (dentro de un <summary> o como ilustración). */
  enlaces?: boolean
  /** Ids bajo cada estación. */
  etiquetas?: boolean
}

/**
 * Tramo de una línea: una estación por unidad del bloque. La vía se pinta en naranja
 * hasta la última estación hecha; cada estación muestra su propio estado.
 */
export function Linea({ blockId, actual, enlaces = true, etiquetas = false }: LineaProps) {
  const completed = useProgress((s) => s.completed)
  const units = UNITS.filter((u) => u.blockId === blockId)
  const ultima = units.reduce((max, u, i) => (u.id in completed ? i : max), -1)
  const recorrido = units.length > 1 ? Math.max(0, ultima) / (units.length - 1) : ultima >= 0 ? 1 : 0
  const block = getBlock(blockId)

  return (
    <div className={`relative ${etiquetas ? 'pb-6' : ''}`}>
      {/* La vía va centrada en la fila de estaciones (h-6), no en el bloque con etiquetas. */}
      <div className="absolute inset-x-[5px] top-3 h-1 -translate-y-1/2 rounded-full bg-border" aria-hidden>
        <div className="h-full rounded-full bg-accent" style={{ width: `${recorrido * 100}%` }} />
      </div>
      <ol
        className="relative flex items-center justify-between"
        aria-label={`Línea ${blockId.toUpperCase()}: ${block?.title ?? ''}`}
      >
        {units.map((u) => {
          const hecha = u.id in completed
          const esActual = u.id === actual
          const punto = esActual
            ? 'h-5 w-5 border-4 border-accent bg-bg'
            : hecha
              ? 'h-2.5 w-2.5 bg-accent ring-2 ring-bg'
              : 'h-2.5 w-2.5 border-2 border-fg-muted bg-bg'
          const estado = esActual ? 'estás aquí' : hecha ? 'hecha' : 'pendiente'
          const contenido = (
            <>
              <span className={`block rounded-full ${punto}`} />
              {(etiquetas || esActual) && (
                <span
                  className={`absolute top-full mt-1.5 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] left-1/2 ${
                    esActual ? 'font-medium text-accent-ink' : 'text-fg-muted'
                  } ${etiquetas && !esActual ? 'hidden md:block' : ''}`}
                >
                  {u.id}
                </span>
              )}
            </>
          )
          return (
            <li key={u.id} className="relative grid place-items-center">
              {enlaces ? (
                <Link
                  to={`/unidad/${u.id}`}
                  title={`${u.id} · ${u.title}`}
                  aria-label={`${u.id} ${u.title} (${estado})`}
                  aria-current={esActual ? 'step' : undefined}
                  className="relative grid h-6 min-w-3 place-items-center rounded-full"
                >
                  {contenido}
                </Link>
              ) : (
                <span className="relative grid h-6 min-w-3 place-items-center" title={`${u.id} · ${u.title}`}>
                  {contenido}
                  <span className="sr-only">
                    {u.id} {estado}
                  </span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
