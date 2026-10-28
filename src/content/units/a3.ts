import type { UnitContent } from '../index'

// Bloque A, unidades 12–22: funciones flecha, scope, arrays, objetos, errores y proyecto.
// Los tests usan nombres con prefijo __ para no chocar con variables del alumno.
export const unitsA3: Record<string, UnitContent> = {
  a12: {
    exercises: [
      {
        id: 'a12-e1',
        title: 'Reescribe con flechas',
        language: 'javascript',
        prompt:
          'Convierte las tres funciones en **funciones flecha** guardadas en constantes con el mismo nombre. Usa return implícito.',
        starter:
          'function triple(n) {\n  return n * 3\n}\n\nfunction saludar(nombre) {\n  return "Hola " + nombre\n}\n\nfunction crearPunto(x, y) {\n  return { x: x, y: y }\n}\n',
        solution:
          "const triple = (n) => n * 3\n\nconst saludar = (nombre) => 'Hola ' + nombre\n\nconst crearPunto = (x, y) => ({ x, y })\n",
        hints: ['`const triple = (n) => ...`', 'Para devolver un objeto, envuélvelo en paréntesis: `=> ({ x, y })`.'],
        tests: `
test('triple', () => expect(triple(4)).toBe(12))
test('saludar', () => expect(saludar('Ana')).toBe('Hola Ana'))
test('crearPunto', () => expect(crearPunto(1, 2)).toEqual({ x: 1, y: 2 }))
test('son funciones flecha', () => {
  for (const __f of [triple, saludar, crearPunto]) expect(__f.toString().includes('=>')).toBe(true)
})`,
      },
      {
        id: 'a12-e2',
        title: 'Aplicar dos veces',
        language: 'javascript',
        prompt:
          'Escribe `dosVeces(fn, valor)` que aplique la función `fn` dos veces: `fn(fn(valor))`.\n\nEjemplo: `dosVeces((n) => n + 3, 1)` → `7`.',
        starter: 'const dosVeces = (fn, valor) => {\n}\n',
        solution: 'const dosVeces = (fn, valor) => fn(fn(valor))\n',
        hints: ['`fn` es una función: llámala con `fn(...)`.', 'El resultado de la primera llamada es el argumento de la segunda.'],
        tests: `
test('+3 dos veces', () => expect(dosVeces((n) => n + 3, 1)).toBe(7))
test('doble dos veces', () => expect(dosVeces((n) => n * 2, 5)).toBe(20))
test('con strings', () => expect(dosVeces((s) => s + '!', 'hey')).toBe('hey!!'))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué devuelve `f()`?',
        code: 'const f = () => { valor: 1 }',
        options: ['{ valor: 1 }', 'undefined', '1'],
        answer: 1,
        explanation: 'Las llaves se interpretan como el cuerpo de la función (con una etiqueta `valor:`), no como un objeto. Faltan paréntesis.',
      },
    ],
  },

  a13: {
    exercises: [
      {
        id: 'a13-e1',
        title: 'Arregla el alcance',
        language: 'javascript',
        prompt:
          'La función `mayor` intenta usar `resultado` fuera del bloque `if` donde se declaró y falla. Arréglala para que devuelva el mayor de dos números.',
        starter:
          'function mayor(a, b) {\n  if (a > b) {\n    const resultado = a\n  } else {\n    const resultado = b\n  }\n  return resultado\n}\n',
        solution: 'function mayor(a, b) {\n  let resultado\n  if (a > b) {\n    resultado = a\n  } else {\n    resultado = b\n  }\n  return resultado\n}\n',
        hints: ['Declara `resultado` con `let` antes del `if`.', 'Dentro de cada rama, solo asígnale el valor.'],
        tests: `
test('mayor(3, 7)', () => expect(mayor(3, 7)).toBe(7))
test('mayor(9, 2)', () => expect(mayor(9, 2)).toBe(9))`,
      },
      {
        id: 'a13-e2',
        title: 'Función pura',
        language: 'javascript',
        prompt:
          'La función `agregarIva` modifica una variable externa `total`. Reescríbela como **función pura**: que reciba `precio` y `tasa` y devuelva el precio con IVA, sin tocar nada de fuera. Elimina la variable `total`.',
        starter: 'let total = 0\n\nfunction agregarIva(precio) {\n  total = precio * 1.16\n}\n',
        solution: 'function agregarIva(precio, tasa) {\n  return precio * (1 + tasa)\n}\n',
        hints: ['Añade el parámetro `tasa`.', 'Usa `return` en lugar de asignar a `total`.'],
        tests: `
test('100 al 25%', () => expect(agregarIva(100, 0.25)).toBe(125))
test('200 al 50%', () => expect(agregarIva(200, 0.5)).toBe(300))
test('no existe total', () => expect(typeof total).toBe('undefined'))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué pasa al ejecutar esto?',
        code: 'for (let i = 0; i < 2; i++) {}\nconsole.log(i)',
        options: ['Imprime 2', 'Imprime 1', 'ReferenceError'],
        answer: 2,
        explanation: '`i` se declaró con `let` dentro del `for`: solo existe en ese bloque.',
      },
      {
        question: '¿Qué devuelve `f()`?',
        code: "const x = 'afuera'\nfunction f() {\n  const x = 'adentro'\n  return x\n}",
        options: ["'afuera'", "'adentro'"],
        answer: 1,
        explanation: 'La variable interna sombrea a la externa.',
      },
    ],
  },

  a14: {
    exercises: [
      {
        id: 'a14-e1',
        title: 'Primero y último',
        language: 'javascript',
        prompt:
          'Escribe `extremos(arr)` que devuelva un array con el primer y el último elemento: `extremos([4, 5, 6])` → `[4, 6]`. Para un array vacío devuelve `[]`.',
        starter: 'function extremos(arr) {\n}\n',
        solution: 'function extremos(arr) {\n  if (arr.length === 0) return []\n  return [arr[0], arr[arr.length - 1]]\n}\n',
        hints: ['El último índice es `arr.length - 1` (o usa `arr.at(-1)`).', 'Trata el caso vacío primero.'],
        tests: `
test('[4, 5, 6]', () => expect(extremos([4, 5, 6])).toEqual([4, 6]))
test('un elemento', () => expect(extremos([9])).toEqual([9, 9]))
test('vacío', () => expect(extremos([])).toEqual([]))`,
      },
      {
        id: 'a14-e2',
        title: 'Ordenar sin mutar',
        language: 'javascript',
        prompt:
          'Escribe `ordenarNumeros(nums)` que devuelva un array **nuevo** ordenado de menor a mayor, sin modificar el original.',
        starter: 'function ordenarNumeros(nums) {\n  return nums.sort()\n}\n',
        solution: 'function ordenarNumeros(nums) {\n  return nums.toSorted((a, b) => a - b)\n}\n',
        hints: ['`sort` modifica el original; `toSorted` no.', 'Sin función de comparación se ordena como texto: usa `(a, b) => a - b`.'],
        tests: `
test('ordena números', () => expect(ordenarNumeros([10, 9, 100, 1])).toEqual([1, 9, 10, 100]))
test('no modifica el original', () => {
  const __orig = [3, 1, 2]
  ordenarNumeros(__orig)
  expect(__orig).toEqual([3, 1, 2])
})`,
      },
    ],
    quiz: [
      {
        question: '¿Es válido este código?',
        code: 'const lista = [1, 2]\nlista.push(3)',
        options: ['Sí: const impide reasignar, no modificar el contenido', 'No: const no permite cambios'],
        answer: 0,
        explanation: '`lista = [...]` sí daría error; `push` modifica el array al que apunta.',
      },
      {
        question: '¿Qué devuelve `[10, 9, 100].toSorted()`?',
        options: ['[9, 10, 100]', '[10, 100, 9]', '[100, 10, 9]'],
        answer: 1,
        explanation: 'Sin comparador, ordena como strings: "10" < "100" < "9".',
      },
    ],
  },

  a15: {
    exercises: [
      {
        id: 'a15-e1',
        title: 'Mayor de la lista',
        language: 'javascript',
        prompt: 'Escribe `maximo(nums)` usando `for...of` (sin `Math.max`). El array nunca está vacío.',
        starter: 'function maximo(nums) {\n}\n',
        solution: 'function maximo(nums) {\n  let max = nums[0]\n  for (const n of nums) {\n    if (n > max) max = n\n  }\n  return max\n}\n',
        hints: ['Empieza suponiendo que el máximo es el primer elemento.', 'Recorre y actualiza si encuentras uno mayor.'],
        tests: `
test('[3, 9, 2]', () => expect(maximo([3, 9, 2])).toBe(9))
test('negativos', () => expect(maximo([-5, -2, -9])).toBe(-2))
test('no usa Math.max', () => expect(maximo.toString().includes('Math.max')).toBe(false))`,
      },
      {
        id: 'a15-e2',
        title: 'Primer negativo',
        language: 'javascript',
        prompt:
          'Escribe `posicionPrimerNegativo(nums)` que devuelva el índice del primer número negativo, o `-1` si no hay. Usa un bucle y sal en cuanto lo encuentres.',
        starter: 'function posicionPrimerNegativo(nums) {\n}\n',
        solution:
          'function posicionPrimerNegativo(nums) {\n  for (const [i, n] of nums.entries()) {\n    if (n < 0) return i\n  }\n  return -1\n}\n',
        hints: ['`nums.entries()` te da `[indice, valor]`.', 'Un `return` dentro del bucle sale de la función.'],
        tests: `
test('[4, -1, -3]', () => expect(posicionPrimerNegativo([4, -1, -3])).toBe(1))
test('sin negativos', () => expect(posicionPrimerNegativo([1, 2])).toBe(-1))
test('vacío', () => expect(posicionPrimerNegativo([])).toBe(-1))`,
      },
    ],
    quiz: [
      {
        question: '¿Se puede usar `break` dentro de `forEach`?',
        options: ['Sí', 'No, da error de sintaxis'],
        answer: 1,
        explanation: '`forEach` llama a una función; `break` solo funciona en bucles. Usa `for...of` si necesitas salir.',
      },
    ],
  },

  a16: {
    exercises: [
      {
        id: 'a16-e1',
        title: 'map y filter',
        language: 'javascript',
        prompt:
          'Escribe `cuadradosDePares(nums)` que devuelva los cuadrados de los números pares, en orden. Usa `filter` y `map`.\n\n`cuadradosDePares([1, 2, 3, 4])` → `[4, 16]`',
        starter: 'const cuadradosDePares = (nums) => {\n}\n',
        solution: 'const cuadradosDePares = (nums) => nums.filter((n) => n % 2 === 0).map((n) => n * n)\n',
        hints: ['Primero filtra, luego transforma.', 'Puedes encadenar: `nums.filter(...).map(...)`.'],
        tests: `
test('[1, 2, 3, 4]', () => expect(cuadradosDePares([1, 2, 3, 4])).toEqual([4, 16]))
test('sin pares', () => expect(cuadradosDePares([1, 3])).toEqual([]))`,
      },
      {
        id: 'a16-e2',
        title: 'Buscar usuario',
        language: 'javascript',
        prompt:
          "Escribe `buscarPorEmail(usuarios, email)` que devuelva el usuario con ese email, o `undefined`. Cada usuario es `{ nombre, email }`.",
        starter: 'function buscarPorEmail(usuarios, email) {\n}\n',
        solution: 'function buscarPorEmail(usuarios, email) {\n  return usuarios.find((u) => u.email === email)\n}\n',
        hints: ['`find` devuelve el primer elemento que cumple.'],
        tests: `
const __us = [{ nombre: 'Ana', email: 'ana@x.com' }, { nombre: 'Luis', email: 'luis@x.com' }]
test('encuentra a Luis', () => expect(buscarPorEmail(__us, 'luis@x.com')).toEqual({ nombre: 'Luis', email: 'luis@x.com' }))
test('no existe', () => expect(buscarPorEmail(__us, 'zz@x.com')).toBe(undefined))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué devuelve `[1, 2, 3].find((n) => n > 5)`?',
        options: ['[]', 'undefined', 'null', '-1'],
        answer: 1,
        explanation: '`find` devuelve `undefined` si nadie cumple. `findIndex` devolvería `-1`.',
      },
      {
        question: '¿Qué longitud tiene el resultado de `arr.map(f)`?',
        options: ['La misma que `arr`', 'Depende de `f`', 'Siempre 1'],
        answer: 0,
        explanation: '`map` produce un elemento por cada elemento original.',
      },
    ],
  },

  a17: {
    exercises: [
      {
        id: 'a17-e1',
        title: 'Total del carrito',
        language: 'javascript',
        prompt:
          'Escribe `totalCarrito(items)` con `reduce`. Cada item es `{ precio, cantidad }`. Devuelve la suma de `precio × cantidad`. Para un carrito vacío, `0`.',
        starter: 'function totalCarrito(items) {\n}\n',
        solution: 'function totalCarrito(items) {\n  return items.reduce((total, item) => total + item.precio * item.cantidad, 0)\n}\n',
        hints: ['El valor inicial es `0`.', 'En cada paso: `total + item.precio * item.cantidad`.'],
        tests: `
test('dos items', () => expect(totalCarrito([{ precio: 10, cantidad: 2 }, { precio: 5, cantidad: 3 }])).toBe(35))
test('vacío', () => expect(totalCarrito([])).toBe(0))`,
      },
      {
        id: 'a17-e2',
        title: 'Validar formulario',
        language: 'javascript',
        prompt:
          "Escribe dos funciones sobre un array de campos `{ nombre, valor }`:\n\n- `todosLlenos(campos)`: `true` si **todos** tienen un `valor` no vacío.\n- `algunoLleno(campos)`: `true` si **al menos uno** lo tiene.",
        starter: 'function todosLlenos(campos) {\n}\n\nfunction algunoLleno(campos) {\n}\n',
        solution:
          "function todosLlenos(campos) {\n  return campos.every((c) => c.valor !== '')\n}\n\nfunction algunoLleno(campos) {\n  return campos.some((c) => c.valor !== '')\n}\n",
        hints: ['`every` para todos, `some` para alguno.'],
        tests: `
const __llenos = [{ nombre: 'a', valor: 'x' }, { nombre: 'b', valor: 'y' }]
const __mixtos = [{ nombre: 'a', valor: 'x' }, { nombre: 'b', valor: '' }]
const __vacios = [{ nombre: 'a', valor: '' }]
test('todos llenos', () => expect(todosLlenos(__llenos)).toBe(true))
test('mixtos: no todos', () => expect(todosLlenos(__mixtos)).toBe(false))
test('mixtos: alguno', () => expect(algunoLleno(__mixtos)).toBe(true))
test('vacíos: ninguno', () => expect(algunoLleno(__vacios)).toBe(false))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué devuelve?',
        code: '[2, 3, 4].reduce((acc, n) => acc * n, 1)',
        options: ['9', '24', '10'],
        answer: 1,
        explanation: '1 × 2 × 3 × 4 = 24.',
      },
      {
        question: '¿Qué devuelve `[].every((n) => n > 100)`?',
        options: ['true', 'false'],
        answer: 0,
        explanation: 'Un array vacío no tiene ningún elemento que incumpla, así que `every` devuelve `true`.',
      },
    ],
  },

  a18: {
    exercises: [
      {
        id: 'a18-e1',
        title: 'Crear y modificar',
        language: 'javascript',
        prompt:
          "Escribe `crearLibro(titulo, autor)` que devuelva `{ titulo, autor, leido: false }`. Escribe también `marcarLeido(libro)` que ponga `leido` en `true` en ese mismo objeto y lo devuelva.",
        starter: 'function crearLibro(titulo, autor) {\n}\n\nfunction marcarLeido(libro) {\n}\n',
        solution:
          'function crearLibro(titulo, autor) {\n  return { titulo, autor, leido: false }\n}\n\nfunction marcarLeido(libro) {\n  libro.leido = true\n  return libro\n}\n',
        hints: ['Usa la abreviatura `{ titulo, autor, ... }`.', '`libro.leido = true`'],
        tests: `
test('crearLibro', () => expect(crearLibro('Dune', 'Herbert')).toEqual({ titulo: 'Dune', autor: 'Herbert', leido: false }))
test('marcarLeido', () => {
  const __l = crearLibro('Dune', 'Herbert')
  marcarLeido(__l)
  expect(__l.leido).toBe(true)
})`,
      },
      {
        id: 'a18-e2',
        title: 'Contar propiedades',
        language: 'javascript',
        prompt:
          "Escribe `describir(obj)` que devuelva un string con cada propiedad en formato `clave=valor` separadas por `, `.\n\n`describir({ a: 1, b: 'x' })` → `'a=1, b=x'`",
        starter: 'function describir(obj) {\n}\n',
        solution:
          "function describir(obj) {\n  return Object.entries(obj)\n    .map(([clave, valor]) => clave + '=' + valor)\n    .join(', ')\n}\n",
        hints: ['`Object.entries` da pares `[clave, valor]`.', 'Transforma con `map` y une con `join`.'],
        tests: `
test('dos propiedades', () => expect(describir({ a: 1, b: 'x' })).toBe('a=1, b=x'))
test('vacío', () => expect(describir({})).toBe(''))`,
      },
    ],
    quiz: [
      {
        question: '¿Cuánto vale `a.x` al final?',
        code: 'const a = { x: 1 }\nconst b = a\nb.x = 5',
        options: ['1', '5'],
        answer: 1,
        explanation: '`a` y `b` apuntan al mismo objeto.',
      },
      {
        question: '¿Cómo lees una propiedad cuyo nombre está en la variable `k`?',
        options: ['obj.k', 'obj[k]', "obj['k']"],
        answer: 1,
        explanation: '`obj.k` y `obj[\'k\']` leen la propiedad llamada literalmente "k".',
      },
    ],
  },

  a19: {
    exercises: [
      {
        id: 'a19-e1',
        title: 'Inventario',
        language: 'javascript',
        prompt: `Con un array de productos \`{ nombre, precio, stock }\`, escribe:

- \`disponibles(productos)\`: nombres de los que tienen stock > 0.
- \`valorInventario(productos)\`: suma de \`precio × stock\`.
- \`masCaro(productos)\`: el **nombre** del producto con mayor precio.`,
        starter: 'function disponibles(productos) {\n}\n\nfunction valorInventario(productos) {\n}\n\nfunction masCaro(productos) {\n}\n',
        solution: `function disponibles(productos) {
  return productos.filter((p) => p.stock > 0).map((p) => p.nombre)
}

function valorInventario(productos) {
  return productos.reduce((total, p) => total + p.precio * p.stock, 0)
}

function masCaro(productos) {
  return productos.toSorted((a, b) => b.precio - a.precio)[0].nombre
}
`,
        hints: ['`disponibles`: filter + map.', '`masCaro`: ordena de mayor a menor y toma el primero, o usa reduce.'],
        tests: `
const __prods = [
  { nombre: 'Teclado', precio: 50, stock: 3 },
  { nombre: 'Ratón', precio: 20, stock: 0 },
  { nombre: 'Monitor', precio: 200, stock: 5 },
]
test('disponibles', () => expect(disponibles(__prods)).toEqual(['Teclado', 'Monitor']))
test('valorInventario', () => expect(valorInventario(__prods)).toBe(1150))
test('masCaro', () => expect(masCaro(__prods)).toBe('Monitor'))`,
      },
      {
        id: 'a19-e2',
        title: 'Ranking de alumnos',
        language: 'javascript',
        prompt:
          "Escribe `ranking(alumnos)` que reciba `{ nombre, nota }` y devuelva strings `'1. Ana (9)'`, `'2. Luis (7)'`... ordenados de mayor a menor nota. No modifiques el array original.",
        starter: 'function ranking(alumnos) {\n}\n',
        solution:
          "function ranking(alumnos) {\n  return alumnos\n    .toSorted((a, b) => b.nota - a.nota)\n    .map((a, i) => (i + 1) + '. ' + a.nombre + ' (' + a.nota + ')')\n}\n",
        hints: ['Ordena con `toSorted((a, b) => b.nota - a.nota)`.', '`map` recibe el índice como segundo argumento.'],
        tests: `
const __al = [{ nombre: 'Luis', nota: 7 }, { nombre: 'Ana', nota: 9 }, { nombre: 'Eva', nota: 8 }]
test('orden y formato', () => expect(ranking(__al)).toEqual(['1. Ana (9)', '2. Eva (8)', '3. Luis (7)']))
test('no modifica el original', () => {
  ranking(__al)
  expect(__al[0].nombre).toBe('Luis')
})`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué hacen falta los paréntesis?',
        code: 'productos.map((p) => ({ nombre: p.nombre }))',
        options: [
          'Para que `{` se lea como objeto y no como cuerpo de la función',
          'Por estilo, no son necesarios',
          'Porque map lo exige',
        ],
        answer: 0,
        explanation: 'Sin paréntesis, las llaves serían el bloque de la función y devolvería `undefined`.',
      },
    ],
  },

  a20: {
    exercises: [
      {
        id: 'a20-e1',
        title: 'JSON seguro',
        language: 'javascript',
        prompt:
          'Escribe `parsearSeguro(texto)` que devuelva el resultado de `JSON.parse(texto)`, o `null` si el texto no es JSON válido.',
        starter: 'function parsearSeguro(texto) {\n  return JSON.parse(texto)\n}\n',
        solution: 'function parsearSeguro(texto) {\n  try {\n    return JSON.parse(texto)\n  } catch {\n    return null\n  }\n}\n',
        hints: ['Envuelve `JSON.parse` en `try`.', 'En el `catch`, devuelve `null`.'],
        tests: `
test('JSON válido', () => expect(parsearSeguro('{"a":1}')).toEqual({ a: 1 }))
test('JSON inválido', () => expect(parsearSeguro('hola')).toBe(null))`,
      },
      {
        id: 'a20-e2',
        title: 'Lanzar errores',
        language: 'javascript',
        prompt:
          "Escribe `retirar(saldo, monto)` que devuelva el nuevo saldo. Si `monto <= 0` lanza `Error('Monto inválido')`; si `monto > saldo` lanza `Error('Saldo insuficiente')`.",
        starter: 'function retirar(saldo, monto) {\n  return saldo - monto\n}\n',
        solution:
          "function retirar(saldo, monto) {\n  if (monto <= 0) throw new Error('Monto inválido')\n  if (monto > saldo) throw new Error('Saldo insuficiente')\n  return saldo - monto\n}\n",
        hints: ["`throw new Error('...')`", 'Comprueba las condiciones antes de restar.'],
        tests: `
function __mensaje(fn) {
  try { fn() } catch (e) { return e.message }
  return 'no lanzó error'
}
test('retiro válido', () => expect(retirar(100, 30)).toBe(70))
test('monto inválido', () => expect(__mensaje(() => retirar(100, 0))).toBe('Monto inválido'))
test('saldo insuficiente', () => expect(__mensaje(() => retirar(100, 500))).toBe('Saldo insuficiente'))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué imprime?',
        code: "try {\n  console.log('A')\n  throw new Error('x')\n  console.log('B')\n} catch {\n  console.log('C')\n} finally {\n  console.log('D')\n}",
        options: ['A B C D', 'A C D', 'A D'],
        answer: 1,
        explanation: 'Tras el `throw` se salta al `catch`; `finally` siempre se ejecuta.',
      },
      {
        question: '¿Qué error produce `undefined.nombre`?',
        options: ['ReferenceError', 'TypeError', 'SyntaxError'],
        answer: 1,
        explanation: 'Leer propiedades de `undefined` es un `TypeError`; TypeScript lo detecta antes de ejecutar.',
      },
    ],
  },

  a21: {
    exercises: [
      {
        id: 'a21-e1',
        title: 'Lista de tareas: operaciones básicas',
        language: 'javascript',
        prompt:
          'Implementa las 5 funciones descritas en la lección. Ninguna debe modificar sus argumentos.',
        starter: `function crearTarea(id, titulo) {
}

function agregar(tareas, titulo) {
}

function completar(tareas, id) {
}

function eliminar(tareas, id) {
}

function formatear(tareas) {
}

// Prueba tu código:
let lista = []
lista = agregar(lista, 'Comprar pan')
lista = agregar(lista, 'Estudiar TypeScript')
lista = completar(lista, 1)
console.log(formatear(lista))
`,
        solution: `function crearTarea(id, titulo) {
  return { id, titulo, hecha: false }
}

function agregar(tareas, titulo) {
  const maxId = tareas.reduce((max, t) => (t.id > max ? t.id : max), 0)
  return tareas.concat([crearTarea(maxId + 1, titulo)])
}

function completar(tareas, id) {
  return tareas.map((t) => (t.id === id ? Object.assign({}, t, { hecha: true }) : t))
}

function eliminar(tareas, id) {
  return tareas.filter((t) => t.id !== id)
}

function formatear(tareas) {
  return tareas.map((t) => (t.hecha ? '[x] ' : '[ ] ') + t.titulo).join('\\n')
}
`,
        hints: [
          '`agregar`: calcula el id máximo con `reduce` empezando en 0, y usa `concat` para no mutar.',
          '`completar`: `map` con un ternario; copia la tarea con `Object.assign({}, t, { hecha: true })`.',
          "`formatear`: `map` a strings y `join('\\n')`.",
        ],
        tests: `
const __base = [
  { id: 1, titulo: 'A', hecha: false },
  { id: 5, titulo: 'B', hecha: true },
]
const __copia = JSON.stringify(__base)
test('crearTarea', () => expect(crearTarea(3, 'X')).toEqual({ id: 3, titulo: 'X', hecha: false }))
test('agregar a lista vacía usa id 1', () => expect(agregar([], 'X')).toEqual([{ id: 1, titulo: 'X', hecha: false }]))
test('agregar usa max id + 1', () => expect(agregar(__base, 'C')[2]).toEqual({ id: 6, titulo: 'C', hecha: false }))
test('completar', () => expect(completar(__base, 1)[0].hecha).toBe(true))
test('eliminar', () => expect(eliminar(__base, 1)).toEqual([{ id: 5, titulo: 'B', hecha: true }]))
test('formatear', () => expect(formatear(__base)).toBe('[ ] A\\n[x] B'))
test('no muta la entrada', () => {
  agregar(__base, 'Z'); completar(__base, 1); eliminar(__base, 5)
  expect(JSON.stringify(__base)).toBe(__copia)
})`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué devolver arrays nuevos en vez de modificar el original?',
        options: [
          'Es más rápido',
          'Evita efectos inesperados en otras partes del código que usan el mismo array',
          'JavaScript no permite modificar arrays',
        ],
        answer: 1,
        explanation: 'Además, React detecta cambios comparando referencias: necesita arrays nuevos.',
      },
    ],
  },

  a22: {
    exercises: [
      {
        id: 'a22-e1',
        title: 'Lista de tareas: consultas y estadísticas',
        language: 'javascript',
        prompt: 'Implementa las 5 funciones descritas en la lección.',
        starter: `function pendientes(tareas) {
}

function buscar(tareas, texto) {
}

function porPrioridad(tareas) {
}

function estadisticas(tareas) {
}

function validarTitulo(titulo) {
}
`,
        solution: `function pendientes(tareas) {
  return tareas.filter((t) => !t.hecha)
}

function buscar(tareas, texto) {
  const q = texto.toLowerCase()
  return tareas.filter((t) => t.titulo.toLowerCase().includes(q))
}

function porPrioridad(tareas) {
  const pesos = { alta: 0, media: 1, baja: 2 }
  return tareas.toSorted((a, b) => pesos[a.prioridad] - pesos[b.prioridad])
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

function validarTitulo(titulo) {
  const limpio = titulo.trim()
  if (limpio === '') throw new Error('El título no puede estar vacío')
  return limpio
}
`,
        hints: [
          '`buscar`: pasa ambos lados a minúsculas antes de `includes`.',
          '`porPrioridad`: objeto de pesos y `toSorted`.',
          '`estadisticas`: cuidado con dividir entre 0.',
        ],
        tests: `
const __ts = [
  { id: 1, titulo: 'Comprar pan', hecha: true, prioridad: 'baja' },
  { id: 2, titulo: 'Pagar luz', hecha: false, prioridad: 'alta' },
  { id: 3, titulo: 'Leer PAN de cada día', hecha: false, prioridad: 'media' },
]
test('pendientes', () => expect(pendientes(__ts).map((t) => t.id)).toEqual([2, 3]))
test('buscar ignora mayúsculas', () => expect(buscar(__ts, 'pan').map((t) => t.id)).toEqual([1, 3]))
test('porPrioridad', () => expect(porPrioridad(__ts).map((t) => t.id)).toEqual([2, 3, 1]))
test('porPrioridad no muta', () => expect(__ts[0].id).toBe(1))
test('estadisticas', () => expect(estadisticas(__ts)).toEqual({ total: 3, hechas: 1, pendientes: 2, porcentaje: 33 }))
test('estadisticas vacía', () => expect(estadisticas([])).toEqual({ total: 0, hechas: 0, pendientes: 0, porcentaje: 0 }))
test('validarTitulo limpia espacios', () => expect(validarTitulo('  Hola ')).toBe('Hola'))
test('validarTitulo vacío lanza', () => {
  let __msg = 'no lanzó'
  try { validarTitulo('   ') } catch (e) { __msg = e.message }
  expect(__msg).toBe('El título no puede estar vacío')
})`,
      },
    ],
    quiz: [
      {
        question: '¿Qué devuelve `Math.round((1 / 3) * 100)`?',
        options: ['33', '33.33', '34'],
        answer: 0,
        explanation: '33.33... se redondea al entero más cercano: 33.',
      },
    ],
  },
}
