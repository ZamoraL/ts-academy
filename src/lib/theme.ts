import { useSyncExternalStore } from 'react'

// Preferencia de tema de este navegador. Es una comodidad: si localStorage falla, se sigue al sistema.
export type TemaPreferido = 'sistema' | 'claro' | 'oscuro'
export type Tema = 'claro' | 'oscuro'

const CLAVE = 'ts-academy-tema'
const oscuroSistema = window.matchMedia('(prefers-color-scheme: dark)')
const oyentes = new Set<() => void>()

function leer(): TemaPreferido {
  try {
    const v = localStorage.getItem(CLAVE)
    return v === 'claro' || v === 'oscuro' ? v : 'sistema'
  } catch {
    return 'sistema'
  }
}

let preferido = leer()

function aplicar() {
  const html = document.documentElement
  if (preferido === 'sistema') html.removeAttribute('data-theme')
  else html.dataset.theme = preferido === 'oscuro' ? 'dark' : 'light'
  for (const o of oyentes) o()
}

export function temaResuelto(): Tema {
  if (preferido !== 'sistema') return preferido
  return oscuroSistema.matches ? 'oscuro' : 'claro'
}

export function setTemaPreferido(t: TemaPreferido) {
  preferido = t
  try {
    if (t === 'sistema') localStorage.removeItem(CLAVE)
    else localStorage.setItem(CLAVE, t)
  } catch {
    // Sin almacenamiento: el cambio dura hasta recargar.
  }
  aplicar()
}

export function onTemaCambia(o: () => void): () => void {
  oyentes.add(o)
  return () => oyentes.delete(o)
}

oscuroSistema.addEventListener('change', () => {
  for (const o of oyentes) o()
})
aplicar()

export function useTemaPreferido(): TemaPreferido {
  return useSyncExternalStore(onTemaCambia, () => preferido)
}

export function useTema(): Tema {
  return useSyncExternalStore(onTemaCambia, temaResuelto)
}
