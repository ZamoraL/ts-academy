import { useState, type ReactNode } from 'react'
import { formatLong, todayISO } from '../lib/date'
import { DURATION_PRESETS, PACES } from '../lib/scheduler'
import { useSchedule } from '../lib/useSchedule'
import type { Pace, PlanConfig } from '../types'
import { FeasibilityNote } from './FeasibilityNote'

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
        <legend className="mb-3 font-medium text-white">¿En cuánto tiempo quieres aprender?</legend>
        <div className="flex flex-wrap gap-2">
          {DURATION_PRESETS.map((p) => (
            <Choice
              key={p.weeks}
              active={!custom && durationWeeks === p.weeks}
              onClick={() => {
                setCustom(false)
                setDurationWeeks(p.weeks)
              }}
            >
              {p.label}
            </Choice>
          ))}
          <Choice active={custom} onClick={() => setCustom(true)}>
            Personalizado
          </Choice>
        </div>
        {custom && (
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-300">
            <input
              type="number"
              min={1}
              max={156}
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Math.max(1, Number(e.target.value) || 1))}
              className="w-20 rounded-md border border-slate-700 bg-slate-900 px-2 py-1"
            />
            semanas
          </label>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-medium text-white">¿Qué ritmo prefieres?</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(PACES) as Pace[]).map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => setPace(key)}
              className={`rounded-lg border p-4 text-left transition ${
                pace === key ? 'border-brand-400 bg-brand-500/10' : 'border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="font-medium text-white">{PACES[key].label}</div>
              <div className="mt-1 text-sm text-slate-400">{PACES[key].description}</div>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-medium text-white">¿Cuándo empiezas?</legend>
        <input
          type="date"
          value={startDate}
          onChange={(e) => e.target.value && setStartDate(e.target.value)}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5"
        />
      </fieldset>

      {preview && (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm">
          <p>
            Fin del plan: <strong className="text-white">{formatLong(preview.endDate)}</strong>
          </p>
          <FeasibilityNote schedule={preview} durationWeeks={durationWeeks} />
        </div>
      )}

      <button type="submit" className="rounded-md bg-brand-500 px-5 py-2 font-medium text-white hover:bg-brand-600">
        {submitLabel}
      </button>
    </form>
  )
}

function Choice({ active, onClick, children }: { active: boolean; onClick(): void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm ${
        active ? 'border-brand-400 bg-brand-500/15 text-white' : 'border-slate-700 text-slate-300 hover:border-slate-500'
      }`}
    >
      {children}
    </button>
  )
}
