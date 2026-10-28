import type { UnitContent } from '../index'

// Bloque A, unidades 03–10: tipos, operadores, strings, condicionales y bucles.
export const unitsA2: Record<string, UnitContent> = {
  a03: {
    exercises: [
      {
        id: 'a03-e1',
        title: 'Un valor de cada tipo',
        language: 'javascript',
        prompt:
          'Declara cuatro constantes: `texto` (un string cualquiera), `numero` (un number), `verdad` (un boolean) y `vacio` con valor `null`.',
        starter: '',
        solution: "const texto = 'hola'\nconst numero = 7\nconst verdad = true\nconst vacio = null\n",
        hints: ['Los booleans son `true` o `false`, sin comillas.', '`null` también va sin comillas.'],
        tests: `
test('texto es string', () => expect(typeof texto).toBe('string'))
test('numero es number', () => expect(typeof numero).toBe('number'))
test('verdad es boolean', () => expect(typeof verdad).toBe('boolean'))
test('vacio es null', () => expect(vacio).toBe(null))`,
      },
      {
        id: 'a03-e2',
        title: 'Detector de tipos',
        language: 'javascript',
        prompt:
          'Escribe `tipoDe(valor)` que devuelva lo mismo que `typeof`, **excepto** para `null`, donde debe devolver `\'null\'`.',
        starter: 'function tipoDe(valor) {\n  \n}\n',
        solution: "function tipoDe(valor) {\n  if (valor === null) return 'null'\n  return typeof valor\n}\n",
        hints: ['Primero comprueba `valor === null`.', 'En el resto de casos, `return typeof valor`.'],
        tests: `
test('string', () => expect(tipoDe('x')).toBe('string'))
test('number', () => expect(tipoDe(1)).toBe('number'))
test('undefined', () => expect(tipoDe(undefined)).toBe('undefined'))
test('null', () => expect(tipoDe(null)).toBe('null'))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué devuelve `typeof null`?',
        options: ["'null'", "'object'", "'undefined'"],
        answer: 1,
        explanation: 'Es un error histórico de JavaScript que se mantiene por compatibilidad.',
      },
      {
        question: "¿Qué tipo tiene `Number('hola')`?",
        options: ['string', 'number (vale NaN)', 'undefined'],
        answer: 1,
        explanation: '`NaN` significa "Not a Number", pero su tipo es `number`.',
      },
    ],
  },

  a04: {
    exercises: [
      {
        id: 'a04-e1',
        title: '¿Es par?',
        language: 'javascript',
        prompt: 'Escribe `esPar(n)` que devuelva `true` si `n` es par y `false` si no.',
        starter: 'function esPar(n) {\n}\n',
        solution: 'function esPar(n) {\n  return n % 2 === 0\n}\n',
        hints: ['El resto de dividir un par entre 2 es 0.', 'Usa `%`.'],
        tests: `
test('4 es par', () => expect(esPar(4)).toBe(true))
test('7 no es par', () => expect(esPar(7)).toBe(false))
test('0 es par', () => expect(esPar(0)).toBe(true))`,
      },
      {
        id: 'a04-e2',
        title: 'Celsius a Fahrenheit',
        language: 'javascript',
        prompt: 'Escribe `aFahrenheit(c)` usando la fórmula `F = C × 9 / 5 + 32`.',
        starter: 'function aFahrenheit(c) {\n}\n',
        solution: 'function aFahrenheit(c) {\n  return (c * 9) / 5 + 32\n}\n',
        hints: ['Por precedencia, `c * 9 / 5 + 32` ya funciona, pero los paréntesis lo hacen más claro.'],
        tests: `
test('0 °C = 32 °F', () => expect(aFahrenheit(0)).toBe(32))
test('100 °C = 212 °F', () => expect(aFahrenheit(100)).toBe(212))
test('-40 °C = -40 °F', () => expect(aFahrenheit(-40)).toBe(-40))`,
      },
    ],
    quiz: [
      {
        question: '¿Cuánto vale esta expresión?',
        code: "1 + 2 + '3'",
        options: ['6', "'33'", "'123'"],
        answer: 1,
        explanation: 'Se evalúa de izquierda a derecha: `1 + 2 = 3`, luego `3 + \'3\'` concatena.',
      },
      {
        question: '¿Cuánto vale `x`?',
        code: 'let x = 10\nx += 5\nx *= 2',
        options: ['20', '30', '25'],
        answer: 1,
        explanation: '10 + 5 = 15, 15 × 2 = 30.',
      },
    ],
  },

  a05: {
    exercises: [
      {
        id: 'a05-e1',
        title: 'Mayor de edad',
        language: 'javascript',
        prompt: 'Escribe `esMayorDeEdad(edad)` que devuelva `true` si la edad es 18 o más.',
        starter: 'function esMayorDeEdad(edad) {\n}\n',
        solution: 'function esMayorDeEdad(edad) {\n  return edad >= 18\n}\n',
        hints: ['Una comparación ya devuelve un boolean: no necesitas `if`.'],
        tests: `
test('18 sí', () => expect(esMayorDeEdad(18)).toBe(true))
test('17 no', () => expect(esMayorDeEdad(17)).toBe(false))
test('40 sí', () => expect(esMayorDeEdad(40)).toBe(true))`,
      },
      {
        id: 'a05-e2',
        title: 'Igualdad estricta',
        language: 'javascript',
        prompt:
          'Escribe `mismoValorYTipo(a, b)` que devuelva `true` solo si `a` y `b` son iguales **y del mismo tipo** (`1` y `\'1\'` no lo son).',
        starter: 'function mismoValorYTipo(a, b) {\n  return a == b\n}\n',
        solution: 'function mismoValorYTipo(a, b) {\n  return a === b\n}\n',
        hints: ['`==` convierte tipos. ¿Cuál no lo hace?'],
        tests: `
test('1 y 1', () => expect(mismoValorYTipo(1, 1)).toBe(true))
test("1 y '1'", () => expect(mismoValorYTipo(1, '1')).toBe(false))
test('0 y false', () => expect(mismoValorYTipo(0, false)).toBe(false))`,
      },
    ],
    quiz: [
      {
        question: "¿Qué devuelve `0 == ''`?",
        options: ['true', 'false', 'Error'],
        answer: 0,
        explanation: '`==` convierte ambos a número: `0 == 0`. Por eso usamos `===`.',
      },
      {
        question: '¿Qué devuelve `[1] === [1]`?',
        options: ['true', 'false'],
        answer: 1,
        explanation: 'Son dos arrays distintos en memoria; `===` compara identidad, no contenido.',
      },
    ],
  },

  a06: {
    exercises: [
      {
        id: 'a06-e1',
        title: 'Puede conducir',
        language: 'javascript',
        prompt:
          'Escribe `puedeConducir(edad, tieneLicencia, estaSancionado)`: devuelve `true` si tiene 18 o más, tiene licencia y **no** está sancionado.',
        starter: 'function puedeConducir(edad, tieneLicencia, estaSancionado) {\n}\n',
        solution:
          'function puedeConducir(edad, tieneLicencia, estaSancionado) {\n  return edad >= 18 && tieneLicencia && !estaSancionado\n}\n',
        hints: ['Combina tres condiciones con `&&`.', 'Para "no está sancionado" usa `!`.'],
        tests: `
test('cumple todo', () => expect(puedeConducir(20, true, false)).toBe(true))
test('menor', () => expect(puedeConducir(16, true, false)).toBe(false))
test('sin licencia', () => expect(puedeConducir(30, false, false)).toBe(false))
test('sancionado', () => expect(puedeConducir(30, true, true)).toBe(false))`,
      },
      {
        id: 'a06-e2',
        title: 'Nombre por defecto',
        language: 'javascript',
        prompt:
          "Escribe `saludo(nombre)` que devuelva `'Hola, ' + nombre`, pero si `nombre` es falsy (string vacío, `undefined`...) use `'Invitado'`. Usa `||`.",
        starter: 'function saludo(nombre) {\n}\n',
        solution: "function saludo(nombre) {\n  return 'Hola, ' + (nombre || 'Invitado')\n}\n",
        hints: ["`nombre || 'Invitado'` devuelve el primer valor truthy.", 'Necesitas paréntesis alrededor del `||`.'],
        tests: `
test('con nombre', () => expect(saludo('Ana')).toBe('Hola, Ana'))
test('vacío', () => expect(saludo('')).toBe('Hola, Invitado'))
test('undefined', () => expect(saludo()).toBe('Hola, Invitado'))`,
      },
    ],
    quiz: [
      {
        question: '¿Cuál de estos valores es truthy?',
        options: ['0', "''", "'0'", 'null'],
        answer: 2,
        explanation: "`'0'` es un string no vacío, así que es truthy.",
      },
      {
        question: "¿Qué devuelve `'' || 'x' || 'y'`?",
        options: ["'x'", "'y'", 'true'],
        answer: 0,
        explanation: '`||` devuelve el primer operando truthy.',
      },
    ],
  },

  a07: {
    exercises: [
      {
        id: 'a07-e1',
        title: 'Presentación',
        language: 'javascript',
        prompt:
          "Escribe `presentar(nombre, ciudad)` que devuelva `'Me llamo Ada y vivo en Londres.'` (con los valores recibidos). Usa un **template literal**.",
        starter: 'function presentar(nombre, ciudad) {\n}\n',
        solution: 'function presentar(nombre, ciudad) {\n  return `Me llamo ${nombre} y vivo en ${ciudad}.`\n}\n',
        hints: ['Usa backticks: `` `...` ``', 'Inserta variables con `${nombre}`.'],
        tests: `
test('Ada en Londres', () => expect(presentar('Ada', 'Londres')).toBe('Me llamo Ada y vivo en Londres.'))
test('Alan en Mánchester', () => expect(presentar('Alan', 'Mánchester')).toBe('Me llamo Alan y vivo en Mánchester.'))`,
      },
      {
        id: 'a07-e2',
        title: 'Iniciales',
        language: 'javascript',
        prompt:
          "Escribe `iniciales(nombreCompleto)` que reciba algo como `'ada lovelace'` y devuelva `'A.L.'` (primera letra de cada palabra, en mayúscula, con punto). Siempre serán dos palabras.",
        starter: 'function iniciales(nombreCompleto) {\n}\n',
        solution:
          "function iniciales(nombreCompleto) {\n  const partes = nombreCompleto.split(' ')\n  return partes[0][0].toUpperCase() + '.' + partes[1][0].toUpperCase() + '.'\n}\n",
        hints: ["`split(' ')` separa las palabras en un array.", '`palabra[0]` es la primera letra.'],
        tests: `
test('ada lovelace', () => expect(iniciales('ada lovelace')).toBe('A.L.'))
test('Grace Hopper', () => expect(iniciales('Grace Hopper')).toBe('G.H.'))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué imprime?',
        code: "const s = 'hola'\ns.toUpperCase()\nconsole.log(s)",
        options: ["'HOLA'", "'hola'", 'undefined'],
        answer: 1,
        explanation: 'Los strings son inmutables: `toUpperCase` devuelve un string nuevo que aquí se descarta.',
      },
      {
        question: "¿Qué devuelve `'TypeScript'.slice(0, 4)`?",
        options: ["'Type'", "'TypeS'", "'ript'"],
        answer: 0,
        explanation: 'Desde el índice 0 hasta antes del 4.',
      },
    ],
  },

  a08: {
    exercises: [
      {
        id: 'a08-e1',
        title: 'Clasificar nota',
        language: 'javascript',
        prompt:
          "Escribe `clasificar(nota)` (0–10): `'Excelente'` si ≥ 9, `'Bien'` si ≥ 7, `'Aprobado'` si ≥ 5 y `'Suspenso'` en otro caso.",
        starter: 'function clasificar(nota) {\n}\n',
        solution:
          "function clasificar(nota) {\n  if (nota >= 9) return 'Excelente'\n  if (nota >= 7) return 'Bien'\n  if (nota >= 5) return 'Aprobado'\n  return 'Suspenso'\n}\n",
        hints: ['Empieza por la condición más exigente.', 'Con `return`, no necesitas `else`.'],
        tests: `
test('10', () => expect(clasificar(10)).toBe('Excelente'))
test('9', () => expect(clasificar(9)).toBe('Excelente'))
test('7.5', () => expect(clasificar(7.5)).toBe('Bien'))
test('5', () => expect(clasificar(5)).toBe('Aprobado'))
test('3', () => expect(clasificar(3)).toBe('Suspenso'))`,
      },
      {
        id: 'a08-e2',
        title: 'Año bisiesto',
        language: 'javascript',
        prompt:
          'Escribe `esBisiesto(anio)`. Un año es bisiesto si es divisible entre 4, **excepto** si es divisible entre 100, **salvo** que también lo sea entre 400.\n\nEjemplos: 2024 sí, 1900 no, 2000 sí, 2023 no.',
        starter: 'function esBisiesto(anio) {\n}\n',
        solution:
          'function esBisiesto(anio) {\n  if (anio % 400 === 0) return true\n  if (anio % 100 === 0) return false\n  return anio % 4 === 0\n}\n',
        hints: ['Comprueba primero el caso más específico: 400.', 'Luego 100, luego 4.'],
        tests: `
test('2024', () => expect(esBisiesto(2024)).toBe(true))
test('1900', () => expect(esBisiesto(1900)).toBe(false))
test('2000', () => expect(esBisiesto(2000)).toBe(true))
test('2023', () => expect(esBisiesto(2023)).toBe(false))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué devuelve `f(95)`?',
        code: "function f(n) {\n  if (n > 50) return 'A'\n  else if (n > 90) return 'B'\n  return 'C'\n}",
        options: ["'A'", "'B'", "'C'"],
        answer: 0,
        explanation: 'La primera condición que se cumple gana; `n > 90` nunca llega a evaluarse.',
      },
    ],
  },

  a09: {
    exercises: [
      {
        id: 'a09-e1',
        title: 'Días de un mes',
        language: 'javascript',
        prompt:
          'Escribe `diasDelMes(mes)` (1–12) usando `switch`. Febrero tiene 28; abril, junio, septiembre y noviembre 30; el resto 31.',
        starter: 'function diasDelMes(mes) {\n  switch (mes) {\n  }\n}\n',
        solution:
          'function diasDelMes(mes) {\n  switch (mes) {\n    case 2:\n      return 28\n    case 4:\n    case 6:\n    case 9:\n    case 11:\n      return 30\n    default:\n      return 31\n  }\n}\n',
        hints: ['Puedes apilar `case` que comparten resultado.', 'Usa `default` para los de 31.'],
        tests: `
test('febrero', () => expect(diasDelMes(2)).toBe(28))
test('abril', () => expect(diasDelMes(4)).toBe(30))
test('noviembre', () => expect(diasDelMes(11)).toBe(30))
test('enero', () => expect(diasDelMes(1)).toBe(31))
test('diciembre', () => expect(diasDelMes(12)).toBe(31))`,
      },
      {
        id: 'a09-e2',
        title: 'Ternario',
        language: 'javascript',
        prompt:
          "Escribe `estado(stock)` con un **operador ternario**: devuelve `'Disponible'` si `stock > 0`, si no `'Agotado'`.",
        starter: 'function estado(stock) {\n}\n',
        solution: "function estado(stock) {\n  return stock > 0 ? 'Disponible' : 'Agotado'\n}\n",
        hints: ['`condición ? valorSi : valorNo`'],
        tests: `
test('con stock', () => expect(estado(3)).toBe('Disponible'))
test('sin stock', () => expect(estado(0)).toBe('Agotado'))`,
      },
    ],
    quiz: [
      {
        question: "¿Qué imprime si `x = 'a'`?",
        code: "switch (x) {\n  case 'a':\n    console.log('A')\n  case 'b':\n    console.log('B')\n    break\n}",
        options: ['A', 'A y luego B', 'B'],
        answer: 1,
        explanation: "Sin `break` tras `case 'a'`, la ejecución continúa en `case 'b'` (fall-through).",
      },
    ],
  },

  a10: {
    exercises: [
      {
        id: 'a10-e1',
        title: 'Suma hasta n',
        language: 'javascript',
        prompt: 'Escribe `sumaHasta(n)` que devuelva `1 + 2 + ... + n` usando un bucle `for`. Para `n = 0` devuelve `0`.',
        starter: 'function sumaHasta(n) {\n}\n',
        solution: 'function sumaHasta(n) {\n  let suma = 0\n  for (let i = 1; i <= n; i++) {\n    suma += i\n  }\n  return suma\n}\n',
        hints: ['Declara `let suma = 0` antes del bucle.', 'El bucle va de 1 hasta `n` incluido: `i <= n`.'],
        tests: `
test('n = 5', () => expect(sumaHasta(5)).toBe(15))
test('n = 100', () => expect(sumaHasta(100)).toBe(5050))
test('n = 0', () => expect(sumaHasta(0)).toBe(0))`,
      },
      {
        id: 'a10-e2',
        title: 'Contar vocales',
        language: 'javascript',
        prompt: "Escribe `contarVocales(texto)` que cuente cuántas vocales (a, e, i, o, u, sin tilde) tiene, sin importar mayúsculas.",
        starter: 'function contarVocales(texto) {\n}\n',
        solution:
          "function contarVocales(texto) {\n  let total = 0\n  const t = texto.toLowerCase()\n  for (let i = 0; i < t.length; i++) {\n    if ('aeiou'.includes(t[i])) total++\n  }\n  return total\n}\n",
        hints: ['Convierte a minúsculas primero.', "`'aeiou'.includes(letra)` dice si es vocal."],
        tests: `
test('hola', () => expect(contarVocales('hola')).toBe(2))
test('MURCIELAGO', () => expect(contarVocales('MURCIELAGO')).toBe(5))
test('vacío', () => expect(contarVocales('')).toBe(0))`,
      },
    ],
    quiz: [
      {
        question: '¿Cuántas veces se imprime algo?',
        code: 'for (let i = 0; i < 3; i++) {\n  console.log(i)\n}',
        options: ['2', '3', '4'],
        answer: 1,
        explanation: 'i toma 0, 1 y 2. Cuando vale 3 la condición es falsa.',
      },
      {
        question: '¿Qué hace `continue`?',
        options: ['Sale del bucle', 'Salta a la siguiente vuelta', 'Reinicia el bucle'],
        answer: 1,
        explanation: '`break` sale; `continue` pasa a la siguiente iteración.',
      },
    ],
  },
}
