import type { UnitContent } from '../index'

// Bloque C: TypeScript fundamentos (c04 está en ts.ts).
// Los tests usan nombres con prefijo __ / _ para no chocar con variables del alumno.
export const unitsC: Record<string, UnitContent> = {
  c01: {
    exercises: [
      {
        id: 'c01-e1',
        title: 'El bug que TS encontró',
        language: 'typescript',
        prompt:
          'Este código en JavaScript devolvía `NaN` sin avisar. Con tipos, TS marca el error en rojo. Pasa el ratón por encima, lee el mensaje y arréglalo.',
        starter: `function precioFinal(producto: { precio: number; cantidad: number }) {
  return producto.precio * producto.cantidad
}

const total = precioFinal({ precio: 10, cantdad: 2 })
`,
        solution: `function precioFinal(producto: { precio: number; cantidad: number }) {
  return producto.precio * producto.cantidad
}

const total = precioFinal({ precio: 10, cantidad: 2 })
`,
        hints: ['Lee el final del mensaje: "Did you mean to write...?"'],
        tests: `
test('total es 20', () => expect(total).toBe(20))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué pasa con los tipos al compilar TypeScript a JavaScript?',
        options: ['Se convierten en comprobaciones en runtime', 'Se borran', 'Se guardan en un archivo aparte'],
        answer: 1,
        explanation: 'TS solo comprueba antes de ejecutar; el JS resultante no tiene tipos.',
      },
      {
        question: '¿Es código TypeScript válido cualquier archivo JavaScript?',
        options: ['Sí, TS es un superconjunto de JS (aunque puede mostrar errores de tipo)', 'No, hay que reescribirlo'],
        answer: 0,
        explanation: 'TS añade sintaxis encima de JS. Con `strict` verás errores, pero la sintaxis es válida.',
      },
    ],
  },

  c02: {
    exercises: [
      {
        id: 'c02-e1',
        title: 'Tres errores',
        language: 'typescript',
        prompt:
          'TypeScript detecta **tres** errores en este código que en JavaScript no lanzarían excepción al escribirlo (o lo harían tarde). Corrígelos. `describir()` debe devolver `\'ADA LOVELACE es adulta\'`.',
        starter: `const usuario = { nombre: 'Ada', apellido: 'Lovelace', edad: 36 }

function esAdulto() {
  return usuario.edad >= 18
}

function describir() {
  const nombre = (usuario.nombre + ' ' + usuario.apelido).toUppercase()
  if (esAdulto) {
    return nombre + ' es adulta'
  }
  return nombre + ' es menor'
}
`,
        solution: `const usuario = { nombre: 'Ada', apellido: 'Lovelace', edad: 36 }

function esAdulto() {
  return usuario.edad >= 18
}

function describir() {
  const nombre = (usuario.nombre + ' ' + usuario.apellido).toUpperCase()
  if (esAdulto()) {
    return nombre + ' es adulta'
  }
  return nombre + ' es menor'
}
`,
        hints: ['Un error es un typo en una propiedad.', 'Otro es un typo en un método de string.', 'El tercero: ¿estás llamando a la función?'],
        tests: `
test('describir', () => expect(describir()).toBe('ADA LOVELACE es adulta'))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué significa "estático" en "chequeo de tipos estático"?',
        options: ['Que los tipos no cambian', 'Que se comprueba sin ejecutar el código', 'Que solo funciona con constantes'],
        answer: 1,
        explanation: 'TS analiza el código fuente; nunca lo ejecuta.',
      },
      {
        question: '"Type \'string\' is not assignable to type \'number\'" significa...',
        options: ['Esperaba un string y le diste un number', 'Esperaba un number y le diste un string'],
        answer: 1,
        explanation: 'El patrón es "Type <lo que diste> is not assignable to type <lo que esperaba>".',
      },
    ],
  },

  c03: {
    exercises: [
      {
        id: 'c03-e1',
        title: 'Configura tsconfig',
        language: 'typescript',
        prompt: `Completa este objeto como si fuera un \`tsconfig.json\` para un proyecto que:

- genera JavaScript \`es2022\`,
- tiene todas las comprobaciones estrictas activadas,
- deja la salida en la carpeta \`dist\`,
- **no** genera JS si hay errores,
- compila solo la carpeta \`src\`.`,
        starter: `const tsconfig = {
  compilerOptions: {
    target: 'es5',
    strict: false,
  },
}
`,
        solution: `const tsconfig = {
  compilerOptions: {
    target: 'es2022',
    strict: true,
    outDir: 'dist',
    noEmitOnError: true,
  },
  include: ['src'],
}
`,
        hints: ['Las opciones son `target`, `strict`, `outDir` y `noEmitOnError`.', '`include` va fuera de `compilerOptions` y es un array.'],
        tests: `
const __o = tsconfig.compilerOptions as Record<string, unknown>
test('target es2022', () => expect(__o.target).toBe('es2022'))
test('strict', () => expect(__o.strict).toBe(true))
test('outDir', () => expect(__o.outDir).toBe('dist'))
test('noEmitOnError', () => expect(__o.noEmitOnError).toBe(true))
test('include', () => expect((tsconfig as Record<string, unknown>).include).toEqual(['src']))`,
      },
    ],
    quiz: [
      {
        question: 'Por defecto, si hay errores de tipo, ¿`tsc` genera el JavaScript?',
        options: ['Sí', 'No'],
        answer: 0,
        explanation: 'Por defecto emite igual. `noEmitOnError: true` lo impide.',
      },
      {
        question: 'En un proyecto con Vite, ¿quién comprueba los tipos?',
        options: ['Vite, al transpilar', 'El editor y `tsc` (por ejemplo, en el script de build)', 'Nadie'],
        answer: 1,
        explanation: 'Vite solo borra los tipos para ir rápido; la comprobación la hace `tsc`.',
      },
    ],
  },

  c05: {
    exercises: [
      {
        id: 'c05-e1',
        title: 'Anota arrays',
        language: 'typescript',
        prompt:
          'Anota los parámetros y el retorno:\n\n- `promedio(nums)`: recibe números, devuelve un número (`0` si está vacío).\n- `unir(palabras, separador)`: recibe strings y un separador, devuelve un string.',
        starter: 'function promedio(nums) {\n  if (nums.length === 0) return 0\n  return nums.reduce((a, n) => a + n, 0) / nums.length\n}\n\nfunction unir(palabras, separador) {\n  return palabras.join(separador)\n}\n',
        solution:
          'function promedio(nums: number[]): number {\n  if (nums.length === 0) return 0\n  return nums.reduce((a, n) => a + n, 0) / nums.length\n}\n\nfunction unir(palabras: string[], separador: string): string {\n  return palabras.join(separador)\n}\n',
        hints: ['Un array de números es `number[]`.'],
        tests: `
test('promedio', () => expect(promedio([2, 4, 9])).toBe(5))
test('unir', () => expect(unir(['a', 'b'], '-')).toBe('a-b'))`,
        typeTests: `
// @ts-expect-error promedio solo acepta números
promedio(['1', '2'])
// @ts-expect-error unir necesita strings
unir([1, 2], ',')`,
      },
      {
        id: 'c05-e2',
        title: 'Lo que devuelve find',
        language: 'typescript',
        prompt:
          'Escribe `primeroMayorQue(nums: number[], limite: number)` que devuelva el primer número mayor que `limite`. **Anota el tipo de retorno correcto**: piensa qué pasa si no hay ninguno.',
        starter: 'function primeroMayorQue(nums: number[], limite: number): number {\n  return nums.find((n) => n > limite)\n}\n',
        solution:
          'function primeroMayorQue(nums: number[], limite: number): number | undefined {\n  return nums.find((n) => n > limite)\n}\n',
        hints: ['Pasa el ratón sobre `find`: ¿qué tipo devuelve?'],
        tests: `
test('encuentra', () => expect(primeroMayorQue([1, 5, 9], 4)).toBe(5))
test('no encuentra', () => expect(primeroMayorQue([1], 4)).toBe(undefined))`,
        typeTests: `
type _r = Expect<Equal<ReturnType<typeof primeroMayorQue>, number | undefined>>`,
      },
    ],
    quiz: [
      {
        question: '¿Qué tipo es `string | number[]`?',
        options: ['Array de strings o números', 'Un string, o un array de números'],
        answer: 1,
        explanation: 'Para un array mezclado escribe `(string | number)[]`.',
      },
      {
        question: '¿Qué tipo infiere TS para `[1, 2].map((n) => String(n))`?',
        options: ['number[]', 'string[]', 'any[]'],
        answer: 1,
        explanation: 'TS sabe lo que devuelve la función que pasas a `map`.',
      },
    ],
  },

  c06: {
    exercises: [
      {
        id: 'c06-e1',
        title: 'De any a unknown',
        language: 'typescript',
        prompt:
          'Cambia `any` por `unknown` y añade las comprobaciones necesarias: `longitud` devuelve la longitud si el valor es un string o un array, y `0` en cualquier otro caso.',
        starter: 'function longitud(valor: any): number {\n  return valor.length\n}\n',
        solution:
          "function longitud(valor: unknown): number {\n  if (typeof valor === 'string' || Array.isArray(valor)) {\n    return valor.length\n  }\n  return 0\n}\n",
        hints: ['`typeof valor === \'string\'`', '`Array.isArray(valor)`'],
        tests: `
test('string', () => expect(longitud('hola')).toBe(4))
test('array', () => expect(longitud([1, 2, 3])).toBe(3))
test('número', () => expect(longitud(42)).toBe(0))
test('null', () => expect(longitud(null)).toBe(0))`,
        typeTests: `
type _p = Expect<Equal<Parameters<typeof longitud>[0], unknown>>`,
      },
      {
        id: 'c06-e2',
        title: 'JSON seguro',
        language: 'typescript',
        prompt:
          '`leerEdad(json)` debe devolver la propiedad `edad` si el JSON es un objeto con `edad` numérica, o `null` en cualquier otro caso (JSON inválido, sin `edad`, `edad` no numérica...). Guarda el resultado de `JSON.parse` como `unknown`.',
        starter: 'function leerEdad(json: string) {\n  return JSON.parse(json).edad\n}\n',
        solution: `function leerEdad(json: string): number | null {
  let datos: unknown
  try {
    datos = JSON.parse(json)
  } catch {
    return null
  }
  if (typeof datos === 'object' && datos !== null && 'edad' in datos && typeof datos.edad === 'number') {
    return datos.edad
  }
  return null
}
`,
        hints: [
          '`let datos: unknown` y asígnalo dentro de un `try`.',
          "Comprueba en cadena: `typeof datos === 'object' && datos !== null && 'edad' in datos && typeof datos.edad === 'number'`.",
        ],
        tests: `
test('válido', () => expect(leerEdad('{"edad": 30}')).toBe(30))
test('edad no numérica', () => expect(leerEdad('{"edad": "30"}')).toBe(null))
test('sin edad', () => expect(leerEdad('{}')).toBe(null))
test('null', () => expect(leerEdad('null')).toBe(null))
test('JSON inválido', () => expect(leerEdad('{roto')).toBe(null))`,
        typeTests: `
type _r = Expect<Equal<ReturnType<typeof leerEdad>, number | null>>`,
      },
    ],
    quiz: [
      {
        question: '¿Cuál de estos compila?',
        options: ['const x: unknown = 1; x.toFixed()', 'const x: any = 1; x.toFixed()', 'Ambos'],
        answer: 1,
        explanation: '`unknown` no deja usar el valor sin comprobarlo; `any` deja todo.',
      },
      {
        question: 'Con `strict`, ¿qué tipo tiene `e` en `catch (e)`?',
        options: ['Error', 'any', 'unknown'],
        answer: 2,
        explanation: 'En JS se puede lanzar cualquier valor, así que es `unknown`.',
      },
    ],
  },

  c07: {
    exercises: [
      {
        id: 'c07-e1',
        title: 'Duración legible',
        language: 'typescript',
        prompt:
          "Escribe `formatearDuracion(segundos)` con tipos en parámetro y retorno. Devuelve `'2m 5s'` para 125, `'45s'` para 45 y `'1h 0m 3s'` para 3603.",
        starter: 'function formatearDuracion(segundos) {\n}\n',
        solution: `function formatearDuracion(segundos: number): string {
  const h = Math.floor(segundos / 3600)
  const m = Math.floor((segundos % 3600) / 60)
  const s = segundos % 60
  if (h > 0) return \`\${h}h \${m}m \${s}s\`
  if (m > 0) return \`\${m}m \${s}s\`
  return \`\${s}s\`
}
`,
        hints: ['`Math.floor(segundos / 3600)` son las horas.', 'El resto con `%`.'],
        tests: `
test('125', () => expect(formatearDuracion(125)).toBe('2m 5s'))
test('45', () => expect(formatearDuracion(45)).toBe('45s'))
test('3603', () => expect(formatearDuracion(3603)).toBe('1h 0m 3s'))`,
        typeTests: `
type _r = Expect<Equal<ReturnType<typeof formatearDuracion>, string>>
// @ts-expect-error solo números
formatearDuracion('10')`,
      },
      {
        id: 'c07-e2',
        title: 'Falta un return',
        language: 'typescript',
        prompt: 'TS dice que la función no siempre devuelve un string. Arréglalo: para `0` debe devolver `\'cero\'`.',
        starter: "function signo(n: number): string {\n  if (n > 0) return 'positivo'\n  if (n < 0) return 'negativo'\n}\n",
        solution: "function signo(n: number): string {\n  if (n > 0) return 'positivo'\n  if (n < 0) return 'negativo'\n  return 'cero'\n}\n",
        hints: ['¿Qué devuelve la función si `n` es 0?'],
        tests: `
test('positivo', () => expect(signo(3)).toBe('positivo'))
test('cero', () => expect(signo(0)).toBe('cero'))`,
      },
    ],
    quiz: [
      {
        question: '¿Hace falta anotar `n` aquí?',
        code: "const nombres = ['Ana', 'Luis']\nnombres.map((n) => n.length)",
        options: ['Sí, si no es any', 'No, TS lo deduce del contexto (string)'],
        answer: 1,
        explanation: 'Es el tipado contextual: TS sabe que `map` sobre `string[]` pasa strings.',
      },
      {
        question: '¿Qué tipo de retorno tiene `async function f() { return 1 }`?',
        options: ['number', 'Promise<number>', 'Promise<any>'],
        answer: 1,
        explanation: 'Las funciones `async` envuelven el retorno en una promesa.',
      },
    ],
  },

  c08: {
    exercises: [
      {
        id: 'c08-e1',
        title: 'Apellido opcional',
        language: 'typescript',
        prompt:
          "`nombreCompleto` debe aceptar objetos **sin** `apellido`. Haz la propiedad opcional y corrige el error que aparecerá. Devuelve `'Ada Lovelace'` o solo `'Ada'`.",
        starter:
          "function nombreCompleto(p: { nombre: string; apellido: string }): string {\n  return p.nombre + ' ' + p.apellido\n}\n",
        solution:
          "function nombreCompleto(p: { nombre: string; apellido?: string }): string {\n  if (p.apellido === undefined) return p.nombre\n  return p.nombre + ' ' + p.apellido\n}\n",
        hints: ['`apellido?: string`', 'Comprueba si es `undefined` antes de concatenar.'],
        tests: `
test('con apellido', () => expect(nombreCompleto({ nombre: 'Ada', apellido: 'Lovelace' })).toBe('Ada Lovelace'))
test('sin apellido', () => expect(nombreCompleto({ nombre: 'Ada' })).toBe('Ada'))`,
        typeTests: `
nombreCompleto({ nombre: 'Ada' })`,
      },
      {
        id: 'c08-e2',
        title: 'Opciones con valores por defecto',
        language: 'typescript',
        prompt:
          "Escribe `configurar(opciones)` donde `opciones` tiene `ancho`, `alto` (number) y `titulo` (string), **todas opcionales**. Devuelve un objeto con las tres presentes, usando por defecto `800`, `600` y `'Sin título'`.",
        starter: 'function configurar(opciones) {\n}\n',
        solution: `function configurar(opciones: { ancho?: number; alto?: number; titulo?: string }) {
  return {
    ancho: opciones.ancho ?? 800,
    alto: opciones.alto ?? 600,
    titulo: opciones.titulo ?? 'Sin título',
  }
}
`,
        hints: ['Tipo del parámetro: `{ ancho?: number; alto?: number; titulo?: string }`.', 'Usa `??` para los defectos.'],
        tests: `
test('defectos', () => expect(configurar({})).toEqual({ ancho: 800, alto: 600, titulo: 'Sin título' }))
test('respeta valores', () => expect(configurar({ ancho: 0, titulo: 'Hola' })).toEqual({ ancho: 0, alto: 600, titulo: 'Hola' }))`,
        typeTests: `
// @ts-expect-error ancho debe ser number
configurar({ ancho: '100' })
// @ts-expect-error propiedad desconocida
configurar({ anchura: 100 })
type _r = Expect<Equal<ReturnType<typeof configurar>, { ancho: number; alto: number; titulo: string }>>`,
      },
    ],
    quiz: [
      {
        question: 'Si `apellido?: string`, ¿qué tipo tiene `p.apellido`?',
        options: ['string', 'string | undefined', 'string | null'],
        answer: 1,
        explanation: 'Opcional significa que puede no estar, es decir, `undefined`.',
      },
    ],
  },

  c09: {
    exercises: [
      {
        id: 'c09-e1',
        title: 'Formatear valores',
        language: 'typescript',
        prompt:
          "Escribe `formatear(valor: string | number | boolean): string`: los números con 2 decimales (`'3.14'`), los booleans como `'sí'` / `'no'`, los strings tal cual.",
        starter: 'function formatear(valor: string | number | boolean): string {\n  return valor.toFixed(2)\n}\n',
        solution:
          "function formatear(valor: string | number | boolean): string {\n  if (typeof valor === 'number') return valor.toFixed(2)\n  if (typeof valor === 'boolean') return valor ? 'sí' : 'no'\n  return valor\n}\n",
        hints: ['Estrecha con `typeof valor === \'number\'`.', 'Tras descartar number y boolean, ¿qué queda?'],
        tests: `
test('número', () => expect(formatear(3.14159)).toBe('3.14'))
test('boolean', () => expect(formatear(false)).toBe('no'))
test('string', () => expect(formatear('hola')).toBe('hola'))`,
      },
      {
        id: 'c09-e2',
        title: 'Uno o muchos',
        language: 'typescript',
        prompt:
          "Escribe `normalizar(entrada)` que acepte un string **o** un array de strings y siempre devuelva un array, en minúsculas y sin espacios alrededor.\n\n`normalizar(' Hola ')` → `['hola']`",
        starter: 'function normalizar(entrada) {\n}\n',
        solution:
          'function normalizar(entrada: string | string[]): string[] {\n  const lista = Array.isArray(entrada) ? entrada : [entrada]\n  return lista.map((s) => s.trim().toLowerCase())\n}\n',
        hints: ['Tipo: `string | string[]`.', '`Array.isArray` estrecha la unión.'],
        tests: `
test('string', () => expect(normalizar(' Hola ')).toEqual(['hola']))
test('array', () => expect(normalizar(['A', ' b'])).toEqual(['a', 'b']))`,
        typeTests: `
type _r = Expect<Equal<ReturnType<typeof normalizar>, string[]>>
// @ts-expect-error no acepta números
normalizar(5)`,
      },
    ],
    quiz: [
      {
        question: 'Con `x: string | number`, ¿qué métodos puedes usar sin estrechar?',
        options: ['Los de string', 'Los de number', 'Solo los que tienen ambos (como `toString`)'],
        answer: 2,
        explanation: 'TS solo permite lo que es válido para todos los miembros de la unión.',
      },
    ],
  },

  c10: {
    exercises: [
      {
        id: 'c10-e1',
        title: 'Modela una biblioteca',
        language: 'typescript',
        prompt:
          'Define `interface Libro` con `titulo` y `autor` (string), `anio` (number) e `isbn` opcional (string). Define `type Biblioteca` como un array de libros. Luego tipa `librosDe(biblioteca, autor)`.',
        starter: 'function librosDe(biblioteca, autor) {\n  return biblioteca.filter((l) => l.autor === autor)\n}\n',
        solution: `interface Libro {
  titulo: string
  autor: string
  anio: number
  isbn?: string
}

type Biblioteca = Libro[]

function librosDe(biblioteca: Biblioteca, autor: string): Libro[] {
  return biblioteca.filter((l) => l.autor === autor)
}
`,
        hints: ['`interface Libro { ... }`', '`type Biblioteca = Libro[]`'],
        tests: `
const __b = [
  { titulo: 'Dune', autor: 'Herbert', anio: 1965 },
  { titulo: 'Emma', autor: 'Austen', anio: 1815 },
]
test('filtra', () => expect(librosDe(__b, 'Austen').length).toBe(1))`,
        typeTests: `
type _k = Expect<Equal<keyof Libro, 'titulo' | 'autor' | 'anio' | 'isbn'>>
type _b = Expect<Equal<Biblioteca, Libro[]>>
const _sinIsbn: Libro = { titulo: 'x', autor: 'y', anio: 1 }
// @ts-expect-error anio es obligatorio
const _sinAnio: Libro = { titulo: 'x', autor: 'y' }`,
      },
      {
        id: 'c10-e2',
        title: 'Extender e intersecar',
        language: 'typescript',
        prompt: `Con la interfaz \`Persona\` dada:

- Define \`interface Empleado\` que **extienda** \`Persona\` con \`puesto\` (string) y \`salario\` (number).
- Define \`type Gerente\` como \`Empleado\` **intersecado** con \`{ equipo: Empleado[] }\`.
- Implementa \`costoEquipo(g: Gerente): number\`: salario del gerente + salarios de su equipo.`,
        starter: `interface Persona {
  nombre: string
}

function costoEquipo(g) {
}
`,
        solution: `interface Persona {
  nombre: string
}

interface Empleado extends Persona {
  puesto: string
  salario: number
}

type Gerente = Empleado & { equipo: Empleado[] }

function costoEquipo(g: Gerente): number {
  return g.salario + g.equipo.reduce((total, e) => total + e.salario, 0)
}
`,
        hints: ['`interface Empleado extends Persona { ... }`', '`type Gerente = Empleado & { equipo: Empleado[] }`'],
        tests: `
const __dev = { nombre: 'Luis', puesto: 'dev', salario: 100 }
test('costoEquipo', () => expect(costoEquipo({ nombre: 'Ana', puesto: 'jefa', salario: 200, equipo: [__dev, __dev] })).toBe(400))`,
        typeTests: `
type _e = Expect<Equal<Pick<Empleado, 'nombre' | 'puesto' | 'salario'>, { nombre: string; puesto: string; salario: number }>>
const _g: Gerente = { nombre: 'A', puesto: 'p', salario: 1, equipo: [] }
// @ts-expect-error a un gerente le falta equipo
const _g2: Gerente = { nombre: 'A', puesto: 'p', salario: 1 }`,
      },
    ],
    quiz: [
      {
        question: '¿Cuál puede declararse dos veces y fusionarse?',
        options: ['type', 'interface', 'Ambos'],
        answer: 1,
        explanation: 'Las interfaces se fusionan (declaration merging); repetir un `type` es error.',
      },
      {
        question: '¿Se puede asignar un `Coord` a una variable de tipo `Punto` si ambos son `{ x: number; y: number }`?',
        options: ['Sí, TS compara la forma', 'No, son nombres distintos'],
        answer: 0,
        explanation: 'TypeScript usa tipado estructural.',
      },
    ],
  },

  c11: {
    exercises: [
      {
        id: 'c11-e1',
        title: 'Métodos HTTP',
        language: 'typescript',
        prompt:
          "Define `type Metodo` con los literales `'GET'`, `'POST'`, `'PUT'` y `'DELETE'`. Implementa `tieneCuerpo(m: Metodo): boolean` (true para POST y PUT).",
        starter: 'type Metodo = string\n\nfunction tieneCuerpo(m: Metodo): boolean {\n  return false\n}\n',
        solution: "type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE'\n\nfunction tieneCuerpo(m: Metodo): boolean {\n  return m === 'POST' || m === 'PUT'\n}\n",
        hints: ["Unión de literales: `'GET' | 'POST' | ...`"],
        tests: `
test('POST', () => expect(tieneCuerpo('POST')).toBe(true))
test('GET', () => expect(tieneCuerpo('GET')).toBe(false))`,
        typeTests: `
type _m = Expect<Equal<Metodo, 'GET' | 'POST' | 'PUT' | 'DELETE'>>
// @ts-expect-error PATCH no está permitido
tieneCuerpo('PATCH')`,
      },
      {
        id: 'c11-e2',
        title: 'as const',
        language: 'typescript',
        prompt:
          "Hay dos problemas:\n\n1. `pedir(req.url, req.metodo)` da error porque `req.metodo` se infiere como `string`.\n2. `Talla` debería ser `'S' | 'M' | 'L'`, derivado de `TALLAS` (no lo escribas a mano: usa `(typeof TALLAS)[number]`).\n\nArregla ambos con `as const`.",
        starter: `type Metodo = 'GET' | 'POST'

function pedir(url: string, metodo: Metodo) {
  return metodo + ' ' + url
}

const req = { url: '/api', metodo: 'GET' }
const resultado = pedir(req.url, req.metodo)

const TALLAS = ['S', 'M', 'L']
type Talla = string
`,
        solution: `type Metodo = 'GET' | 'POST'

function pedir(url: string, metodo: Metodo) {
  return metodo + ' ' + url
}

const req = { url: '/api', metodo: 'GET' } as const
const resultado = pedir(req.url, req.metodo)

const TALLAS = ['S', 'M', 'L'] as const
type Talla = (typeof TALLAS)[number]
`,
        hints: ['Añade `as const` al final de cada literal.', '`type Talla = (typeof TALLAS)[number]`'],
        tests: `
test('resultado', () => expect(resultado).toBe('GET /api'))`,
        typeTests: `
type _t = Expect<Equal<Talla, 'S' | 'M' | 'L'>>`,
      },
    ],
    quiz: [
      {
        question: '¿Qué tipo tiene `b`?',
        code: "let b = 'GET'",
        options: ['"GET"', 'string'],
        answer: 1,
        explanation: 'Con `let`, TS amplía el literal a `string` porque puede reasignarse.',
      },
    ],
  },

  c12: {
    exercises: [
      {
        id: 'c12-e1',
        title: 'Puede ser null',
        language: 'typescript',
        prompt: "`capitalizar` recibe un string o `null`. Si es `null` o vacío, devuelve `''`. Si no, la primera letra en mayúscula.",
        starter: "function capitalizar(texto: string | null): string {\n  return texto[0].toUpperCase() + texto.slice(1)\n}\n",
        solution:
          "function capitalizar(texto: string | null): string {\n  if (!texto) return ''\n  return texto[0].toUpperCase() + texto.slice(1)\n}\n",
        hints: ["Un guard clause: `if (!texto) return ''` cubre null y el string vacío."],
        tests: `
test('normal', () => expect(capitalizar('hola')).toBe('Hola'))
test('null', () => expect(capitalizar(null)).toBe(''))
test('vacío', () => expect(capitalizar('')).toBe(''))`,
      },
      {
        id: 'c12-e2',
        title: 'Map.get',
        language: 'typescript',
        prompt:
          "`precioDe` debe devolver siempre un `number`. Si el producto no está en el Map, lanza `Error('Producto desconocido: <nombre>')`.",
        starter: 'function precioDe(precios: Map<string, number>, producto: string): number {\n  return precios.get(producto)\n}\n',
        solution: `function precioDe(precios: Map<string, number>, producto: string): number {
  const precio = precios.get(producto)
  if (precio === undefined) throw new Error(\`Producto desconocido: \${producto}\`)
  return precio
}
`,
        hints: ['`get` devuelve `number | undefined`.', 'Guárdalo en una constante y compruébalo.'],
        tests: `
const __p = new Map([['pan', 2], ['agua', 0]])
test('existe', () => expect(precioDe(__p, 'pan')).toBe(2))
test('precio 0 es válido', () => expect(precioDe(__p, 'agua')).toBe(0))
test('no existe', () => {
  let __m = ''
  try { precioDe(__p, 'vino') } catch (e) { __m = (e as Error).message }
  expect(__m).toBe('Producto desconocido: vino')
})`,
      },
    ],
    quiz: [
      {
        question: '¿Qué tipo devuelve `localStorage.getItem(\'x\')`?',
        options: ['string', 'string | null', 'string | undefined'],
        answer: 1,
        explanation: 'Devuelve `null` si la clave no existe.',
      },
      {
        question: 'Con `interface A { x: number | undefined }`, ¿es válido `const a: A = {}`?',
        options: ['Sí', 'No: x debe estar presente aunque valga undefined'],
        answer: 1,
        explanation: 'Solo `x?:` permite omitir la propiedad.',
      },
    ],
  },

  c13: {
    exercises: [
      {
        id: 'c13-e1',
        title: 'Quita las assertions',
        language: 'typescript',
        prompt:
          "Este código usa `!` para callar a TS, y explota con un error confuso cuando el usuario no existe. Reemplaza el `!` por una comprobación que lance `Error('Usuario <id> no encontrado')`.",
        starter: `interface Usuario {
  id: number
  nombre: string
}

function nombreDe(usuarios: Usuario[], id: number): string {
  const usuario = usuarios.find((u) => u.id === id)!
  return usuario.nombre
}
`,
        solution: `interface Usuario {
  id: number
  nombre: string
}

function nombreDe(usuarios: Usuario[], id: number): string {
  const usuario = usuarios.find((u) => u.id === id)
  if (!usuario) throw new Error(\`Usuario \${id} no encontrado\`)
  return usuario.nombre
}
`,
        hints: ['Quita el `!` y añade `if (!usuario) throw ...`.'],
        tests: `
const __us = [{ id: 1, nombre: 'Ada' }]
test('existe', () => expect(nombreDe(__us, 1)).toBe('Ada'))
test('no existe', () => {
  let __m = ''
  try { nombreDe(__us, 3) } catch (e) { __m = (e as Error).message }
  expect(__m).toBe('Usuario 3 no encontrado')
})`,
      },
      {
        id: 'c13-e2',
        title: 'satisfies',
        language: 'typescript',
        prompt:
          'Con la anotación `: Rutas`, TS olvida qué claves exactas tiene `rutas` y no se queja de `rutas.ajustes`, que no existe. Cambia la anotación por `satisfies` para que TS conserve las claves y **siga comprobando** que todos los valores son strings.',
        starter: `type Rutas = Record<string, string>

const rutas: Rutas = {
  inicio: '/',
  perfil: '/perfil',
}
`,
        solution: `type Rutas = Record<string, string>

const rutas = {
  inicio: '/',
  perfil: '/perfil',
} satisfies Rutas
`,
        hints: ['`const rutas = { ... } satisfies Rutas`'],
        tests: `
test('perfil', () => expect(rutas.perfil).toBe('/perfil'))`,
        typeTests: `
type _k = Expect<Equal<keyof typeof rutas, 'inicio' | 'perfil'>>
// @ts-expect-error ajustes no existe
rutas.ajustes`,
      },
    ],
    quiz: [
      {
        question: '¿Qué hace `valor as Usuario` en runtime?',
        options: ['Comprueba que valor es un Usuario', 'Nada: se borra al compilar', 'Convierte valor a Usuario'],
        answer: 1,
        explanation: 'Las assertions son solo para el compilador.',
      },
    ],
  },

  c14: {
    exercises: [
      {
        id: 'c14-e1',
        title: 'Migrar la lista de tareas a TS',
        language: 'typescript',
        prompt: 'Define los tipos y anota las funciones como se describe en la lección, hasta que no quede ningún error.',
        starter: `// 1. Define Prioridad, Tarea y Estadisticas aquí


// 2. Anota parámetros y retornos
function agregar(tareas, titulo, prioridad) {
  const maxId = tareas.reduce((max, t) => Math.max(max, t.id), 0)
  return [...tareas, { id: maxId + 1, titulo, hecha: false, prioridad }]
}

function completar(tareas, id) {
  return tareas.map((t) => (t.id === id ? { ...t, hecha: true } : t))
}

function buscarPorId(tareas, id) {
  return tareas.find((t) => t.id === id)
}

function estadisticas(tareas) {
  const total = tareas.length
  const hechas = tareas.filter((t) => t.hecha).length
  return {
    total,
    hechas,
    pendientes: total - hechas,
    porcentaje: total === 0 ? 0 : Math.round((hechas / total) * 100),
  }
}

function vencidas(tareas, hoy) {
  return tareas.filter((t) => !t.hecha && t.vence < hoy)
}
`,
        solution: `type Prioridad = 'alta' | 'media' | 'baja'

interface Tarea {
  id: number
  titulo: string
  hecha: boolean
  prioridad: Prioridad
  vence?: string
}

interface Estadisticas {
  total: number
  hechas: number
  pendientes: number
  porcentaje: number
}

function agregar(tareas: Tarea[], titulo: string, prioridad: Prioridad = 'media'): Tarea[] {
  const maxId = tareas.reduce((max, t) => Math.max(max, t.id), 0)
  return [...tareas, { id: maxId + 1, titulo, hecha: false, prioridad }]
}

function completar(tareas: Tarea[], id: number): Tarea[] {
  return tareas.map((t) => (t.id === id ? { ...t, hecha: true } : t))
}

function buscarPorId(tareas: Tarea[], id: number): Tarea | undefined {
  return tareas.find((t) => t.id === id)
}

function estadisticas(tareas: Tarea[]): Estadisticas {
  const total = tareas.length
  const hechas = tareas.filter((t) => t.hecha).length
  return {
    total,
    hechas,
    pendientes: total - hechas,
    porcentaje: total === 0 ? 0 : Math.round((hechas / total) * 100),
  }
}

function vencidas(tareas: Tarea[], hoy: string): Tarea[] {
  return tareas.filter((t) => !t.hecha && t.vence !== undefined && t.vence < hoy)
}
`,
        hints: [
          'Empieza por `type Prioridad = ...` e `interface Tarea { ... }` con `vence?: string`.',
          "Parámetro opcional con defecto: `prioridad: Prioridad = 'media'`.",
          'En `vencidas`, TS se quejará de que `t.vence` puede ser `undefined`: compruébalo.',
        ],
        tests: `
const __ts: Tarea[] = [
  { id: 1, titulo: 'A', hecha: false, prioridad: 'alta', vence: '2026-01-10' },
  { id: 2, titulo: 'B', hecha: true, prioridad: 'baja', vence: '2026-01-01' },
  { id: 3, titulo: 'C', hecha: false, prioridad: 'media' },
]
test('agregar con prioridad por defecto', () => expect(agregar(__ts, 'D')[3]).toEqual({ id: 4, titulo: 'D', hecha: false, prioridad: 'media' }))
test('completar', () => expect(completar(__ts, 1)[0].hecha).toBe(true))
test('buscarPorId', () => expect(buscarPorId(__ts, 9)).toBe(undefined))
test('estadisticas', () => expect(estadisticas(__ts)).toEqual({ total: 3, hechas: 1, pendientes: 2, porcentaje: 33 }))
test('vencidas', () => expect(vencidas(__ts, '2026-02-01').map((t) => t.id)).toEqual([1]))`,
        typeTests: `
declare const _lista: Tarea[]
type _p = Expect<Equal<Prioridad, 'alta' | 'media' | 'baja'>>
type _b = Expect<Equal<ReturnType<typeof buscarPorId>, Tarea | undefined>>
type _e = Expect<Equal<ReturnType<typeof estadisticas>, Estadisticas>>
type _v = Expect<Equal<Tarea['vence'], string | undefined>>
agregar(_lista, 'x')
// @ts-expect-error prioridad inválida
agregar(_lista, 'x', 'urgente')
// @ts-expect-error falta prioridad
const _t: Tarea = { id: 1, titulo: 'x', hecha: false }`,
      },
    ],
    quiz: [
      {
        question: 'Al migrar JS a TS, ¿por dónde conviene empezar?',
        options: ['Por los tipos de datos (interfaces)', 'Por añadir `any` en todas partes', 'Por reescribir la lógica'],
        answer: 0,
        explanation: 'Con los datos modelados, anotar las funciones es casi mecánico y TS te guía.',
      },
    ],
  },
}
