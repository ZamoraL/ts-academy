import '../sandbox/api'
import type { RunResponse } from './expect'

const TIMEOUT_MS = 8000
let recargas = 0

/**
 * El iframe comparte hilo con la app: un bucle infinito la congelaría.
 * Insertamos una comprobación de tiempo al inicio de cada bucle con bloque `{`.
 * El JS viene de TypeScript, que mantiene un formato estable.
 */
export function protegerBucles(js: string): string {
  return js
    .replace(/^(\s*)((?:for|while)\s*\(.*\)\s*\{)\s*$/gm, '$1$2 __guardia();')
    .replace(/^(\s*)do\s*\{\s*$/gm, '$1do { __guardia();')
}

/** Recarga el iframe del sandbox (estado limpio en cada ejecución) y espera a que esté listo. */
function recargar(iframe: HTMLIFrameElement): Promise<void> {
  return new Promise((resolve) => {
    const onMessage = (e: MessageEvent) => {
      if (e.source === iframe.contentWindow && e.data?.tipo === 'sandbox-listo') {
        window.removeEventListener('message', onMessage)
        resolve()
      }
    }
    window.addEventListener('message', onMessage)
    iframe.src = `${import.meta.env.BASE_URL}sandbox.html?r=${++recargas}`
  })
}

/** Ejecuta código compilado (CommonJS) en el sandbox de React. Sin iframe, usa uno oculto temporal. */
export async function runReact(code: string, conTests: boolean, iframe?: HTMLIFrameElement): Promise<RunResponse> {
  const propio = !iframe
  // Fuera de pantalla, no oculto: en un iframe con display:none no se pueden enfocar inputs.
  const frame = iframe ?? document.createElement('iframe')
  if (propio) frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:800px;height:600px;opacity:0;pointer-events:none'
  if (propio) document.body.appendChild(frame)

  try {
    const timeout = new Promise<RunResponse>((resolve) =>
      setTimeout(
        () => resolve({ logs: [], tests: [], error: `La ejecución tardó más de ${TIMEOUT_MS / 1000} s.` }),
        TIMEOUT_MS,
      ),
    )
    const ejecucion = (async () => {
      await recargar(frame)
      const api = frame.contentWindow?.__sandbox
      if (!api) return { logs: [], tests: [], error: 'No se pudo iniciar la vista previa.' }
      return api.ejecutar(protegerBucles(code), conTests)
    })()
    return await Promise.race([ejecucion, timeout])
  } finally {
    if (propio) frame.remove()
  }
}
