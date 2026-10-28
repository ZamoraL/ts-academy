import { useNavigate } from 'react-router-dom'
import { PlanForm } from '../components/PlanForm'
import { useProgress } from '../store/progress'

export function Onboarding() {
  const setConfig = useProgress((s) => s.setConfig)
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10">
        <span className="grid h-10 w-10 place-items-center rounded bg-brand-500 text-sm font-bold text-white">TS</span>
        <h1 className="mt-4 text-3xl font-bold text-white">Aprende TypeScript desde cero</h1>
        <p className="mt-2 text-slate-400">
          Empezamos por JavaScript, seguimos con todo el TypeScript Handbook y terminamos con React + TypeScript. Cada
          día tiene su lección, ejercicios con verificación automática y un mini quiz. Elige tu ritmo y armamos el plan.
        </p>
      </div>
      <PlanForm
        submitLabel="Crear mi plan"
        onSubmit={(config) => {
          setConfig(config)
          navigate('/')
        }}
      />
    </div>
  )
}
