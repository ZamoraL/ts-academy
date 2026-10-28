import type { UnitContent } from '../index'

export const unitsA: Record<string, UnitContent> = {
  a01: {
    lesson: `
Programar es escribir instrucciones que una computadora ejecuta **en orden**, de arriba hacia abajo.
JavaScript es el lenguaje de la web: corre en el navegador y también en servidores (Node.js).

## Tu primer programa

\`\`\`js
console.log('Hola, mundo')
\`\`\`

\`console.log\` imprime un valor en la consola. Es tu herramienta principal para **ver qué está pasando** en tu programa.

## Comentarios

Todo lo que va después de \`//\` es ignorado por JavaScript. Sirve para dejar notas:

\`\`\`js
// Esto es un comentario de una línea
/* Esto es un comentario
   de varias líneas */
\`\`\`

## Expresiones

Puedes imprimir el resultado de una operación directamente:

\`\`\`js
console.log(2 + 3)        // 5
console.log('Hola' + '!') // Hola!
\`\`\`

## Cómo funcionan los ejercicios

Debajo de cada lección hay ejercicios. Escribe tu código en el editor y pulsa **Comprobar**:
la app ejecuta tu código y luego unos tests que verifican el resultado. Verás la salida de \`console.log\`
y qué tests pasan o fallan.
`,
    exercises: [
      {
        id: 'a01-e1',
        title: 'Hola, mundo',
        language: 'javascript',
        prompt: 'Imprime exactamente `Hola, mundo` en la consola usando `console.log`.',
        starter: '// Escribe tu código aquí\n',
        solution: "console.log('Hola, mundo')\n",
        hints: ['La función se llama `console.log`.', "El texto va entre comillas: `'Hola, mundo'`."],
        tests: `
test('imprime "Hola, mundo"', () => {
  expect(__logs).toContain('Hola, mundo')
})`,
      },
      {
        id: 'a01-e2',
        title: 'Calculadora de consola',
        language: 'javascript',
        prompt: 'Imprime en la consola el resultado de multiplicar `7` por `6` (usa el operador `*`).',
        starter: '',
        solution: 'console.log(7 * 6)\n',
        hints: ['Puedes poner una operación dentro de `console.log(...)`.'],
        tests: `
test('imprime 42', () => {
  expect(__logs).toContain('42')
})`,
      },
    ],
    quiz: [
      {
        question: '¿En qué orden se ejecutan estas líneas?',
        code: "console.log('A')\nconsole.log('B')\nconsole.log('C')",
        options: ['C, B, A', 'A, B, C', 'En orden aleatorio'],
        answer: 1,
        explanation: 'Las instrucciones se ejecutan de arriba hacia abajo.',
      },
      {
        question: '¿Qué hace JavaScript con el texto después de `//`?',
        options: ['Lo imprime', 'Lo ignora', 'Da un error'],
        answer: 1,
        explanation: '`//` inicia un comentario: JavaScript lo ignora.',
      },
    ],
  },

  a02: {
    lesson: `
Una **variable** es un nombre que guarda un valor para usarlo después.

## const

Usa \`const\` cuando el valor **no se va a reasignar**:

\`\`\`js
const nombre = 'Ada'
console.log(nombre) // Ada
\`\`\`

Si intentas reasignarla, JavaScript lanza un error:

\`\`\`js
const pi = 3.14
pi = 3 // TypeError: Assignment to constant variable.
\`\`\`

## let

Usa \`let\` cuando el valor **va a cambiar**:

\`\`\`js
let contador = 0
contador = contador + 1
contador += 1 // forma corta
console.log(contador) // 2
\`\`\`

## ¿Y var?

\`var\` es la forma antigua. Tiene reglas de alcance confusas, así que en código moderno **no se usa**.

## Regla práctica

Empieza siempre con \`const\`. Cambia a \`let\` solo si necesitas reasignar.

## Nombres

- Usa \`camelCase\`: \`precioTotal\`, \`nombreUsuario\`.
- No pueden empezar con número ni contener espacios.
- Distinguen mayúsculas: \`edad\` y \`Edad\` son variables distintas.
`,
    exercises: [
      {
        id: 'a02-e1',
        title: 'Declara tus datos',
        language: 'javascript',
        prompt: 'Declara una constante `nombre` con el texto `"Ada"` y una constante `anioNacimiento` con el número `1815`.',
        starter: '',
        solution: "const nombre = 'Ada'\nconst anioNacimiento = 1815\n",
        hints: ['Usa `const nombre = ...`', 'Los números van sin comillas.'],
        tests: `
test('nombre es "Ada"', () => expect(nombre).toBe('Ada'))
test('anioNacimiento es 1815', () => expect(anioNacimiento).toBe(1815))`,
      },
      {
        id: 'a02-e2',
        title: 'Contador',
        language: 'javascript',
        prompt: 'Declara `puntos` empezando en `10`. Luego súmale `5` y después réstale `3`. Al final `puntos` debe valer `12`.',
        starter: '// ¿const o let?\n',
        solution: 'let puntos = 10\npuntos += 5\npuntos -= 3\n',
        hints: ['El valor cambia: necesitas `let`.', 'Puedes usar `+=` y `-=`.'],
        tests: `
test('puntos vale 12', () => expect(puntos).toBe(12))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué pasa al ejecutar esto?',
        code: 'const x = 1\nx = 2',
        options: ['x vale 2', 'Error: no se puede reasignar una constante', 'x vale 1 y no pasa nada'],
        answer: 1,
        explanation: '`const` impide reasignar la variable.',
      },
      {
        question: '¿Qué palabra usarías para un total que se va acumulando en un bucle?',
        options: ['const', 'let', 'var'],
        answer: 1,
        explanation: 'El valor se reasigna, así que `let`. `var` se evita en código moderno.',
      },
    ],
  },

  a11: {
    lesson: `
Una **función** es un bloque de código con nombre que puedes ejecutar (llamar) muchas veces.

## Declarar y llamar

\`\`\`js
function saludar(nombre) {
  return 'Hola, ' + nombre
}

const mensaje = saludar('Ada') // 'Hola, Ada'
\`\`\`

- \`nombre\` es un **parámetro**: una variable que recibe el valor al llamar la función.
- \`'Ada'\` es el **argumento**: el valor que pasas.
- \`return\` devuelve un resultado y **termina** la función.

## Varios parámetros

\`\`\`js
function sumar(a, b) {
  return a + b
}
sumar(2, 3) // 5
\`\`\`

## Parámetros por defecto

\`\`\`js
function saludar(nombre = 'desconocido') {
  return 'Hola, ' + nombre
}
saludar() // 'Hola, desconocido'
\`\`\`

## Sin return

Si una función no tiene \`return\`, devuelve \`undefined\`.
`,
    exercises: [
      {
        id: 'a11-e1',
        title: 'Área de un rectángulo',
        language: 'javascript',
        prompt: 'Escribe una función `area(ancho, alto)` que devuelva el área del rectángulo.',
        starter: 'function area(ancho, alto) {\n  // tu código\n}\n',
        solution: 'function area(ancho, alto) {\n  return ancho * alto\n}\n',
        hints: ['El área es ancho × alto.', 'No olvides `return`.'],
        tests: `
test('area(2, 3) es 6', () => expect(area(2, 3)).toBe(6))
test('area(10, 0) es 0', () => expect(area(10, 0)).toBe(0))`,
      },
      {
        id: 'a11-e2',
        title: 'Precio con impuesto',
        language: 'javascript',
        prompt: 'Escribe `precioFinal(precio, impuesto)` que devuelva el precio más el impuesto (un porcentaje). Si no se pasa `impuesto`, usa `16`.\n\nEjemplo: `precioFinal(100)` → `116`.',
        starter: 'function precioFinal(precio, impuesto) {\n}\n',
        solution: 'function precioFinal(precio, impuesto = 16) {\n  return precio + (precio * impuesto) / 100\n}\n',
        hints: ['Usa un parámetro por defecto: `impuesto = 16`.', 'El impuesto es `precio * impuesto / 100`.'],
        tests: `
test('precioFinal(100) es 116', () => expect(precioFinal(100)).toBe(116))
test('precioFinal(200, 10) es 220', () => expect(precioFinal(200, 10)).toBe(220))`,
      },
    ],
    quiz: [
      {
        question: '¿Qué devuelve esta función?',
        code: 'function f() {\n  console.log("hola")\n}\nconst r = f()',
        options: ['"hola"', 'undefined', 'null'],
        answer: 1,
        explanation: 'Sin `return`, una función devuelve `undefined`. `console.log` solo imprime.',
      },
    ],
  },
}
