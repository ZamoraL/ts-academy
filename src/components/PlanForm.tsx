import { useState, type ReactNode } from 'react'
import { formatLong, todayISO } from '../lib/date'
import { DURATION_PRESETS, PACES } from '../lib/scheduler'
import { useSchedule } from '../lib/useSchedule'
import type { Pace, PlanConfig } from '../types'
import { FeasibilityNote } from './FeasibilityNote'
import { btn } from './styles'

interface Props {
  initial?: PlanConfig | null
  submitLabel: string
  onSubmit(config: PlanConfig): void
}

export function PlanForm({ initial, submitLabel, onSubmit }: Props) {
  const [startDate, setStartDate] = useState(initial?.startDate ?? todayISO())
  const [durationWeeks, setDurationWeeks] = useState(initial?.durationWeeks ?? 13)
  const [pace, setPace] = useState<Pace>(initial?.pace ?? 'intense')
  const isPreset = DURATION_PRESETS.some((p) => p.weeks === durationWeeks)
  const [custom, setCustom] = useState(!isPreset)

  const config: PlanConfig = { startDate, durationWeeks, pace }
  const preview = useSchedule(config)

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(config)
      }}
    >
      <fieldset>
        <legend className="mb-3 font-bold">¿En cuánto tiempo quieres aprender?</legend>
        <div className="flex flex-wrap gap-px overflow-hidden rounded-sm border border-border bg-border sm:inline-flex">
          {DURATION_PRESETS.map((p) => (
            <Opcion
              key={p.weeks}
              name="duracion"
              checked={!custom && durationWeeks === p.weeks}
              onChange={() => {
                setCustom(false)
                setDurationWeeks(p.weeks)
              }}
            >
              {p.label}
            </Opcion>
          ))}
          <Opcion name="duracion" checked={custom} onChange={() => setCustom(true)}>
            Personalizado
          </Opcion>
        </div>
        {custom && (
          <div className="mt-3 flex items-center gap-2">
            <input
              id="semanas"
              type="number"
              min={1}
              max={156}
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Math.min(156, Math.max(1, Number(e.target.value) || 1)))}
              className="tabular h-10 w-20 rounded-sm border border-border bg-surface px-2 text-base"
            />
            <label htmlFor="semanas">semanas (entre 1 y 156)</label>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-bold">¿Qué ritmo prefieres?</legend>
        <div className="divide-y divide-border rounded-sm border border-border">
          {(Object.keys(PACES) as Pace[]).map((key) => (
            <label
              key={key}
              className={`flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-surface-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent-ink ${
                pace === key ? 'bg-surface-2' : ''
              }`}
            >
              <input
                type="radio"
                name="ritmo"
                checked={pace === key}
                onChange={() => setPace(key)}
                className="mt-1 accent-[var(--accent-ink)]"
              />
              <span>
                <span className="block font-bold">{PACES[key].label}</span>
                <span className="block text-fg-muted">{PACES[key].description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="inicio" className="mb-3 block font-bold">
          ¿Cuándo empiezas?
        </label>
        <input
          id="inicio"
          type="date"
          value={startDate}
          onChange={(e) => e.target.value && setStartDate(e.target.value)}
          className="tabular h-10 rounded-sm border border-border bg-surface px-3 text-base"
        />
      </div>

      {preview && (
        <div className="rounded-sm border border-border bg-surface px-4 py-3 font-mono text-[13px]" aria-live="polite">
          <p className="mb-1">
            <span className="text-fg-muted">fin del plan</span>{' '}
            <span className="first-letter:uppercase">{formatLong(preview.endDate)}</span>
          </p>
          <div className="font-sans text-sm">
            <FeasibilityNote schedule={preview} durationWeeks={durationWeeks} />
          </div>
        </div>
      )}

      <button type="submit" className={btn.primary}>
        {submitLabel}
      </button>
    </form>
  )
}

function Opcion({
  name,
  checked,
  onChange,
  children,
}: {
  name: string
  checked: boolean
  onChange(): void
  children: ReactNode
}) {
  return (
    <label
      className={`flex min-h-10 flex-1 cursor-pointer items-center justify-center px-4 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-accent-ink sm:flex-none ${
        checked ? 'bg-fg font-bold text-bg' : 'bg-surface hover:bg-surface-2'
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  )
}
