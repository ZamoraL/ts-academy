import { Link } from 'react-router-dom'
import { KindBadge, UnitRow } from '../components/DayCard'
import { FeasibilityNote } from '../components/FeasibilityNote'
import { Linea, Roundel } from '../components/Linea'
import { btn, link, plural, teclaMod } from '../components/styles'
import { getBlock, getUnit, UNITS } from '../content'
import { addDays, formatLong, formatShort, todayISO } from '../lib/date'
import { KIND_HINT, KIND_LABEL } from '../lib/kinds'
import { calcularEstadisticas } from '../lib/stats'
import { computeStreak } from '../lib/streak'
import { useSchedule } from '../lib/useSchedule'
import { useTeclasFilas } from '../lib/useTeclasFilas'
import { useProgress } from '../store/progress'

export function Dashboard() {
  const schedule = useSchedule()
  const config = useProgress((s) => s.config)!
  const completed = useProgress((s) => s.completed)
  const exercises = useProgress((s) => s.exercises)
  const quizzes = useProgress((s) => s.quizzes)
  const repasos = useProgress((s) => s.repasos)
  const activity = useProgress((s) => s.activity)
  const today = todayISO()
  useTeclasFilas()
  if (!schedule) return null

  const hoy = schedule.days.find((d) => d.date === today)
  const estudio = hoy?.kind === 'study' ? hoy : undefined
  const repaso = hoy && hoy.kind !== 'study' ? hoy : undefined
  const siguienteDia = schedule.days.find((d) => d.date > today)
  const proximos = schedule.days.filter((d) => d.date > today).slice(0, 5)
  const terminado = UNITS.every((u) => u.id in completed)
  const antesDeEmpezar = config.startDate > today

  // La siguiente parada: la primera unidad sin terminar de hoy o, si no hay, la siguiente del temario.
  const actual = estudio?.unitIds.find((id) => !(id in completed)) ?? UNITS.find((u) => !(u.id in completed))?.id
  const unidad = actual ? getUnit(actual) : undefined
  const enLinea = unidad ? UNITS.filter((u) => u.blockId === unidad.blockId) : []
  const linea = unidad ? getBlock(unidad.blockId) : undefined
  const siguiente = unidad ? UNITS[UNITS.indexOf(unidad) + 1] : undefined
  const hechasHoy = estudio ? estudio.unitIds.filter((id) => id in completed).length : 0
  const anterior = Object.entries(completed)
    .filter(([id, fecha]) => fecha < today && !estudio?.unitIds.includes(id))
    .sort((a, b) => (a[1] < b[1] ? -1 : 1))
    .at(-1)

  const stats = calcularEstadisticas(UNITS, { completed, exercises, quizzes, repasos })
  const racha = computeStreak(activity, today, config.pace)

  return (
    <div className="space-y-12">
      {/* Cartel principal: dónde estás y adónde vas. */}
      <section aria-labelledby="estas-en" className="space-y-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-muted">
          <span className="first-letter:uppercase">{formatLong(today)}</span>
          {hoy && (
            <>
              <span aria-hidden>·</span>
              <KindBadge kind={hoy.kind} accent />
              <span className="tabular">{hoy.minutes} min</span>
            </>
          )}
          {!hoy && !terminado && !antesDeEmpezar && <span>· hoy no hay servicio: día de descanso</span>}
        </div>

        {terminado ? (
          <div>
            <p className="text-fg-muted">Fin de trayecto</p>
            <h1 id="estas-en" className="font-display mt-1 text-4xl sm:text-5xl">
              Recorriste las {UNITS.length} estaciones
            </h1>
            <p className="mt-3 max-w-[60ch] text-fg-muted">
              Terminaste el curso. Puedes volver a cualquier estación desde el{' '}
              <Link to="/temario" className={link}>
                plano
              </Link>{' '}
              para repasar.
            </p>
          </div>
        ) : repaso ? (
          <div>
            <p className="text-fg-muted">{repaso.kind === 'practice' ? 'Práctica semanal' : 'Día de repaso'}</p>
            <h1 id="estas-en" className="font-display mt-1 text-4xl sm:text-5xl">
              Vuelta por {plural(repaso.unitIds.length, 'estación', 'estaciones')}
            </h1>
            <p className="mt-3 max-w-[60ch] text-fg-muted">{KIND_HINT[repaso.kind]}</p>
            <div className="mt-6">
              {repaso.date in repasos ? (
                <p className="font-bold text-success-ink">✓ {KIND_LABEL[repaso.kind]} terminado</p>
              ) : (
                <Link to={`/repaso/${repaso.date}`} className={btn.primary}>
                  Empezar {KIND_LABEL[repaso.kind]} →
                </Link>
              )}
            </div>
          </div>
        ) : (
          unidad &&
          linea && (
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="flex items-center gap-2.5 text-fg-muted">
                  <Roundel id={linea.id} activa size="sm" />
                  Línea {linea.id.toUpperCase()} · {linea.title}
                </p>
                <p className="mt-6 text-fg-muted">
                  {antesDeEmpezar ? `Tu viaje empieza el ${formatLong(config.startDate)}. Primera parada:` : 'Estás en'}
                </p>
                <h1 id="estas-en" className="font-display mt-1 max-w-[20ch] text-[34px] sm:text-5xl">
                  {unidad.title}
                </h1>
                <p className="tabular mt-3 text-fg-muted">
                  <span className="font-mono text-sm">{unidad.id}</span> · estación {enLinea.indexOf(unidad) + 1} de{' '}
                  {enLinea.length}
                  {estudio && ` · ${hechasHoy} de ${plural(estudio.unitIds.length, 'parada hecha', 'paradas hechas')} hoy`}
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 lg:items-end">
                <Link to={`/unidad/${unidad.id}`} className={btn.primary}>
                  {stats.unidades.hechas > 0 ? 'Continuar' : 'Empezar'} en {unidad.id} →
                </Link>
                {siguiente && (
                  <p className="text-sm text-fg-muted">
                    Siguiente parada: <span className="font-mono text-xs">{siguiente.id}</span> {siguiente.title}
                  </p>
                )}
              </div>
            </div>
          )
        )}

        {unidad && !terminado && !repaso && (
          <div className="rounded-md border border-border bg-surface px-4 pt-5 pb-3 sm:px-6">
            <Linea blockId={unidad.blockId} actual={unidad.id} etiquetas />
          </div>
        )}
      </section>

      {!schedule.feasible && (
        <div className="rounded-md bg-surface-2 px-4 py-3">
          <FeasibilityNote schedule={schedule} durationWeeks={config.durationWeeks} />
          <Link to="/ajustes" className={`${link} mt-1 inline-block`}>
            Ajustar el plan
          </Link>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <section aria-labelledby="itinerario">
          <h2 id="itinerario" className="font-display mb-3 text-lg">
            {repaso ? 'Estaciones para repasar' : 'Itinerario de hoy'}
          </h2>
          {repaso ? (
            <ol>
              {repaso.unitIds.map((id) => (
                <UnitRow key={id} unitId={id} repaso meta="repasar" />
              ))}
            </ol>
          ) : estudio ? (
            <ol>
              {anterior && (
                <UnitRow
                  unitId={anterior[0]}
                  meta={anterior[1] === addDays(today, -1) ? 'ayer' : formatShort(anterior[1])}
                />
              )}
              {estudio.unitIds.map((id) => (
                <UnitRow key={id} unitId={id} actual={id === actual} />
              ))}
            </ol>
          ) : (
            <p className="text-fg-muted">
              {terminado
                ? 'No quedan paradas.'
                : siguienteDia
                  ? `Hoy no hay paradas planificadas. El servicio sigue el ${formatLong(siguienteDia.date)}; si quieres, adelanta la siguiente estación.`
                  : 'No hay paradas planificadas.'}
            </p>
          )}
          {estudio && hechasHoy === estudio.unitIds.length && (
            <p className="mt-3 font-bold text-success-ink">
              ✓ Itinerario de hoy completo{siguienteDia ? `. Siguiente servicio: ${formatShort(siguienteDia.date)}` : ''}.
            </p>
          )}
        </section>

        {proximos.length > 0 && (
          <section aria-labelledby="proximos">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 id="proximos" className="font-display text-lg">
                Próximos servicios
              </h2>
              <Link to="/plan" className={`${link} text-sm`}>
                Horario
              </Link>
            </div>
            <ul className="divide-y divide-border border-y border-border">
              {proximos.map((d) => (
                <li key={d.date} className="flex min-h-12 items-center gap-3 py-2 text-sm">
                  <span className="tabular w-20 shrink-0 text-fg-muted first-letter:uppercase">
                    {formatShort(d.date)}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-xs">
                    {d.kind === 'study' ? (
                      d.unitIds.join(' · ')
                    ) : (
                      <span className="font-sans text-sm">
                        Repasar {plural(d.unitIds.length, 'estación', 'estaciones')}
                      </span>
                    )}
                  </span>
                  <KindBadge kind={d.kind} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <footer className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center">
        <dl className="tabular grid flex-1 grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:flex-wrap">
          <Dato titulo="estaciones" valor={`${stats.unidades.hechas}/${stats.unidades.total}`} />
          <Dato titulo="ejercicios" valor={`${stats.ejercicios.resueltos}/${stats.ejercicios.total}`} />
          <Dato
            titulo="quizzes"
            valor={
              stats.quizzes.respondidas > 0
                ? `${Math.round((stats.quizzes.aciertos / stats.quizzes.respondidas) * 100)} %`
                : '—'
            }
          />
          <Dato titulo="racha" valor={plural(racha, 'día', 'días')} />
        </dl>
        <p className="hidden text-xs text-fg-muted lg:block">
          <kbd>J</kbd> <kbd>K</kbd> moverse · <kbd>↵</kbd> abrir · <kbd>{teclaMod}</kbd> <kbd>K</kbd> buscar
        </p>
      </footer>
    </div>
  )
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs text-fg-muted">{titulo}</dt>
      <dd className="font-display text-lg">{valor}</dd>
    </div>
  )
}
