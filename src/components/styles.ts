// Clases y utilidades compartidas de la interfaz.
// Botones: uno primario por vista (naranja), el resto con borde.
export const btn = {
  primary:
    'inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-4 font-bold text-on-accent hover:brightness-95 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50',
  secondary:
    'inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-surface px-3.5 text-sm text-fg hover:border-fg-muted active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50',
  ghost:
    'inline-flex min-h-10 items-center gap-2 rounded-md px-2.5 text-sm text-fg-muted hover:bg-surface-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-50',
  danger:
    'inline-flex min-h-10 items-center gap-2 rounded-md border border-danger px-3.5 text-sm text-danger-ink hover:bg-danger hover:text-on-danger',
}

export const link = 'text-accent-ink underline decoration-1 underline-offset-2 hover:decoration-2'

export function plural(n: number, uno: string, varios: string): string {
  return `${n} ${n === 1 ? uno : varios}`
}

export const esMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
export const teclaMod = esMac ? '⌘' : 'Ctrl'
