import { useMemo } from 'react'
import { UNITS } from '../content'
import { useProgress } from '../store/progress'
import type { PlanConfig } from '../types'
import { todayISO } from './date'
import { buildSchedule, type Schedule } from './scheduler'

export function useSchedule(configOverride?: PlanConfig): Schedule | null {
  const storedConfig = useProgress((s) => s.config)
  const completed = useProgress((s) => s.completed)
  const config = configOverride ?? storedConfig
  const today = todayISO()
  return useMemo(
    () => (config ? buildSchedule({ units: UNITS, config, completed, today }) : null),
    [config, completed, today],
  )
}
