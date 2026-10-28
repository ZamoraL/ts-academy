import type { UnitContent } from '../index'

// Bloque B: JavaScript moderno.
// Los tests usan nombres con prefijo __ para no chocar con variables del alumno.

/** Reemplaza fetch por una API falsa. `rutas` mapea URL → cuerpo JSON; el resto responde 404. */
const MOCK_FETCH = `
function __mockFetch(rutas) {
  const llamadas = []
  globalThis.fetch = async (url) => {
    llamadas.push(String(url))
    const cuerpo = rutas[String(url)]
    if (cuerpo === undefined) return { ok: false, status: 404, json: async () => ({}) }
    return { ok: true, status: 200, json: async () => cuerpo }
  }
  return llamadas
}
`

const ASSERT_THROWS = `
async function __mensajeDeError(fn) {
  try { await fn() } catch (e) { return e.message }
  return 'no lanzó error'
}
`

export const unitsB: Record<string, UnitContent> = {
  b01: {
    exercises: [
      {
        id: 'b01-e1',
        title: 'Desestructurar parámetros',
        language: 'javascript',
        prompt:
          "Escribe `etiqueta(producto)` que reciba `{ nombre, precio, moneda }` y devuelva `'Teclado: 50 USD'`. Si no viene `moneda`, usa `'EUR'`. Desestructura **en el parámetro**.",
        starter: 'function etiqueta(producto) {\n}\n',
        solution: "function etiqueta({ nombre, precio, moneda = 'EUR' }) {\n  return `${nombre}: ${precio} ${moneda}`\n}\n",
        hints: ['`function etiqueta({ nombre, precio, moneda = ... })`'],
        tests: `
test('con moneda', () => expect(etiqueta({ nombre: 'Teclado', precio: 50, moneda: 'USD' })).toBe('Teclado: 50 USD'))
test('sin moneda', () => expect(etiqueta({ nombre: 'Ratón', precio: 20 })).toBe('Ratón: 20 EUR'))
test('desestructura en el parámetro', () => expect(etiqueta.toString().split(')')[0].includes('{')).toBe(true))`,
      },
      {
        id: 'b01-e2',
        title: 'Coordenadas',
        language: 'javascript',
        prompt:
          'Escribe `distancia(puntoA, puntoB)` donde cada punto es un array `[x, y]`. Devuelve la distancia euclídea. Usa destructuring de arrays.\n\nFórmula: `Math.hypot(x2 - x1, y2 - y1)`',
        starter: 'function distancia(puntoA, puntoB) {\n}\n',
        solution: 'function distancia([x1, y1], [x2, y2]) {\n  return Math.hypot(x2 - x1, y2 - y1)\n}\n',
        hints: ['Puedes desestructurar directamente: `function distancia([x1, y1], [x2, y2])`.'],
        tests: `
test('3-4-5', () => expect(distancia([0, 0], [3, 4])).toBe(5))
test('mismo punto', () => expect(distancia([2, 2], [2, 2])).toBe(0))`,
      },
    ],
    quiz: [
      {
        question: '¿Cuánto vale `c`?',
        code: 'const [a, , c = 10] = [1, 2]',
        options: ['2', 'undefined', '10'],
        answer: 2,
        explanation: 'No hay tercer elemento, así que se usa el valor por defecto.',
      },
      {
        question: '¿Qué variable crea `const { nombre: n } = usuario`?',
        options: ['nombre', 'n', 'ambas'],
        answer: 1,
        explanation: '`nombre: n` lee la propiedad `nombre` y la guarda en la variable `n`.',
      },
    ],
  },

  b02: {
    exercises: [
      {
        id: 'b02-e1',
        title: 'Actualizar sin mutar',
        language: 'javascript',
        prompt:
          'Escribe dos funciones sin mutar los argumentos:\n\n- `actualizar(usuario, cambios)`: devuelve un usuario nuevo con los cambios aplicados.\n- `agregarEtiqueta(usuario, etiqueta)`: devuelve un usuario nuevo con `etiqueta` añadida al final de `usuario.etiquetas`.',
        starter: 'function actualizar(usuario, cambios) {\n}\n\nfunction agregarEtiqueta(usuario, etiqueta) {\n}\n',
        solution:
          'function actualizar(usuario, cambios) {\n  return { ...usuario, ...cambios }\n}\n\nfunction agregarEtiqueta(usuario, etiqueta) {\n  return { ...usuario, etiquetas: [...usuario.etiquetas, etiqueta] }\n}\n',
        hints: ['`{ ...usuario, ...cambios }`', 'El array también hay que copiarlo: `[...usuario.etiquetas, etiqueta]`.'],
        tests: `
const __u = { nombre: 'Ana', edad: 30, etiquetas: ['admin'] }
const __copia = JSON.stringify(__u)
test('actualizar', () => expect(actualizar(__u, { edad: 31 })).toEqual({ nombre: 'Ana', edad: 31, etiquetas: ['admin'] }))
test('agregarEtiqueta', () => expect(agregarEtiqueta(__u, 'beta').etiquetas).toEqual(['admin', 'beta']))
test('no muta', () => {
  actualizar(__u, { edad: 99 }); agregarEtiqueta(__u, 'x')
  expect(JSON.stringify(__u)).toBe(__copia)
})`,
      },
      {
        id: 'b02-e2',
        title: 'Rest en parámetros',
        language: 'javascript',
        prompt:
          "Escribe `promedio(...nums)` que acepte cualquier cantidad de números y devuelva su promedio (`0` si no recibe ninguno). Escribe también `sinPassword(usuario)` que devuelva el usuario sin la propiedad `password`, usando rest en destructuring.",
        starter: 'function promedio() {\n}\n\nfunction sinPassword(usuario) {\n}\n',
        solution:
          'function promedio(...nums) {\n  if (nums.length === 0) return 0\n  return nums.reduce((a, n) => a + n, 0) / nums.length\n}\n\nfunction sinPassword({ password, ...resto }) {\n  return resto\n}\n',
        hints: ['`function promedio(...nums)` agrupa los argumentos en un array.', '`const { password, ...resto } = usuario`'],
        tests: `
test('promedio(2, 4, 6)', () => expect(promedio(2, 4, 6)).toBe(4))
test('promedio()', () => expect(promedio()).toBe(0))
test('sinPassword', () => expect(sinPassword({ email: 'a@x.com', password: '123' })).toEqual({ email: 'a@x.com' }))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué vale `r`?',
        code: "const r = { a: 1, b: 2, ...{ b: 3, c: 4 } }",
        options: ['{ a: 1, b: 2, c: 4 }', '{ a: 1, b: 3, c: 4 }', 'Error'],
        answer: 1,
        explanation: 'Las propiedades que vienen después sobrescriben a las anteriores.',
      },
      {
        question: 'Tras `const b = { ...a }`, ¿modificar `b.datos.x` cambia `a.datos.x`?',
        options: ['Sí, la copia es superficial', 'No, spread copia a fondo'],
        answer: 0,
        explanation: 'Spread copia un solo nivel; `datos` es el mismo objeto en ambos.',
      },
    ],
  },

  b03: {
    exercises: [
      {
        id: 'b03-e1',
        title: 'Acceso seguro',
        language: 'javascript',
        prompt:
          "Escribe `ciudadDe(usuario)` que devuelva `usuario.perfil.direccion.ciudad`, o `'Desconocida'` si cualquier parte falta (incluido el propio `usuario`).",
        starter: 'function ciudadDe(usuario) {\n  return usuario.perfil.direccion.ciudad\n}\n',
        solution: "function ciudadDe(usuario) {\n  return usuario?.perfil?.direccion?.ciudad ?? 'Desconocida'\n}\n",
        hints: ['Usa `?.` en cada paso.', 'Termina con `?? \'Desconocida\'`.'],
        tests: `
test('completo', () => expect(ciudadDe({ perfil: { direccion: { ciudad: 'Lima' } } })).toBe('Lima'))
test('sin dirección', () => expect(ciudadDe({ perfil: {} })).toBe('Desconocida'))
test('sin perfil', () => expect(ciudadDe({})).toBe('Desconocida'))
test('usuario undefined', () => expect(ciudadDe(undefined)).toBe('Desconocida'))`,
      },
      {
        id: 'b03-e2',
        title: '?? vs ||',
        language: 'javascript',
        prompt:
          'La función `configurar` debe usar los valores recibidos y aplicar defectos **solo cuando faltan**: `volumen` 50, `silencio` `true`, `nombre` `\'Invitado\'`. Ahora mismo un volumen `0` o `silencio: false` se pierden. Arréglalo.',
        starter:
          "function configurar(opciones) {\n  return {\n    volumen: opciones.volumen || 50,\n    silencio: opciones.silencio || true,\n    nombre: opciones.nombre || 'Invitado',\n  }\n}\n",
        solution:
          "function configurar(opciones) {\n  return {\n    volumen: opciones.volumen ?? 50,\n    silencio: opciones.silencio ?? true,\n    nombre: opciones.nombre ?? 'Invitado',\n  }\n}\n",
        hints: ['`||` reemplaza cualquier falsy. ¿Qué operador solo reemplaza null/undefined?'],
        tests: `
test('defectos', () => expect(configurar({})).toEqual({ volumen: 50, silencio: true, nombre: 'Invitado' }))
test('volumen 0 se respeta', () => expect(configurar({ volumen: 0 }).volumen).toBe(0))
test('silencio false se respeta', () => expect(configurar({ silencio: false }).silencio).toBe(false))
test('nombre vacío se respeta', () => expect(configurar({ nombre: '' }).nombre).toBe(''))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué devuelve `0 ?? 5`?',
        options: ['0', '5'],
        answer: 0,
        explanation: '`??` solo usa el lado derecho si el izquierdo es `null` o `undefined`.',
      },
      {
        question: '¿Qué devuelve `null?.x.y.z`?',
        options: ['undefined', 'TypeError', 'null'],
        answer: 0,
        explanation: 'El `?.` corta toda la cadena en cuanto encuentra `null` o `undefined`.',
      },
    ],
  },

  b04: {
    exercises: [
      {
        id: 'b04-e1',
        title: 'Contador con closure',
        language: 'javascript',
        prompt:
          'Escribe `crearContador(inicio)` que devuelva un objeto con `incrementar()`, `decrementar()` y `valor()`. La cuenta debe ser **privada**: no puede ser una propiedad del objeto devuelto.',
        starter: 'function crearContador(inicio) {\n  return {\n    cuenta: inicio,\n  }\n}\n',
        solution:
          'function crearContador(inicio) {\n  let cuenta = inicio\n  return {\n    incrementar: () => { cuenta++ },\n    decrementar: () => { cuenta-- },\n    valor: () => cuenta,\n  }\n}\n',
        hints: ['Declara `let cuenta = inicio` dentro de la función, fuera del objeto.', 'Los métodos son flechas que leen o modifican `cuenta`.'],
        tests: `
test('incrementa y decrementa', () => {
  const __c = crearContador(10)
  __c.incrementar(); __c.incrementar(); __c.decrementar()
  expect(__c.valor()).toBe(11)
})
test('contadores independientes', () => {
  const __a = crearContador(0)
  const __b = crearContador(0)
  __a.incrementar()
  expect(__b.valor()).toBe(0)
})
test('cuenta privada', () => expect(Object.keys(crearContador(0)).toSorted()).toEqual(['decrementar', 'incrementar', 'valor']))`,
      },
      {
        id: 'b04-e2',
        title: 'Fábrica de funciones',
        language: 'javascript',
        prompt:
          "Escribe `crearFormateador(prefijo, sufijo)` que devuelva una función que reciba un texto y lo envuelva.\n\n```js\nconst negrita = crearFormateador('**', '**')\nnegrita('hola') // '**hola**'\n```",
        starter: 'function crearFormateador(prefijo, sufijo) {\n}\n',
        solution: 'function crearFormateador(prefijo, sufijo) {\n  return (texto) => prefijo + texto + sufijo\n}\n',
        hints: ['Devuelve una función: `return (texto) => ...`'],
        tests: `
test('negrita', () => expect(crearFormateador('**', '**')('hola')).toBe('**hola**'))
test('paréntesis', () => expect(crearFormateador('(', ')')('x')).toBe('(x)'))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué imprime?',
        code: 'function crear() {\n  let n = 0\n  return () => ++n\n}\nconst a = crear()\nconst b = crear()\na(); a()\nconsole.log(b())',
        options: ['1', '2', '3'],
        answer: 0,
        explanation: 'Cada llamada a `crear` tiene su propia `n`.',
      },
    ],
  },

  b05: {
    exercises: [
      {
        id: 'b05-e1',
        title: 'Clase CuentaBancaria',
        language: 'javascript',
        prompt: `Crea la clase \`CuentaBancaria\`:

- \`constructor(titular)\`: guarda \`titular\`; el saldo empieza en 0 y es **privado** (\`#saldo\`).
- \`depositar(monto)\`: suma al saldo.
- \`retirar(monto)\`: resta; si no alcanza, lanza \`Error('Saldo insuficiente')\`.
- \`get saldo\`: devuelve el saldo.`,
        starter: 'class CuentaBancaria {\n}\n',
        solution: `class CuentaBancaria {
  #saldo = 0

  constructor(titular) {
    this.titular = titular
  }

  depositar(monto) {
    this.#saldo += monto
  }

  retirar(monto) {
    if (monto > this.#saldo) throw new Error('Saldo insuficiente')
    this.#saldo -= monto
  }

  get saldo() {
    return this.#saldo
  }
}
`,
        hints: ['Declara `#saldo = 0` como campo de clase.', 'El getter se escribe `get saldo() { ... }`.'],
        tests: `
test('titular', () => expect(new CuentaBancaria('Ana').titular).toBe('Ana'))
test('depositar y retirar', () => {
  const __c = new CuentaBancaria('Ana')
  __c.depositar(100); __c.retirar(30)
  expect(__c.saldo).toBe(70)
})
test('saldo insuficiente', () => {
  const __c = new CuentaBancaria('Ana')
  expect(() => __c.retirar(1)).toThrow()
})
test('saldo privado', () => expect(Object.keys(new CuentaBancaria('Ana'))).toEqual(['titular']))`,
      },
      {
        id: 'b05-e2',
        title: 'Método estático',
        language: 'javascript',
        prompt:
          "Crea la clase `Punto` con `x` e `y`, un método `distanciaA(otro)` y un método **estático** `origen()` que devuelva `new Punto(0, 0)`.",
        starter: 'class Punto {\n  constructor(x, y) {\n  }\n}\n',
        solution:
          'class Punto {\n  constructor(x, y) {\n    this.x = x\n    this.y = y\n  }\n\n  distanciaA(otro) {\n    return Math.hypot(otro.x - this.x, otro.y - this.y)\n  }\n\n  static origen() {\n    return new Punto(0, 0)\n  }\n}\n',
        hints: ['`static origen() { ... }` se llama como `Punto.origen()`.'],
        tests: `
test('origen', () => expect(Punto.origen()).toEqual({ x: 0, y: 0 }))
test('distancia', () => expect(new Punto(3, 4).distanciaA(Punto.origen())).toBe(5))
test('instanceof', () => expect(Punto.origen() instanceof Punto).toBe(true))`,
      },
    ],
    quiz: [
      {
        question: '¿Cómo se usa un getter `get area()`?',
        options: ['r.area()', 'r.area', 'Rectangulo.area'],
        answer: 1,
        explanation: 'Los getters se leen como propiedades, sin paréntesis.',
      },
    ],
  },

  b06: {
    exercises: [
      {
        id: 'b06-e1',
        title: 'Figuras',
        language: 'javascript',
        prompt: `Crea:

- \`Figura\` con \`constructor(nombre)\`, \`area()\` que devuelve \`0\`, y \`describir()\` que devuelve \`'<nombre> con área <area>'\`.
- \`Circulo extends Figura\` con \`radio\`; su área es \`Math.PI * r²\` redondeada a 2 decimales (\`Number(x.toFixed(2))\`). Nombre \`'Círculo'\`.
- \`Cuadrado extends Figura\` con \`lado\`. Nombre \`'Cuadrado'\`.

\`describir\` no debe reescribirse en las subclases.`,
        starter: 'class Figura {\n}\n\nclass Circulo {\n}\n\nclass Cuadrado {\n}\n',
        solution: `class Figura {
  constructor(nombre) {
    this.nombre = nombre
  }
  area() {
    return 0
  }
  describir() {
    return \`\${this.nombre} con área \${this.area()}\`
  }
}

class Circulo extends Figura {
  constructor(radio) {
    super('Círculo')
    this.radio = radio
  }
  area() {
    return Number((Math.PI * this.radio ** 2).toFixed(2))
  }
}

class Cuadrado extends Figura {
  constructor(lado) {
    super('Cuadrado')
    this.lado = lado
  }
  area() {
    return this.lado ** 2
  }
}
`,
        hints: ['En el constructor de la subclase, llama a `super(nombre)` antes de usar `this`.', '`describir` llama a `this.area()`: usará la versión de cada subclase.'],
        tests: `
test('cuadrado', () => expect(new Cuadrado(3).describir()).toBe('Cuadrado con área 9'))
test('círculo', () => expect(new Circulo(1).describir()).toBe('Círculo con área 3.14'))
test('herencia', () => expect(new Circulo(1) instanceof Figura).toBe(true))
test('describir heredado', () => expect(Object.hasOwn(Circulo.prototype, 'describir')).toBe(false))`,
      },
      {
        id: 'b06-e2',
        title: 'Error personalizado',
        language: 'javascript',
        prompt:
          "Crea `ErrorValidacion extends Error` con `constructor(campo, mensaje)`. Debe tener `name = 'ErrorValidacion'` y la propiedad `campo`. Luego escribe `validarEmail(email)` que lance `ErrorValidacion('email', 'Email inválido')` si el email no contiene `'@'`, o devuelva `true`.",
        starter: 'class ErrorValidacion {\n}\n\nfunction validarEmail(email) {\n}\n',
        solution:
          "class ErrorValidacion extends Error {\n  constructor(campo, mensaje) {\n    super(mensaje)\n    this.name = 'ErrorValidacion'\n    this.campo = campo\n  }\n}\n\nfunction validarEmail(email) {\n  if (!email.includes('@')) throw new ErrorValidacion('email', 'Email inválido')\n  return true\n}\n",
        hints: ['`super(mensaje)` inicializa `message`.'],
        tests: `
test('email válido', () => expect(validarEmail('a@x.com')).toBe(true))
test('email inválido', () => {
  let __e
  try { validarEmail('ax.com') } catch (e) { __e = e }
  expect(__e instanceof ErrorValidacion).toBe(true)
  expect(__e instanceof Error).toBe(true)
  expect(__e.campo).toBe('email')
  expect(__e.message).toBe('Email inválido')
  expect(__e.name).toBe('ErrorValidacion')
})`,
      },
    ],
    quiz: [
      {
        question: '¿Qué pasa si usas `this` antes de `super()` en el constructor de una subclase?',
        options: ['Nada', 'ReferenceError', 'this es undefined'],
        answer: 1,
        explanation: 'En una subclase, `this` no existe hasta que se llama a `super()`.',
      },
    ],
  },

  b07: {
    exercises: [
      {
        id: 'b07-e1',
        title: 'Exportaciones con nombre',
        language: 'javascript',
        prompt:
          'Este "módulo" tiene tres funciones. **Exporta** `formatearPrecio` y `aplicarDescuento` con exportaciones con nombre. `redondear` es un detalle interno: **no** la exportes.',
        starter:
          "function redondear(n) {\n  return Math.round(n * 100) / 100\n}\n\nfunction formatearPrecio(n) {\n  return '$' + redondear(n).toFixed(2)\n}\n\nfunction aplicarDescuento(precio, porcentaje) {\n  return redondear(precio * (1 - porcentaje / 100))\n}\n",
        solution:
          "function redondear(n) {\n  return Math.round(n * 100) / 100\n}\n\nexport function formatearPrecio(n) {\n  return '$' + redondear(n).toFixed(2)\n}\n\nexport function aplicarDescuento(precio, porcentaje) {\n  return redondear(precio * (1 - porcentaje / 100))\n}\n",
        hints: ['Pon `export` delante de `function`.'],
        tests: `
test('exporta formatearPrecio', () => expect(exports.formatearPrecio(3.5)).toBe('$3.50'))
test('exporta aplicarDescuento', () => expect(exports.aplicarDescuento(200, 15)).toBe(170))
test('redondear es privada', () => expect(exports.redondear).toBe(undefined))`,
      },
      {
        id: 'b07-e2',
        title: 'Exportación por defecto',
        language: 'javascript',
        prompt:
          "Exporta **por defecto** una función `saludar(nombre)` que devuelva `'Hola, ' + nombre`, y una constante con nombre `VERSION` igual a `'1.0'`.",
        starter: '',
        solution: "export const VERSION = '1.0'\n\nexport default function saludar(nombre) {\n  return 'Hola, ' + nombre\n}\n",
        hints: ['`export default function saludar(...)`', "`export const VERSION = '1.0'`"],
        tests: `
test('default', () => expect(exports.default('Ada')).toBe('Hola, Ada'))
test('VERSION', () => expect(exports.VERSION).toBe('1.0'))`,
      },
    ],
    quiz: [
      {
        question: '¿Cuál importa una exportación por defecto?',
        options: ["import { Boton } from './Boton'", "import Boton from './Boton'", "import * from './Boton'"],
        answer: 1,
        explanation: 'Las exportaciones por defecto se importan sin llaves.',
      },
      {
        question: '¿Cuántas exportaciones por defecto puede tener un módulo?',
        options: ['Una', 'Las que quieras', 'Ninguna si tiene exportaciones con nombre'],
        answer: 0,
        explanation: 'Solo una `export default`, y puede convivir con exportaciones con nombre.',
      },
    ],
  },

  b08: {
    exercises: [
      {
        id: 'b08-e1',
        title: 'Únicos y comunes',
        language: 'javascript',
        prompt:
          'Usa `Set` para escribir:\n\n- `unicos(arr)`: el array sin duplicados, en orden de aparición.\n- `comunes(a, b)`: los elementos de `a` que también están en `b`, sin duplicados.',
        starter: 'function unicos(arr) {\n}\n\nfunction comunes(a, b) {\n}\n',
        solution:
          'function unicos(arr) {\n  return [...new Set(arr)]\n}\n\nfunction comunes(a, b) {\n  const enB = new Set(b)\n  return unicos(a.filter((x) => enB.has(x)))\n}\n',
        hints: ['`[...new Set(arr)]`', 'Crea un Set con `b` y filtra `a` con `has`.'],
        tests: `
test('unicos', () => expect(unicos([3, 1, 3, 2, 1])).toEqual([3, 1, 2]))
test('comunes', () => expect(comunes([1, 2, 2, 3, 4], [2, 4, 6])).toEqual([2, 4]))
test('sin comunes', () => expect(comunes([1], [2])).toEqual([]))`,
      },
      {
        id: 'b08-e2',
        title: 'Contar palabras',
        language: 'javascript',
        prompt:
          "Escribe `contarPalabras(texto)` que devuelva un `Map` de palabra → veces que aparece. Ignora mayúsculas y separa por espacios (puede haber varios seguidos).",
        starter: 'function contarPalabras(texto) {\n}\n',
        solution:
          "function contarPalabras(texto) {\n  const conteo = new Map()\n  for (const palabra of texto.toLowerCase().split(' ')) {\n    if (palabra === '') continue\n    conteo.set(palabra, (conteo.get(palabra) ?? 0) + 1)\n  }\n  return conteo\n}\n",
        hints: ["Al separar `'a  b'` por `' '` aparece un string vacío: sáltalo.", '`conteo.get(p) ?? 0`'],
        tests: `
test('devuelve un Map', () => expect(contarPalabras('a') instanceof Map).toBe(true))
test('cuenta', () => {
  const __m = contarPalabras('El gato y el  perro y EL ratón')
  expect(__m.get('el')).toBe(3)
  expect(__m.get('y')).toBe(2)
  expect(__m.get('gato')).toBe(1)
  expect(__m.size).toBe(5)
})`,
      },
    ],
    quiz: [
      {
        question: '¿Qué vale `new Set([1, 1, 2]).size`?',
        options: ['3', '2', '1'],
        answer: 1,
        explanation: 'Un Set guarda cada valor una sola vez.',
      },
    ],
  },

  b09: {
    exercises: [
      {
        id: 'b09-e1',
        title: 'Guardar y restaurar',
        language: 'javascript',
        prompt:
          'Escribe `guardar(estado)` que devuelva el estado como JSON con sangría de 2 espacios, y `restaurar(texto)` que lo convierta de vuelta. Si el texto no es JSON válido, `restaurar` devuelve `{ tareas: [] }`.',
        starter: 'function guardar(estado) {\n}\n\nfunction restaurar(texto) {\n}\n',
        solution:
          'function guardar(estado) {\n  return JSON.stringify(estado, null, 2)\n}\n\nfunction restaurar(texto) {\n  try {\n    return JSON.parse(texto)\n  } catch {\n    return { tareas: [] }\n  }\n}\n',
        hints: ['`JSON.stringify(valor, null, 2)`', 'Envuelve `JSON.parse` en `try/catch`.'],
        tests: `
const __estado = { tareas: [{ id: 1, titulo: 'A' }] }
test('guardar con sangría', () => expect(guardar({ a: 1 })).toBe('{\\n  "a": 1\\n}'))
test('ida y vuelta', () => expect(restaurar(guardar(__estado))).toEqual(__estado))
test('texto inválido', () => expect(restaurar('{roto')).toEqual({ tareas: [] }))`,
      },
      {
        id: 'b09-e2',
        title: 'Fechas en JSON',
        language: 'javascript',
        prompt:
          "Las fechas se convierten en strings al hacer `JSON.stringify`. Escribe `parsearEvento(texto)` que haga `JSON.parse` y convierta la propiedad `fecha` de vuelta a un objeto `Date`.",
        starter: 'function parsearEvento(texto) {\n  return JSON.parse(texto)\n}\n',
        solution: 'function parsearEvento(texto) {\n  const evento = JSON.parse(texto)\n  return { ...evento, fecha: new Date(evento.fecha) }\n}\n',
        hints: ['`new Date(string)` crea una fecha a partir del texto ISO.'],
        tests: `
const __ev = { nombre: 'Lanzamiento', fecha: new Date('2026-01-15T10:00:00.000Z') }
test('fecha es Date', () => expect(parsearEvento(JSON.stringify(__ev)).fecha instanceof Date).toBe(true))
test('misma fecha', () => expect(parsearEvento(JSON.stringify(__ev)).fecha.getTime()).toBe(__ev.fecha.getTime()))
test('conserva el resto', () => expect(parsearEvento(JSON.stringify(__ev)).nombre).toBe('Lanzamiento'))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué devuelve `JSON.stringify({ a: undefined, b: 1 })`?',
        options: ['\'{"a":undefined,"b":1}\'', '\'{"b":1}\'', '\'{"a":null,"b":1}\''],
        answer: 1,
        explanation: '`undefined` no existe en JSON: la propiedad se omite.',
      },
      {
        question: '¿Es JSON válido `{ nombre: "Ada" }`?',
        options: ['Sí', 'No: la clave necesita comillas dobles'],
        answer: 1,
        explanation: 'En JSON todas las claves van entre comillas dobles.',
      },
    ],
  },

  b10: {
    exercises: [
      {
        id: 'b10-e1',
        title: 'Predice el orden',
        language: 'javascript',
        prompt: `Sin ejecutarlo, ¿en qué orden se imprimen las letras? Asigna a \`orden\` un array con las letras en el orden correcto.

\`\`\`js
console.log('A')
setTimeout(() => console.log('B'), 0)
console.log('C')
setTimeout(() => console.log('D'), 10)
setTimeout(() => console.log('E'), 0)
console.log('F')
\`\`\`

Después, comprueba tu respuesta pegando el código y pulsando **Ejecutar**.`,
        starter: 'const orden = []\n',
        solution: "const orden = ['A', 'C', 'F', 'B', 'E', 'D']\n",
        hints: ['Primero se ejecuta todo el código síncrono.', 'Los timers con el mismo retraso corren en el orden en que se registraron.'],
        tests: `
test('orden correcto', () => expect(orden).toEqual(['A', 'C', 'F', 'B', 'E', 'D']))`,
      },
      {
        id: 'b10-e2',
        title: 'Callback con retraso',
        language: 'javascript',
        prompt:
          'Escribe `despues(ms, valor, callback)` que, pasados `ms` milisegundos, llame a `callback(valor * 2)`. No debe llamarlo antes de tiempo.',
        starter: 'function despues(ms, valor, callback) {\n  callback(valor * 2)\n}\n',
        solution: 'function despues(ms, valor, callback) {\n  setTimeout(() => callback(valor * 2), ms)\n}\n',
        hints: ['`setTimeout(() => ..., ms)`'],
        tests: `
test('no es inmediato', () => {
  let __llamado = false
  despues(20, 1, () => { __llamado = true })
  expect(__llamado).toBe(false)
})
test('llama con el doble', async () => {
  const __r = await new Promise((resolve) => despues(20, 21, resolve))
  expect(__r).toBe(42)
})`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué un bucle muy largo congela la página?',
        options: [
          'Porque consume mucha memoria',
          'Porque JavaScript tiene un solo hilo: nada de la cola puede ejecutarse hasta que termine',
          'Porque el navegador lo bloquea por seguridad',
        ],
        answer: 1,
        explanation: 'Clics, timers y renderizado esperan a que la pila quede vacía.',
      },
    ],
  },

  b11: {
    exercises: [
      {
        id: 'b11-e1',
        title: 'Crear promesas',
        language: 'javascript',
        prompt:
          "Escribe `esperar(ms)` que devuelva una promesa que se cumple tras `ms` milisegundos, y `dividir(a, b)` que devuelva una promesa que se cumple con `a / b`, o se rechaza con `Error('División entre 0')` si `b` es 0.",
        starter: 'function esperar(ms) {\n}\n\nfunction dividir(a, b) {\n}\n',
        solution:
          "function esperar(ms) {\n  return new Promise((resolve) => setTimeout(resolve, ms))\n}\n\nfunction dividir(a, b) {\n  return new Promise((resolve, reject) => {\n    if (b === 0) reject(new Error('División entre 0'))\n    else resolve(a / b)\n  })\n}\n",
        hints: ['`new Promise((resolve, reject) => { ... })`', 'Para `esperar`, pasa `resolve` directamente a `setTimeout`.'],
        tests: `${ASSERT_THROWS}
test('esperar devuelve una promesa', () => expect(esperar(1) instanceof Promise).toBe(true))
test('esperar espera', async () => {
  const __t = Date.now()
  await esperar(30)
  expect(Date.now() - __t >= 25).toBe(true)
})
test('dividir', async () => expect(await dividir(10, 4)).toBe(2.5))
test('dividir entre 0', async () => expect(await __mensajeDeError(() => dividir(1, 0))).toBe('División entre 0'))`,
      },
      {
        id: 'b11-e2',
        title: 'Encadenar con then',
        language: 'javascript',
        prompt:
          "Se te dan `obtenerUsuario(id)` y `obtenerPedidos(usuario)`, que devuelven promesas. Escribe `totalGastado(id)` usando **`.then`** (sin async/await) que devuelva una promesa con la suma de `importe` de los pedidos del usuario.",
        starter: `// Ya implementadas (simulan una API):
const obtenerUsuario = (id) => Promise.resolve({ id, nombre: 'Ana' })
const obtenerPedidos = (usuario) =>
  Promise.resolve(usuario.id === 1 ? [{ importe: 10 }, { importe: 25 }] : [])

function totalGastado(id) {
}
`,
        solution: `// Ya implementadas (simulan una API):
const obtenerUsuario = (id) => Promise.resolve({ id, nombre: 'Ana' })
const obtenerPedidos = (usuario) =>
  Promise.resolve(usuario.id === 1 ? [{ importe: 10 }, { importe: 25 }] : [])

function totalGastado(id) {
  return obtenerUsuario(id)
    .then((usuario) => obtenerPedidos(usuario))
    .then((pedidos) => pedidos.reduce((total, p) => total + p.importe, 0))
}
`,
        hints: ['Devuelve la cadena: `return obtenerUsuario(id).then(...)`.', 'Si un `.then` devuelve una promesa, el siguiente recibe su valor.'],
        tests: `
test('usuario 1', async () => expect(await totalGastado(1)).toBe(35))
test('usuario sin pedidos', async () => expect(await totalGastado(2)).toBe(0))
test('sin async/await', () => expect(totalGastado.toString().includes('await')).toBe(false))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué imprime?',
        code: "console.log('A')\nPromise.resolve().then(() => console.log('B'))\nconsole.log('C')",
        options: ['A B C', 'A C B', 'B A C'],
        answer: 1,
        explanation: 'Los `.then` se ejecutan después de que termine el código síncrono actual.',
      },
      {
        question: '¿Qué hace `Promise.all` si una de las promesas se rechaza?',
        options: ['Ignora esa y sigue', 'Se rechaza con ese error', 'Espera a todas y devuelve los errores'],
        answer: 1,
        explanation: 'Para no fallar, usa `Promise.allSettled`.',
      },
    ],
  },

  b12: {
    exercises: [
      {
        id: 'b12-e1',
        title: 'Reescribe con async/await',
        language: 'javascript',
        prompt:
          'Reescribe `totalGastado` usando `async`/`await` en vez de `.then`. Si `obtenerUsuario` falla, devuelve `0` (usa `try/catch`).',
        starter: `const obtenerUsuario = (id) =>
  id > 0 ? Promise.resolve({ id }) : Promise.reject(new Error('id inválido'))
const obtenerPedidos = (usuario) =>
  Promise.resolve(usuario.id === 1 ? [{ importe: 10 }, { importe: 25 }] : [])

function totalGastado(id) {
  return obtenerUsuario(id)
    .then((usuario) => obtenerPedidos(usuario))
    .then((pedidos) => pedidos.reduce((total, p) => total + p.importe, 0))
}
`,
        solution: `const obtenerUsuario = (id) =>
  id > 0 ? Promise.resolve({ id }) : Promise.reject(new Error('id inválido'))
const obtenerPedidos = (usuario) =>
  Promise.resolve(usuario.id === 1 ? [{ importe: 10 }, { importe: 25 }] : [])

async function totalGastado(id) {
  try {
    const usuario = await obtenerUsuario(id)
    const pedidos = await obtenerPedidos(usuario)
    return pedidos.reduce((total, p) => total + p.importe, 0)
  } catch {
    return 0
  }
}
`,
        hints: ['Marca la función como `async`.', 'Envuelve los `await` en `try { } catch { return 0 }`.'],
        tests: `
test('usuario 1', async () => expect(await totalGastado(1)).toBe(35))
test('id inválido devuelve 0', async () => expect(await totalGastado(-1)).toBe(0))
test('usa await', () => expect(totalGastado.toString().includes('await')).toBe(true))`,
      },
      {
        id: 'b12-e2',
        title: 'En paralelo',
        language: 'javascript',
        prompt:
          '`cargarPerfil` tarda ~100 ms y `cargarAjustes` también. Escribe `cargarTodo()` que devuelva `{ perfil, ajustes }` cargándolos **en paralelo** (debe tardar ~100 ms, no ~200).',
        starter: `const esperar = (ms) => new Promise((r) => setTimeout(r, ms))
const cargarPerfil = async () => { await esperar(100); return { nombre: 'Ana' } }
const cargarAjustes = async () => { await esperar(100); return { tema: 'oscuro' } }

async function cargarTodo() {
  const perfil = await cargarPerfil()
  const ajustes = await cargarAjustes()
  return { perfil, ajustes }
}
`,
        solution: `const esperar = (ms) => new Promise((r) => setTimeout(r, ms))
const cargarPerfil = async () => { await esperar(100); return { nombre: 'Ana' } }
const cargarAjustes = async () => { await esperar(100); return { tema: 'oscuro' } }

async function cargarTodo() {
  const [perfil, ajustes] = await Promise.all([cargarPerfil(), cargarAjustes()])
  return { perfil, ajustes }
}
`,
        hints: ['`Promise.all([a(), b()])` lanza ambas a la vez.', 'Desestructura el resultado: `const [perfil, ajustes] = await ...`'],
        tests: `
test('resultado', async () => expect(await cargarTodo()).toEqual({ perfil: { nombre: 'Ana' }, ajustes: { tema: 'oscuro' } }))
test('en paralelo (< 180 ms)', async () => {
  const __t = Date.now()
  await cargarTodo()
  expect(Date.now() - __t < 180).toBe(true)
})`,
      },
    ],
    quiz: [
      {
        question: '¿Qué devuelve siempre una función `async`?',
        options: ['El valor del return', 'Una promesa', 'undefined'],
        answer: 1,
        explanation: 'El valor del `return` se envuelve en una promesa.',
      },
      {
        question: '¿Qué imprime?',
        code: 'async function f() { return 1 }\nconsole.log(f() === 1)',
        options: ['true', 'false'],
        answer: 1,
        explanation: '`f()` es una `Promise`, no `1`. Hace falta `await f()`.',
      },
    ],
  },

  b13: {
    exercises: [
      {
        id: 'b13-e1',
        title: 'getJSON',
        language: 'javascript',
        prompt:
          "Escribe `async function getJSON(url)` que haga `fetch(url)`, lance `Error('HTTP <status>')` si la respuesta no es `ok` (por ejemplo `'HTTP 404'`), y si no devuelva el cuerpo parseado con `.json()`.",
        starter: 'async function getJSON(url) {\n  const r = await fetch(url)\n  return r.json()\n}\n',
        solution:
          'async function getJSON(url) {\n  const r = await fetch(url)\n  if (!r.ok) throw new Error(`HTTP ${r.status}`)\n  return r.json()\n}\n',
        hints: ['Comprueba `r.ok` antes de leer el cuerpo.', '`r.status` tiene el código.'],
        tests: `${MOCK_FETCH}${ASSERT_THROWS}
test('devuelve el JSON', async () => {
  __mockFetch({ 'https://api.test/a': { ok: 1 } })
  expect(await getJSON('https://api.test/a')).toEqual({ ok: 1 })
})
test('404 lanza error', async () => {
  __mockFetch({})
  expect(await __mensajeDeError(() => getJSON('https://api.test/nada'))).toBe('HTTP 404')
})`,
      },
      {
        id: 'b13-e2',
        title: 'Buscar con parámetros',
        language: 'javascript',
        prompt:
          "Escribe `async function buscarRepos(texto, pagina)` que pida `https://api.test/buscar?q=<texto>&pagina=<pagina>` usando `URLSearchParams`, y devuelva solo los **nombres** de `resultados` (`{ resultados: [{ nombre }, ...] }`).",
        starter: 'async function buscarRepos(texto, pagina) {\n}\n',
        solution:
          "async function buscarRepos(texto, pagina) {\n  const params = new URLSearchParams({ q: texto, pagina: String(pagina) })\n  const r = await fetch(`https://api.test/buscar?${params}`)\n  const datos = await r.json()\n  return datos.resultados.map((x) => x.nombre)\n}\n",
        hints: ['`new URLSearchParams({ q: texto, pagina: String(pagina) })`', 'Interpola los params en la URL con un template literal.'],
        tests: `${MOCK_FETCH}
test('url y resultado', async () => {
  const __llamadas = __mockFetch({
    'https://api.test/buscar?q=react+ts&pagina=2': { resultados: [{ nombre: 'uno' }, { nombre: 'dos' }] },
  })
  expect(await buscarRepos('react ts', 2)).toEqual(['uno', 'dos'])
  expect(__llamadas).toEqual(['https://api.test/buscar?q=react+ts&pagina=2'])
})`,
      },
    ],
    quiz: [
      {
        question: 'Si el servidor responde 500, ¿qué hace la promesa de `fetch`?',
        options: ['Se rechaza', 'Se cumple, con `ok: false`'],
        answer: 1,
        explanation: '`fetch` solo se rechaza por errores de red. Siempre comprueba `r.ok`.',
      },
    ],
  },

  b14: {
    exercises: [
      {
        id: 'b14-e1',
        title: 'Cliente de API',
        language: 'javascript',
        prompt: 'Implementa `crearCliente(base)` como se describe en la lección.',
        starter: `function crearCliente(base) {
  async function getJSON(url) {
  }

  return {
    async usuario(id) {
    },
    async postsDe(userId) {
    },
    async resumen(id) {
    },
  }
}

// Para probar contra la API real, descomenta y pulsa "Ejecutar":
// crearCliente('https://jsonplaceholder.typicode.com').resumen(1).then(console.log)
`,
        solution: `function crearCliente(base) {
  async function getJSON(url) {
    const r = await fetch(url)
    if (!r.ok) throw new Error(\`HTTP \${r.status}\`)
    return r.json()
  }

  return {
    async usuario(id) {
      return getJSON(\`\${base}/users/\${id}\`)
    },
    async postsDe(userId) {
      return getJSON(\`\${base}/posts?userId=\${userId}\`)
    },
    async resumen(id) {
      const [usuario, posts] = await Promise.all([this.usuario(id), this.postsDe(id)])
      return {
        nombre: usuario.name,
        email: usuario.email,
        totalPosts: posts.length,
        titulos: posts.map((p) => p.title),
      }
    },
  }
}
`,
        hints: [
          'Empieza por `getJSON`: es igual a la de la unidad anterior.',
          'En `resumen`, puedes llamar a los otros métodos con `this.usuario(id)`.',
          '`const [usuario, posts] = await Promise.all([...])`',
        ],
        tests: `${MOCK_FETCH}${ASSERT_THROWS}
const __B = 'https://api.test'
const __rutas = {
  [__B + '/users/1']: { id: 1, name: 'Leanne', email: 'l@x.com' },
  [__B + '/posts?userId=1']: [{ id: 1, userId: 1, title: 'Uno' }, { id: 2, userId: 1, title: 'Dos' }],
}
test('usuario', async () => {
  __mockFetch(__rutas)
  expect((await crearCliente(__B).usuario(1)).name).toBe('Leanne')
})
test('usuario inexistente', async () => {
  __mockFetch(__rutas)
  expect(await __mensajeDeError(() => crearCliente(__B).usuario(99))).toBe('HTTP 404')
})
test('postsDe', async () => {
  __mockFetch(__rutas)
  expect((await crearCliente(__B).postsDe(1)).length).toBe(2)
})
test('resumen', async () => {
  __mockFetch(__rutas)
  expect(await crearCliente(__B).resumen(1)).toEqual({ nombre: 'Leanne', email: 'l@x.com', totalPosts: 2, titulos: ['Uno', 'Dos'] })
})
test('resumen en paralelo', async () => {
  let __enVuelo = 0
  let __max = 0
  globalThis.fetch = async (url) => {
    __enVuelo++; __max = Math.max(__max, __enVuelo)
    await new Promise((r) => setTimeout(r, 20))
    __enVuelo--
    return { ok: true, status: 200, json: async () => __rutas[url] }
  }
  await crearCliente(__B).resumen(1)
  expect(__max).toBe(2)
})`,
      },
    ],
    quiz: [
      {
        question: 'En `resumen`, ¿por qué usar `Promise.all` en vez de dos `await` seguidos?',
        options: [
          'Porque las dos peticiones son independientes: así van en paralelo',
          'Porque `await` no funciona dos veces',
          'Para capturar errores',
        ],
        answer: 0,
        explanation: 'Los posts no dependen del usuario cargado: no hay por qué esperar.',
      },
    ],
  },

  b15: {
    exercises: [
      {
        id: 'b15-e1',
        title: 'Caché, reintentos y timeout',
        language: 'javascript',
        prompt: 'Implementa `conCache`, `conReintentos` y `conTimeout` como se describe en la lección.',
        starter: `function conCache(fn) {
}

function conReintentos(fn, intentos) {
}

function conTimeout(promesa, ms) {
}
`,
        solution: `function conCache(fn) {
  const cache = new Map()
  return (arg) => {
    if (!cache.has(arg)) {
      const promesa = fn(arg).catch((error) => {
        cache.delete(arg)
        throw error
      })
      cache.set(arg, promesa)
    }
    return cache.get(arg)
  }
}

function conReintentos(fn, intentos) {
  return async (...args) => {
    let ultimoError
    for (let i = 0; i < intentos; i++) {
      try {
        return await fn(...args)
      } catch (error) {
        ultimoError = error
      }
    }
    throw ultimoError
  }
}

function conTimeout(promesa, ms) {
  const limite = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms)
  })
  return Promise.race([promesa, limite])
}
`,
        hints: [
          '`conCache`: un `Map` declarado fuera de la función devuelta (closure). Guarda la promesa de `fn(arg)`.',
          'Para borrar de la caché si falla: `fn(arg).catch((e) => { cache.delete(arg); throw e })`.',
          '`conReintentos`: un `for` con `try { return await fn(...args) } catch { ... }`.',
          '`conTimeout`: `Promise.race([promesa, promesaQueSeRechazaTrasMs])`.',
        ],
        tests: `${ASSERT_THROWS}
const __dormir = (ms) => new Promise((r) => setTimeout(r, ms))
test('caché: una sola llamada por argumento', async () => {
  let __n = 0
  const __f = conCache(async (x) => { __n++; return x * 2 })
  expect(await __f(2)).toBe(4)
  expect(await __f(2)).toBe(4)
  await __f(3)
  expect(__n).toBe(2)
})
test('caché: llamadas simultáneas comparten petición', async () => {
  let __n = 0
  const __f = conCache(async (x) => { __n++; await __dormir(20); return x })
  await Promise.all([__f(1), __f(1), __f(1)])
  expect(__n).toBe(1)
})
test('caché: los errores no se guardan', async () => {
  let __n = 0
  const __f = conCache(async () => { __n++; if (__n === 1) throw new Error('fallo'); return 'ok' })
  expect(await __mensajeDeError(() => __f('a'))).toBe('fallo')
  expect(await __f('a')).toBe('ok')
})
test('reintentos: termina bien al tercer intento', async () => {
  let __n = 0
  const __f = conReintentos(async () => { __n++; if (__n < 3) throw new Error('x'); return 'ok' }, 3)
  expect(await __f()).toBe('ok')
  expect(__n).toBe(3)
})
test('reintentos: lanza el último error', async () => {
  let __n = 0
  const __f = conReintentos(async () => { __n++; throw new Error('fallo ' + __n) }, 2)
  expect(await __mensajeDeError(__f)).toBe('fallo 2')
})
test('reintentos: pasa los argumentos', async () => {
  const __f = conReintentos(async (a, b) => a + b, 1)
  expect(await __f(2, 3)).toBe(5)
})
test('timeout: a tiempo', async () => expect(await conTimeout(__dormir(10).then(() => 'ok'), 100)).toBe('ok'))
test('timeout: tarde', async () => expect(await __mensajeDeError(() => conTimeout(__dormir(200), 30))).toBe('Timeout'))`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué guardar la promesa en la caché y no el resultado?',
        options: [
          'Para que llamadas simultáneas compartan la misma petición en curso',
          'Porque los resultados no se pueden guardar en un Map',
          'Para ahorrar memoria',
        ],
        answer: 0,
        explanation: 'Si guardas el resultado, una segunda llamada antes de que termine la primera haría otra petición.',
      },
    ],
  },
}
