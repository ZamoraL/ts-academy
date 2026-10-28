import type { UnitContent } from '../index'

// Bloque F: ecosistema TypeScript.
// Los ejercicios con `export` se compilan a CommonJS: los tests leen el objeto `exports`.

/** Igualdad por asignabilidad mutua: más tolerante que Equal con mapped types. */
const MUTUO = `
type Mutuo<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false
`

export const unitsF: Record<string, UnitContent> = {
  f01: {
    exercises: [
      {
        id: 'f01-e1',
        title: 'Un módulo con tipos',
        language: 'typescript',
        prompt: `Convierte este archivo en un módulo que **exporte**:

- la interfaz \`Usuario\`,
- el tipo \`Rol\`,
- la función \`crearUsuario\`.

\`generarId\` es interna: no la exportes. Los tests comprueban qué existe en runtime (fíjate en qué pasa con los tipos).`,
        starter: `interface Usuario {
  id: number
  nombre: string
  rol: Rol
}

type Rol = 'admin' | 'lector'

let ultimoId = 0
function generarId(): number {
  return ++ultimoId
}

function crearUsuario(nombre: string, rol: Rol = 'lector'): Usuario {
  return { id: generarId(), nombre, rol }
}
`,
        solution: `export interface Usuario {
  id: number
  nombre: string
  rol: Rol
}

export type Rol = 'admin' | 'lector'

let ultimoId = 0
function generarId(): number {
  return ++ultimoId
}

export function crearUsuario(nombre: string, rol: Rol = 'lector'): Usuario {
  return { id: generarId(), nombre, rol }
}
`,
        hints: ['Pon `export` delante de cada declaración pública.'],
        tests: `
const __exp = exports as Record<string, unknown>
test('exporta crearUsuario', () => expect(typeof __exp.crearUsuario).toBe('function'))
test('crearUsuario funciona', () => expect((__exp.crearUsuario as typeof crearUsuario)('Ada')).toEqual({ id: 1, nombre: 'Ada', rol: 'lector' }))
test('generarId es privada', () => expect(__exp.generarId).toBe(undefined))
test('los tipos no existen en runtime', () => expect(Object.keys(__exp)).toEqual(['crearUsuario']))`,
      },
    ],
    quiz: [
      {
        question: 'En un proyecto Node con `moduleResolution: "nodenext"`, ¿cómo importas `./usuarios.ts`?',
        options: ["from './usuarios'", "from './usuarios.ts'", "from './usuarios.js'"],
        answer: 2,
        explanation: 'La ruta apunta al archivo que existirá tras compilar.',
      },
      {
        question: '¿Genera código en runtime `export interface Usuario { ... }`?',
        options: ['Sí', 'No'],
        answer: 1,
        explanation: 'Las interfaces solo existen para el compilador.',
      },
    ],
  },

  f02: {
    exercises: [
      {
        id: 'f02-e1',
        title: 'Exportar tipos explícitamente',
        language: 'typescript',
        prompt: `Las declaraciones no llevan \`export\`. Al final del archivo, añade **dos** líneas de exportación:

1. \`export { ... }\` con los valores: \`crear\` y \`VERSION\`.
2. \`export type { ... }\` con los tipos: \`Opciones\` y \`Resultado\`.

Es el estilo que exige \`verbatimModuleSyntax\`: queda claro qué se borra al compilar.`,
        starter: `interface Opciones {
  nombre: string
  activo?: boolean
}

type Resultado = { ok: true; id: number } | { ok: false; error: string }

const VERSION = '2.0'

function crear(o: Opciones): Resultado {
  if (o.nombre.trim() === '') return { ok: false, error: 'Nombre vacío' }
  return { ok: true, id: o.nombre.length }
}
`,
        solution: `interface Opciones {
  nombre: string
  activo?: boolean
}

type Resultado = { ok: true; id: number } | { ok: false; error: string }

const VERSION = '2.0'

function crear(o: Opciones): Resultado {
  if (o.nombre.trim() === '') return { ok: false, error: 'Nombre vacío' }
  return { ok: true, id: o.nombre.length }
}

export { crear, VERSION }
export type { Opciones, Resultado }
`,
        hints: ['`export { crear, VERSION }`', '`export type { Opciones, Resultado }`'],
        tests: `
const __exp = exports as Record<string, unknown>
test('valores exportados', () => expect(Object.keys(__exp).sort()).toEqual(['VERSION', 'crear']))
test('crear', () => expect((__exp.crear as typeof crear)({ nombre: '' })).toEqual({ ok: false, error: 'Nombre vacío' }))`,
      },
    ],
    quiz: [
      {
        question: 'Con `verbatimModuleSyntax`, ¿qué pasa con `import { Usuario } from \'./x\'` si Usuario es una interface?',
        options: ['Nada', 'Error: hay que usar import type', 'Se convierte en any'],
        answer: 1,
        explanation: 'La regla: lo que no lleva `type` se conserva, así que importar un tipo sin `type` es un error.',
      },
      {
        question: '¿Por qué Vite/esbuild necesitan saber qué imports son solo tipos?',
        options: [
          'Porque compilan archivo por archivo y no pueden mirar el otro archivo para saberlo',
          'Porque no soportan TypeScript',
          'Por seguridad',
        ],
        answer: 0,
        explanation: 'Sin `import type`, no sabrían si borrar el import.',
      },
    ],
  },

  f03: {
    exercises: [
      {
        id: 'f03-e1',
        title: 'Declarar una librería JS',
        language: 'typescript',
        prompt: `Una librería JS de gráficos ya está cargada en la página (con un \`<script>\`). Escribe las **declaraciones** para usarla con tipos (solo \`declare\`, sin implementación):

- \`VERSION\`: string constante.
- \`crearGrafico(contenedor: HTMLElement, opciones)\`: devuelve un \`Grafico\`. Las opciones tienen \`tipo\` (\`'barras' | 'lineas'\`) y \`titulo\` opcional.
- Clase \`Grafico\` con \`actualizar(datos: number[]): void\` y \`destruir(): void\`.
- Además, la librería añade \`window.graficos\` con \`version: string\`. Amplía \`Window\`.`,
        starter: '// Escribe aquí las declaraciones\n',
        solution: `declare const VERSION: string

interface OpcionesGrafico {
  tipo: 'barras' | 'lineas'
  titulo?: string
}

declare class Grafico {
  actualizar(datos: number[]): void
  destruir(): void
}

declare function crearGrafico(contenedor: HTMLElement, opciones: OpcionesGrafico): Grafico

declare global {
  interface Window {
    graficos: { version: string }
  }
}
`,
        hints: [
          '`declare const VERSION: string`',
          '`declare class Grafico { actualizar(datos: number[]): void ... }`',
          '`declare global { interface Window { graficos: { version: string } } }`',
        ],
        typeTests: `
const _v: string = VERSION
const _g = crearGrafico(document.body, { tipo: 'barras' })
_g.actualizar([1, 2, 3])
_g.destruir()
const _ver: string = window.graficos.version
// @ts-expect-error tipo inválido
crearGrafico(document.body, { tipo: 'tarta' })
// @ts-expect-error actualizar recibe números
_g.actualizar(['a'])`,
      },
    ],
    quiz: [
      {
        question: '¿Qué hace `declare const API_URL: string`?',
        options: ['Crea la variable con valor vacío', 'Le dice a TS que la variable existe en runtime, sin generar código', 'Lee una variable de entorno'],
        answer: 1,
        explanation: '`declare` solo aporta el tipo.',
      },
      {
        question: '¿Qué opción genera `.d.ts` automáticamente al compilar una librería?',
        options: ['declaration', 'types', 'emitTypes'],
        answer: 0,
        explanation: '`"declaration": true`.',
      },
    ],
  },

  f04: {
    exercises: [
      {
        id: 'f04-e1',
        title: 'Cuatro opciones de strict',
        language: 'typescript',
        prompt: `Este código se escribió sin \`strict\`. Arregla los cuatro errores; cada uno viene de una opción distinta:

1. \`noImplicitAny\`
2. \`strictNullChecks\`
3. \`strictPropertyInitialization\`
4. \`useUnknownInCatchVariables\`

Los tests indican el comportamiento esperado.`,
        starter: `function duplicar(x) {
  return x * 2
}

function primeraMayuscula(palabras: string[]): string {
  return palabras.find((p) => p[0] === p[0].toUpperCase()).toLowerCase()
}

class Conexion {
  url: string
  abierta: boolean = false
}

function leer(json: string): string {
  try {
    return JSON.parse(json).nombre
  } catch (e) {
    return e.message
  }
}
`,
        solution: `function duplicar(x: number) {
  return x * 2
}

function primeraMayuscula(palabras: string[]): string {
  return palabras.find((p) => p[0] === p[0].toUpperCase())?.toLowerCase() ?? ''
}

class Conexion {
  url: string
  abierta: boolean = false

  constructor(url: string) {
    this.url = url
  }
}

function leer(json: string): string {
  try {
    return JSON.parse(json).nombre
  } catch (e) {
    return e instanceof Error ? e.message : String(e)
  }
}
`,
        hints: [
          '`find` puede devolver `undefined`: usa `?.` y `??`.',
          'Añade un constructor que reciba la URL.',
          'En el catch, `e` es `unknown`: comprueba `e instanceof Error`.',
        ],
        tests: `
test('duplicar', () => expect(duplicar(4)).toBe(8))
test('primeraMayuscula', () => expect(primeraMayuscula(['hola', 'Mundo'])).toBe('mundo'))
test('sin mayúsculas', () => expect(primeraMayuscula(['a'])).toBe(''))
test('Conexion', () => expect(new (Conexion as any)('ws://x').url).toBe('ws://x'))
test('leer inválido', () => expect(leer('{').length > 0).toBe(true))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué opción hace que `arr[5]` tenga tipo `T | undefined`?',
        options: ['strictNullChecks', 'noUncheckedIndexedAccess', 'strict'],
        answer: 1,
        explanation: 'No está incluida en `strict`; hay que activarla aparte.',
      },
    ],
  },

  f05: {
    exercises: [
      {
        id: 'f05-e1',
        title: 'tsconfig para Vite + React',
        language: 'typescript',
        prompt: `Completa \`compilerOptions\` para una app con Vite y React:

- genera ES2022 y conoce las APIs de ES2022, el DOM y \`DOM.Iterable\`,
- módulos ESNext resueltos como un bundler,
- JSX con el runtime moderno de React,
- TS **no** genera archivos (Vite se encarga),
- modo estricto.`,
        starter: `const tsconfig = {
  compilerOptions: {
    target: 'ES5',
  },
}
`,
        solution: `const tsconfig = {
  compilerOptions: {
    target: 'ES2022',
    lib: ['ES2022', 'DOM', 'DOM.Iterable'],
    module: 'ESNext',
    moduleResolution: 'bundler',
    jsx: 'react-jsx',
    noEmit: true,
    strict: true,
  },
}
`,
        hints: ['Opciones: `target`, `lib`, `module`, `moduleResolution`, `jsx`, `noEmit`, `strict`.', "`moduleResolution: 'bundler'`, `jsx: 'react-jsx'`"],
        tests: `
const __o = tsconfig.compilerOptions as Record<string, unknown>
const __low = (v: unknown) => String(v).toLowerCase()
test('target', () => expect(__low(__o.target)).toBe('es2022'))
test('lib', () => expect((__o.lib as string[] | undefined)?.map(__low)).toEqual(['es2022', 'dom', 'dom.iterable']))
test('module', () => expect(__low(__o.module)).toBe('esnext'))
test('moduleResolution', () => expect(__low(__o.moduleResolution)).toBe('bundler'))
test('jsx', () => expect(__o.jsx).toBe('react-jsx'))
test('noEmit', () => expect(__o.noEmit).toBe(true))
test('strict', () => expect(__o.strict).toBe(true))`,
      },
    ],
    quiz: [
      {
        question: 'TS dice "Property \'toSorted\' does not exist on type \'number[]\'". ¿Qué revisas?',
        options: ['module', 'lib / target', 'moduleResolution'],
        answer: 1,
        explanation: '`toSorted` está en ES2023: tu `lib` es más antiguo.',
      },
      {
        question: '¿`target: "es5"` añade polyfills para métodos modernos?',
        options: ['Sí', 'No, solo transforma sintaxis'],
        answer: 1,
        explanation: 'Los métodos que no existen en el entorno necesitan un polyfill aparte.',
      },
    ],
  },

  f06: {
    exercises: [
      {
        id: 'f06-e1',
        title: 'Usar un enum',
        language: 'typescript',
        prompt:
          "Con el enum `Direccion` (de strings), implementa `opuesta(d: Direccion): Direccion` y `mover(pos: [number, number], d: Direccion): [number, number]` (Arriba resta 1 a y, Abajo suma 1, Izquierda resta 1 a x, Derecha suma 1).",
        starter: `enum Direccion {
  Arriba = 'ARRIBA',
  Abajo = 'ABAJO',
  Izquierda = 'IZQUIERDA',
  Derecha = 'DERECHA',
}

function opuesta(d: Direccion): Direccion {
  return d
}

function mover(pos: [number, number], d: Direccion): [number, number] {
  return pos
}
`,
        solution: `enum Direccion {
  Arriba = 'ARRIBA',
  Abajo = 'ABAJO',
  Izquierda = 'IZQUIERDA',
  Derecha = 'DERECHA',
}

function opuesta(d: Direccion): Direccion {
  switch (d) {
    case Direccion.Arriba:
      return Direccion.Abajo
    case Direccion.Abajo:
      return Direccion.Arriba
    case Direccion.Izquierda:
      return Direccion.Derecha
    case Direccion.Derecha:
      return Direccion.Izquierda
  }
}

function mover([x, y]: [number, number], d: Direccion): [number, number] {
  switch (d) {
    case Direccion.Arriba:
      return [x, y - 1]
    case Direccion.Abajo:
      return [x, y + 1]
    case Direccion.Izquierda:
      return [x - 1, y]
    case Direccion.Derecha:
      return [x + 1, y]
  }
}
`,
        hints: ['Un `switch` con `case Direccion.Arriba:` …'],
        tests: `
test('opuesta', () => expect(opuesta(Direccion.Izquierda)).toBe('DERECHA'))
test('mover', () => expect(mover([0, 0], Direccion.Arriba)).toEqual([0, -1]))
test('el enum existe en runtime', () => expect(Object.values(Direccion)).toEqual(['ARRIBA', 'ABAJO', 'IZQUIERDA', 'DERECHA']))`,
      },
      {
        id: 'f06-e2',
        title: 'De enum a as const',
        language: 'typescript',
        prompt:
          'Reemplaza el `enum Estado` por un objeto `as const` llamado `Estado` y un tipo `Estado` con la unión de sus valores. El resto del código no debe cambiar, y además debe aceptar strings literales como `\'ACTIVO\'`.',
        starter: `enum Estado {
  Activo = 'ACTIVO',
  Pausado = 'PAUSADO',
  Cerrado = 'CERRADO',
}

function puedeEditar(e: Estado): boolean {
  return e === Estado.Activo
}
`,
        solution: `const Estado = {
  Activo: 'ACTIVO',
  Pausado: 'PAUSADO',
  Cerrado: 'CERRADO',
} as const

type Estado = (typeof Estado)[keyof typeof Estado]

function puedeEditar(e: Estado): boolean {
  return e === Estado.Activo
}
`,
        hints: ['`const Estado = { ... } as const`', '`type Estado = (typeof Estado)[keyof typeof Estado]`'],
        tests: `
test('activo', () => expect(puedeEditar(Estado.Activo)).toBe(true))
test('cerrado', () => expect(puedeEditar(Estado.Cerrado)).toBe(false))`,
        typeTests: `
type _e = Expect<Equal<Estado, 'ACTIVO' | 'PAUSADO' | 'CERRADO'>>
puedeEditar('ACTIVO')
// @ts-expect-error estado inexistente
puedeEditar('BORRADO')`,
      },
    ],
    quiz: [
      {
        question: 'Con `enum E { A = \'A\' }` y `function f(x: E)`, ¿compila `f(\'A\')`?',
        options: ['Sí', 'No, hay que escribir E.A'],
        answer: 1,
        explanation: 'Los enums de strings no aceptan el literal. Las uniones sí.',
      },
    ],
  },

  f07: {
    exercises: [
      {
        id: 'f07-e1',
        title: 'Mini librería de validación',
        language: 'typescript',
        prompt: 'Implementa y exporta `Schema`, `Infer`, `texto`, `numero`, `booleano`, `lista`, `opcional` y `objeto` como describe la lección.',
        starter: `export interface Schema<T> {
  parse(valor: unknown): T
}

export type Infer<S> = unknown

export function texto(): Schema<string> {
  return { parse: (v) => v as string }
}
`,
        solution: `export interface Schema<T> {
  parse(valor: unknown): T
}

export type Infer<S> = S extends Schema<infer T> ? T : never

function crear<T>(mensaje: string, es: (v: unknown) => v is T): Schema<T> {
  return {
    parse(valor) {
      if (!es(valor)) throw new Error(mensaje)
      return valor
    },
  }
}

export function texto(): Schema<string> {
  return crear('Se esperaba texto', (v): v is string => typeof v === 'string')
}

export function numero(): Schema<number> {
  return crear('Se esperaba número', (v): v is number => typeof v === 'number' && !Number.isNaN(v))
}

export function booleano(): Schema<boolean> {
  return crear('Se esperaba booleano', (v): v is boolean => typeof v === 'boolean')
}

function conPrefijo<T>(prefijo: string, fn: () => T): T {
  try {
    return fn()
  } catch (e) {
    throw new Error(\`\${prefijo}: \${e instanceof Error ? e.message : String(e)}\`)
  }
}

export function lista<T>(item: Schema<T>): Schema<T[]> {
  return {
    parse(valor) {
      if (!Array.isArray(valor)) throw new Error('Se esperaba lista')
      return valor.map((v, i) => conPrefijo(\`[\${i}]\`, () => item.parse(v)))
    },
  }
}

export function opcional<T>(s: Schema<T>): Schema<T | undefined> {
  return {
    parse(valor) {
      return valor === undefined ? undefined : s.parse(valor)
    },
  }
}

export function objeto<F extends Record<string, Schema<unknown>>>(forma: F): Schema<{ [K in keyof F]: Infer<F[K]> }> {
  return {
    parse(valor) {
      if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) throw new Error('Se esperaba objeto')
      const entrada = valor as Record<string, unknown>
      const resultado: Record<string, unknown> = {}
      for (const clave of Object.keys(forma)) {
        resultado[clave] = conPrefijo(clave, () => forma[clave].parse(entrada[clave]))
      }
      return resultado as { [K in keyof F]: Infer<F[K]> }
    },
  }
}
`,
        hints: [
          'Una función auxiliar `crear(mensaje, predicado)` evita repetir `texto`, `numero` y `booleano`.',
          'Otra auxiliar `conPrefijo(prefijo, fn)` con `try/catch` resuelve los mensajes anidados.',
          'En `objeto`, construye un `Record<string, unknown>` y termina con `as { [K in keyof F]: Infer<F[K]> }`.',
        ],
        tests: `
const __Usuario = objeto({
  nombre: texto(),
  edad: numero(),
  etiquetas: lista(texto()),
  apodo: opcional(texto()),
})
function __error(fn: () => unknown): string {
  try { fn() } catch (e) { return (e as Error).message }
  return 'no lanzó'
}
test('primitivos', () => {
  expect(texto().parse('a')).toBe('a')
  expect(__error(() => numero().parse(NaN))).toBe('Se esperaba número')
  expect(__error(() => booleano().parse('true'))).toBe('Se esperaba booleano')
})
test('objeto válido', () => expect(__Usuario.parse({ nombre: 'Ada', edad: 36, etiquetas: ['x'] })).toEqual({ nombre: 'Ada', edad: 36, etiquetas: ['x'], apodo: undefined }))
test('campo inválido', () => expect(__error(() => __Usuario.parse({ nombre: 1 }))).toBe('nombre: Se esperaba texto'))
test('error anidado', () => expect(__error(() => __Usuario.parse({ nombre: 'a', edad: 1, etiquetas: ['ok', 2] }))).toBe('etiquetas: [1]: Se esperaba texto'))
test('no es objeto', () => expect(__error(() => __Usuario.parse(null))).toBe('Se esperaba objeto'))
test('lista', () => expect(__error(() => lista(numero()).parse('x'))).toBe('Se esperaba lista'))
test('exporta todo', () => expect(Object.keys(exports as object).sort()).toEqual(['booleano', 'lista', 'numero', 'objeto', 'opcional', 'texto']))`,
        typeTests: `${MUTUO}
const _S = objeto({ nombre: texto(), edad: numero(), tags: lista(texto()), apodo: opcional(texto()) })
type _U = Infer<typeof _S>
type _t = Expect<Mutuo<_U, { nombre: string; edad: number; tags: string[]; apodo: string | undefined }>>
type _p = Expect<Equal<Infer<Schema<boolean>>, boolean>>
type _o = Expect<Equal<Infer<ReturnType<typeof opcional<number>>>, number | undefined>>
const _u: _U = _S.parse({})
const _n: string = _u.nombre`,
      },
    ],
    quiz: [
      {
        question: '¿Qué dos cosas obtienes de un schema como los de esta librería (o Zod)?',
        options: [
          'Validación en runtime y el tipo de TS inferido, sin duplicar',
          'Más velocidad y menos código',
          'Tipos y documentación',
        ],
        answer: 0,
        explanation: 'Describes la forma una vez; `parse` valida y `Infer` da el tipo.',
      },
    ],
  },
}
