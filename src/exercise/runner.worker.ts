// Ejecuta código del usuario + tests en un worker aislado.
// El hilo principal termina el worker si tarda demasiado (bucles infinitos).
import { format, makeExpect, runTests, type RunResponse } from './expect'

export interface RunRequest {
  code: string
}

self.onmessage = async (event: MessageEvent<RunRequest>) => {
  const logs: string[] = []
  const tests: { name: string; fn: () => unknown }[] = []
  const capture = (...args: unknown[]) => logs.push(args.map(format).join(' '))
  const fakeConsole = { log: capture, info: capture, warn: capture, error: capture }
  const test = (name: string, fn: () => unknown) => tests.push({ name, fn })

  const response: RunResponse = { logs, tests: [] }
  try {
    const run = new Function('console', 'test', 'expect', '__logs', 'exports', 'require', event.data.code)
    run(fakeConsole, test, makeExpect, logs, {}, () => {
      throw new Error('require no está disponible en los ejercicios')
    })
  } catch (e) {
    response.error = format(e)
  }

  // Los tests solo cuentan si el código del usuario no lanzó un error.
  if (!response.error) response.tests = await runTests(tests)
  self.postMessage(response)
}
