import { useNavigate } from 'react-router-dom'
import { Linea, Roundel } from '../components/Linea'
import { PlanForm } from '../components/PlanForm'
import { BLOCKS, EXERCISES, UNITS } from '../content'
import { useProgress } from '../store/progress'

export function Onboarding() {
  const setConfig = useProgress((s) => s.setConfig)
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="mb-12 flex items-center gap-2">
        <span className="font-display grid h-8 w-8 place-items-center rounded-full bg-fg text-[11px] text-bg" aria-hidden>
          TS
        </span>
        <span className="font-display text-sm">Academy</span>
      </p>

      <h1 className="font-display max-w-[16ch] text-[40px] sm:text-[64px]">
        De JavaScript a React en {UNITS.length} estaciones
      </h1>
      <p className="mt-5 max-w-[60ch] text-lg text-fg-muted">
        Empiezas desde cero con JavaScript, recorres el TypeScript Handbook completo y terminas con React + TypeScript.
        Cada día trae su lección, ejercicios que se comprueban en el navegador y un mini quiz.
      </p>

      {/* El plano de la red: la ilustración es el propio temario. */}
      <section aria-label="Plano de líneas" className="mt-10 rounded-md border border-border bg-surface p-4 sm:p-6">
        <ol className="space-y-3">
          {BLOCKS.map((b) => (
            <li key={b.id} className="grid grid-cols-[1.5rem_1fr] items-center gap-x-3 sm:grid-cols-[1.5rem_14rem_1fr]">
              <Roundel id={b.id} size="sm" />
              <span className="truncate text-sm">{b.title}</span>
              <span className="col-start-2 sm:col-start-3">
                <Linea blockId={b.id} enlaces={false} />
              </span>
            </li>
          ))}
        </ol>
        <p className="tabular mt-4 border-t border-border pt-3 text-sm text-fg-muted">
          {BLOCKS.length} líneas · {UNITS.length} estaciones · {EXERCISES.length} ejercicios · el progreso se guarda en
          este navegador
        </p>
      </section>

      <section aria-labelledby="planifica" className="mt-14 max-w-2xl">
        <h2 id="planifica" className="font-display mb-6 text-2xl">
          Planifica tu viaje
        </h2>
        <PlanForm
          submitLabel="Crear mi horario"
          onSubmit={(config) => {
            setConfig(config)
            navigate('/')
          }}
        />
      </section>
    </div>
  )
}
