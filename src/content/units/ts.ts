import type { UnitContent } from '../index'

export const unitsTS: Record<string, UnitContent> = {
  c04: {
    lesson: `
En TypeScript puedes indicar el tipo de una variable con una **anotación**: \`: tipo\` después del nombre.

\`\`\`ts
let miNombre: string = 'Alice'
\`\`\`

## Inferencia

En la mayoría de los casos **no hace falta** anotar: TypeScript *infiere* el tipo a partir del valor inicial.

\`\`\`ts
let miNombre = 'Alice' // TS infiere: string
miNombre = 42          // Error: Type 'number' is not assignable to type 'string'.
\`\`\`

El Handbook recomienda no añadir anotaciones cuando el tipo se infiere igual: es ruido.

## const y tipos literales

Con \`const\`, TS infiere un tipo más estrecho, porque el valor nunca cambia:

\`\`\`ts
let a = 'hola'   // string
const b = 'hola' // "hola" (tipo literal)
\`\`\`

## ¿Cuándo sí anotar?

- **Parámetros de funciones**: TS no puede adivinar qué te van a pasar.
- Variables declaradas sin valor inicial: \`let total: number\`.
- Cuando quieres que el tipo sea más amplio que el valor inicial.

\`\`\`ts
function saludar(persona: string) {
  return 'Hola, ' + persona.toUpperCase()
}
saludar(42) // Error: Argument of type 'number' is not assignable to parameter of type 'string'.
\`\`\`

## Pasa el ratón por encima

En el editor de los ejercicios, pon el cursor sobre una variable para ver qué tipo infirió TS.
Es la mejor forma de aprender inferencia.
`,
    exercises: [
      {
        id: 'c04-e1',
        title: 'Anota los parámetros',
        language: 'typescript',
        prompt:
          'La función `describir` tiene parámetros sin tipo (con `strict`, eso es un error: *implicitly has an \'any\' type*). Añade las anotaciones: `nombre` es texto y `edad` es número.',
        starter: 'function describir(nombre, edad) {\n  return `${nombre} tiene ${edad} años`\n}\n',
        solution: 'function describir(nombre: string, edad: number) {\n  return `${nombre} tiene ${edad} años`\n}\n',
        hints: ['La sintaxis es `parametro: tipo`.', 'Los tipos son `string` y `number`.'],
        tests: `
test('describe correctamente', () => {
  expect(describir('Ada', 36)).toBe('Ada tiene 36 años')
})`,
        typeTests: `
// @ts-expect-error edad debe ser number
describir('Ada', '36')
// @ts-expect-error nombre debe ser string
describir(1, 36)`,
      },
      {
        id: 'c04-e2',
        title: 'Arregla el error de tipo',
        language: 'typescript',
        prompt:
          'Este código tiene un error de tipo. `total` empieza en `0` pero luego se le asigna un texto. Corrige el código para que `total` siga siendo un número y `etiqueta` contenga el texto.',
        starter: "let total = 0\ntotal = total + 10\ntotal = 'Total: ' + total\n",
        solution: "let total = 0\ntotal = total + 10\nconst etiqueta = 'Total: ' + total\n",
        hints: ['TS infirió `number` para `total`.', 'Crea otra variable `etiqueta` para el texto.'],
        tests: `
test('total es 10', () => expect(total).toBe(10))
test('etiqueta es "Total: 10"', () => expect(etiqueta).toBe('Total: 10'))`,
        typeTests: `
type _total = Expect<Equal<typeof total, number>>`,
      },
    ],
    quiz: [
      {
        question: '¿Qué tipo infiere TypeScript?',
        code: "const color = 'rojo'",
        options: ['string', '"rojo"', 'any'],
        answer: 1,
        explanation: 'Con `const` el valor no cambia, así que TS infiere el tipo literal `"rojo"`.',
      },
      {
        question: '¿Dónde es más importante escribir anotaciones?',
        options: ['En todas las variables', 'En los parámetros de funciones', 'En ningún sitio, TS lo infiere todo'],
        answer: 1,
        explanation: 'TS no puede inferir qué valores recibirá un parámetro.',
      },
    ],
  },

  d06: {
    lesson: `
Una **discriminated union** es una unión de tipos de objeto que comparten una propiedad literal
(el *discriminante*) que dice cuál es cuál.

\`\`\`ts
interface Circulo {
  kind: 'circulo'
  radio: number
}

interface Cuadrado {
  kind: 'cuadrado'
  lado: number
}

type Forma = Circulo | Cuadrado
\`\`\`

## Narrowing con el discriminante

Al comprobar \`kind\`, TS sabe exactamente qué tipo tienes en cada rama:

\`\`\`ts
function area(forma: Forma) {
  switch (forma.kind) {
    case 'circulo':
      return Math.PI * forma.radio ** 2 // forma: Circulo
    case 'cuadrado':
      return forma.lado ** 2            // forma: Cuadrado
  }
}
\`\`\`

## ¿Por qué no propiedades opcionales?

Un diseño como \`{ kind: string; radio?: number; lado?: number }\` obliga a usar \`!\` o comprobaciones
extra, y no impide combinaciones absurdas. La unión discriminada modela **solo los estados válidos**.

## Exhaustividad con never

Si añades \`Triangulo\` a \`Forma\` y olvidas manejarlo, puedes hacer que TS te avise:

\`\`\`ts
default: {
  const _exhaustivo: never = forma
  return _exhaustivo
}
\`\`\`

Si queda algún caso sin cubrir, \`forma\` no es \`never\` y aparece un error.
`,
    exercises: [
      {
        id: 'd06-e1',
        title: 'Resultado de una petición',
        language: 'typescript',
        prompt: `Define el tipo \`Resultado\` como una discriminated union con discriminante \`estado\`:

- \`{ estado: 'cargando' }\`
- \`{ estado: 'ok'; datos: string[] }\`
- \`{ estado: 'error'; mensaje: string }\`

Luego implementa \`describir(r: Resultado): string\` que devuelva:
\`'Cargando...'\`, \`'N elementos'\` (con N = cantidad de datos) o \`'Error: <mensaje>'\`.`,
        starter: `type Resultado = unknown // reemplaza

function describir(r: Resultado): string {
  return ''
}
`,
        solution: `type Resultado =
  | { estado: 'cargando' }
  | { estado: 'ok'; datos: string[] }
  | { estado: 'error'; mensaje: string }

function describir(r: Resultado): string {
  switch (r.estado) {
    case 'cargando':
      return 'Cargando...'
    case 'ok':
      return \`\${r.datos.length} elementos\`
    case 'error':
      return \`Error: \${r.mensaje}\`
  }
}
`,
        hints: [
          'Une tres tipos de objeto con `|`.',
          'Usa `switch (r.estado)` y dentro de cada `case` TS sabrá qué propiedades existen.',
        ],
        tests: `
test('cargando', () => expect(describir({ estado: 'cargando' })).toBe('Cargando...'))
test('ok', () => expect(describir({ estado: 'ok', datos: ['a', 'b'] })).toBe('2 elementos'))
test('error', () => expect(describir({ estado: 'error', mensaje: 'timeout' })).toBe('Error: timeout'))`,
        typeTests: `
// @ts-expect-error 'ok' requiere datos
const _a: Resultado = { estado: 'ok' }
// @ts-expect-error 'cargando' no tiene mensaje
const _b: Resultado = { estado: 'cargando', mensaje: 'x' }
// @ts-expect-error estado desconocido
const _c: Resultado = { estado: 'pendiente' }`,
      },
    ],
    quiz: [
      {
        question: 'Dentro de `case \'ok\':`, ¿qué tipo tiene `r`?',
        code: "type R = { estado: 'ok'; datos: string[] } | { estado: 'error'; mensaje: string }\nfunction f(r: R) {\n  switch (r.estado) {\n    case 'ok': // ← aquí\n  }\n}",
        options: ['R', "{ estado: 'ok'; datos: string[] }", 'never'],
        answer: 1,
        explanation: 'Comprobar el discriminante estrecha la unión al miembro cuyo `estado` es `\'ok\'`.',
      },
    ],
  },

  e05: {
    lesson: `
\`keyof\` toma un tipo de objeto y produce la **unión de sus claves** como tipos literales.

\`\`\`ts
type Punto = { x: number; y: number }
type P = keyof Punto // "x" | "y"
\`\`\`

## Uso típico: acceso seguro a propiedades

Combinado con genéricos, permite funciones que solo aceptan claves que existen:

\`\`\`ts
function obtener<T, K extends keyof T>(obj: T, clave: K): T[K] {
  return obj[clave]
}

const p = { x: 1, y: 2 }
obtener(p, 'x') // number
obtener(p, 'z') // Error: Argument of type '"z"' is not assignable to parameter of type '"x" | "y"'.
\`\`\`

\`T[K]\` es un *indexed access type*: el tipo de la propiedad \`K\` de \`T\`. Lo verás a fondo en unas unidades.

## Index signatures

Si el tipo tiene una index signature, \`keyof\` devuelve el tipo de la clave:

\`\`\`ts
type Diccionario = { [clave: string]: boolean }
type D = keyof Diccionario // string | number
\`\`\`

Es \`string | number\` porque en JavaScript \`obj[0]\` es lo mismo que \`obj["0"]\`.

## Tests de tipos

En este ejercicio usarás \`Expect<Equal<A, B>>\`, disponible en todos los editores: compila solo si
\`A\` y \`B\` son exactamente el mismo tipo.
`,
    exercises: [
      {
        id: 'e05-e1',
        title: 'Claves de un usuario',
        language: 'typescript',
        prompt: 'Define el tipo `ClavesUsuario` como las claves de `Usuario`, usando `keyof` (no las escribas a mano).',
        starter: `interface Usuario {
  id: number
  nombre: string
  email: string
}

type ClavesUsuario = unknown
`,
        solution: `interface Usuario {
  id: number
  nombre: string
  email: string
}

type ClavesUsuario = keyof Usuario
`,
        hints: ['`keyof Usuario`'],
        typeTests: `
type _t = Expect<Equal<ClavesUsuario, 'id' | 'nombre' | 'email'>>`,
      },
      {
        id: 'e05-e2',
        title: 'Función pluck',
        language: 'typescript',
        prompt:
          'Implementa `pluck(items, clave)` que devuelva un array con el valor de `clave` de cada elemento. Debe ser genérica: solo acepta claves existentes y el tipo de retorno es el array del tipo de esa propiedad.',
        starter: `function pluck(items, clave) {
  return items.map((item) => item[clave])
}
`,
        solution: `function pluck<T, K extends keyof T>(items: T[], clave: K): T[K][] {
  return items.map((item) => item[clave])
}
`,
        hints: ['Necesitas dos parámetros genéricos: `T` y `K extends keyof T`.', 'El retorno es `T[K][]`.'],
        tests: `
const gente = [{ nombre: 'Ada', edad: 36 }, { nombre: 'Alan', edad: 41 }]
test('pluck nombre', () => expect(pluck(gente, 'nombre')).toEqual(['Ada', 'Alan']))
test('pluck edad', () => expect(pluck(gente, 'edad')).toEqual([36, 41]))`,
        typeTests: `
const _g = [{ nombre: 'Ada', edad: 36 }]
type _r1 = Expect<Equal<ReturnType<typeof pluck<{ nombre: string; edad: number }, 'edad'>>, number[]>>
// @ts-expect-error clave inexistente
pluck(_g, 'email')`,
      },
    ],
    quiz: [
      {
        question: '¿Qué es `keyof { a: 1; b: 2 }`?',
        options: ['1 | 2', '"a" | "b"', 'string'],
        answer: 1,
        explanation: '`keyof` produce la unión de las claves como tipos literales.',
      },
    ],
  },
}
