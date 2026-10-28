import { UnitRow } from '../components/DayCard'
import { BLOCKS, UNITS } from '../content'

export function Syllabus() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Temario</h1>
        <p className="mt-1 text-sm text-slate-400">
          {UNITS.length} unidades basadas en MDN, el TypeScript Handbook y react.dev. Puedes abrir cualquiera, no hace
          falta seguir el orden.
        </p>
      </div>
      {BLOCKS.map((b, i) => (
        <section key={b.id}>
          <h2 className="font-semibold text-white">
            <span className="mr-2 text-slate-500">{String.fromCharCode(65 + i)}.</span>
            {b.title}
          </h2>
          <p className="mb-3 text-sm text-slate-400">{b.description}</p>
          <ul className="space-y-2">
            {UNITS.filter((u) => u.blockId === b.id).map((u) => (
              <UnitRow key={u.id} unitId={u.id} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
