import type { UnitContent } from '../index'

// Bloque E: TypeScript avanzado (e05 está en ts.ts).
// Muchos ejercicios son solo de tipos: se comprueban con typeTests.
export const unitsE: Record<string, UnitContent> = {
  e01: {
    exercises: [
      {
        id: 'e01-e1',
        title: 'Primeros genéricos',
        language: 'typescript',
        prompt:
          'Haz genéricas estas funciones para que conserven el tipo: `identidad(x)`, `primero(arr)` (o `undefined`) y `ultimo(arr)` (o `undefined`). No uses `any`.',
        starter: 'function identidad(x: any): any {\n  return x\n}\n\nfunction primero(arr: any[]) {\n  return arr[0]\n}\n\nfunction ultimo(arr: any[]) {\n  return arr[arr.length - 1]\n}\n',
        solution:
          'function identidad<T>(x: T): T {\n  return x\n}\n\nfunction primero<T>(arr: T[]): T | undefined {\n  return arr[0]\n}\n\nfunction ultimo<T>(arr: T[]): T | undefined {\n  return arr[arr.length - 1]\n}\n',
        hints: ['`function identidad<T>(x: T): T`', 'El retorno de `primero` es `T | undefined`.'],
        tests: `
test('identidad', () => expect(identidad('a')).toBe('a'))
test('primero', () => expect(primero([3, 4])).toBe(3))
test('ultimo vacío', () => expect(ultimo([])).toBe(undefined))`,
        typeTests: `
declare const _num: number
const _a = identidad(_num)
type _ta = Expect<Equal<typeof _a, number>>
const _b = primero(['x'])
type _tb = Expect<Equal<typeof _b, string | undefined>>
const _c = ultimo([true])
type _tc = Expect<Equal<typeof _c, boolean | undefined>>`,
      },
      {
        id: 'e01-e2',
        title: 'mapear y par',
        language: 'typescript',
        prompt:
          'Implementa `mapear<T, U>(arr, fn)` (como `map`, pero escrito con un `for...of`) y `par(a, b)` que devuelva la tupla `[a, b]` conservando ambos tipos.',
        starter: 'function mapear(arr, fn) {\n}\n\nfunction par(a, b) {\n}\n',
        solution: `function mapear<T, U>(arr: T[], fn: (x: T) => U): U[] {
  const resultado: U[] = []
  for (const x of arr) resultado.push(fn(x))
  return resultado
}

function par<A, B>(a: A, b: B): [A, B] {
  return [a, b]
}
`,
        hints: ['`mapear<T, U>(arr: T[], fn: (x: T) => U): U[]`', '`par<A, B>(a: A, b: B): [A, B]`'],
        tests: `
test('mapear', () => expect(mapear([1, 2], (n) => n * 10)).toEqual([10, 20]))
test('par', () => expect(par('a', 1)).toEqual(['a', 1]))`,
        typeTests: `
const _m = mapear([1, 2], (n) => String(n))
type _tm = Expect<Equal<typeof _m, string[]>>
const _p = par('edad', 36)
type _tp = Expect<Equal<typeof _p, [string, number]>>`,
      },
    ],
    quiz: [
      {
        question: '¿Qué tipo tiene `x`?',
        code: 'function f<T>(v: T): T[] { return [v] }\nconst x = f(true)',
        options: ['T[]', 'boolean[]', 'any[]'],
        answer: 1,
        explanation: 'TS infiere `T = boolean` a partir del argumento.',
      },
    ],
  },

  e02: {
    exercises: [
      {
        id: 'e02-e1',
        title: 'Resultado<T>',
        language: 'typescript',
        prompt: `Define \`type Resultado<T>\` como una unión discriminada por \`ok\`:

- \`{ ok: true; valor: T }\`
- \`{ ok: false; error: string }\`

Implementa \`dividir(a, b): Resultado<number>\` (error \`'División entre 0'\`) y \`valorO<T>(r: Resultado<T>, defecto: T): T\`.`,
        starter: 'type Resultado<T> = unknown\n\nfunction dividir(a: number, b: number) {\n}\n\nfunction valorO(r, defecto) {\n}\n',
        solution: `type Resultado<T> = { ok: true; valor: T } | { ok: false; error: string }

function dividir(a: number, b: number): Resultado<number> {
  if (b === 0) return { ok: false, error: 'División entre 0' }
  return { ok: true, valor: a / b }
}

function valorO<T>(r: Resultado<T>, defecto: T): T {
  return r.ok ? r.valor : defecto
}
`,
        hints: ['`type Resultado<T> = { ok: true; valor: T } | { ok: false; error: string }`', 'Comprobar `r.ok` estrecha la unión.'],
        tests: `
test('dividir ok', () => expect(dividir(6, 3)).toEqual({ ok: true, valor: 2 }))
test('dividir error', () => expect(dividir(1, 0)).toEqual({ ok: false, error: 'División entre 0' }))
test('valorO', () => expect(valorO(dividir(1, 0), -1)).toBe(-1))`,
        typeTests: `
declare const _r: Resultado<string>
if (_r.ok) { const _v: string = _r.valor } else { const _e: string = _r.error }
// @ts-expect-error un resultado ok necesita valor
const _mal: Resultado<number> = { ok: true }`,
      },
      {
        id: 'e02-e2',
        title: 'Caja<T>',
        language: 'typescript',
        prompt: "Define `type Caja<T> = { valor: T }`. Implementa `envolver<T>(v)` y `mapCaja<T, U>(caja, fn)`.",
        starter: 'function envolver(v) {\n}\n\nfunction mapCaja(caja, fn) {\n}\n',
        solution: `type Caja<T> = { valor: T }

function envolver<T>(valor: T): Caja<T> {
  return { valor }
}

function mapCaja<T, U>(caja: Caja<T>, fn: (v: T) => U): Caja<U> {
  return { valor: fn(caja.valor) }
}
`,
        hints: ['`mapCaja<T, U>(caja: Caja<T>, fn: (v: T) => U): Caja<U>`'],
        tests: `
test('envolver', () => expect(envolver(1)).toEqual({ valor: 1 }))
test('mapCaja', () => expect(mapCaja(envolver(3), (n) => n > 2)).toEqual({ valor: true }))`,
        typeTests: `
const _c = mapCaja(envolver('hola'), (s) => s.length)
type _t = Expect<Equal<typeof _c, Caja<number>>>`,
      },
    ],
    quiz: [
      {
        question: '¿Qué diferencia hay entre `type A<T> = (x: T) => T` y `type B = <T>(x: T) => T`?',
        options: [
          'Ninguna',
          'A es un tipo genérico (eliges T al usar el tipo); B es una función genérica (cada llamada elige T)',
          'B no compila',
        ],
        answer: 1,
        explanation: '`A<number>` solo acepta números; una función de tipo `B` acepta cualquier tipo en cada llamada.',
      },
    ],
  },

  e03: {
    exercises: [
      {
        id: 'e03-e1',
        title: 'masLargo',
        language: 'typescript',
        prompt:
          'Implementa `masLargo(a, b)` que devuelva el de mayor `length` (el primero si empatan). Debe aceptar strings, arrays o cualquier cosa con `length`, y **conservar el tipo**.',
        starter: 'function masLargo<T>(a: T, b: T): T {\n  return a.length >= b.length ? a : b\n}\n',
        solution: 'function masLargo<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b\n}\n',
        hints: ['`<T extends { length: number }>`'],
        tests: `
test('strings', () => expect(masLargo('hola', 'hi')).toBe('hola'))
test('arrays', () => expect(masLargo([1], [1, 2])).toEqual([1, 2]))`,
        typeTests: `
declare const _x: string
const _s = masLargo(_x, _x)
type _ts = Expect<Equal<typeof _s, string>>
// @ts-expect-error los números no tienen length
masLargo(1, 2)`,
      },
      {
        id: 'e03-e2',
        title: 'Indexar por id',
        language: 'typescript',
        prompt:
          'Implementa `indexarPorId(items)` que reciba objetos con `id: number` y devuelva un `Map<number, T>` donde `T` es el tipo exacto de los objetos (no solo `{ id: number }`).',
        starter: 'function indexarPorId(items: { id: number }[]) {\n  return new Map(items.map((x) => [x.id, x]))\n}\n',
        solution:
          'function indexarPorId<T extends { id: number }>(items: T[]): Map<number, T> {\n  return new Map(items.map((x) => [x.id, x]))\n}\n',
        hints: ['`<T extends { id: number }>(items: T[]): Map<number, T>`'],
        tests: `
test('indexa', () => expect(indexarPorId([{ id: 2, n: 'a' }]).get(2)).toEqual({ id: 2, n: 'a' }))`,
        typeTests: `
const _m = indexarPorId([{ id: 1, nombre: 'Ada' }])
type _t = Expect<Equal<typeof _m, Map<number, { id: number; nombre: string }>>>
// @ts-expect-error necesita id numérico
indexarPorId([{ id: 'x' }])`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué `<T extends { length: number }>(x: T): T` es mejor que `(x: { length: number }): { length: number }`?',
        options: ['Es más corto', 'Conserva el tipo exacto del argumento en el retorno', 'Es más rápido'],
        answer: 1,
        explanation: 'Con el genérico, pasar un string devuelve `string`, no `{ length: number }`.',
      },
    ],
  },

  e04: {
    exercises: [
      {
        id: 'e04-e1',
        title: 'Pila<T>',
        language: 'typescript',
        prompt:
          'Implementa la clase genérica `Pila<T>` con `push(item)`, `pop()` (o `undefined`), `peek()` (mira el de arriba sin quitarlo, o `undefined`), y el getter `tamaño`. Los items deben ser privados.',
        starter: 'class Pila {\n}\n',
        solution: `class Pila<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  get tamaño(): number {
    return this.items.length
  }
}
`,
        hints: ['`class Pila<T> { private items: T[] = [] ... }`'],
        tests: `
test('push/pop/peek', () => {
  const __p = new Pila<number>()
  __p.push(1); __p.push(2)
  expect(__p.peek()).toBe(2)
  expect(__p.pop()).toBe(2)
  expect(__p.tamaño).toBe(1)
})`,
        typeTests: `
const _p = new Pila<string>()
// @ts-expect-error solo strings
_p.push(1)
const _x = _p.pop()
type _t = Expect<Equal<typeof _x, string | undefined>>
// @ts-expect-error items es privado
_p.items`,
      },
      {
        id: 'e04-e2',
        title: 'Parámetro por defecto',
        language: 'typescript',
        prompt:
          "Define `interface Evento<T = undefined>` con `tipo: string` y `payload: T`. Implementa `crearEvento(tipo)` sin payload (devuelve `Evento`) y `crearEventoCon<T>(tipo, payload: T)` (devuelve `Evento<T>`).",
        starter: 'interface Evento {\n}\n\nfunction crearEvento(tipo: string) {\n}\n\nfunction crearEventoCon(tipo: string, payload) {\n}\n',
        solution: `interface Evento<T = undefined> {
  tipo: string
  payload: T
}

function crearEvento(tipo: string): Evento {
  return { tipo, payload: undefined }
}

function crearEventoCon<T>(tipo: string, payload: T): Evento<T> {
  return { tipo, payload }
}
`,
        hints: ['`interface Evento<T = undefined>`'],
        tests: `
test('sin payload', () => expect(crearEvento('cerrar')).toEqual({ tipo: 'cerrar', payload: undefined }))
test('con payload', () => expect(crearEventoCon('abrir', { id: 1 })).toEqual({ tipo: 'abrir', payload: { id: 1 } }))`,
        typeTests: `
type _d = Expect<Equal<Evento['payload'], undefined>>
const _e = crearEventoCon('x', 5)
type _t = Expect<Equal<typeof _e, Evento<number>>>`,
      },
    ],
    quiz: [
      {
        question: '¿Puede un método `static` usar el parámetro de tipo `T` de su clase?',
        options: ['Sí', 'No, static pertenece a la clase, no a una instancia con un T concreto'],
        answer: 1,
        explanation: 'Los miembros estáticos son compartidos por todas las instanciaciones.',
      },
    ],
  },

  e06: {
    exercises: [
      {
        id: 'e06-e1',
        title: 'Derivar tipos de valores',
        language: 'typescript',
        prompt:
          'Sustituye los `unknown` por tipos **derivados** con `typeof`:\n\n- `Config`: el tipo de `configPorDefecto`.\n- `Usuario`: lo que devuelve `crearUsuario` (usa `ReturnType`).\n- `Rol`: la unión de los valores de `ROLES` (añade `as const` donde haga falta).',
        starter: `const configPorDefecto = { tema: 'oscuro', idioma: 'es', notificaciones: true }
type Config = unknown

function crearUsuario(nombre: string) {
  return { nombre, activo: true, creado: new Date() }
}
type Usuario = unknown

const ROLES = ['admin', 'editor', 'lector']
type Rol = unknown
`,
        solution: `const configPorDefecto = { tema: 'oscuro', idioma: 'es', notificaciones: true }
type Config = typeof configPorDefecto

function crearUsuario(nombre: string) {
  return { nombre, activo: true, creado: new Date() }
}
type Usuario = ReturnType<typeof crearUsuario>

const ROLES = ['admin', 'editor', 'lector'] as const
type Rol = (typeof ROLES)[number]
`,
        hints: ['`type Config = typeof configPorDefecto`', '`ReturnType<typeof crearUsuario>`', '`(typeof ROLES)[number]` con `as const` en el array.'],
        typeTests: `
type _c = Expect<Equal<Config, { tema: string; idioma: string; notificaciones: boolean }>>
type _u = Expect<Equal<Usuario, { nombre: string; activo: boolean; creado: Date }>>
type _r = Expect<Equal<Rol, 'admin' | 'editor' | 'lector'>>`,
      },
      {
        id: 'e06-e2',
        title: 'Códigos HTTP',
        language: 'typescript',
        prompt:
          'Deriva `type Codigo` como la unión de **valores** de `HTTP` (`200 | 404 | 500`) y `type NombreCodigo` como la unión de sus claves. Implementa `nombreDe(c: Codigo): NombreCodigo`.',
        starter: `const HTTP = { ok: 200, noEncontrado: 404, error: 500 }

type Codigo = number
type NombreCodigo = string

function nombreDe(c: Codigo): NombreCodigo {
  return ''
}
`,
        solution: `const HTTP = { ok: 200, noEncontrado: 404, error: 500 } as const

type Codigo = (typeof HTTP)[keyof typeof HTTP]
type NombreCodigo = keyof typeof HTTP

function nombreDe(c: Codigo): NombreCodigo {
  const claves = Object.keys(HTTP) as NombreCodigo[]
  return claves.find((k) => HTTP[k] === c)!
}
`,
        hints: ['`as const` en el objeto.', '`(typeof HTTP)[keyof typeof HTTP]`', '`Object.keys` devuelve `string[]`: necesitas un `as`.'],
        tests: `
test('404', () => expect(nombreDe(404)).toBe('noEncontrado'))`,
        typeTests: `
type _c = Expect<Equal<Codigo, 200 | 404 | 500>>
type _n = Expect<Equal<NombreCodigo, 'ok' | 'noEncontrado' | 'error'>>`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué `ReturnType<crearUsuario>` es un error?',
        options: ['Porque crearUsuario es un valor, no un tipo; hace falta typeof', 'Porque ReturnType no existe', 'No es un error'],
        answer: 0,
        explanation: '`ReturnType<typeof crearUsuario>`.',
      },
    ],
  },

  e07: {
    exercises: [
      {
        id: 'e07-e1',
        title: 'Extraer piezas',
        language: 'typescript',
        prompt: 'Con el tipo `Pedido` dado, define **usando indexed access** (sin escribir los tipos a mano): `Cliente`, `Ciudad`, `Item` (un elemento de `items`) y `Estado`.',
        starter: `type Pedido = {
  id: number
  estado: 'pendiente' | 'enviado'
  cliente: { nombre: string; direccion: { ciudad: string; cp: string } }
  items: { sku: string; cantidad: number }[]
}

type Cliente = unknown
type Ciudad = unknown
type Item = unknown
type Estado = unknown
`,
        solution: `type Pedido = {
  id: number
  estado: 'pendiente' | 'enviado'
  cliente: { nombre: string; direccion: { ciudad: string; cp: string } }
  items: { sku: string; cantidad: number }[]
}

type Cliente = Pedido['cliente']
type Ciudad = Pedido['cliente']['direccion']['ciudad']
type Item = Pedido['items'][number]
type Estado = Pedido['estado']
`,
        hints: ["`Pedido['cliente']`", "`Pedido['items'][number]`"],
        typeTests: `
type _c = Expect<Equal<Cliente, { nombre: string; direccion: { ciudad: string; cp: string } }>>
type _ci = Expect<Equal<Ciudad, string>>
type _i = Expect<Equal<Item, { sku: string; cantidad: number }>>
type _e = Expect<Equal<Estado, 'pendiente' | 'enviado'>>`,
      },
      {
        id: 'e07-e2',
        title: 'Valores de un objeto',
        language: 'typescript',
        prompt:
          'Define el tipo genérico `ValorDe<T>` como la unión de los tipos de todas las propiedades de `T`. Implementa `valores<T extends object>(obj: T): ValorDe<T>[]`.',
        starter: 'type ValorDe<T> = unknown\n\nfunction valores(obj) {\n  return Object.values(obj)\n}\n',
        solution:
          'type ValorDe<T> = T[keyof T]\n\nfunction valores<T extends object>(obj: T): ValorDe<T>[] {\n  return Object.values(obj) as ValorDe<T>[]\n}\n',
        hints: ['`T[keyof T]`'],
        tests: `
test('valores', () => expect(valores({ a: 1, b: 'x' })).toEqual([1, 'x']))`,
        typeTests: `
type _v = Expect<Equal<ValorDe<{ a: number; b: string; c: boolean }>, string | number | boolean>>
const _r = valores({ x: 1, y: 2 })
type _t = Expect<Equal<typeof _r, number[]>>`,
      },
    ],
    quiz: [
      {
        question: '¿Qué es `(typeof lista)[number]` si `lista` es `{ id: number }[]`?',
        options: ['number', '{ id: number }', '{ id: number }[]'],
        answer: 1,
        explanation: 'Indexar un array con `number` da el tipo de sus elementos.',
      },
    ],
  },

  e08: {
    exercises: [
      {
        id: 'e08-e1',
        title: 'Conditional types',
        language: 'typescript',
        prompt: `Define:

- \`EsArray<T>\`: \`true\` si \`T\` es un array, si no \`false\`.
- \`NombreTipo<T>\`: \`'texto'\` para strings, \`'número'\` para numbers, \`'lista'\` para arrays, \`'otro'\` para el resto.
- \`MensajeDe<T>\`: el tipo de la propiedad \`mensaje\` si \`T\` la tiene, si no \`never\`.`,
        starter: 'type EsArray<T> = unknown\ntype NombreTipo<T> = unknown\ntype MensajeDe<T> = unknown\n',
        solution: `type EsArray<T> = T extends unknown[] ? true : false
type NombreTipo<T> = T extends string ? 'texto' : T extends number ? 'número' : T extends unknown[] ? 'lista' : 'otro'
type MensajeDe<T> = T extends { mensaje: unknown } ? T['mensaje'] : never
`,
        hints: ['`T extends unknown[] ? true : false`', "Encadena: `T extends string ? 'texto' : T extends number ? ...`"],
        typeTests: `
type _a1 = Expect<Equal<EsArray<string[]>, true>>
type _a2 = Expect<Equal<EsArray<string>, false>>
type _n1 = Expect<Equal<NombreTipo<'x'>, 'texto'>>
type _n2 = Expect<Equal<NombreTipo<3>, 'número'>>
type _n3 = Expect<Equal<NombreTipo<boolean[]>, 'lista'>>
type _n4 = Expect<Equal<NombreTipo<{ a: 1 }>, 'otro'>>
type _m1 = Expect<Equal<MensajeDe<{ mensaje: string }>, string>>
type _m2 = Expect<Equal<MensajeDe<{ otro: 1 }>, never>>`,
      },
      {
        id: 'e08-e2',
        title: 'Retorno condicional',
        language: 'typescript',
        prompt:
          "Define `type Etiqueta<T extends number | string>` que sea `{ id: number }` si `T` es number, y `{ nombre: string }` si es string. Declara la función `crearEtiqueta<T extends number | string>(x: T): Etiqueta<T>` e impleméntala (necesitarás un `as` en los returns).",
        starter: 'function crearEtiqueta(x: number | string) {\n  return typeof x === \'number\' ? { id: x } : { nombre: x }\n}\n',
        solution: `type Etiqueta<T extends number | string> = T extends number ? { id: number } : { nombre: string }

function crearEtiqueta<T extends number | string>(x: T): Etiqueta<T> {
  return (typeof x === 'number' ? { id: x } : { nombre: x }) as Etiqueta<T>
}
`,
        hints: ['TS no puede estrechar `T` dentro de la implementación: `as Etiqueta<T>` es la salida habitual.'],
        tests: `
test('número', () => expect(crearEtiqueta(1)).toEqual({ id: 1 }))
test('string', () => expect(crearEtiqueta('a')).toEqual({ nombre: 'a' }))`,
        typeTests: `
const _a = crearEtiqueta(1)
type _ta = Expect<Equal<typeof _a, { id: number }>>
const _b = crearEtiqueta('x')
type _tb = Expect<Equal<typeof _b, { nombre: string }>>`,
      },
    ],
    quiz: [
      {
        question: '¿Qué es `NonNullable<string | null | undefined>`?',
        options: ['string', 'string | null', 'never'],
        answer: 0,
        explanation: '`NonNullable<T> = T extends null | undefined ? never : T`.',
      },
    ],
  },

  e09: {
    exercises: [
      {
        id: 'e09-e1',
        title: 'Extraer con infer',
        language: 'typescript',
        prompt: `Define con \`infer\` (sin usar los utility types de la librería):

- \`ElementoDe<T>\`: tipo de los elementos si \`T\` es array, si no \`T\`.
- \`MiRetorno<T>\`: tipo de retorno si \`T\` es función, si no \`never\`.
- \`PrimerParam<T>\`: tipo del primer parámetro de una función, si no \`never\`.
- \`Desenvolver<T>\`: el tipo dentro de una \`Promise\`, si no \`T\`.`,
        starter: 'type ElementoDe<T> = unknown\ntype MiRetorno<T> = unknown\ntype PrimerParam<T> = unknown\ntype Desenvolver<T> = unknown\n',
        solution: `type ElementoDe<T> = T extends (infer E)[] ? E : T
type MiRetorno<T> = T extends (...args: any[]) => infer R ? R : never
type PrimerParam<T> = T extends (primero: infer A, ...resto: any[]) => any ? A : never
type Desenvolver<T> = T extends Promise<infer V> ? V : T
`,
        hints: ['`T extends (infer E)[] ? E : T`', '`T extends (...args: any[]) => infer R ? R : never`'],
        typeTests: `
type _e1 = Expect<Equal<ElementoDe<string[]>, string>>
type _e2 = Expect<Equal<ElementoDe<number>, number>>
type _r1 = Expect<Equal<MiRetorno<() => boolean>, boolean>>
type _r2 = Expect<Equal<MiRetorno<string>, never>>
type _p1 = Expect<Equal<PrimerParam<(id: number, s: string) => void>, number>>
type _d1 = Expect<Equal<Desenvolver<Promise<{ a: 1 }>>, { a: 1 }>>
type _d2 = Expect<Equal<Desenvolver<string>, string>>`,
      },
      {
        id: 'e09-e2',
        title: 'Primero y último de una tupla',
        language: 'typescript',
        prompt: 'Define `Primero<T>` y `Ultimo<T>` para tuplas usando `infer` y rest (`...unknown[]`). Para una tupla vacía, `never`.',
        starter: 'type Primero<T> = unknown\ntype Ultimo<T> = unknown\n',
        solution:
          'type Primero<T> = T extends [infer A, ...unknown[]] ? A : never\ntype Ultimo<T> = T extends [...unknown[], infer Z] ? Z : never\n',
        hints: ['`T extends [infer A, ...unknown[]] ? A : never`'],
        typeTests: `
type _p = Expect<Equal<Primero<[1, 2, 3]>, 1>>
type _u = Expect<Equal<Ultimo<[1, 2, 3]>, 3>>
type _v = Expect<Equal<Primero<[]>, never>>
type _s = Expect<Equal<Ultimo<['a']>, 'a'>>`,
      },
    ],
    quiz: [
      {
        question: '¿Dónde puede aparecer `infer`?',
        options: ['En cualquier tipo', 'Solo en la condición (lado extends) de un conditional type', 'Solo en funciones'],
        answer: 1,
        explanation: '`infer X` declara una variable de tipo dentro de la condición.',
      },
    ],
  },

  e10: {
    exercises: [
      {
        id: 'e10-e1',
        title: 'Distribuir o no',
        language: 'typescript',
        prompt: `Define:

- \`Filtrar<T, U>\`: los miembros de \`T\` asignables a \`U\` (como \`Extract\`).
- \`Quitar<T, U>\`: los que **no** lo son (como \`Exclude\`).
- \`ArraysSeparados<T>\`: \`string | number\` → \`string[] | number[]\`.
- \`ArrayUnico<T>\`: \`string | number\` → \`(string | number)[]\` (evita la distribución).`,
        starter: 'type Filtrar<T, U> = unknown\ntype Quitar<T, U> = unknown\ntype ArraysSeparados<T> = unknown\ntype ArrayUnico<T> = unknown\n',
        solution: `type Filtrar<T, U> = T extends U ? T : never
type Quitar<T, U> = T extends U ? never : T
type ArraysSeparados<T> = T extends unknown ? T[] : never
type ArrayUnico<T> = [T] extends [unknown] ? T[] : never
`,
        hints: ['Devolver `never` elimina un miembro de la unión.', 'Envolver en tupla `[T]` evita distribuir.'],
        typeTests: `
type _f = Expect<Equal<Filtrar<'a' | 1 | 'b' | true, string>, 'a' | 'b'>>
type _q = Expect<Equal<Quitar<'a' | 1 | 'b', string>, 1>>
type _s = Expect<Equal<ArraysSeparados<string | number>, string[] | number[]>>
type _u = Expect<Equal<ArrayUnico<string | number>, (string | number)[]>>`,
      },
      {
        id: 'e10-e2',
        title: 'EsNever',
        language: 'typescript',
        prompt: 'Define `EsNever<T>` que sea `true` solo para `never`. Cuidado: la versión obvia (`T extends never ? ...`) devuelve `never` para `never`.',
        starter: 'type EsNever<T> = T extends never ? true : false\n',
        solution: 'type EsNever<T> = [T] extends [never] ? true : false\n',
        hints: ['`never` es una unión vacía: distribuir sobre ella no produce nada.', 'Envuelve en tupla.'],
        typeTests: `
type _a = Expect<Equal<EsNever<never>, true>>
type _b = Expect<Equal<EsNever<string>, false>>
type _c = Expect<Equal<EsNever<undefined>, false>>`,
      },
    ],
    quiz: [
      {
        question: '¿Qué es `Arr<boolean>` con `type Arr<T> = T extends any ? T[] : never`?',
        options: ['boolean[]', 'false[] | true[]', 'never'],
        answer: 1,
        explanation: '`boolean` es `true | false`, y la condición se distribuye.',
      },
    ],
  },

  e11: {
    exercises: [
      {
        id: 'e11-e1',
        title: 'Tus propios utility types',
        language: 'typescript',
        prompt: `Escribe con mapped types (sin usar \`Partial\`, \`Readonly\`...):

- \`Opcional<T>\`: todas las propiedades opcionales.
- \`Mutable<T>\`: quita \`readonly\`.
- \`Nullable<T>\`: cada propiedad acepta además \`null\`.
- \`Flags<T>\`: mismas claves, todos los valores \`boolean\`.`,
        starter: 'type Opcional<T> = unknown\ntype Mutable<T> = unknown\ntype Nullable<T> = unknown\ntype Flags<T> = unknown\n',
        solution: `type Opcional<T> = { [K in keyof T]?: T[K] }
type Mutable<T> = { -readonly [K in keyof T]: T[K] }
type Nullable<T> = { [K in keyof T]: T[K] | null }
type Flags<T> = { [K in keyof T]: boolean }
`,
        hints: ['`{ [K in keyof T]?: T[K] }`', '`-readonly` quita el modificador.'],
        typeTests: `
type U = { readonly id: number; nombre: string }
type _o = Expect<Equal<Opcional<U>, { readonly id?: number; nombre?: string }>>
type _m = Expect<Equal<Mutable<U>, { id: number; nombre: string }>>
type _n = Expect<Equal<Nullable<U>, { readonly id: number | null; nombre: string | null }>>
type _f = Expect<Equal<Flags<U>, { readonly id: boolean; nombre: boolean }>>`,
      },
      {
        id: 'e11-e2',
        title: 'Traducciones',
        language: 'typescript',
        prompt:
          "Con `type Idioma = 'es' | 'en' | 'fr'`, define `type Traducciones` con un mapped type sobre `Idioma` (cada idioma → string). Implementa `traducir(t: Traducciones, idioma: Idioma): string`. El objeto `saludo` debe compilar.",
        starter: `type Idioma = 'es' | 'en' | 'fr'
type Traducciones = unknown

const saludo: Traducciones = { es: 'Hola', en: 'Hello', fr: 'Bonjour' }

function traducir(t: Traducciones, idioma: Idioma): string {
  return ''
}
`,
        solution: `type Idioma = 'es' | 'en' | 'fr'
type Traducciones = { [L in Idioma]: string }

const saludo: Traducciones = { es: 'Hola', en: 'Hello', fr: 'Bonjour' }

function traducir(t: Traducciones, idioma: Idioma): string {
  return t[idioma]
}
`,
        hints: ['`{ [L in Idioma]: string }`'],
        tests: `
test('fr', () => expect(traducir(saludo, 'fr')).toBe('Bonjour'))`,
        typeTests: `
// @ts-expect-error falta fr
const _mal: Traducciones = { es: 'a', en: 'b' }`,
      },
    ],
    quiz: [
      {
        question: '¿Conserva `{ [K in keyof T]: T[K] }` los `readonly` y `?` de T?',
        options: ['Sí, es homomórfico', 'No'],
        answer: 0,
        explanation: 'Los mapped types sobre `keyof T` copian los modificadores.',
      },
    ],
  },

  e12: {
    exercises: [
      {
        id: 'e12-e1',
        title: 'Getters',
        language: 'typescript',
        prompt:
          'Define `Getters<T>`: para cada propiedad `x`, un método `getX(): tipo`. Implementa `crearGetters<T extends object>(obj: T): Getters<T>` en runtime.',
        starter: 'type Getters<T> = unknown\n\nfunction crearGetters(obj) {\n}\n',
        solution: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

function crearGetters<T extends object>(obj: T): Getters<T> {
  const resultado: Record<string, () => unknown> = {}
  for (const [clave, valor] of Object.entries(obj)) {
    resultado['get' + clave[0].toUpperCase() + clave.slice(1)] = () => valor
  }
  return resultado as Getters<T>
}
`,
        hints: ['`[K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]`', 'En runtime, construye un `Record<string, () => unknown>` y al final usa `as`.'],
        tests: `
test('getters', () => {
  const __g = crearGetters({ nombre: 'Ada', edad: 36 })
  expect(__g.getNombre()).toBe('Ada')
  expect(__g.getEdad()).toBe(36)
})`,
        typeTests: `
type _g = Expect<Equal<Getters<{ nombre: string; edad: number }>, { getNombre: () => string; getEdad: () => number }>>`,
      },
      {
        id: 'e12-e2',
        title: 'Filtrar claves',
        language: 'typescript',
        prompt: 'Define `SoloDatos<T>` (quita las propiedades que son funciones) y `SinClave<T, K>` (quita la clave `K`, como `Omit`, usando `as`).',
        starter: 'type SoloDatos<T> = unknown\ntype SinClave<T, K> = unknown\n',
        solution: `type SoloDatos<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K]
}
type SinClave<T, K> = {
  [P in keyof T as Exclude<P, K>]: T[P]
}
`,
        hints: ['Si la clave nueva es `never`, la propiedad desaparece.'],
        typeTests: `
type U = { nombre: string; edad: number; saludar: () => string }
type _d = Expect<Equal<SoloDatos<U>, { nombre: string; edad: number }>>
type _s = Expect<Equal<SinClave<U, 'edad'>, { nombre: string; saludar: () => string }>>`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué `Capitalize<string & K>` en vez de `Capitalize<K>`?',
        options: ['Por estilo', 'Porque `keyof T` puede incluir number y symbol, y Capitalize solo acepta strings', 'Para que sea más rápido'],
        answer: 1,
        explanation: '`string & K` se queda solo con las claves string.',
      },
    ],
  },

  e13: {
    exercises: [
      {
        id: 'e13-e1',
        title: 'Clases CSS y handlers',
        language: 'typescript',
        prompt: `Define:

- \`Clase\`: todas las combinaciones \`btn-<tamaño>-<color>\` con tamaños \`'sm' | 'lg'\` y colores \`'rojo' | 'azul'\`.
- \`Handler<E extends string>\`: \`'on' + E\` con la primera letra en mayúscula (\`'click'\` → \`'onClick'\`).
- \`Px\`: strings como \`'10px'\` o \`'1.5px'\`. Implementa \`px(n: number): Px\`.`,
        starter: "type Clase = string\ntype Handler<E extends string> = string\ntype Px = string\n\nfunction px(n: number): Px {\n  return n + 'px'\n}\n",
        solution: `type Tamaño = 'sm' | 'lg'
type Color = 'rojo' | 'azul'
type Clase = \`btn-\${Tamaño}-\${Color}\`
type Handler<E extends string> = \`on\${Capitalize<E>}\`
type Px = \`\${number}px\`

function px(n: number): Px {
  return \`\${n}px\`
}
`,
        hints: ['Un template literal con dos uniones genera todas las combinaciones.', '`on${Capitalize<E>}`', '`${number}px`'],
        tests: `
test('px', () => expect(px(12)).toBe('12px'))`,
        typeTests: `
type _c = Expect<Equal<Clase, 'btn-sm-rojo' | 'btn-sm-azul' | 'btn-lg-rojo' | 'btn-lg-azul'>>
type _h = Expect<Equal<Handler<'click' | 'focus'>, 'onClick' | 'onFocus'>>
const _p: Px = '1.5px'
// @ts-expect-error no son px
const _e: Px = '10em'`,
      },
      {
        id: 'e13-e2',
        title: 'Parsear con infer',
        language: 'typescript',
        prompt: `Define:

- \`SinOn<T>\`: si \`T\` es \`'on' + X\`, devuelve \`X\` con la primera letra en minúscula; si no, \`never\`. (\`'onClick'\` → \`'click'\`)
- \`Partes<T>\`: divide \`'a.b.c'\` en la tupla \`['a', 'b', 'c']\` (tipo recursivo).`,
        starter: 'type SinOn<T> = unknown\ntype Partes<T> = unknown\n',
        solution: `type SinOn<T> = T extends \`on\${infer R}\` ? Uncapitalize<R> : never
type Partes<T> = T extends \`\${infer A}.\${infer Resto}\` ? [A, ...Partes<Resto>] : [T]
`,
        hints: ['`T extends `on${infer R}` ? ... : never`', 'Recursivo: `[A, ...Partes<Resto>]`, y el caso base `[T]`.'],
        typeTests: `
type _s1 = Expect<Equal<SinOn<'onClick'>, 'click'>>
type _s2 = Expect<Equal<SinOn<'click'>, never>>
type _p1 = Expect<Equal<Partes<'a.b.c'>, ['a', 'b', 'c']>>
type _p2 = Expect<Equal<Partes<'solo'>, ['solo']>>`,
      },
    ],
    quiz: [
      {
        question: "¿Cuántos miembros tiene `` `${'a' | 'b'}-${'x' | 'y' | 'z'}` ``?",
        options: ['2', '5', '6'],
        answer: 2,
        explanation: 'Todas las combinaciones: 2 × 3.',
      },
    ],
  },

  e14: {
    exercises: [
      {
        id: 'e14-e1',
        title: 'Partial y Required',
        language: 'typescript',
        prompt:
          'Implementa `actualizar(t: Tarea, cambios: Partial<Tarea>): Tarea` y `resolver(o: Opciones): Required<Opciones>` (defectos: `ancho` 800, `alto` 600, `titulo` `\'Ventana\'`). En `resolver`, un valor `undefined` explícito también debe usar el defecto.',
        starter: `interface Tarea {
  titulo: string
  hecha: boolean
}

interface Opciones {
  ancho?: number
  alto?: number
  titulo?: string
}

function actualizar(t: Tarea, cambios: Tarea): Tarea {
  return { ...t, ...cambios }
}

function resolver(o: Opciones) {
  return o
}
`,
        solution: `interface Tarea {
  titulo: string
  hecha: boolean
}

interface Opciones {
  ancho?: number
  alto?: number
  titulo?: string
}

function actualizar(t: Tarea, cambios: Partial<Tarea>): Tarea {
  return { ...t, ...cambios }
}

function resolver(o: Opciones): Required<Opciones> {
  return {
    ancho: o.ancho ?? 800,
    alto: o.alto ?? 600,
    titulo: o.titulo ?? 'Ventana',
  }
}
`,
        hints: ['`cambios: Partial<Tarea>`', 'Con `??` por propiedad, un `undefined` explícito también usa el defecto (el spread no).'],
        tests: `
test('actualizar', () => expect(actualizar({ titulo: 'a', hecha: false }, { hecha: true })).toEqual({ titulo: 'a', hecha: true }))
test('resolver', () => expect(resolver({ ancho: 100 })).toEqual({ ancho: 100, alto: 600, titulo: 'Ventana' }))
test('undefined explícito', () => expect(resolver({ alto: undefined }).alto).toBe(600))`,
        typeTests: `
declare const _t: Tarea
actualizar(_t, { hecha: true })
type _r = Expect<Equal<ReturnType<typeof resolver>, Required<Opciones>>>`,
      },
      {
        id: 'e14-e2',
        title: 'Readonly',
        language: 'typescript',
        prompt: 'Implementa `congelar<T extends object>(obj: T): Readonly<T>` con `Object.freeze`, y escribe `DeepPartial<T>` recursivo (las propiedades objeto también se vuelven parciales).',
        starter: 'function congelar(obj) {\n  return obj\n}\n\ntype DeepPartial<T> = Partial<T>\n',
        solution: `function congelar<T extends object>(obj: T): Readonly<T> {
  return Object.freeze(obj)
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
`,
        hints: ['`DeepPartial` se llama a sí mismo cuando la propiedad es un objeto.'],
        tests: `
test('congelado', () => expect(Object.isFrozen(congelar({ a: 1 }))).toBe(true))`,
        typeTests: `
const _c = congelar({ x: 1 })
// @ts-expect-error es readonly
_c.x = 2
type Cfg = { ui: { tema: string; tamaño: number }; debug: boolean }
const _p: DeepPartial<Cfg> = { ui: { tema: 'oscuro' } }`,
      },
    ],
    quiz: [
      {
        question: '¿`Partial<{ a: { b: string } }>` hace opcional `b`?',
        options: ['Sí', 'No, solo el primer nivel'],
        answer: 1,
        explanation: 'Los utility types son superficiales.',
      },
    ],
  },

  e15: {
    exercises: [
      {
        id: 'e15-e1',
        title: 'Pick y Omit',
        language: 'typescript',
        prompt:
          'A partir de `Usuario`, define `UsuarioPublico` (sin `password`), `NuevoUsuario` (sin `id` ni `creado`) y `Tarjeta` (solo `id` y `nombre`). Implementa `publico(u: Usuario): UsuarioPublico` (quita el password en runtime con rest).',
        starter: `interface Usuario {
  id: number
  nombre: string
  email: string
  password: string
  creado: string
}

type UsuarioPublico = unknown
type NuevoUsuario = unknown
type Tarjeta = unknown

function publico(u: Usuario) {
  return u
}
`,
        solution: `interface Usuario {
  id: number
  nombre: string
  email: string
  password: string
  creado: string
}

type UsuarioPublico = Omit<Usuario, 'password'>
type NuevoUsuario = Omit<Usuario, 'id' | 'creado'>
type Tarjeta = Pick<Usuario, 'id' | 'nombre'>

function publico(u: Usuario): UsuarioPublico {
  const { password: _password, ...resto } = u
  return resto
}
`,
        hints: ["`Omit<Usuario, 'password'>`", '`const { password: _password, ...resto } = u`'],
        tests: `
test('publico', () => expect(publico({ id: 1, nombre: 'a', email: 'e', password: 'p', creado: 'c' })).toEqual({ id: 1, nombre: 'a', email: 'e', creado: 'c' }))`,
        typeTests: `
type _p = Expect<Equal<keyof UsuarioPublico, 'id' | 'nombre' | 'email' | 'creado'>>
type _n = Expect<Equal<keyof NuevoUsuario, 'nombre' | 'email' | 'password'>>
type _t = Expect<Equal<Tarjeta, Pick<Usuario, 'id' | 'nombre'>>>`,
      },
      {
        id: 'e15-e2',
        title: 'Record exhaustivo',
        language: 'typescript',
        prompt:
          "Con `type Rol = 'admin' | 'editor' | 'lector'`, tipa `ETIQUETAS` como `Record<Rol, string>` (debe tener las tres) e implementa `contarPorRol(roles: Rol[]): Record<Rol, number>` (todas las claves presentes, aunque sea con 0).",
        starter: `type Rol = 'admin' | 'editor' | 'lector'

const ETIQUETAS = { admin: 'Administrador', editor: 'Editor' }

function contarPorRol(roles: Rol[]) {
}
`,
        solution: `type Rol = 'admin' | 'editor' | 'lector'

const ETIQUETAS: Record<Rol, string> = { admin: 'Administrador', editor: 'Editor', lector: 'Lector' }

function contarPorRol(roles: Rol[]): Record<Rol, number> {
  const conteo: Record<Rol, number> = { admin: 0, editor: 0, lector: 0 }
  for (const r of roles) conteo[r]++
  return conteo
}
`,
        hints: ['Al anotar `Record<Rol, string>`, TS te dirá qué clave falta.'],
        tests: `
test('contar', () => expect(contarPorRol(['admin', 'lector', 'admin'])).toEqual({ admin: 2, editor: 0, lector: 1 }))
test('etiqueta lector', () => expect(ETIQUETAS.lector).toBe('Lector'))`,
        typeTests: `
type _e = Expect<Equal<typeof ETIQUETAS, Record<Rol, string>>>
type _c = Expect<Equal<ReturnType<typeof contarPorRol>, Record<Rol, number>>>`,
      },
    ],
    quiz: [
      {
        question: "¿Da error `Omit<Usuario, 'pasword'>` (con typo)?",
        options: ['Sí', 'No: Omit acepta cualquier string'],
        answer: 1,
        explanation: 'A diferencia de `Pick`, `Omit` no restringe K a `keyof T`.',
      },
    ],
  },

  e16: {
    exercises: [
      {
        id: 'e16-e1',
        title: 'Tipos derivados de funciones',
        language: 'typescript',
        prompt:
          'Sin escribir los tipos a mano, define `Sesion` (retorno de `crearSesion`), `Nivel` (primer parámetro de `log`) y `Perfil` (lo que resuelve la promesa de `cargarPerfil`).',
        starter: `function crearSesion(usuario: string) {
  return { usuario, token: 'abc', expira: 0 }
}

function log(nivel: 'info' | 'error', mensaje: string) {}

async function cargarPerfil(id: number) {
  return { id, nombre: 'Ada', avatar: '/a.png' }
}

type Sesion = unknown
type Nivel = unknown
type Perfil = unknown
`,
        solution: `function crearSesion(usuario: string) {
  return { usuario, token: 'abc', expira: 0 }
}

function log(nivel: 'info' | 'error', mensaje: string) {}

async function cargarPerfil(id: number) {
  return { id, nombre: 'Ada', avatar: '/a.png' }
}

type Sesion = ReturnType<typeof crearSesion>
type Nivel = Parameters<typeof log>[0]
type Perfil = Awaited<ReturnType<typeof cargarPerfil>>
`,
        hints: ['`Parameters<typeof log>[0]`', '`Awaited<ReturnType<typeof cargarPerfil>>`'],
        typeTests: `
type _s = Expect<Equal<Sesion, { usuario: string; token: string; expira: number }>>
type _n = Expect<Equal<Nivel, 'info' | 'error'>>
type _p = Expect<Equal<Perfil, { id: number; nombre: string; avatar: string }>>`,
      },
      {
        id: 'e16-e2',
        title: 'Envolver conservando la firma',
        language: 'typescript',
        prompt:
          'Implementa `contarLlamadas(fn)` que devuelva un objeto `{ llamar, total }`: `llamar` invoca `fn` con los mismos argumentos y devuelve lo mismo (con **la misma firma** que `fn`), y `total()` devuelve cuántas veces se llamó.',
        starter: 'function contarLlamadas(fn: Function) {\n  let n = 0\n  return {\n    llamar: (...args: any[]) => { n++; return fn(...args) },\n    total: () => n,\n  }\n}\n',
        solution: `function contarLlamadas<F extends (...args: any[]) => any>(fn: F) {
  let n = 0
  return {
    llamar: (...args: Parameters<F>): ReturnType<F> => {
      n++
      return fn(...args)
    },
    total: () => n,
  }
}
`,
        hints: ['`<F extends (...args: any[]) => any>`', '`(...args: Parameters<F>): ReturnType<F>`'],
        tests: `
test('cuenta', () => {
  const __c = contarLlamadas((a: number, b: number) => a + b)
  expect(__c.llamar(1, 2)).toBe(3)
  __c.llamar(3, 4)
  expect(__c.total()).toBe(2)
})`,
        typeTests: `
const _c = contarLlamadas((a: number, b: string) => b.repeat(a))
const _r = _c.llamar(2, 'x')
type _t = Expect<Equal<typeof _r, string>>
// @ts-expect-error argumentos incorrectos
_c.llamar('x', 2)`,
      },
    ],
    quiz: [
      {
        question: '¿Qué es `Awaited<Promise<Promise<number>>>`?',
        options: ['Promise<number>', 'number', 'never'],
        answer: 1,
        explanation: '`Awaited` desenvuelve promesas anidadas.',
      },
    ],
  },

  e17: {
    exercises: [
      {
        id: 'e17-e1',
        title: 'Store genérico',
        language: 'typescript',
        prompt: 'Define `Store<S>` e implementa `crearStore` como describe la lección.',
        starter: `interface Store<S> {
}

function crearStore<S extends object>(inicial: S): Store<S> {
}
`,
        solution: `interface Store<S> {
  get(): S
  select<K extends keyof S>(clave: K): S[K]
  set(cambio: Partial<S> | ((actual: S) => Partial<S>)): void
  subscribe(listener: (estado: S, anterior: S) => void): () => void
}

function crearStore<S extends object>(inicial: S): Store<S> {
  let estado = inicial
  const listeners = new Set<(estado: S, anterior: S) => void>()

  return {
    get: () => estado,
    select: (clave) => estado[clave],
    set(cambio) {
      const parcial = typeof cambio === 'function' ? cambio(estado) : cambio
      const anterior = estado
      estado = { ...estado, ...parcial }
      for (const l of listeners) l(estado, anterior)
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
`,
        hints: [
          'Guarda los listeners en un `Set`: borrar uno concreto es trivial.',
          "`typeof cambio === 'function'` estrecha la unión.",
          'Al implementar los métodos dentro del objeto, TS infiere sus parámetros a partir de `Store<S>`.',
        ],
        tests: `
test('get y select', () => {
  const __s = crearStore({ n: 1, nombre: 'a' })
  expect(__s.get()).toEqual({ n: 1, nombre: 'a' })
  expect(__s.select('nombre')).toBe('a')
})
test('set parcial y con función', () => {
  const __s = crearStore({ n: 1, nombre: 'a' })
  __s.set({ nombre: 'b' })
  __s.set((s) => ({ n: s.n + 10 }))
  expect(__s.get()).toEqual({ n: 11, nombre: 'b' })
})
test('no muta', () => {
  const __ini = { n: 1 }
  const __s = crearStore(__ini)
  __s.set({ n: 2 })
  expect(__ini.n).toBe(1)
})
test('subscribe y desuscribir', () => {
  const __s = crearStore({ n: 0 })
  const __vistos: number[] = []
  const __off = __s.subscribe((e, a) => __vistos.push(a.n, e.n))
  __s.set({ n: 1 })
  __off()
  __s.set({ n: 2 })
  expect(__vistos).toEqual([0, 1])
})`,
        typeTests: `
const _s = crearStore({ contador: 0, usuario: null as string | null })
const _c = _s.select('contador')
type _t = Expect<Equal<typeof _c, number>>
_s.set({ usuario: 'Ada' })
_s.set((s) => ({ contador: s.contador + 1 }))
// @ts-expect-error clave inexistente
_s.select('otra')
// @ts-expect-error tipo incorrecto
_s.set({ contador: 'uno' })`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué el estado nuevo se crea con spread en vez de modificar el actual?',
        options: [
          'Para que los listeners puedan comparar el estado anterior con el nuevo',
          'Porque Partial lo exige',
          'Por rendimiento',
        ],
        answer: 0,
        explanation: 'Si mutaras, `anterior` y `estado` serían el mismo objeto. React se basa en lo mismo.',
      },
    ],
  },

  e18: {
    exercises: [
      {
        id: 'e18-e1',
        title: 'Emisor de eventos tipado',
        language: 'typescript',
        prompt: 'Implementa `Emisor`, `NombreHandler`, `Handlers` y `conectar` como describe la lección.',
        starter: `class Emisor<E extends Record<string, unknown>> {
}

type NombreHandler<K extends string> = string
type Handlers<E> = unknown

function conectar<E extends Record<string, unknown>>(emisor: Emisor<E>, handlers: Handlers<E>): () => void {
  return () => {}
}
`,
        solution: `class Emisor<E extends Record<string, unknown>> {
  private listeners = new Map<string, Set<(payload: any) => void>>()

  on<K extends keyof E & string>(evento: K, fn: (payload: E[K]) => void): () => void {
    let set = this.listeners.get(evento)
    if (!set) {
      set = new Set()
      this.listeners.set(evento, set)
    }
    set.add(fn)
    return () => {
      set.delete(fn)
    }
  }

  emit<K extends keyof E & string>(evento: K, payload: E[K]): void {
    for (const fn of this.listeners.get(evento) ?? []) fn(payload)
  }
}

type NombreHandler<K extends string> = \`on\${Capitalize<K>}\`

type Handlers<E> = {
  [K in keyof E & string as NombreHandler<K>]?: (payload: E[K]) => void
}

function conectar<E extends Record<string, unknown>>(emisor: Emisor<E>, handlers: Handlers<E>): () => void {
  const desconectores: (() => void)[] = []
  for (const [nombre, fn] of Object.entries(handlers)) {
    if (typeof fn !== 'function') continue
    const evento = (nombre[2].toLowerCase() + nombre.slice(3)) as keyof E & string
    desconectores.push(emisor.on(evento, fn as (payload: E[typeof evento]) => void))
  }
  return () => desconectores.forEach((d) => d())
}
`,
        hints: [
          'Guarda listeners en `Map<string, Set<(payload: any) => void>>`.',
          "En `conectar`, `'onLogin'` → `nombre[2].toLowerCase() + nombre.slice(3)`.",
          'Dentro de `conectar`, TS no puede relacionar el string calculado con `keyof E`: un `as` controlado es aceptable.',
        ],
        tests: `
type __Ev = { login: { usuario: string }; logout: undefined; error: { codigo: number } }
test('on y emit', () => {
  const __e = new Emisor<__Ev>()
  const __vistos: string[] = []
  __e.on('login', (p) => __vistos.push(p.usuario))
  __e.on('login', (p) => __vistos.push(p.usuario.toUpperCase()))
  __e.emit('login', { usuario: 'ada' })
  expect(__vistos).toEqual(['ada', 'ADA'])
})
test('desuscribir', () => {
  const __e = new Emisor<__Ev>()
  let __n = 0
  const __off = __e.on('logout', () => { __n++ })
  __e.emit('logout', undefined)
  __off()
  __e.emit('logout', undefined)
  expect(__n).toBe(1)
})
test('conectar', () => {
  const __e = new Emisor<__Ev>()
  const __vistos: unknown[] = []
  const __off = conectar(__e, { onLogin: (p) => __vistos.push(p.usuario), onError: (p) => __vistos.push(p.codigo) })
  __e.emit('login', { usuario: 'x' })
  __e.emit('error', { codigo: 500 })
  __off()
  __e.emit('login', { usuario: 'y' })
  expect(__vistos).toEqual(['x', 500])
})`,
        typeTests: `
type Ev = { login: { usuario: string }; logout: undefined }
const _e = new Emisor<Ev>()
_e.on('login', (p) => p.usuario.trim())
// @ts-expect-error payload incorrecto
_e.emit('login', { usuario: 1 })
// @ts-expect-error evento inexistente
_e.on('registro', () => {})
type _n = Expect<Equal<NombreHandler<'login'>, 'onLogin'>>
type _h = Expect<Equal<keyof Handlers<Ev>, 'onLogin' | 'onLogout'>>
// @ts-expect-error handler inexistente
conectar(_e, { onRegistro: () => {} })`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué `K extends keyof E & string` y no solo `keyof E`?',
        options: [
          'Porque las claves pueden ser number o symbol, y el nombre del evento se usa como string',
          'Por rendimiento',
          'No hace falta',
        ],
        answer: 0,
        explanation: 'Además, `Capitalize` y los template literals necesitan strings.',
      },
    ],
  },
}
