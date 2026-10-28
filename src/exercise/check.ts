import type { Exercise } from '../types'
import type { TestResult } from './expect'
import { cargarTiposReact, monaco } from './monaco'
import { runCode } from './run'
import { runReact } from './runReact'

export interface TypeIssue {
  line: number
  message: string
  /** true si el error está en los tests de tipos (el código del usuario no cumple lo pedido) */
  inTests: boolean
}

export interface CheckResult {
  passed: boolean
  typeErrors: TypeIssue[]
  tests: TestResult[]
  logs: string[]
  runtimeError?: string
}

type Diagnostic = monaco.languages.typescript.Diagnostic

function flatten(message: Diagnostic['messageText']): string {
  if (typeof message === 'string') return message
  const next = message.next?.map(flatten).join('\n  ') ?? ''
  return next ? `${message.messageText}\n  ${next}` : message.messageText
}

function upsertModel(name: string, value: string, language: string): monaco.editor.ITextModel {
  const uri = monaco.Uri.parse(`file:///__check__/${name}`)
  const existing = monaco.editor.getModel(uri)
  if (existing) {
    existing.setValue(value)
    return existing
  }
  return monaco.editor.createModel(value, language, uri)
}

async function getTsWorker(model: monaco.editor.ITextModel) {
  // El modo TS de Monaco se registra de forma diferida al crear el primer modelo TS:
  // hasta entonces getTypeScriptWorker lanza "TypeScript not registered!".
  for (let attempt = 0; ; attempt++) {
    try {
      const getWorker = await monaco.languages.typescript.getTypeScriptWorker()
      return await getWorker(model.uri)
    } catch (e) {
      if (attempt >= 50) throw e
      await new Promise((r) => setTimeout(r, 100))
    }
  }
}

async function diagnostics(model: monaco.editor.ITextModel, userLines: number, soloSintaxis = false): Promise<TypeIssue[]> {
  const worker = await getTsWorker(model)
  const file = model.uri.toString()
  const all = [
    ...(await worker.getSyntacticDiagnostics(file)),
    ...(soloSintaxis ? [] : await worker.getSemanticDiagnostics(file)),
  ]
  return all.map((d) => {
    const line = model.getPositionAt(d.start ?? 0).lineNumber
    return { line, message: flatten(d.messageText), inTests: line > userLines }
  })
}

async function emit(model: monaco.editor.ITextModel): Promise<string> {
  const worker = await getTsWorker(model)
  const output = await worker.getEmitOutput(model.uri.toString())
  return output.outputFiles.find((f) => f.name.endsWith('.js'))?.text ?? ''
}

/** Extensión del archivo del ejercicio: decide cómo lo trata Monaco (JSX o no, JS o TS). */
export function fileExtension(exercise: Exercise): string {
  const base = exercise.language === 'typescript' ? 'ts' : 'js'
  return exercise.react ? `${base}x` : base
}

/**
 * `export` y JSX no son válidos dentro de `new Function`: se compila a CommonJS
 * con el compilador de TS (los tests leen `exports`; el JSX usa react/jsx-runtime).
 */
function needsEmit(exercise: Exercise, code: string): boolean {
  return exercise.language === 'typescript' || exercise.react === true || /^\s*export\b/m.test(code)
}

/** Modelo oculto en TS(X) solo para compilar; los errores de tipo de este modelo se ignoran. */
function compile(exercise: Exercise, name: string, source: string): Promise<string> {
  return emit(upsertModel(`${exercise.id}.${name}.${exercise.react ? 'tsx' : 'ts'}`, source, 'typescript'))
}

function execute(exercise: Exercise, program: string, conTests: boolean, iframe?: HTMLIFrameElement) {
  return exercise.react ? runReact(program, conTests, iframe) : runCode(program)
}

export async function checkExercise(exercise: Exercise, code: string, iframe?: HTMLIFrameElement): Promise<CheckResult> {
  if (exercise.react) await cargarTiposReact()
  const userLines = code.split('\n').length
  const typeErrors: TypeIssue[] = []
  let program = `${code}\n${exercise.tests ?? ''}`

  if (exercise.language === 'typescript') {
    // Modelo 1: código + tests de tipos (solo se comprueba, nunca se ejecuta).
    const typeModel = upsertModel(
      `${exercise.id}.types.${fileExtension(exercise)}`,
      `${code}\n${exercise.typeTests ?? ''}`,
      'typescript',
    )
    const errors = await diagnostics(typeModel, userLines)
    const requireClean = exercise.requireNoTypeErrors ?? true
    typeErrors.push(...errors.filter((e) => e.inTests || requireClean))
  }

  // Modelo 2: código + tests de runtime, transpilado a JS (TS siempre; JS solo si usa módulos o JSX).
  if (exercise.tests && needsEmit(exercise, code)) {
    // En JS no hay comprobación de tipos, pero el compilador "repara" errores de sintaxis
    // (JSX mal cerrado, por ejemplo): los reportamos en vez de ejecutar código adivinado.
    if (exercise.language === 'javascript') {
      // Modelo TS(X): el worker de TS no ve los modelos JS; solo pedimos errores de sintaxis.
      const modelo = upsertModel(`${exercise.id}.sintaxis.${exercise.react ? 'tsx' : 'ts'}`, code, 'typescript')
      typeErrors.push(...(await diagnostics(modelo, userLines, true)))
    }
    program = await compile(exercise, 'run', program)
  }

  const run = exercise.tests ? await execute(exercise, program, true, iframe) : { logs: [], tests: [], error: undefined }
  const testsOk = run.tests.every((t) => t.passed) && !run.error
  return {
    passed: typeErrors.length === 0 && testsOk,
    typeErrors,
    tests: run.tests,
    logs: run.logs,
    runtimeError: run.error,
  }
}

/** Ejecuta solo el código del usuario (botón "Ejecutar"), sin tests. En React, actualiza la vista previa. */
export async function runOnly(exercise: Exercise, code: string, iframe?: HTMLIFrameElement): Promise<CheckResult> {
  if (exercise.react) await cargarTiposReact()
  const program = needsEmit(exercise, code) ? await compile(exercise, 'only', code) : code
  const run = await execute(exercise, program, false, iframe)
  return { passed: false, typeErrors: [], tests: [], logs: run.logs, runtimeError: run.error }
}
