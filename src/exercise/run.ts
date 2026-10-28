import type { RunResponse } from './expect'
import RunnerWorker from './runner.worker?worker'

const TIMEOUT_MS = 3000

export function runCode(code: string): Promise<RunResponse> {
  return new Promise((resolve) => {
    const worker = new RunnerWorker()
    const timer = setTimeout(() => {
      worker.terminate()
      resolve({
        logs: [],
        tests: [],
        error: `El código tardó más de ${TIMEOUT_MS / 1000} s. ¿Hay un bucle infinito?`,
      })
    }, TIMEOUT_MS)
    worker.onmessage = (e: MessageEvent<RunResponse>) => {
      clearTimeout(timer)
      worker.terminate()
      resolve(e.data)
    }
    worker.postMessage({ code })
  })
}
