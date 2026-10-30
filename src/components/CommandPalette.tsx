import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UNITS } from '../content'
import { useProgress } from '../store/progress'
import { teclaMod } from './styles'
import { Estado } from './ui'

const PAGINAS = [
  { id: 'hoy', title: 'Hoy', to: '/' },
  { id: 'plan', title: 'Horario', to: '/plan' },
  { id: 'temario', title: 'Plano del curso', to: '/temario' },
  { id: 'ajustes', title: 'Ajustes', to: '/ajustes' },
]

const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

interface Resultado {
  id: string
  title: string
  to: string
  unidad: boolean
}

/** Buscador de unidades y páginas. Se abre con ⌘K / Ctrl+K o con el botón de la cabecera. */
export function CommandPalette() {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [activo, setActivo] = useState(0)
  const completed = useProgress((s) => s.completed)
  const navigate = useNavigate()

  useEffect(() => {
    function abrir() {
      if (dialog.current?.open) return
      setQuery('')
      setActivo(0)
      dialog.current?.showModal()
      input.current?.focus()
    }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        abrir()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('abrir-buscador', abrir)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('abrir-buscador', abrir)
    }
  }, [])

  const resultados = useMemo<Resultado[]>(() => {
    const q = normalizar(query.trim())
    const paginas = PAGINAS.map((p) => ({ ...p, unidad: false }))
    const unidades = UNITS.map((u) => ({ id: u.id, title: u.title, to: `/unidad/${u.id}`, unidad: true }))
    if (!q) return [...paginas, ...unidades.filter((u) => !(u.id in completed)).slice(0, 5)]
    return [...paginas, ...unidades]
      .filter((r) => normalizar(`${r.id} ${r.title}`).includes(q))
      .slice(0, 9)
  }, [query, completed])

  function ir(r: Resultado | undefined) {
    if (!r) return
    dialog.current?.close()
    navigate(r.to)
  }

  return (
    <dialog
      ref={dialog}
      aria-label="Buscar estación"
      className="mx-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] rounded-md border border-border bg-surface p-0 text-fg backdrop:bg-black/40"
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
    >
      <div className="flex items-center gap-3 border-b border-border px-4">
        <span className="font-mono text-fg-muted" aria-hidden>
          ›
        </span>
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActivo(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActivo((a) => Math.min(resultados.length - 1, a + 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActivo((a) => Math.max(0, a - 1))
            } else if (e.key === 'Enter') {
              e.preventDefault()
              ir(resultados[activo])
            }
          }}
          placeholder="Busca por título o id: «genéricos», «c04»…"
          aria-label="Buscar"
          aria-controls="resultados-buscador"
          aria-activedescendant={resultados[activo] ? `res-${resultados[activo].id}` : undefined}
          className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-fg-muted"
        />
        <kbd>esc</kbd>
      </div>
      <ul id="resultados-buscador" role="listbox" className="max-h-[50vh] overflow-y-auto py-1">
        {resultados.length === 0 && (
          <li className="px-4 py-6 text-fg-muted">
            Nada coincide con «{query}». Prueba con una palabra del título, como «tipos» o «hooks».
          </li>
        )}
        {resultados.map((r, i) => (
          <li
            key={r.id}
            id={`res-${r.id}`}
            role="option"
            aria-selected={i === activo}
            onMouseMove={() => setActivo(i)}
            onClick={() => ir(r)}
            className={`flex h-10 cursor-pointer items-center gap-3 px-4 ${i === activo ? 'bg-surface-2' : ''}`}
          >
            {r.unidad ? (
              <>
                <Estado estado={r.id in completed ? 'hecho' : 'pendiente'} />
                <span className="w-9 shrink-0 font-mono text-xs text-fg-muted">{r.id}</span>
              </>
            ) : (
              <span className="w-[3.25rem] shrink-0 text-xs text-fg-muted">ir a</span>
            )}
            <span className="truncate">{r.title}</span>
            {i === activo && <kbd className="ml-auto">↵</kbd>}
          </li>
        ))}
      </ul>
      <p className="border-t border-border px-4 py-2 text-xs text-fg-muted">
        <kbd>↑</kbd> <kbd>↓</kbd> moverse · <kbd>↵</kbd> abrir · <kbd>{teclaMod}</kbd> <kbd>K</kbd> en cualquier
        pantalla
      </p>
    </dialog>
  )
}
