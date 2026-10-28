import { Link } from 'react-router-dom'
import { DayCard, KindBadge, UnitRow } from '../components/DayCard'
import { FeasibilityNote } from '../components/FeasibilityNote'
import { BLOCKS, UNITS } from '../content'
import { formatLong, formatShort, todayISO } from '../lib/date'
import { calcularEstadisticas } from '../lib/stats'
import { useSchedule } from '../lib/useSchedule'
import { useProgress } from '../store/progress'

export function Dashboard() {
  const schedule = useSchedule()
  const config = useProgress((s) => s.config)!
  const completed = useProgress((s) => s.completed)
  const exercises = useProgress((s) => s.exercises)
  const quizzes = useProgress((s) => s.quizzes)
  const repasos = useProgress((s) => s.repasos)
  const today = todayISO()
  if (!schedule) return null

  const todayPlan = schedule.days.find((d) => d.date === today)
  const doneToday = UNITS.filter((u) => completed[u.id] === today)
  const upcoming = schedule.days.filter((d) => d.date > today).slice(0, 6)
  const finished = schedule.days.length === 0
  const stats = calcularEstadisticas(UNITS, { completed, exercises, quizzes, repasos })
  const precision =
    stats.quizzes.respondidas > 0 ? Math.round((stats.quizzes.aciertos / stats.quizzes.respondidas) * 100) : null

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-slate-500 first-letter:uppercase">{formatLong(today)}</p>
        <h1 className="text-2xl font-bold text-white">
          {finished ? '¡Terminaste el curso! 🎉' : todayPlan ? 'Tu sesión de hoy' : 'Hoy toca descanso'}
        </h1>
        {config.startDate > today && (
          <p className="mt-1 text-slate-400">Tu plan empieza el {formatLong(config.startDate)}.</p>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Dato titulo="Unidades" valor={`${stats.unidades.hechas}/${stats.unidades.total}`} />
        <Dato titulo="Ejercicios resueltos" valor={`${stats.ejercicios.resueltos}/${stats.ejercicios.total}`} />
        <Dato
          titulo="Aciertos en quizzes"
          valor={precision === null ? '—' : `${precision}%`}
          detalle={stats.quizzes.respondidas > 0 ? `${stats.quizzes.aciertos} de ${stats.quizzes.respondidas}` : undefined}
        />
        <Dato titulo="Repasos hechos" valor={String(stats.repasos)} />
      </dl>

      {!schedule.feasible && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          <FeasibilityNote schedule={schedule} durationWeeks={config.durationWeeks} />
          <Link to="/ajustes" className="mt-2 inline-block text-amber-300 underline">
            Ajustar plan
          </Link>
        </div>
      )}

      {todayPlan && todayPlan.unitIds.length > 0 && <DayCard day={todayPlan} title="Hoy" />}

      {doneToday.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-400">Completado hoy</h2>
          <ul className="space-y-2">
            {doneToday.map((u) => (
              <UnitRow key={u.id} unitId={u.id} />
            ))}
          </ul>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-semibold text-white">Próximos días</h2>
            <Link to="/plan" className="text-sm text-brand-300 hover:underline">
              Ver plan completo
            </Link>
          </div>
          <ul className="divide-y divide-slate-800 rounded-xl border border-slate-800">
            {upcoming.map((d) => (
              <li key={d.date} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="w-28 shrink-0 text-slate-400">{formatShort(d.date)}</span>
                <KindBadge kind={d.kind} />
                <span className="truncate text-slate-300">
                  {d.kind === 'study' ? (
                    UNITS.filter((u) => d.unitIds.includes(u.id))
                      .map((u) => u.title)
                      .join(' · ')
                  ) : (
                    <Link to={`/repaso/${d.date}`} className="hover:text-white hover:underline">
                      Repasar {unidades(d.unitIds.length)}
                    </Link>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-semibold text-white">Progreso por bloque</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {BLOCKS.map((b) => {
            const units = UNITS.filter((u) => u.blockId === b.id)
            const done = units.filter((u) => u.id in completed).length
            return (
              <div key={b.id} className="rounded-lg border border-slate-800 p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-200">{b.title}</span>
                  <span className="text-slate-500">
                    {done}/{units.length}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-brand-400" style={{ width: `${(done / units.length) * 100}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function unidades(n: number): string {
  return n === 1 ? '1 unidad' : `${n} unidades`
}

function Dato({ titulo, valor, detalle }: { titulo: string; valor: string; detalle?: string }) {
  return (
    <div className="rounded-lg border border-slate-800 p-3">
      <dt className="text-xs text-slate-500">{titulo}</dt>
      <dd className="mt-1 text-xl font-semibold text-white">
        {valor}
        {detalle && <span className="ml-2 text-xs font-normal text-slate-500">{detalle}</span>}
      </dd>
    </div>
  )
}
