// Fechas locales como 'YYYY-MM-DD' para evitar problemas de zona horaria.
export type ISODate = string

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function toISODate(d: Date): ISODate {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function parseISODate(s: ISODate): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayISO(): ISODate {
  return toISODate(new Date())
}

export function addDays(s: ISODate, days: number): ISODate {
  const d = parseISODate(s)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

/** 0 = domingo ... 6 = sábado */
export function weekday(s: ISODate): number {
  return parseISODate(s).getDay()
}

export function diffDays(a: ISODate, b: ISODate): number {
  return Math.round((parseISODate(b).getTime() - parseISODate(a).getTime()) / 86_400_000)
}

export function maxDate(a: ISODate, b: ISODate): ISODate {
  return a > b ? a : b
}

const fmt = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' })
const fmtShort = new Intl.DateTimeFormat('es', { weekday: 'short', day: 'numeric', month: 'short' })

export function formatLong(s: ISODate): string {
  return fmt.format(parseISODate(s))
}

export function formatShort(s: ISODate): string {
  return fmtShort.format(parseISODate(s))
}
