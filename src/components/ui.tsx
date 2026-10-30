import type { ReactNode } from 'react'

/** Cabecera de página: rótulo en Unbounded, una línea de contexto y acciones a la derecha. */
export function PageHeader({ title, meta, children }: { title: ReactNode; meta?: ReactNode; children?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end gap-x-6 gap-y-3">
      <div className="min-w-0">
        <h1 className="font-display text-[28px] sm:text-[32px]">{title}</h1>
        {meta && <p className="tabular mt-2 max-w-[70ch] text-fg-muted">{meta}</p>}
      </div>
      {children && <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>}
    </header>
  )
}

/** Estación en miniatura: estado de una unidad por forma (relleno, anillo, hueco) además de color. */
export function Estado({ estado }: { estado: 'hecho' | 'actual' | 'pendiente' }) {
  const forma = {
    hecho: 'h-2.5 w-2.5 bg-accent',
    actual: 'h-3.5 w-3.5 border-[3px] border-accent bg-bg',
    pendiente: 'h-2.5 w-2.5 border-2 border-fg-muted bg-bg',
  }[estado]
  const texto = { hecho: 'hecha', actual: 'en curso', pendiente: 'pendiente' }[estado]
  return (
    <span className="grid w-4 shrink-0 place-items-center" role="img" aria-label={texto}>
      <span className={`block rounded-full ${forma}`} />
    </span>
  )
}

/** Etiqueta para el tipo de día: lección (tinta), repaso y práctica (turquesa). */
export function Tag({ children, tono = 'neutro' }: { children: ReactNode; tono?: 'neutro' | 'accent' | 'support' }) {
  const color = {
    neutro: 'border-border text-fg-muted',
    accent: 'border-accent-ink text-accent-ink',
    support: 'border-support-ink text-support-ink',
  }[tono]
  return (
    <span className={`inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-bold ${color}`}>
      {children}
    </span>
  )
}

/** Líneas grises con la forma del contenido mientras carga. */
export function Skeleton({ lines = 6 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Cargando">
      <div className="h-8 w-2/5 rounded-md bg-surface-2" />
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="h-4 rounded-sm bg-surface-2" style={{ width: `${90 - ((i * 17) % 35)}%` }} />
      ))}
    </div>
  )
}
