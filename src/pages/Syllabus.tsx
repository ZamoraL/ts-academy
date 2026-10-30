import { UnitRow } from '../components/DayCard'
import { Linea, Roundel } from '../components/Linea'
import { PageHeader } from '../components/ui'
import { BLOCKS, UNITS } from '../content'
import { useTeclasFilas } from '../lib/useTeclasFilas'
import { useProgress } from '../store/progress'

export function Syllabus() {
  const completed = useProgress((s) => s.completed)
  useTeclasFilas()
  const actual = UNITS.find((u) => !(u.id in completed))

  return (
    <div className="space-y-8">
      <PageHeader
        title="Plano del curso"
        meta={`${BLOCKS.length} líneas y ${UNITS.length} estaciones, de JavaScript a React + TypeScript, basadas en MDN, el TypeScript Handbook y react.dev. Puedes bajarte en cualquier estación.`}
      />
      <ol>
        {BLOCKS.map((b, i) => {
          const units = UNITS.filter((u) => u.blockId === b.id)
          const done = units.filter((u) => u.id in completed).length
          const enCurso = actual?.blockId === b.id
          const ultima = i === BLOCKS.length - 1
          return (
            <li key={b.id} className="relative">
              {/* Transbordo: la conexión entre una línea y la siguiente. */}
              {!ultima && (
                <span
                  className={`absolute top-8 bottom-0 left-[15px] w-1 ${done === units.length ? 'bg-accent' : 'bg-border'}`}
                  aria-hidden
                />
              )}
              <details open={enCurso} className="group">
                <summary className="relative grid grid-cols-[2rem_1fr] gap-x-4 rounded-md py-3 pr-2 hover:bg-surface-2 sm:grid-cols-[2rem_minmax(0,16rem)_1fr_auto] sm:items-center">
                  <Roundel id={b.id} activa={enCurso} />
                  <span className="min-w-0">
                    <span className="block font-bold">
                      Línea {b.id.toUpperCase()} · {b.title}
                    </span>
                    <span className="block text-sm text-fg-muted">{b.description}</span>
                  </span>
                  <span className="col-start-2 mt-3 sm:col-start-3 sm:mt-0">
                    <Linea blockId={b.id} actual={enCurso ? actual?.id : undefined} enlaces={false} />
                  </span>
                  <span className="tabular col-start-2 mt-1 text-sm text-fg-muted sm:col-start-4 sm:mt-0 sm:w-16 sm:text-right">
                    {done}/{units.length}
                    <span className="ml-2 inline-block transition-transform group-open:rotate-90" aria-hidden>
                      ›
                    </span>
                  </span>
                </summary>
                <ol className="mb-4 ml-12">
                  {units.map((u) => (
                    <UnitRow key={u.id} unitId={u.id} actual={u.id === actual?.id} />
                  ))}
                </ol>
              </details>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
