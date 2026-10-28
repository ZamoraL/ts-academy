import type { RunResponse } from '../exercise/expect'

/** Lo que el iframe del sandbox expone a la app (mismo origen). */
export interface SandboxApi {
  ejecutar(code: string, conTests: boolean): Promise<RunResponse>
}

declare global {
  interface Window {
    __sandbox?: SandboxApi
  }
}
