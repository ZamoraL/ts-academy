import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_id, label) {
    if (label === 'typescript' || label === 'javascript') return new tsWorker()
    return new editorWorker()
  },
}

// Ayudas globales disponibles en todos los ejercicios.
const GLOBALS = `
declare function test(name: string, fn: () => void | Promise<void>): void
interface Matchers {
  toBe(expected: unknown): void
  toEqual(expected: unknown): void
  toBeTruthy(): void
  toBeFalsy(): void
  toContain(item: unknown): void
  toThrow(): void
  toBeNull(): void
  toHaveLength(n: number): void
  toHaveTextContent(text: string): void
  toBeDisabled(): void
  toHaveValue(value: string | number): void
}
declare function expect(actual: unknown): Matchers
declare const __logs: string[]
type Expect<T extends true> = T
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
`

const ts = monaco.languages.typescript

const COMUNES: monaco.languages.typescript.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.CommonJS,
  // Para resolver 'react' desde los .d.ts cargados en file:///node_modules/
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  esModuleInterop: true,
  jsx: ts.JsxEmit.ReactJSX,
  // Cada archivo es un módulo: los ejercicios no comparten variables globales.
  moduleDetection: 3,
}

ts.typescriptDefaults.setCompilerOptions({ ...COMUNES, strict: true, noEmitOnError: false })
ts.typescriptDefaults.addExtraLib(GLOBALS, 'file:///globals.d.ts')
ts.typescriptDefaults.setEagerModelSync(true)

ts.javascriptDefaults.setCompilerOptions({ ...COMUNES, allowJs: true })
ts.javascriptDefaults.addExtraLib(GLOBALS, 'file:///globals.d.ts')

let tiposReact: Promise<void> | null = null

const tiposZod = import.meta.glob<string>(
  ['../../node_modules/zod/index.d.ts', '../../node_modules/zod/v3/**/*.d.ts'],
  { query: '?raw', import: 'default' },
)

/** Carga los tipos de React (y Zod) en Monaco la primera vez que se abre un ejercicio de React (~1 MB). */
export function cargarTiposReact(): Promise<void> {
  tiposReact ??= (async () => {
    for (const [ruta, cargar] of Object.entries(tiposZod)) {
      const contenido = await cargar()
      const destino = 'file:///node_modules/' + ruta.slice('../../node_modules/'.length)
      ts.typescriptDefaults.addExtraLib(contenido, destino)
      ts.javascriptDefaults.addExtraLib(contenido, destino)
    }
    const archivos = await Promise.all([
      import('../../node_modules/@types/react/index.d.ts?raw'),
      import('../../node_modules/@types/react/global.d.ts?raw'),
      import('../../node_modules/@types/react/jsx-runtime.d.ts?raw'),
      import('../../node_modules/csstype/index.d.ts?raw'),
    ])
    const rutas = [
      'file:///node_modules/@types/react/index.d.ts',
      'file:///node_modules/@types/react/global.d.ts',
      'file:///node_modules/@types/react/jsx-runtime.d.ts',
      'file:///node_modules/csstype/index.d.ts',
    ]
    for (const defaults of [ts.typescriptDefaults, ts.javascriptDefaults]) {
      archivos.forEach((a, i) => defaults.addExtraLib(a.default, rutas[i]))
    }
  })()
  return tiposReact
}

loader.config({ monaco })
// Registra los estilos del tema: colorize (bloques de código de las lecciones) los usa sin crear un editor.
monaco.editor.setTheme('vs-dark')

export { monaco }
