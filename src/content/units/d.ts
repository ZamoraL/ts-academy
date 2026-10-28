import type { UnitContent } from '../index'

// Bloque D: TypeScript intermedio (d06 está en ts.ts).
// Los tests usan nombres con prefijo __ / _ para no chocar con variables del alumno.

const ERROR_MSG = `
function __mensaje(fn: () => unknown): string {
  try { fn() } catch (e) { return (e as Error).message }
  return 'no lanzó error'
}
`

export const unitsD: Record<string, UnitContent> = {
  d01: {
    exercises: [
      {
        id: 'd01-e1',
        title: 'padLeft',
        language: 'typescript',
        prompt:
          "Implementa `padLeft(padding, input)`: si `padding` es un número, antepone ese número de espacios; si es un string, lo antepone tal cual.\n\n`padLeft(3, 'x')` → `'   x'` · `padLeft('>> ', 'x')` → `'>> x'`",
        starter: "function padLeft(padding: number | string, input: string): string {\n  return ' '.repeat(padding) + input\n}\n",
        solution:
          "function padLeft(padding: number | string, input: string): string {\n  if (typeof padding === 'number') {\n    return ' '.repeat(padding) + input\n  }\n  return padding + input\n}\n",
        hints: ["`if (typeof padding === 'number')`"],
        tests: `
test('número', () => expect(padLeft(3, 'x')).toBe('   x'))
test('string', () => expect(padLeft('>> ', 'x')).toBe('>> x'))`,
      },
      {
        id: 'd01-e2',
        title: 'Descartar paso a paso',
        language: 'typescript',
        prompt:
          "Implementa `describir(x: string | number | boolean | undefined): string` con returns tempranos:\n\n- `undefined` → `'nada'`\n- string → `'texto de N letras'`\n- number → `'número par'` / `'número impar'`\n- boolean → `'verdadero'` / `'falso'`",
        starter: 'function describir(x: string | number | boolean | undefined): string {\n}\n',
        solution: `function describir(x: string | number | boolean | undefined): string {
  if (x === undefined) return 'nada'
  if (typeof x === 'string') return \`texto de \${x.length} letras\`
  if (typeof x === 'number') return x % 2 === 0 ? 'número par' : 'número impar'
  return x ? 'verdadero' : 'falso'
}
`,
        hints: ['Tras cada `return`, TS resta ese caso. Al final solo queda `boolean`.'],
        tests: `
test('undefined', () => expect(describir(undefined)).toBe('nada'))
test('string', () => expect(describir('hola')).toBe('texto de 4 letras'))
test('par', () => expect(describir(4)).toBe('número par'))
test('impar', () => expect(describir(7)).toBe('número impar'))
test('boolean', () => expect(describir(false)).toBe('falso'))`,
      },
    ],
    quiz: [
      {
        question: "Con `x: string[] | null`, dentro de `if (typeof x === 'object')`, ¿qué tipo tiene `x`?",
        options: ['string[]', 'string[] | null', 'object'],
        answer: 1,
        explanation: "`typeof null` es `'object'`, así que TS no descarta `null`.",
      },
    ],
  },

  d02: {
    exercises: [
      {
        id: 'd02-e1',
        title: 'El caso de null',
        language: 'typescript',
        prompt:
          "`listar` debe devolver siempre un array: si recibe un array, una copia; si recibe un string (aunque sea `''`), `[ese string]`; si recibe `null`, `[]`. Corrige el error de tipo **sin** perder el string vacío.",
        starter: `function listar(strs: string | string[] | null): string[] {
  if (typeof strs === 'object') {
    return [...strs]
  }
  return [strs]
}
`,
        solution: `function listar(strs: string | string[] | null): string[] {
  if (strs === null) return []
  if (typeof strs === 'object') {
    return [...strs]
  }
  return [strs]
}
`,
        hints: ['Descarta `null` primero con `strs === null`.', "Ojo: `if (!strs)` también descartaría `''`."],
        tests: `
test('array', () => expect(listar(['a', 'b'])).toEqual(['a', 'b']))
test('string', () => expect(listar('a')).toEqual(['a']))
test('string vacío', () => expect(listar('')).toEqual(['']))
test('null', () => expect(listar(null)).toEqual([]))`,
      },
      {
        id: 'd02-e2',
        title: '!= null',
        language: 'typescript',
        prompt:
          "`sumarDefinidos` recibe valores que pueden ser `number`, `null` o `undefined`. Suma solo los números (el `0` cuenta como número). Usa `!= null` para descartar a la vez `null` y `undefined`.",
        starter:
          'function sumarDefinidos(valores: (number | null | undefined)[]): number {\n  let total = 0\n  for (const v of valores) {\n    total += v\n  }\n  return total\n}\n',
        solution:
          'function sumarDefinidos(valores: (number | null | undefined)[]): number {\n  let total = 0\n  for (const v of valores) {\n    if (v != null) total += v\n  }\n  return total\n}\n',
        hints: ['`if (v != null) total += v`'],
        tests: `
test('suma', () => expect(sumarDefinidos([1, null, 2, undefined, 0, 3])).toBe(6))
test('vacío', () => expect(sumarDefinidos([])).toBe(0))`,
      },
    ],
    quiz: [
      {
        question: "Con `x: string | undefined`, ¿qué valor válido descarta `if (x)` además de `undefined`?",
        options: ['Ninguno', "El string vacío ''", "El string '0'"],
        answer: 1,
        explanation: "`''` es falsy. Si `''` es válido, usa `x !== undefined`.",
      },
    ],
  },

  d03: {
    exercises: [
      {
        id: 'd03-e1',
        title: 'Peces y aves',
        language: 'typescript',
        prompt: "Implementa `mover(animal: Pez | Ave): string` usando el operador `in`: llama a `nadar()` o `volar()` según corresponda.",
        starter: `type Pez = { nadar: () => string }
type Ave = { volar: () => string }

function mover(animal: Pez | Ave): string {
  return animal.nadar()
}
`,
        solution: `type Pez = { nadar: () => string }
type Ave = { volar: () => string }

function mover(animal: Pez | Ave): string {
  if ('nadar' in animal) return animal.nadar()
  return animal.volar()
}
`,
        hints: ["`if ('nadar' in animal)`"],
        tests: `
test('pez', () => expect(mover({ nadar: () => 'glu' })).toBe('glu'))
test('ave', () => expect(mover({ volar: () => 'fiu' })).toBe('fiu'))`,
      },
      {
        id: 'd03-e2',
        title: 'Fechas o strings',
        language: 'typescript',
        prompt:
          "Implementa `anio(x: Date | string | number): number`: con un `Date` devuelve `getFullYear()`; con un string o número, crea primero un `Date` con él. Usa `instanceof`.",
        starter: 'function anio(x: Date | string | number): number {\n  return x.getFullYear()\n}\n',
        solution: 'function anio(x: Date | string | number): number {\n  if (x instanceof Date) return x.getFullYear()\n  return new Date(x).getFullYear()\n}\n',
        hints: ['`if (x instanceof Date)`'],
        tests: `
test('Date', () => expect(anio(new Date(2024, 5, 1))).toBe(2024))
test('string', () => expect(anio('2030-06-15T12:00:00')).toBe(2030))
test('timestamp', () => expect(anio(new Date(1999, 1, 1).getTime())).toBe(1999))`,
      },
    ],
    quiz: [
      {
        question: '¿Funciona `instanceof Usuario` con un objeto que viene de `JSON.parse`?',
        options: ['Sí, si tiene la misma forma', 'No, solo con objetos creados con `new Usuario`'],
        answer: 1,
        explanation: 'JSON.parse crea objetos planos; su prototipo es Object.',
      },
    ],
  },

  d04: {
    exercises: [
      {
        id: 'd04-e1',
        title: 'Narrowing en callbacks',
        language: 'typescript',
        prompt:
          'TS da error dentro del `filter` aunque acabamos de comprobar `usuario.nombre`. Arréglalo copiando el valor a una constante (sin usar `!`).',
        starter: `function masLargos(usuario: { nombre?: string }, lista: string[]): string[] {
  if (usuario.nombre) {
    return lista.filter((x) => x.length > usuario.nombre.length)
  }
  return []
}
`,
        solution: `function masLargos(usuario: { nombre?: string }, lista: string[]): string[] {
  const nombre = usuario.nombre
  if (nombre) {
    return lista.filter((x) => x.length > nombre.length)
  }
  return []
}
`,
        hints: ['`const nombre = usuario.nombre` antes del `if`.'],
        tests: `
test('filtra', () => expect(masLargos({ nombre: 'Ana' }, ['Luisa', 'Eva', 'Ramón'])).toEqual(['Luisa', 'Ramón']))
test('sin nombre', () => expect(masLargos({}, ['a'])).toEqual([]))`,
      },
      {
        id: 'd04-e2',
        title: 'A número',
        language: 'typescript',
        prompt:
          "Implementa `aNumero(valor: string | number | null | undefined): number`:\n\n- `null`/`undefined` → `0`\n- number → tal cual\n- string → `parseFloat(valor)`, o `0` si da `NaN`",
        starter: 'function aNumero(valor: string | number | null | undefined): number {\n  return parseFloat(valor)\n}\n',
        solution: `function aNumero(valor: string | number | null | undefined): number {
  if (valor == null) return 0
  if (typeof valor === 'number') return valor
  const n = parseFloat(valor)
  return Number.isNaN(n) ? 0 : n
}
`,
        hints: ['`valor == null` cubre null y undefined.', '`Number.isNaN(n)`'],
        tests: `
test('null', () => expect(aNumero(null)).toBe(0))
test('número', () => expect(aNumero(7)).toBe(7))
test('string', () => expect(aNumero('3.5kg')).toBe(3.5))
test('string inválido', () => expect(aNumero('abc')).toBe(0))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué tipo tiene `x` al final?',
        code: "let x: string | number = 'a'\nx = 5\nx",
        options: ['string | number', 'number', 'string'],
        answer: 1,
        explanation: 'Tras la asignación, TS sabe que en ese punto x es number.',
      },
    ],
  },

  d05: {
    exercises: [
      {
        id: 'd05-e1',
        title: 'esPez',
        language: 'typescript',
        prompt:
          'Convierte `esPez` en un **type predicate** y usa `filter(esPez)` en `soloPeces` para que devuelva `Pez[]`.',
        starter: `type Pez = { nombre: string; nadar: () => void }
type Ave = { nombre: string; volar: () => void }

function esPez(animal: Pez | Ave): boolean {
  return 'nadar' in animal
}

function soloPeces(zoo: (Pez | Ave)[]): Pez[] {
  return zoo.filter((a) => esPez(a))
}
`,
        solution: `type Pez = { nombre: string; nadar: () => void }
type Ave = { nombre: string; volar: () => void }

function esPez(animal: Pez | Ave): animal is Pez {
  return 'nadar' in animal
}

function soloPeces(zoo: (Pez | Ave)[]): Pez[] {
  return zoo.filter(esPez)
}
`,
        hints: ['Retorno: `animal is Pez`.', 'Pasa `esPez` directamente a `filter`.'],
        tests: `
const __zoo = [{ nombre: 'Nemo', nadar: () => {} }, { nombre: 'Piolín', volar: () => {} }]
test('filtra', () => expect(soloPeces(__zoo).map((p) => p.nombre)).toEqual(['Nemo']))`,
        typeTests: `
declare const _a: Pez | Ave
if (esPez(_a)) _a.nadar()
else _a.volar()`,
      },
      {
        id: 'd05-e2',
        title: 'Quitar undefined',
        language: 'typescript',
        prompt:
          'Implementa `definidos(valores: (string | undefined)[]): string[]` con `filter` y un predicado inline. Luego implementa `esUsuario(x: unknown): x is Usuario` que valide un objeto con `nombre` string y `edad` number.',
        starter: `interface Usuario {
  nombre: string
  edad: number
}

function definidos(valores: (string | undefined)[]): string[] {
  return valores.filter((v) => v !== undefined)
}

function esUsuario(x: unknown): x is Usuario {
  return true
}
`,
        solution: `interface Usuario {
  nombre: string
  edad: number
}

function definidos(valores: (string | undefined)[]): string[] {
  return valores.filter((v): v is string => v !== undefined)
}

function esUsuario(x: unknown): x is Usuario {
  return (
    typeof x === 'object' &&
    x !== null &&
    'nombre' in x &&
    typeof x.nombre === 'string' &&
    'edad' in x &&
    typeof x.edad === 'number'
  )
}
`,
        hints: ['`(v): v is string => v !== undefined`', "En esUsuario: `typeof x === 'object' && x !== null && 'nombre' in x && ...`"],
        tests: `
test('definidos', () => expect(definidos(['a', undefined, 'b'])).toEqual(['a', 'b']))
test('usuario válido', () => expect(esUsuario({ nombre: 'Ada', edad: 36 })).toBe(true))
test('edad string', () => expect(esUsuario({ nombre: 'Ada', edad: '36' })).toBe(false))
test('null', () => expect(esUsuario(null)).toBe(false))
test('string', () => expect(esUsuario('Ada')).toBe(false))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué devuelve una función con retorno `x is Pez`?',
        options: ['Un Pez', 'Un boolean', 'never'],
        answer: 1,
        explanation: 'En runtime devuelve un boolean; el predicado le dice a TS qué significa `true`.',
      },
    ],
  },

  d07: {
    exercises: [
      {
        id: 'd07-e1',
        title: 'El caso olvidado',
        language: 'typescript',
        prompt:
          'Alguien añadió `Triangulo` a `Forma` y el switch ahora da error en el `default`. Añade el caso que falta (área = base × altura / 2).',
        starter: `type Circulo = { kind: 'circulo'; radio: number }
type Cuadrado = { kind: 'cuadrado'; lado: number }
type Triangulo = { kind: 'triangulo'; base: number; altura: number }
type Forma = Circulo | Cuadrado | Triangulo

function area(forma: Forma): number {
  switch (forma.kind) {
    case 'circulo':
      return Math.PI * forma.radio ** 2
    case 'cuadrado':
      return forma.lado ** 2
    default: {
      const _exhaustivo: never = forma
      return _exhaustivo
    }
  }
}
`,
        solution: `type Circulo = { kind: 'circulo'; radio: number }
type Cuadrado = { kind: 'cuadrado'; lado: number }
type Triangulo = { kind: 'triangulo'; base: number; altura: number }
type Forma = Circulo | Cuadrado | Triangulo

function area(forma: Forma): number {
  switch (forma.kind) {
    case 'circulo':
      return Math.PI * forma.radio ** 2
    case 'cuadrado':
      return forma.lado ** 2
    case 'triangulo':
      return (forma.base * forma.altura) / 2
    default: {
      const _exhaustivo: never = forma
      return _exhaustivo
    }
  }
}
`,
        hints: ["`case 'triangulo':`"],
        tests: `
test('triángulo', () => expect(area({ kind: 'triangulo', base: 4, altura: 3 })).toBe(6))
test('cuadrado', () => expect(area({ kind: 'cuadrado', lado: 3 })).toBe(9))`,
      },
      {
        id: 'd07-e2',
        title: 'assertNever',
        language: 'typescript',
        prompt:
          "Implementa `assertNever(x: never): never` que lance `Error('Caso no manejado: ' + JSON.stringify(x))`. Úsalo en `etiqueta` para que sea exhaustiva y añade el caso de `'archivado'` (→ `'📦 Archivado'`).",
        starter: `type Estado = 'borrador' | 'publicado' | 'archivado'

function assertNever(x: never): never {
}

function etiqueta(e: Estado): string {
  switch (e) {
    case 'borrador':
      return '✏️ Borrador'
    case 'publicado':
      return '✅ Publicado'
  }
}
`,
        solution: `type Estado = 'borrador' | 'publicado' | 'archivado'

function assertNever(x: never): never {
  throw new Error('Caso no manejado: ' + JSON.stringify(x))
}

function etiqueta(e: Estado): string {
  switch (e) {
    case 'borrador':
      return '✏️ Borrador'
    case 'publicado':
      return '✅ Publicado'
    case 'archivado':
      return '📦 Archivado'
    default:
      return assertNever(e)
  }
}
`,
        hints: ['`assertNever` solo necesita un `throw`.', '`default: return assertNever(e)`'],
        tests: `${ERROR_MSG}
test('archivado', () => expect(etiqueta('archivado')).toBe('📦 Archivado'))
test('assertNever lanza', () => expect(__mensaje(() => assertNever('raro' as never))).toBe('Caso no manejado: "raro"'))`,
        typeTests: `
function _usa(x: 'a'): string {
  if (x === 'a') return 'ok'
  return assertNever(x)
}`,
      },
    ],
    quiz: [
      {
        question: '¿Qué tipo tiene `x` en una rama donde TS descartó todos los miembros de la unión?',
        options: ['unknown', 'never', 'undefined'],
        answer: 1,
        explanation: '`never` es el tipo sin valores posibles.',
      },
    ],
  },

  d08: {
    exercises: [
      {
        id: 'd08-e1',
        title: 'Tipos de función',
        language: 'typescript',
        prompt:
          "Define `type Operacion = (a: number, b: number) => number`. Usa ese tipo en el objeto `operaciones` (sumar, restar, multiplicar) y en `aplicar(op, a, b)`. Escribe también `componer(f, g)` que reciba dos funciones `(n: number) => number` y devuelva otra que aplique `g` y luego `f`.",
        starter: `const operaciones = {
  sumar: (a, b) => a + b,
  restar: (a, b) => a - b,
  multiplicar: (a, b) => a * b,
}

function aplicar(op, a, b) {
  return op(a, b)
}

function componer(f, g) {
}
`,
        solution: `type Operacion = (a: number, b: number) => number

const operaciones: { sumar: Operacion; restar: Operacion; multiplicar: Operacion } = {
  sumar: (a, b) => a + b,
  restar: (a, b) => a - b,
  multiplicar: (a, b) => a * b,
}

function aplicar(op: Operacion, a: number, b: number): number {
  return op(a, b)
}

function componer(f: (n: number) => number, g: (n: number) => number): (n: number) => number {
  return (n) => f(g(n))
}
`,
        hints: [
          'Anota el objeto: `{ sumar: Operacion; restar: Operacion; multiplicar: Operacion }`. Así `a` y `b` se infieren.',
          '`componer` devuelve `(n) => f(g(n))`.',
        ],
        tests: `
test('aplicar', () => expect(aplicar(operaciones.multiplicar, 3, 4)).toBe(12))
test('componer', () => expect(componer((n) => n + 1, (n) => n * 10)(2)).toBe(21))`,
        typeTests: `
type _o = Expect<Equal<Operacion, (a: number, b: number) => number>>
// @ts-expect-error una operación recibe números
aplicar(operaciones.sumar, '1', 2)`,
      },
      {
        id: 'd08-e2',
        title: 'Call signature',
        language: 'typescript',
        prompt:
          "Define `type Saludador` como una función `(nombre: string) => string` que además tiene la propiedad `idioma: 'es' | 'en'` (usa una *call signature*). Implementa `crearSaludador(idioma)` que devuelva un `Saludador` (`'Hola, Ada'` o `'Hello, Ada'`).",
        starter: `type Saludador = unknown

function crearSaludador(idioma: 'es' | 'en'): Saludador {
}
`,
        solution: `type Saludador = {
  (nombre: string): string
  idioma: 'es' | 'en'
}

function crearSaludador(idioma: 'es' | 'en'): Saludador {
  const saludar = (nombre: string) => (idioma === 'es' ? 'Hola, ' : 'Hello, ') + nombre
  saludar.idioma = idioma
  return saludar
}
`,
        hints: ['En un tipo de objeto: `(nombre: string): string` y `idioma: ...`.', 'Crea la función en una `const` y luego asígnale `.idioma`.'],
        tests: `
test('español', () => expect(crearSaludador('es')('Ada')).toBe('Hola, Ada'))
test('inglés', () => expect(crearSaludador('en')('Ada')).toBe('Hello, Ada'))
test('idioma', () => expect(crearSaludador('en').idioma).toBe('en'))`,
        typeTests: `
declare const _s: Saludador
const _r: string = _s('x')
const _i: 'es' | 'en' = _s.idioma`,
      },
    ],
    quiz: [
      {
        question: '¿Se puede pasar `() => 42` donde se espera `() => void`?',
        options: ['Sí, el valor de retorno se ignora', 'No, debe devolver undefined'],
        answer: 0,
        explanation: 'Por eso `arr.forEach((x) => lista.push(x))` funciona.',
      },
    ],
  },

  d09: {
    exercises: [
      {
        id: 'd09-e1',
        title: 'Opcionales y rest',
        language: 'typescript',
        prompt: `Implementa:

- \`formatearPrecio(n: number, moneda?: string)\`: \`'12.50 EUR'\`; sin moneda, \`'12.50'\`.
- \`maximo(primero: number, ...resto: number[])\`: el mayor. Exige **al menos un** argumento.`,
        starter: 'function formatearPrecio(n: number, moneda: string): string {\n}\n\nfunction maximo(...nums: number[]): number {\n  return Math.max(...nums)\n}\n',
        solution: `function formatearPrecio(n: number, moneda?: string): string {
  const base = n.toFixed(2)
  return moneda === undefined ? base : \`\${base} \${moneda}\`
}

function maximo(primero: number, ...resto: number[]): number {
  return Math.max(primero, ...resto)
}
`,
        hints: ['`moneda?: string`', 'Un parámetro obligatorio antes del rest garantiza al menos uno.'],
        tests: `
test('con moneda', () => expect(formatearPrecio(12.5, 'EUR')).toBe('12.50 EUR'))
test('sin moneda', () => expect(formatearPrecio(12.5)).toBe('12.50'))
test('maximo', () => expect(maximo(3, 9, 2)).toBe(9))
test('maximo de uno', () => expect(maximo(-4)).toBe(-4))`,
        typeTests: `
formatearPrecio(1)
// @ts-expect-error necesita al menos un número
maximo()`,
      },
      {
        id: 'd09-e2',
        title: 'Desestructurar con tipo',
        language: 'typescript',
        prompt:
          "Define `type OpcionesBoton` con `texto` (string), `variante` opcional (`'primario' | 'secundario'`) y `deshabilitado` opcional (boolean). Implementa `claseBoton({ ... }: OpcionesBoton)` desestructurando con defectos `'primario'` y `false`. Devuelve `'btn btn-primario'`, añadiendo `' btn-off'` si está deshabilitado.",
        starter: 'function claseBoton(opciones) {\n}\n',
        solution: `type OpcionesBoton = {
  texto: string
  variante?: 'primario' | 'secundario'
  deshabilitado?: boolean
}

function claseBoton({ variante = 'primario', deshabilitado = false }: OpcionesBoton): string {
  return \`btn btn-\${variante}\` + (deshabilitado ? ' btn-off' : '')
}
`,
        hints: ["`function claseBoton({ variante = 'primario', deshabilitado = false }: OpcionesBoton)`"],
        tests: `
test('defecto', () => expect(claseBoton({ texto: 'OK' })).toBe('btn btn-primario'))
test('secundario off', () => expect(claseBoton({ texto: 'OK', variante: 'secundario', deshabilitado: true })).toBe('btn btn-secundario btn-off'))`,
        typeTests: `
// @ts-expect-error variante inválida
claseBoton({ texto: 'x', variante: 'peligro' })
// @ts-expect-error falta texto
claseBoton({})`,
      },
    ],
    quiz: [
      {
        question: 'Al tipar un callback, ¿conviene escribir `(valor: T, indice?: number) => void`?',
        options: ['Sí, por si no se usa el índice', 'No: escribe `indice: number`; quien implementa puede ignorarlo'],
        answer: 1,
        explanation: 'Una función con menos parámetros siempre es asignable a una con más.',
      },
    ],
  },

  d10: {
    exercises: [
      {
        id: 'd10-e1',
        title: 'crearFecha',
        language: 'typescript',
        prompt:
          'Escribe sobrecargas para `crearFecha`: una que reciba un `timestamp` y otra que reciba `dia, mes, anio` (mes de 1 a 12). Llamarla con 2 argumentos debe ser un error.',
        starter: 'function crearFecha(a: number, b?: number, c?: number): Date {\n  if (b !== undefined && c !== undefined) return new Date(c, b - 1, a)\n  return new Date(a)\n}\n',
        solution: `function crearFecha(timestamp: number): Date
function crearFecha(dia: number, mes: number, anio: number): Date
function crearFecha(a: number, b?: number, c?: number): Date {
  if (b !== undefined && c !== undefined) return new Date(c, b - 1, a)
  return new Date(a)
}
`,
        hints: ['Escribe dos líneas `function crearFecha(...): Date` sin cuerpo, justo encima de la implementación.'],
        tests: `
test('día, mes, año', () => expect(crearFecha(15, 3, 2026).getMonth()).toBe(2))
test('timestamp', () => expect(crearFecha(0).getTime()).toBe(0))`,
        typeTests: `
// @ts-expect-error no hay sobrecarga de 2 argumentos
crearFecha(1, 2)`,
      },
      {
        id: 'd10-e2',
        title: 'Retorno según argumento',
        language: 'typescript',
        prompt:
          "Escribe `invertir` con sobrecargas: con un `string` devuelve `string` invertido; con un `number[]` devuelve `number[]` invertido (sin mutar). Los tests de tipos comprueban que cada llamada tenga el tipo de retorno preciso.",
        starter: "function invertir(x: string | number[]): string | number[] {\n  if (typeof x === 'string') return [...x].reverse().join('')\n  return [...x].reverse()\n}\n",
        solution: `function invertir(x: string): string
function invertir(x: number[]): number[]
function invertir(x: string | number[]): string | number[] {
  if (typeof x === 'string') return [...x].reverse().join('')
  return [...x].reverse()
}
`,
        hints: ['Dos sobrecargas encima de la implementación actual.'],
        tests: `
test('string', () => expect(invertir('hola')).toBe('aloh'))
test('array', () => expect(invertir([1, 2, 3])).toEqual([3, 2, 1]))`,
        typeTests: `
const _s: string = invertir('abc')
const _n: number[] = invertir([1])`,
      },
    ],
    quiz: [
      {
        question: '¿La firma de implementación es visible para quien llama la función?',
        options: ['Sí', 'No, solo las sobrecargas'],
        answer: 1,
        explanation: 'Desde fuera solo se ven las firmas de sobrecarga.',
      },
      {
        question: 'Si el retorno es siempre `number`, ¿sobrecargas o unión en el parámetro?',
        options: ['Sobrecargas', 'Unión'],
        answer: 1,
        explanation: 'Las sobrecargas solo valen la pena cuando el retorno depende del argumento.',
      },
    ],
  },

  d11: {
    exercises: [
      {
        id: 'd11-e1',
        title: 'void y never',
        language: 'typescript',
        prompt:
          "Implementa `fallar(mensaje: string): never` (lanza un Error) y `dividir(a: number, b: number): number` que use `fallar('División entre 0')` cuando `b` sea 0. Implementa también `ejecutarTodos(fns: (() => void)[]): number` que ejecute todas las funciones y devuelva cuántas ejecutó.",
        starter: 'function fallar(mensaje: string) {\n}\n\nfunction dividir(a: number, b: number): number {\n  return a / b\n}\n\nfunction ejecutarTodos(fns) {\n}\n',
        solution: `function fallar(mensaje: string): never {
  throw new Error(mensaje)
}

function dividir(a: number, b: number): number {
  if (b === 0) fallar('División entre 0')
  return a / b
}

function ejecutarTodos(fns: (() => void)[]): number {
  for (const fn of fns) fn()
  return fns.length
}
`,
        hints: ['`): never { throw new Error(mensaje) }`'],
        tests: `${ERROR_MSG}
test('dividir', () => expect(dividir(10, 4)).toBe(2.5))
test('dividir entre 0', () => expect(__mensaje(() => dividir(1, 0))).toBe('División entre 0'))
test('ejecutarTodos', () => {
  let __n = 0
  expect(ejecutarTodos([() => { __n++ }, () => { __n += 10 }])).toBe(2)
  expect(__n).toBe(11)
})`,
        typeTests: `
type _f = Expect<Equal<ReturnType<typeof fallar>, never>>
ejecutarTodos([() => 42, () => 'x'])`,
      },
      {
        id: 'd11-e2',
        title: 'object y unknown',
        language: 'typescript',
        prompt:
          "Implementa `aTexto(valor: unknown): string`: strings tal cual, instancias de `Error` → su `message`, objetos (no null) → `JSON.stringify`, y el resto → `String(valor)`. Implementa también `contarClaves(o: object): number`.",
        starter: 'function aTexto(valor: unknown): string {\n  return valor.toString()\n}\n\nfunction contarClaves(o) {\n}\n',
        solution: `function aTexto(valor: unknown): string {
  if (typeof valor === 'string') return valor
  if (valor instanceof Error) return valor.message
  if (typeof valor === 'object' && valor !== null) return JSON.stringify(valor)
  return String(valor)
}

function contarClaves(o: object): number {
  return Object.keys(o).length
}
`,
        hints: ['Comprueba `Error` antes que `object` (un Error también es un objeto).'],
        tests: `
test('string', () => expect(aTexto('hola')).toBe('hola'))
test('error', () => expect(aTexto(new Error('mal'))).toBe('mal'))
test('objeto', () => expect(aTexto({ a: 1 })).toBe('{"a":1}'))
test('null', () => expect(aTexto(null)).toBe('null'))
test('contarClaves', () => expect(contarClaves({ a: 1, b: 2 })).toBe(2))`,
        typeTests: `
// @ts-expect-error object no acepta primitivos
contarClaves('hola')`,
      },
    ],
    quiz: [
      {
        question: '¿Cuál acepta el valor `5`?',
        options: ['object', '{}', 'Ninguno'],
        answer: 1,
        explanation: '`{}` acepta cualquier valor no nulo, incluidos primitivos. `object` solo no primitivos.',
      },
    ],
  },

  d12: {
    exercises: [
      {
        id: 'd12-e1',
        title: 'readonly',
        language: 'typescript',
        prompt:
          "Marca `id` y `creado` como `readonly` en `Documento`. Luego corrige `renombrar` para que **no** mute el documento: debe devolver uno nuevo con el título cambiado.",
        starter: `interface Documento {
  id: number
  titulo: string
  creado: string
}

function renombrar(doc: Documento, titulo: string): Documento {
  doc.titulo = titulo
  return doc
}
`,
        solution: `interface Documento {
  readonly id: number
  titulo: string
  readonly creado: string
}

function renombrar(doc: Documento, titulo: string): Documento {
  return { ...doc, titulo }
}
`,
        hints: ['`readonly id: number`', '`return { ...doc, titulo }`'],
        tests: `
const __d = { id: 1, titulo: 'A', creado: '2026-01-01' }
test('renombra', () => expect(renombrar(__d, 'B').titulo).toBe('B'))
test('no muta', () => expect(__d.titulo).toBe('A'))`,
        typeTests: `
declare const _d: Documento
// @ts-expect-error id es readonly
_d.id = 2
// @ts-expect-error creado es readonly
_d.creado = 'x'
_d.titulo = 'ok'`,
      },
      {
        id: 'd12-e2',
        title: 'Diccionario',
        language: 'typescript',
        prompt:
          "Define `interface Diccionario` con una index signature de string a string. Implementa `traducir(dic: Diccionario, texto: string): string` que traduzca cada palabra (separadas por espacio); las que no estén en el diccionario se dejan igual.",
        starter: 'function traducir(dic, texto) {\n}\n',
        solution: `interface Diccionario {
  [palabra: string]: string
}

function traducir(dic: Diccionario, texto: string): string {
  return texto
    .split(' ')
    .map((p) => (p in dic ? dic[p] : p))
    .join(' ')
}
`,
        hints: ['`[palabra: string]: string`', 'Comprueba con `p in dic`: TS asume que `dic[p]` siempre existe.'],
        tests: `
test('traduce', () => expect(traducir({ hola: 'hello', mundo: 'world' }, 'hola mundo cruel')).toBe('hello world cruel'))`,
        typeTests: `
const _ok: Diccionario = { a: 'b' }
// @ts-expect-error los valores deben ser strings
const _mal: Diccionario = { a: 1 }`,
      },
    ],
    quiz: [
      {
        question: 'Con `readonly dueño: { nombre: string }`, ¿se puede hacer `casa.dueño.nombre = "x"`?',
        options: ['Sí, readonly es superficial', 'No'],
        answer: 0,
        explanation: 'Solo impide reasignar `dueño`, no modificar su contenido.',
      },
    ],
  },

  d13: {
    exercises: [
      {
        id: 'd13-e1',
        title: 'Componer interfaces',
        language: 'typescript',
        prompt: `Define:

- \`interface ConId { id: number }\`
- \`interface ConFechas { creado: string; actualizado: string }\`
- \`interface Usuario\` que extienda **ambas** y añada \`email: string\`.

Implementa \`tocar(u: Usuario, fecha: string): Usuario\` que devuelva una copia con \`actualizado\` cambiado.`,
        starter: 'function tocar(u, fecha) {\n}\n',
        solution: `interface ConId {
  id: number
}

interface ConFechas {
  creado: string
  actualizado: string
}

interface Usuario extends ConId, ConFechas {
  email: string
}

function tocar(u: Usuario, fecha: string): Usuario {
  return { ...u, actualizado: fecha }
}
`,
        hints: ['`interface Usuario extends ConId, ConFechas { ... }`'],
        tests: `
test('tocar', () => expect(tocar({ id: 1, email: 'a', creado: 'x', actualizado: 'x' }, 'y').actualizado).toBe('y'))`,
        typeTests: `
const _u: Usuario = { id: 1, email: 'a', creado: 'x', actualizado: 'y' }
const _id: ConId = _u
// @ts-expect-error falta email
const _mal: Usuario = { id: 1, creado: 'x', actualizado: 'y' }`,
      },
      {
        id: 'd13-e2',
        title: 'Intersección y permisos',
        language: 'typescript',
        prompt:
          "Con `Usuario` dado, define `type Admin = Usuario & { permisos: string[] }`. Implementa `puede(u: Usuario | Admin, permiso: string): boolean`: un usuario normal nunca puede; un admin puede si tiene el permiso o `'*'`.",
        starter: `interface Usuario {
  nombre: string
}

function puede(u: Usuario, permiso: string): boolean {
  return u.permisos.includes(permiso)
}
`,
        solution: `interface Usuario {
  nombre: string
}

type Admin = Usuario & { permisos: string[] }

function puede(u: Usuario | Admin, permiso: string): boolean {
  if (!('permisos' in u)) return false
  return u.permisos.includes(permiso) || u.permisos.includes('*')
}
`,
        hints: ["Usa `'permisos' in u` para estrechar."],
        tests: `
test('usuario normal', () => expect(puede({ nombre: 'a' }, 'borrar')).toBe(false))
test('admin con permiso', () => expect(puede({ nombre: 'a', permisos: ['borrar'] }, 'borrar')).toBe(true))
test('admin comodín', () => expect(puede({ nombre: 'a', permisos: ['*'] }, 'x')).toBe(true))
test('admin sin permiso', () => expect(puede({ nombre: 'a', permisos: ['leer'] }, 'x')).toBe(false))`,
        typeTests: `
type _a = Expect<Equal<Admin['permisos'], string[]>>`,
      },
    ],
    quiz: [
      {
        question: '¿Qué tipo tiene `x` en `{ x: string } & { x: number }`?',
        options: ['string | number', 'never', 'Error de compilación'],
        answer: 1,
        explanation: 'Ningún valor es a la vez string y number. `extends` habría dado un error claro.',
      },
    ],
  },

  d14: {
    exercises: [
      {
        id: 'd14-e1',
        title: 'Devolver tuplas',
        language: 'typescript',
        prompt:
          "Implementa `minMax(nums: readonly number[]): [number, number]` y `crearEstado(inicial: number)` que devuelva una tupla `[leer, escribir]`: `leer()` devuelve el valor actual y `escribir(v)` lo cambia (como un `useState` mínimo). Anota el retorno de `crearEstado` como tupla.",
        starter: 'function minMax(nums: number[]) {\n  return [Math.min(...nums), Math.max(...nums)]\n}\n\nfunction crearEstado(inicial: number) {\n}\n',
        solution: `function minMax(nums: readonly number[]): [number, number] {
  return [Math.min(...nums), Math.max(...nums)]
}

function crearEstado(inicial: number): [() => number, (v: number) => void] {
  let valor = inicial
  return [() => valor, (v) => { valor = v }]
}
`,
        hints: ['Sin anotar, TS infiere `number[]`, no una tupla.', 'Retorno: `[() => number, (v: number) => void]`.'],
        tests: `
test('minMax', () => expect(minMax([3, 1, 4])).toEqual([1, 4]))
test('crearEstado', () => {
  const [__leer, __escribir] = crearEstado(1)
  __escribir(5)
  expect(__leer()).toBe(5)
})`,
        typeTests: `
type _m = Expect<Equal<ReturnType<typeof minMax>, [number, number]>>
type _e = Expect<Equal<ReturnType<typeof crearEstado>, [() => number, (v: number) => void]>>
const _fijos = [1, 2, 3] as const
minMax(_fijos)`,
      },
      {
        id: 'd14-e2',
        title: 'Entradas tipadas',
        language: 'typescript',
        prompt:
          "Define `type Entrada = [clave: string, valor: number]`. Implementa `aObjeto(entradas: readonly Entrada[]): Record<string, number>` y `ordenarPorValor(entradas: readonly Entrada[]): Entrada[]` (de mayor a menor, sin mutar).",
        starter: 'function aObjeto(entradas) {\n}\n\nfunction ordenarPorValor(entradas) {\n}\n',
        solution: `type Entrada = [clave: string, valor: number]

function aObjeto(entradas: readonly Entrada[]): Record<string, number> {
  return Object.fromEntries(entradas)
}

function ordenarPorValor(entradas: readonly Entrada[]): Entrada[] {
  return [...entradas].sort((a, b) => b[1] - a[1])
}
`,
        hints: ['`Object.fromEntries` convierte pares en objeto.', 'Copia antes de ordenar: `[...entradas].sort(...)`.'],
        tests: `
const __e: Entrada[] = [['a', 1], ['b', 3], ['c', 2]]
test('aObjeto', () => expect(aObjeto(__e)).toEqual({ a: 1, b: 3, c: 2 }))
test('ordenar', () => expect(ordenarPorValor(__e).map((x) => x[0])).toEqual(['b', 'c', 'a']))
test('no muta', () => expect(__e[0][0]).toBe('a'))`,
        typeTests: `
type _t = Expect<Equal<Entrada, [clave: string, valor: number]>>
// @ts-expect-error el segundo elemento es number
const _mal: Entrada = ['a', 'b']`,
      },
    ],
    quiz: [
      {
        question: "¿Qué tipo infiere TS para `const x = ['a', 1]`?",
        options: ['[string, number]', '(string | number)[]'],
        answer: 1,
        explanation: 'TS infiere arrays, no tuplas. Usa una anotación o `as const`.',
      },
      {
        question: '¿Qué parámetro acepta tanto `number[]` como `readonly number[]`?',
        options: ['nums: number[]', 'nums: readonly number[]'],
        answer: 1,
        explanation: 'Un array mutable se puede tratar como readonly, pero no al revés.',
      },
    ],
  },

  d15: {
    exercises: [
      {
        id: 'd15-e1',
        title: 'Clase Vector',
        language: 'typescript',
        prompt:
          'Completa la clase `Vector`: los campos `x` e `y` deben inicializarse en el constructor (con defectos `0`). Añade `sumar(otro: Vector): Vector`, `escalar(k: number): Vector` (ambos devuelven vectores **nuevos**) y un getter `longitud`.',
        starter: `class Vector {
  x: number
  y: number
}
`,
        solution: `class Vector {
  x: number
  y: number

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  sumar(otro: Vector): Vector {
    return new Vector(this.x + otro.x, this.y + otro.y)
  }

  escalar(k: number): Vector {
    return new Vector(this.x * k, this.y * k)
  }

  get longitud(): number {
    return Math.hypot(this.x, this.y)
  }
}
`,
        hints: ['El error "has no initializer" se arregla con un constructor.', '`get longitud(): number { ... }`'],
        tests: `
test('defectos', () => expect(new Vector()).toEqual({ x: 0, y: 0 }))
test('sumar', () => expect(new Vector(1, 2).sumar(new Vector(3, 4))).toEqual({ x: 4, y: 6 }))
test('escalar', () => expect(new Vector(1, 2).escalar(3)).toEqual({ x: 3, y: 6 }))
test('longitud', () => expect(new Vector(3, 4).longitud).toBe(5))
test('inmutable', () => {
  const __v = new Vector(1, 1)
  __v.sumar(new Vector(1, 1))
  expect(__v.x).toBe(1)
})`,
        typeTests: `
// @ts-expect-error longitud no tiene setter
new Vector().longitud = 5`,
      },
      {
        id: 'd15-e2',
        title: 'Getter y setter',
        language: 'typescript',
        prompt:
          'Implementa `Temperatura` con un campo `celsius` (constructor) y un getter/setter `fahrenheit`. Además, el campo `escala` debe ser `readonly` con valor `\'C\'`.',
        starter: 'class Temperatura {\n}\n',
        solution: `class Temperatura {
  readonly escala = 'C'
  celsius: number

  constructor(celsius: number) {
    this.celsius = celsius
  }

  get fahrenheit(): number {
    return (this.celsius * 9) / 5 + 32
  }

  set fahrenheit(f: number) {
    this.celsius = ((f - 32) * 5) / 9
  }
}
`,
        hints: ['`get fahrenheit()` y `set fahrenheit(f: number)`.'],
        tests: `
test('get', () => expect(new Temperatura(100).fahrenheit).toBe(212))
test('set', () => {
  const __t = new Temperatura(0)
  __t.fahrenheit = 50
  expect(__t.celsius).toBe(10)
})`,
        typeTests: `
// @ts-expect-error escala es readonly
new Temperatura(0).escala = 'F'`,
      },
    ],
    quiz: [
      {
        question: 'Con `strict`, ¿qué pasa con `class A { nombre: string }` sin constructor?',
        options: ['Nada', 'Error: no se inicializa nombre', 'nombre vale \'\''],
        answer: 1,
        explanation: 'Es `strictPropertyInitialization`.',
      },
    ],
  },

  d16: {
    exercises: [
      {
        id: 'd16-e1',
        title: 'private y readonly',
        language: 'typescript',
        prompt:
          "Haz que `saldo` sea `private` (solo se lee mediante `consultar()`) y `titular` `readonly`. Usa **parameter properties** en el constructor para `titular`.",
        starter: `class Cuenta {
  saldo = 0
  titular: string

  constructor(titular: string) {
    this.titular = titular
  }

  depositar(m: number) {
    this.saldo += m
  }

  consultar(): number {
    return this.saldo
  }
}
`,
        solution: `class Cuenta {
  private saldo = 0

  constructor(readonly titular: string) {}

  depositar(m: number) {
    this.saldo += m
  }

  consultar(): number {
    return this.saldo
  }
}
`,
        hints: ['`private saldo = 0`', '`constructor(readonly titular: string) {}`'],
        tests: `
test('funciona', () => {
  const __c = new Cuenta('Ana')
  __c.depositar(50)
  expect(__c.consultar()).toBe(50)
  expect(__c.titular).toBe('Ana')
})`,
        typeTests: `
const _c = new Cuenta('Ana')
// @ts-expect-error saldo es privado
_c.saldo
// @ts-expect-error titular es readonly
_c.titular = 'Luis'`,
      },
      {
        id: 'd16-e2',
        title: 'protected',
        language: 'typescript',
        prompt:
          'En `Empleado`, `salario` debe ser `protected`: accesible en `Gerente` (para calcular el bono, 20% del salario) pero no desde fuera.',
        starter: `class Empleado {
  constructor(public nombre: string, private salario: number) {}
}

class Gerente extends Empleado {
  bono(): number {
    return this.salario * 0.2
  }
}
`,
        solution: `class Empleado {
  constructor(public nombre: string, protected salario: number) {}
}

class Gerente extends Empleado {
  bono(): number {
    return this.salario * 0.2
  }
}
`,
        hints: ['Cambia `private` por `protected`.'],
        tests: `
test('bono', () => expect(new Gerente('Ana', 1000).bono()).toBe(200))`,
        typeTests: `
// @ts-expect-error salario no es accesible desde fuera
new Gerente('Ana', 1000).salario`,
      },
    ],
    quiz: [
      {
        question: '¿Cuál impide el acceso también en runtime?',
        options: ['private', '#campo', 'protected'],
        answer: 1,
        explanation: '`private` y `protected` solo los comprueba el compilador.',
      },
    ],
  },

  d17: {
    exercises: [
      {
        id: 'd17-e1',
        title: 'Clase abstracta',
        language: 'typescript',
        prompt: `Crea:

- \`interface Forma { nombre: string; area(): number }\`
- \`abstract class FiguraBase implements Forma\` con \`nombre\` (constructor), \`area()\` abstracto y \`describir()\` → \`'<nombre>: <área con 2 decimales>'\`.
- \`class Rectangulo extends FiguraBase\` con \`ancho\` y \`alto\` (nombre \`'Rectángulo'\`).`,
        starter: 'class FiguraBase {\n}\n\nclass Rectangulo {\n}\n',
        solution: `interface Forma {
  nombre: string
  area(): number
}

abstract class FiguraBase implements Forma {
  constructor(readonly nombre: string) {}

  abstract area(): number

  describir(): string {
    return \`\${this.nombre}: \${this.area().toFixed(2)}\`
  }
}

class Rectangulo extends FiguraBase {
  constructor(private ancho: number, private alto: number) {
    super('Rectángulo')
  }

  area(): number {
    return this.ancho * this.alto
  }
}
`,
        hints: ['`abstract area(): number` (sin cuerpo).', 'En `Rectangulo`, llama a `super(\'Rectángulo\')`.'],
        tests: `
test('describir', () => expect(new Rectangulo(2, 3).describir()).toBe('Rectángulo: 6.00'))`,
        typeTests: `
const _f: Forma = new Rectangulo(1, 1)
// @ts-expect-error no se puede instanciar una clase abstracta
new FiguraBase('x')`,
      },
      {
        id: 'd17-e2',
        title: 'static y constructor privado',
        language: 'typescript',
        prompt:
          "Implementa `Color` con constructor **privado** que recibe `hex`, y métodos estáticos `desdeRGB(r, g, b)` y `desdeHex(hex)` (valida que empiece por `#` y tenga 7 caracteres; si no, lanza `Error('Hex inválido')`). Añade un contador estático `creados` que cuente instancias.",
        starter: 'class Color {\n  constructor(public hex: string) {}\n}\n',
        solution: `class Color {
  static creados = 0

  private constructor(readonly hex: string) {
    Color.creados++
  }

  static desdeRGB(r: number, g: number, b: number): Color {
    const h = (n: number) => n.toString(16).padStart(2, '0')
    return new Color(\`#\${h(r)}\${h(g)}\${h(b)}\`)
  }

  static desdeHex(hex: string): Color {
    if (!hex.startsWith('#') || hex.length !== 7) throw new Error('Hex inválido')
    return new Color(hex)
  }
}
`,
        hints: ['`private constructor(...)`', '`static creados = 0` y `Color.creados++` en el constructor.'],
        tests: `${ERROR_MSG}
test('desdeRGB', () => expect(Color.desdeRGB(255, 0, 128).hex).toBe('#ff0080'))
test('desdeHex', () => expect(Color.desdeHex('#00ff00').hex).toBe('#00ff00'))
test('hex inválido', () => expect(__mensaje(() => Color.desdeHex('00ff00'))).toBe('Hex inválido'))
test('contador', () => {
  const __antes = Color.creados
  Color.desdeRGB(0, 0, 0)
  expect(Color.creados).toBe(__antes + 1)
})`,
        typeTests: `
// @ts-expect-error el constructor es privado
new Color('#000000')`,
      },
    ],
    quiz: [
      {
        question: '¿`implements` añade tipos a los parámetros de los métodos de la clase?',
        options: ['Sí', 'No, solo comprueba que la clase cumple la interfaz'],
        answer: 1,
        explanation: 'Sigues necesitando anotar los parámetros en la clase.',
      },
    ],
  },

  d18: {
    exercises: [
      {
        id: 'd18-e1',
        title: 'Máquina de estados de un pedido',
        language: 'typescript',
        prompt: 'Define `Pedido`, `Evento`, `assertNever`, `transicion` y `resumen` como describe la lección.',
        starter: `// Tipos
type Pedido = unknown
type Evento = unknown

function assertNever(x: never): never {
  throw new Error('Caso no manejado: ' + JSON.stringify(x))
}

function transicion(pedido: Pedido, evento: Evento): Pedido {
  return pedido
}

function resumen(pedido: Pedido): string {
  return ''
}
`,
        solution: `type Pedido =
  | { estado: 'carrito'; items: string[] }
  | { estado: 'pagado'; items: string[]; pagoId: string }
  | { estado: 'enviado'; items: string[]; pagoId: string; tracking: string }
  | { estado: 'entregado'; items: string[]; pagoId: string; tracking: string; fecha: string }
  | { estado: 'cancelado'; motivo: string }

type Evento =
  | { tipo: 'agregar'; item: string }
  | { tipo: 'pagar'; pagoId: string }
  | { tipo: 'enviar'; tracking: string }
  | { tipo: 'entregar'; fecha: string }
  | { tipo: 'cancelar'; motivo: string }

function assertNever(x: never): never {
  throw new Error('Caso no manejado: ' + JSON.stringify(x))
}

function invalida(pedido: Pedido, evento: Evento): never {
  throw new Error(\`Transición inválida: \${pedido.estado} → \${evento.tipo}\`)
}

function transicion(pedido: Pedido, evento: Evento): Pedido {
  switch (evento.tipo) {
    case 'agregar':
      if (pedido.estado !== 'carrito') return invalida(pedido, evento)
      return { ...pedido, items: [...pedido.items, evento.item] }
    case 'pagar':
      if (pedido.estado !== 'carrito' || pedido.items.length === 0) return invalida(pedido, evento)
      return { estado: 'pagado', items: pedido.items, pagoId: evento.pagoId }
    case 'enviar':
      if (pedido.estado !== 'pagado') return invalida(pedido, evento)
      return { ...pedido, estado: 'enviado', tracking: evento.tracking }
    case 'entregar':
      if (pedido.estado !== 'enviado') return invalida(pedido, evento)
      return { ...pedido, estado: 'entregado', fecha: evento.fecha }
    case 'cancelar':
      if (pedido.estado !== 'carrito' && pedido.estado !== 'pagado') return invalida(pedido, evento)
      return { estado: 'cancelado', motivo: evento.motivo }
    default:
      return assertNever(evento)
  }
}

function resumen(pedido: Pedido): string {
  switch (pedido.estado) {
    case 'carrito':
      return \`Carrito con \${pedido.items.length} items\`
    case 'pagado':
      return \`Pagado (\${pedido.pagoId})\`
    case 'enviado':
      return \`Enviado (\${pedido.tracking})\`
    case 'entregado':
      return \`Entregado el \${pedido.fecha}\`
    case 'cancelado':
      return \`Cancelado: \${pedido.motivo}\`
    default:
      return assertNever(pedido)
  }
}
`,
        hints: [
          'Una unión de 5 objetos para `Pedido`, cada uno con su literal en `estado`.',
          'Una función auxiliar `invalida(pedido, evento): never` evita repetir el `throw`.',
          'Al hacer spread de un pedido `pagado` para pasar a `enviado`, sobrescribe `estado` y añade `tracking`.',
        ],
        tests: `${ERROR_MSG}
const __vacio: Pedido = { estado: 'carrito', items: [] }
function __flujo(...evs: Evento[]): Pedido { return evs.reduce(transicion, __vacio) }
test('agregar', () => expect(resumen(__flujo({ tipo: 'agregar', item: 'a' }, { tipo: 'agregar', item: 'b' }))).toBe('Carrito con 2 items'))
test('flujo completo', () => expect(resumen(__flujo(
  { tipo: 'agregar', item: 'a' },
  { tipo: 'pagar', pagoId: 'P1' },
  { tipo: 'enviar', tracking: 'T1' },
  { tipo: 'entregar', fecha: '2026-03-01' },
))).toBe('Entregado el 2026-03-01'))
test('pagar carrito vacío', () => expect(__mensaje(() => __flujo({ tipo: 'pagar', pagoId: 'P' }))).toBe('Transición inválida: carrito → pagar'))
test('cancelar enviado', () => expect(__mensaje(() => __flujo(
  { tipo: 'agregar', item: 'a' }, { tipo: 'pagar', pagoId: 'P' }, { tipo: 'enviar', tracking: 'T' }, { tipo: 'cancelar', motivo: 'x' },
))).toBe('Transición inválida: enviado → cancelar'))
test('cancelar pagado', () => expect(resumen(__flujo(
  { tipo: 'agregar', item: 'a' }, { tipo: 'pagar', pagoId: 'P' }, { tipo: 'cancelar', motivo: 'me arrepentí' },
))).toBe('Cancelado: me arrepentí'))
test('pagado conserva items', () => {
  const __p = __flujo({ tipo: 'agregar', item: 'a' }, { tipo: 'pagar', pagoId: 'P9' })
  expect(__p).toEqual({ estado: 'pagado', items: ['a'], pagoId: 'P9' })
})`,
        typeTests: `
type _e = Expect<Equal<Pedido['estado'], 'carrito' | 'pagado' | 'enviado' | 'entregado' | 'cancelado'>>
type _t = Expect<Equal<Evento['tipo'], 'agregar' | 'pagar' | 'enviar' | 'entregar' | 'cancelar'>>
// @ts-expect-error un pedido pagado necesita pagoId
const _p: Pedido = { estado: 'pagado', items: [] }
// @ts-expect-error un pedido cancelado no tiene items
const _c: Pedido = { estado: 'cancelado', motivo: 'x', items: [] }`,
      },
    ],
    quiz: [
      {
        question: '¿Qué ventaja tiene modelar el pedido como discriminated union frente a un objeto con propiedades opcionales?',
        options: [
          'Es más corto',
          'Los estados imposibles (enviado sin tracking) no se pueden representar',
          'Es más rápido en runtime',
        ],
        answer: 1,
        explanation: '"Make impossible states impossible": el tipo solo admite combinaciones válidas.',
      },
    ],
  },

  d19: {
    exercises: [
      {
        id: 'd19-e1',
        title: 'Inventario con clases',
        language: 'typescript',
        prompt: 'Implementa `Producto`, `StockInsuficienteError` e `Inventario` como describe la lección.',
        starter: `interface Producto {
}

class StockInsuficienteError extends Error {
}

class Inventario {
}
`,
        solution: `interface Producto {
  readonly sku: string
  nombre: string
  precio: number
}

class StockInsuficienteError extends Error {
  readonly sku: string
  readonly pedido: number
  readonly disponible: number

  constructor(sku: string, pedido: number, disponible: number) {
    super(\`Stock insuficiente de \${sku}: pedido \${pedido}, disponible \${disponible}\`)
    this.name = 'StockInsuficienteError'
    this.sku = sku
    this.pedido = pedido
    this.disponible = disponible
  }
}

class Inventario {
  private stock = new Map<string, { producto: Producto; cantidad: number }>()

  agregar(producto: Producto, cantidad: number): void {
    const actual = this.stock.get(producto.sku)?.cantidad ?? 0
    this.stock.set(producto.sku, { producto, cantidad: actual + cantidad })
  }

  retirar(sku: string, cantidad: number): void {
    const entrada = this.stock.get(sku)
    const disponible = entrada?.cantidad ?? 0
    if (!entrada || cantidad > disponible) throw new StockInsuficienteError(sku, cantidad, disponible)
    entrada.cantidad -= cantidad
  }

  cantidadDe(sku: string): number {
    return this.stock.get(sku)?.cantidad ?? 0
  }

  buscar(sku: string): Producto | undefined {
    return this.stock.get(sku)?.producto
  }

  get valorTotal(): number {
    let total = 0
    for (const { producto, cantidad } of this.stock.values()) total += producto.precio * cantidad
    return total
  }

  listar(): readonly Producto[] {
    return [...this.stock.values()]
      .filter((e) => e.cantidad > 0)
      .map((e) => e.producto)
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  }
}
`,
        hints: [
          '`?.` y `??` simplifican leer del Map: `this.stock.get(sku)?.cantidad ?? 0`.',
          'En el error, llama a `super(mensaje)` antes de asignar las propiedades.',
          '`listar` puede usar `[...this.stock.values()]` y luego filter/map/sort.',
        ],
        tests: `
const __teclado: Producto = { sku: 'T1', nombre: 'Teclado', precio: 50 }
const __raton: Producto = { sku: 'R1', nombre: 'Ratón', precio: 20 }
const __monitor: Producto = { sku: 'M1', nombre: 'Monitor', precio: 200 }
function __inv() {
  const i = new Inventario()
  i.agregar(__teclado, 2); i.agregar(__raton, 5); i.agregar(__monitor, 1)
  return i
}
test('agregar suma', () => {
  const __i = __inv(); __i.agregar(__teclado, 3)
  expect(__i.cantidadDe('T1')).toBe(5)
})
test('retirar', () => {
  const __i = __inv(); __i.retirar('R1', 2)
  expect(__i.cantidadDe('R1')).toBe(3)
})
test('stock insuficiente', () => {
  let __e: unknown
  try { __inv().retirar('M1', 3) } catch (e) { __e = e }
  expect(__e instanceof StockInsuficienteError).toBe(true)
  expect((__e as StockInsuficienteError).message).toBe('Stock insuficiente de M1: pedido 3, disponible 1')
  expect((__e as StockInsuficienteError).disponible).toBe(1)
})
test('sku inexistente', () => {
  let __e: unknown
  try { __inv().retirar('X', 1) } catch (e) { __e = e }
  expect((__e as StockInsuficienteError).disponible).toBe(0)
})
test('buscar', () => expect(__inv().buscar('X')).toBe(undefined))
test('valorTotal', () => expect(__inv().valorTotal).toBe(400))
test('listar ordena y omite agotados', () => {
  const __i = __inv(); __i.retirar('M1', 1)
  expect(__i.listar().map((p) => p.nombre)).toEqual(['Ratón', 'Teclado'])
})`,
        typeTests: `
const _i = new Inventario()
// @ts-expect-error el Map es privado
_i.stock
// @ts-expect-error valorTotal es solo lectura
_i.valorTotal = 1
// @ts-expect-error listar devuelve un array readonly
_i.listar().push({ sku: 'x', nombre: 'x', precio: 1 })
declare const _p: Producto
// @ts-expect-error sku es readonly
_p.sku = 'y'
type _b = Expect<Equal<ReturnType<Inventario['buscar']>, Producto | undefined>>`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué devolver `readonly Producto[]` en `listar`?',
        options: [
          'Para que quien llama no pueda modificar el array y creer que cambió el inventario',
          'Porque es más rápido',
          'Porque Map lo exige',
        ],
        answer: 0,
        explanation: 'Comunica que es una vista de solo lectura.',
      },
    ],
  },
}
