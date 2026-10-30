import { useEffect } from 'react'

/** J/K mueve el foco entre las filas `[data-fila]` de la página; Enter las abre (son enlaces). */
export function useTeclasFilas() {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.key !== 'j' && e.key !== 'k')) return
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [contenteditable], .monaco-editor, dialog')) return
      const filas = [...document.querySelectorAll<HTMLElement>('[data-fila]')].filter((f) => f.offsetParent !== null)
      if (filas.length === 0) return
      e.preventDefault()
      const i = filas.indexOf(document.activeElement as HTMLElement)
      const siguiente = e.key === 'j' ? Math.min(filas.length - 1, i + 1) : Math.max(0, i === -1 ? 0 : i - 1)
      filas[siguiente].focus()
      filas[siguiente].scrollIntoView({ block: 'nearest' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

