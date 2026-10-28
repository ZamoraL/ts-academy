import type { UnitContent } from '../index'

// Bloque G: React básico. Ejercicios en JSX que corren en el sandbox con vista previa.
// Los tests usan Testing Library: render, screen, userEvent, fireEvent, act, waitFor, within.
// Nombres con prefijo __ para no chocar con variables del alumno.

const MOCK_FETCH = `
function __mockFetch(rutas) {
  const llamadas = []
  globalThis.fetch = async (url) => {
    llamadas.push(String(url))
    await new Promise((r) => setTimeout(r, 10))
    const cuerpo = rutas[String(url)]
    if (cuerpo === undefined) return { ok: false, status: 404, json: async () => ({}) }
    return { ok: true, status: 200, json: async () => cuerpo }
  }
  return llamadas
}
`

export const unitsG: Record<string, UnitContent> = {
  g01: {
    exercises: [
      {
        id: 'g01-e1',
        title: 'Hola, React',
        language: 'javascript',
        react: true,
        prompt: 'Haz que el componente devuelva un título `<h1>` con el texto `Hola, React`. Pulsa **Ejecutar** para verlo en la vista previa.',
        starter: 'export default function Hola() {\n  return null\n}\n',
        solution: 'export default function Hola() {\n  return <h1>Hola, React</h1>\n}\n',
        hints: ['`return <h1>Hola, React</h1>`'],
        tests: `
test('muestra el título', () => {
  render(<Hola />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hola, React')
})`,
      },
    ],
    quiz: [
      {
        question: '¿Qué significa que React sea declarativo?',
        options: [
          'Que describes cómo debe verse la interfaz según el estado, y React actualiza el DOM',
          'Que tienes que declarar todas las variables',
          'Que modificas el DOM paso a paso',
        ],
        answer: 0,
        explanation: 'Describes el qué; React se encarga del cómo.',
      },
    ],
  },

  g02: {
    exercises: [
      {
        id: 'g02-e1',
        title: 'Componer componentes',
        language: 'javascript',
        react: true,
        prompt:
          "Crea un componente `Perfil` que devuelva una imagen (`<img>`) con `src=\"avatares/Persona.svg\"` y `alt=\"Avatar\"`. Luego haz que `Galeria` muestre un título `<h2>Equipo</h2>` y **tres** `Perfil`.",
        starter: 'export default function Galeria() {\n  return <h2>Equipo</h2>\n}\n',
        solution: `function Perfil() {
  return <img src="avatares/Persona.svg" alt="Avatar" />
}

export default function Galeria() {
  return (
    <section>
      <h2>Equipo</h2>
      <Perfil />
      <Perfil />
      <Perfil />
    </section>
  )
}
`,
        hints: ['Declara `function Perfil()` fuera de `Galeria`.', 'Necesitas un elemento raíz (`<section>` o un fragmento `<>...</>`) para devolver varios.'],
        tests: `
test('título', () => {
  render(<Galeria />)
  expect(screen.getByRole('heading', { name: 'Equipo' })).toBeTruthy()
})
test('tres perfiles', () => {
  render(<Galeria />)
  expect(screen.getAllByRole('img', { name: 'Avatar' })).toHaveLength(3)
})
test('Perfil es un componente', () => expect(typeof Perfil).toBe('function'))`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué un componente se llama `Perfil` y no `perfil`?',
        options: ['Por estilo', 'React trata las etiquetas en minúscula como HTML y en mayúscula como componentes', 'Es obligatorio en JavaScript'],
        answer: 1,
        explanation: '`<perfil />` sería una etiqueta HTML desconocida.',
      },
      {
        question: '¿Qué devuelve este componente?',
        code: 'function F() {\n  return\n    <p>Hola</p>\n}',
        options: ['<p>Hola</p>', 'undefined', 'Error de compilación'],
        answer: 1,
        explanation: 'Un `return` solo en su línea devuelve `undefined`. Usa paréntesis.',
      },
    ],
  },

  g03: {
    exercises: [
      {
        id: 'g03-e1',
        title: 'De HTML a JSX',
        language: 'javascript',
        react: true,
        prompt:
          'Este componente tiene HTML pegado tal cual y no compila como JSX. Corrígelo: `class`, `for`, `style` como string y etiquetas sin cerrar.',
        starter: `export default function Contacto() {
  return (
    <form class="tarjeta">
      <label for="email">Email</label>
      <input id="email" type="email">
      <br>
      <p style="color: gray">Nunca compartiremos tu email.</p>
    </form>
  )
}
`,
        solution: `export default function Contacto() {
  return (
    <form className="tarjeta">
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
      <br />
      <p style={{ color: 'gray' }}>Nunca compartiremos tu email.</p>
    </form>
  )
}
`,
        hints: ['`className`, `htmlFor`.', 'Cierra con `/>`: `<input ... />`, `<br />`.', "`style={{ color: 'gray' }}`"],
        tests: `
test('clase', () => {
  const { container } = render(<Contacto />)
  expect(container.querySelector('form.tarjeta')).toBeTruthy()
})
test('label asociado', () => {
  render(<Contacto />)
  expect(screen.getByLabelText('Email').getAttribute('type')).toBe('email')
})
test('estilo', () => {
  render(<Contacto />)
  expect(screen.getByText(/Nunca compartiremos/).style.color).toBe('gray')
})`,
      },
      {
        id: 'g03-e2',
        title: 'Expresiones en llaves',
        language: 'javascript',
        react: true,
        prompt:
          "Usando los datos de `cientifica`, muestra: un `<h2>` con el nombre **en mayúsculas**, un párrafo `Edad: N años` (calculada como `2026 - nacimiento`) y una imagen con `src` = `cientifica.foto` y `alt` = `Foto de <nombre>`.",
        starter: `const cientifica = {
  nombre: 'Hedy Lamarr',
  nacimiento: 1914,
  foto: 'avatares/Hedy.svg',
}

export default function Ficha() {
  return (
    <div>
      <h2>nombre</h2>
    </div>
  )
}
`,
        solution: `const cientifica = {
  nombre: 'Hedy Lamarr',
  nacimiento: 1914,
  foto: 'avatares/Hedy.svg',
}

export default function Ficha() {
  return (
    <div>
      <h2>{cientifica.nombre.toUpperCase()}</h2>
      <p>Edad: {2026 - cientifica.nacimiento} años</p>
      <img src={cientifica.foto} alt={\`Foto de \${cientifica.nombre}\`} />
    </div>
  )
}
`,
        hints: ['Dentro de `{ }` va cualquier expresión: `{cientifica.nombre.toUpperCase()}`.', 'En atributos: `alt={`Foto de ${cientifica.nombre}`}`.'],
        tests: `
test('nombre en mayúsculas', () => {
  render(<Ficha />)
  expect(screen.getByRole('heading')).toHaveTextContent('HEDY LAMARR')
})
test('edad', () => {
  render(<Ficha />)
  expect(screen.getByText(/Edad:/)).toHaveTextContent('Edad: 112 años')
})
test('foto', () => {
  render(<Ficha />)
  expect(screen.getByRole('img', { name: 'Foto de Hedy Lamarr' }).getAttribute('src')).toBe('avatares/Hedy.svg')
})`,
      },
    ],
    quiz: [
      {
        question: '¿Qué muestra `<p>{false}</p>`?',
        options: ['false', 'Nada', 'Error'],
        answer: 1,
        explanation: '`true`, `false`, `null` y `undefined` no se renderizan.',
      },
    ],
  },

  g04: {
    exercises: [
      {
        id: 'g04-e1',
        title: 'Props y valores por defecto',
        language: 'javascript',
        react: true,
        prompt:
          '`Avatar` debe recibir `nombre` y `tamaño` (por defecto `48`) y mostrar una `<img>` con `alt={nombre}`, `width` y `height` iguales a `tamaño`, y `src` = `avatares/<nombre>.svg`. `App` muestra uno de Ada (tamaño 80) y otro de Grace (sin tamaño).',
        starter: `function Avatar() {
  return <img />
}

export default function App() {
  return (
    <div>
      <Avatar />
    </div>
  )
}
`,
        solution: `function Avatar({ nombre, tamaño = 48 }) {
  return <img src={\`avatares/\${nombre}.svg\`} alt={nombre} width={tamaño} height={tamaño} />
}

export default function App() {
  return (
    <div>
      <Avatar nombre="Ada" tamaño={80} />
      <Avatar nombre="Grace" />
    </div>
  )
}
`,
        hints: ['`function Avatar({ nombre, tamaño = 48 })`', 'Los números se pasan con llaves: `tamaño={80}`.', 'Arma el `src` con un template literal: `src={`avatares/${nombre}.svg`}`.'],
        tests: `
test('Avatar con tamaño', () => {
  render(<Avatar nombre="Linus" tamaño={32} />)
  const __img = screen.getByRole('img', { name: 'Linus' })
  expect(__img.getAttribute('width')).toBe('32')
  expect(__img.getAttribute('src')).toBe('avatares/Linus.svg')
})
test('tamaño por defecto', () => {
  render(<Avatar nombre="X" />)
  expect(screen.getByRole('img').getAttribute('height')).toBe('48')
})
test('App', () => {
  render(<App />)
  expect(screen.getByRole('img', { name: 'Ada' }).getAttribute('width')).toBe('80')
  expect(screen.getByRole('img', { name: 'Grace' }).getAttribute('width')).toBe('48')
})`,
      },
      {
        id: 'g04-e2',
        title: 'children',
        language: 'javascript',
        react: true,
        prompt:
          'Crea `Tarjeta({ titulo, children })` que devuelva un `<section>` con un `<h2>` con el título y debajo el contenido recibido. `App` debe usarla con el título `Perfil` y dentro un párrafo `Matemática y escritora`.',
        starter: 'function Tarjeta() {\n  return <section></section>\n}\n\nexport default function App() {\n  return <Tarjeta />\n}\n',
        solution: `function Tarjeta({ titulo, children }) {
  return (
    <section>
      <h2>{titulo}</h2>
      {children}
    </section>
  )
}

export default function App() {
  return (
    <Tarjeta titulo="Perfil">
      <p>Matemática y escritora</p>
    </Tarjeta>
  )
}
`,
        hints: ['Lo que pongas entre `<Tarjeta>` y `</Tarjeta>` llega como `children`.'],
        tests: `
test('Tarjeta renderiza children', () => {
  render(<Tarjeta titulo="T"><button>Dentro</button></Tarjeta>)
  expect(screen.getByRole('heading')).toHaveTextContent('T')
  expect(screen.getByRole('button', { name: 'Dentro' })).toBeTruthy()
})
test('App', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Perfil' })).toBeTruthy()
  expect(screen.getByText('Matemática y escritora')).toBeTruthy()
})`,
      },
    ],
    quiz: [
      {
        question: '¿Puede un componente modificar sus props?',
        options: ['Sí', 'No, las props son de solo lectura'],
        answer: 1,
        explanation: 'Lo que cambia es estado, no props.',
      },
    ],
  },

  g05: {
    exercises: [
      {
        id: 'g05-e1',
        title: 'Mostrar u ocultar',
        language: 'javascript',
        react: true,
        prompt: `Implementa:

- \`Item({ nombre, empacado })\`: un \`<li>\` con el nombre y, si está empacado, \` ✅\` después.
- \`Notificaciones({ cantidad })\`: si \`cantidad > 0\`, un párrafo \`Tienes N mensajes\`; si es 0, **no** muestra nada (ni siquiera un 0).`,
        starter: `function Item({ nombre, empacado }) {
  return <li>{nombre}</li>
}

function Notificaciones({ cantidad }) {
  return <div>{cantidad && <p>Tienes {cantidad} mensajes</p>}</div>
}

export default function App() {
  return (
    <>
      <ul>
        <Item nombre="Pasaporte" empacado={true} />
        <Item nombre="Cargador" empacado={false} />
      </ul>
      <Notificaciones cantidad={0} />
    </>
  )
}
`,
        solution: `function Item({ nombre, empacado }) {
  return (
    <li>
      {nombre}
      {empacado && ' ✅'}
    </li>
  )
}

function Notificaciones({ cantidad }) {
  return <div>{cantidad > 0 && <p>Tienes {cantidad} mensajes</p>}</div>
}

export default function App() {
  return (
    <>
      <ul>
        <Item nombre="Pasaporte" empacado={true} />
        <Item nombre="Cargador" empacado={false} />
      </ul>
      <Notificaciones cantidad={0} />
    </>
  )
}
`,
        hints: ["`{empacado && ' ✅'}`", 'Con `cantidad && ...`, si cantidad es 0 se muestra el 0. Compara: `cantidad > 0 && ...`.'],
        tests: `
test('empacado', () => {
  render(<ul><Item nombre="A" empacado={true} /></ul>)
  expect(screen.getByRole('listitem')).toHaveTextContent('A ✅')
})
test('no empacado', () => {
  render(<ul><Item nombre="B" empacado={false} /></ul>)
  expect(screen.getByRole('listitem').textContent).toBe('B')
})
test('con mensajes', () => {
  render(<Notificaciones cantidad={3} />)
  expect(screen.getByText(/Tienes/)).toHaveTextContent('Tienes 3 mensajes')
})
test('sin mensajes no muestra nada', () => {
  const { container } = render(<Notificaciones cantidad={0} />)
  expect(container.textContent).toBe('')
})`,
      },
      {
        id: 'g05-e2',
        title: 'Estados de carga',
        language: 'javascript',
        react: true,
        prompt:
          "`Estado({ estado, datos })`: si `estado` es `'cargando'` devuelve `<p>Cargando…</p>`; si es `'error'`, `<p role=\"alert\">Algo falló</p>`; si es `'ok'`, una lista `<ul>` con un `<li>` por cada string de `datos`. Usa returns tempranos.",
        starter: 'export default function Estado({ estado = \'ok\', datos = [\'uno\', \'dos\'] }) {\n  return null\n}\n',
        solution: `export default function Estado({ estado = 'ok', datos = ['uno', 'dos'] }) {
  if (estado === 'cargando') return <p>Cargando…</p>
  if (estado === 'error') return <p role="alert">Algo falló</p>
  return (
    <ul>
      {datos.map((d) => (
        <li key={d}>{d}</li>
      ))}
    </ul>
  )
}
`,
        hints: ["`if (estado === 'cargando') return ...`"],
        tests: `
test('cargando', () => {
  render(<Estado estado="cargando" />)
  expect(screen.getByText('Cargando…')).toBeTruthy()
})
test('error', () => {
  render(<Estado estado="error" />)
  expect(screen.getByRole('alert')).toHaveTextContent('Algo falló')
})
test('ok', () => {
  render(<Estado estado="ok" datos={['a', 'b', 'c']} />)
  expect(screen.getAllByRole('listitem')).toHaveLength(3)
})`,
      },
    ],
    quiz: [
      {
        question: '¿Qué muestra `{lista.length && <p>Hay elementos</p>}` si la lista está vacía?',
        options: ['Nada', '0', 'false'],
        answer: 1,
        explanation: 'La expresión vale `0`, y React sí renderiza números.',
      },
    ],
  },

  g06: {
    exercises: [
      {
        id: 'g06-e1',
        title: 'Lista de personas',
        language: 'javascript',
        react: true,
        prompt:
          "`ListaPersonas({ personas, profesion })`: muestra un `<ul>` con un `<li>` por persona con el texto `Nombre: profesión`. Si se pasa `profesion`, muestra solo las de esa profesión. Usa el `id` como `key`. Si no queda ninguna, `<p>Nadie por aquí</p>`.",
        starter: `const PERSONAS = [
  { id: 1, nombre: 'Marie Curie', profesion: 'química' },
  { id: 2, nombre: 'Ada Lovelace', profesion: 'matemática' },
  { id: 3, nombre: 'Rosalind Franklin', profesion: 'química' },
]

function ListaPersonas({ personas, profesion }) {
  return <ul></ul>
}

export default function App() {
  return <ListaPersonas personas={PERSONAS} profesion="química" />
}
`,
        solution: `const PERSONAS = [
  { id: 1, nombre: 'Marie Curie', profesion: 'química' },
  { id: 2, nombre: 'Ada Lovelace', profesion: 'matemática' },
  { id: 3, nombre: 'Rosalind Franklin', profesion: 'química' },
]

function ListaPersonas({ personas, profesion }) {
  const visibles = profesion ? personas.filter((p) => p.profesion === profesion) : personas
  if (visibles.length === 0) return <p>Nadie por aquí</p>
  return (
    <ul>
      {visibles.map((p) => (
        <li key={p.id}>
          {p.nombre}: {p.profesion}
        </li>
      ))}
    </ul>
  )
}

export default function App() {
  return <ListaPersonas personas={PERSONAS} profesion="química" />
}
`,
        hints: ['Filtra primero, luego `map` a `<li key={p.id}>`.'],
        tests: `
test('todas', () => {
  render(<ListaPersonas personas={PERSONAS} />)
  expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Marie Curie: química', 'Ada Lovelace: matemática', 'Rosalind Franklin: química'])
})
test('filtradas', () => {
  render(<ListaPersonas personas={PERSONAS} profesion="matemática" />)
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
})
test('vacía', () => {
  render(<ListaPersonas personas={PERSONAS} profesion="física" />)
  expect(screen.getByText('Nadie por aquí')).toBeTruthy()
})
test('sin avisos de key', () => {
  render(<ListaPersonas personas={PERSONAS} />)
  expect(__logs.some((l) => l.includes('key'))).toBe(false)
})`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué no conviene usar el índice como `key` si la lista se puede reordenar?',
        options: [
          'Porque es más lento',
          'Porque la key dejaría de identificar al mismo elemento y React podría mezclar su estado',
          'Porque los índices empiezan en 0',
        ],
        answer: 1,
        explanation: 'La key debe ser estable para cada dato.',
      },
    ],
  },

  g07: {
    exercises: [
      {
        id: 'g07-e1',
        title: 'Handlers como props',
        language: 'javascript',
        react: true,
        prompt:
          '`Boton({ onClick, children })` debe pasar `onClick` al `<button>`. `Barra({ onPlay, onPausa })` muestra dos `Boton`: **Play** llama a `onPlay` y **Pausa** a `onPausa`.',
        starter: `function Boton({ onClick, children }) {
  return <button>{children}</button>
}

function Barra({ onPlay, onPausa }) {
  return (
    <div>
      <Boton>Play</Boton>
      <Boton>Pausa</Boton>
    </div>
  )
}

export default function App() {
  return <Barra onPlay={() => alert('▶️')} onPausa={() => alert('⏸️')} />
}
`,
        solution: `function Boton({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}

function Barra({ onPlay, onPausa }) {
  return (
    <div>
      <Boton onClick={onPlay}>Play</Boton>
      <Boton onClick={onPausa}>Pausa</Boton>
    </div>
  )
}

export default function App() {
  return <Barra onPlay={() => alert('▶️')} onPausa={() => alert('⏸️')} />
}
`,
        hints: ['`<button onClick={onClick}>`', '`<Boton onClick={onPlay}>Play</Boton>`'],
        tests: `
test('llama al handler correcto', async () => {
  const __llamadas = []
  render(<Barra onPlay={() => __llamadas.push('play')} onPausa={() => __llamadas.push('pausa')} />)
  await userEvent.click(screen.getByRole('button', { name: 'Pausa' }))
  await userEvent.click(screen.getByRole('button', { name: 'Play' }))
  expect(__llamadas).toEqual(['pausa', 'play'])
})
test('no llama al renderizar', () => {
  const __llamadas = []
  render(<Barra onPlay={() => __llamadas.push('play')} onPausa={() => __llamadas.push('pausa')} />)
  expect(__llamadas).toEqual([])
})`,
      },
      {
        id: 'g07-e2',
        title: 'El objeto evento',
        language: 'javascript',
        react: true,
        prompt:
          "`Eco({ onEscribir })`: un `<input>` con label `Texto` que, en cada cambio, llama a `onEscribir` con el **valor actual** del input. Además, un link `<a href=\"#docs\">Docs</a>` que al hacer clic llame a `e.preventDefault()` (no debe navegar) y a `onEscribir('link')`.",
        starter: `export default function Eco({ onEscribir = console.log }) {
  return (
    <div>
      <label>
        Texto
        <input />
      </label>
      <a href="#docs">Docs</a>
    </div>
  )
}
`,
        solution: `export default function Eco({ onEscribir = console.log }) {
  return (
    <div>
      <label>
        Texto
        <input onChange={(e) => onEscribir(e.target.value)} />
      </label>
      <a
        href="#docs"
        onClick={(e) => {
          e.preventDefault()
          onEscribir('link')
        }}
      >
        Docs
      </a>
    </div>
  )
}
`,
        hints: ['`onChange={(e) => onEscribir(e.target.value)}`', 'En el link: `e.preventDefault()` antes de llamar a `onEscribir`.'],
        tests: `
test('eco del valor', async () => {
  const __vals = []
  render(<Eco onEscribir={(v) => __vals.push(v)} />)
  await userEvent.type(screen.getByLabelText('Texto'), 'hey')
  expect(__vals).toEqual(['h', 'he', 'hey'])
})
test('link sin navegar', () => {
  const __vals = []
  render(<Eco onEscribir={(v) => __vals.push(v)} />)
  const __ev = new MouseEvent('click', { bubbles: true, cancelable: true })
  screen.getByRole('link', { name: 'Docs' }).dispatchEvent(__ev)
  expect(__ev.defaultPrevented).toBe(true)
  expect(__vals).toEqual(['link'])
})`,
      },
    ],
    quiz: [
      {
        question: '¿Qué pasa con `<button onClick={guardar()}>`?',
        options: ['Se llama a guardar al hacer clic', 'Se llama a guardar al renderizar', 'Error de sintaxis'],
        answer: 1,
        explanation: 'Estás pasando el resultado de llamar a `guardar`. Pasa la función: `onClick={guardar}`.',
      },
    ],
  },

  g08: {
    exercises: [
      {
        id: 'g08-e1',
        title: 'Contador',
        language: 'javascript',
        react: true,
        prompt: 'Completa `Contador`: muestra `Clics: N` en un párrafo y un botón **Sumar** que incrementa N. Empieza en 0.',
        starter: `import { useState } from 'react'

export default function Contador() {
  return (
    <div>
      <p>Clics: 0</p>
      <button>Sumar</button>
    </div>
  )
}
`,
        solution: `import { useState } from 'react'

export default function Contador() {
  const [clics, setClics] = useState(0)
  return (
    <div>
      <p>Clics: {clics}</p>
      <button onClick={() => setClics(clics + 1)}>Sumar</button>
    </div>
  )
}
`,
        hints: ['`const [clics, setClics] = useState(0)`', '`onClick={() => setClics(clics + 1)}`'],
        tests: `
test('empieza en 0', () => {
  render(<Contador />)
  expect(screen.getByText(/Clics:/)).toHaveTextContent('Clics: 0')
})
test('suma al hacer clic', async () => {
  render(<Contador />)
  await userEvent.click(screen.getByRole('button', { name: 'Sumar' }))
  await userEvent.click(screen.getByRole('button', { name: 'Sumar' }))
  expect(screen.getByText(/Clics:/)).toHaveTextContent('Clics: 2')
})`,
      },
      {
        id: 'g08-e2',
        title: 'Función actualizadora',
        language: 'javascript',
        react: true,
        prompt:
          'El botón **+3** llama tres veces a `setPuntos`, pero solo suma 1. Arréglalo usando la **función actualizadora**. Añade también un botón **Reiniciar** que vuelva a 0, y un estado independiente `visible` (empieza en `true`) con un botón **Ocultar**/**Mostrar** que oculta el marcador.',
        starter: `import { useState } from 'react'

export default function Marcador() {
  const [puntos, setPuntos] = useState(0)

  function sumarTres() {
    setPuntos(puntos + 1)
    setPuntos(puntos + 1)
    setPuntos(puntos + 1)
  }

  return (
    <div>
      <p>Puntos: {puntos}</p>
      <button onClick={sumarTres}>+3</button>
    </div>
  )
}
`,
        solution: `import { useState } from 'react'

export default function Marcador() {
  const [puntos, setPuntos] = useState(0)
  const [visible, setVisible] = useState(true)

  function sumarTres() {
    setPuntos((p) => p + 1)
    setPuntos((p) => p + 1)
    setPuntos((p) => p + 1)
  }

  return (
    <div>
      {visible && <p>Puntos: {puntos}</p>}
      <button onClick={sumarTres}>+3</button>
      <button onClick={() => setPuntos(0)}>Reiniciar</button>
      <button onClick={() => setVisible(!visible)}>{visible ? 'Ocultar' : 'Mostrar'}</button>
    </div>
  )
}
`,
        hints: ['`setPuntos((p) => p + 1)`', 'Otro `useState(true)` para `visible`.'],
        tests: `
const __clic = (n) => userEvent.click(screen.getByRole('button', { name: n }))
test('+3 suma tres', async () => {
  render(<Marcador />)
  await __clic('+3')
  expect(screen.getByText(/Puntos/)).toHaveTextContent('Puntos: 3')
})
test('reiniciar', async () => {
  render(<Marcador />)
  await __clic('+3'); await __clic('Reiniciar')
  expect(screen.getByText(/Puntos/)).toHaveTextContent('Puntos: 0')
})
test('ocultar y mostrar conserva los puntos', async () => {
  render(<Marcador />)
  await __clic('+3'); await __clic('Ocultar')
  expect(screen.queryByText(/Puntos/)).toBeNull()
  await __clic('Mostrar')
  expect(screen.getByText(/Puntos/)).toHaveTextContent('Puntos: 3')
})`,
      },
    ],
    quiz: [
      {
        question: '¿Se puede llamar a `useState` dentro de un `if`?',
        options: ['Sí', 'No: los hooks deben llamarse siempre en el mismo orden, en el nivel superior'],
        answer: 1,
        explanation: 'React identifica cada estado por el orden de las llamadas.',
      },
    ],
  },

  g09: {
    exercises: [
      {
        id: 'g09-e1',
        title: 'Lista de la compra',
        language: 'javascript',
        react: true,
        prompt: `\`ListaCompra\` guarda un array de \`{ id, nombre, comprado }\` en el estado. Implementa:

- un botón **Agregar leche** que añade \`{ nombre: 'Leche', comprado: false }\` (id: el mayor + 1),
- en cada \`<li>\`, un botón con el nombre que alterna \`comprado\` (si está comprado, el \`<li>\` muestra \` ✓\` después del botón),
- un botón **Quitar comprados** que borra los comprados.

Sin mutar el estado.`,
        starter: `import { useState } from 'react'

const INICIAL = [
  { id: 1, nombre: 'Pan', comprado: false },
  { id: 2, nombre: 'Café', comprado: true },
]

export default function ListaCompra() {
  const [items, setItems] = useState(INICIAL)

  return (
    <div>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            <button>{i.nombre}</button>
          </li>
        ))}
      </ul>
      <button>Agregar leche</button>
      <button>Quitar comprados</button>
    </div>
  )
}
`,
        solution: `import { useState } from 'react'

const INICIAL = [
  { id: 1, nombre: 'Pan', comprado: false },
  { id: 2, nombre: 'Café', comprado: true },
]

export default function ListaCompra() {
  const [items, setItems] = useState(INICIAL)

  function agregar() {
    const id = items.reduce((max, i) => Math.max(max, i.id), 0) + 1
    setItems([...items, { id, nombre: 'Leche', comprado: false }])
  }

  function alternar(id) {
    setItems(items.map((i) => (i.id === id ? { ...i, comprado: !i.comprado } : i)))
  }

  return (
    <div>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            <button onClick={() => alternar(i.id)}>{i.nombre}</button>
            {i.comprado && ' ✓'}
          </li>
        ))}
      </ul>
      <button onClick={agregar}>Agregar leche</button>
      <button onClick={() => setItems(items.filter((i) => !i.comprado))}>Quitar comprados</button>
    </div>
  )
}
`,
        hints: ['Añadir: `[...items, nuevo]`.', 'Alternar: `map` con `{ ...i, comprado: !i.comprado }`.', 'Quitar: `filter`.'],
        tests: `
const __clic = (n) => userEvent.click(screen.getByRole('button', { name: n }))
const __textos = () => screen.getAllByRole('listitem').map((li) => li.textContent)
test('estado inicial', () => {
  render(<ListaCompra />)
  expect(__textos()).toEqual(['Pan', 'Café ✓'])
})
test('agregar', async () => {
  render(<ListaCompra />)
  await __clic('Agregar leche')
  expect(__textos()).toEqual(['Pan', 'Café ✓', 'Leche'])
})
test('alternar', async () => {
  render(<ListaCompra />)
  await __clic('Pan')
  expect(__textos()).toEqual(['Pan ✓', 'Café ✓'])
})
test('quitar comprados', async () => {
  render(<ListaCompra />)
  await __clic('Quitar comprados')
  expect(__textos()).toEqual(['Pan'])
})
test('no muta INICIAL', async () => {
  render(<ListaCompra />)
  await __clic('Pan'); await __clic('Agregar leche')
  expect(INICIAL).toEqual([{ id: 1, nombre: 'Pan', comprado: false }, { id: 2, nombre: 'Café', comprado: true }])
})`,
      },
      {
        id: 'g09-e2',
        title: 'Editar un objeto',
        language: 'javascript',
        react: true,
        prompt:
          "`EditorPerfil` guarda `{ nombre: 'Ada', ciudad: 'Londres' }` en **un solo** estado. Dos inputs con labels `Nombre` y `Ciudad` editan cada campo, y un párrafo muestra `Ada vive en Londres`.",
        starter: `import { useState } from 'react'

export default function EditorPerfil() {
  const [perfil, setPerfil] = useState({ nombre: 'Ada', ciudad: 'Londres' })

  return (
    <div>
      <label>
        Nombre
        <input value={perfil.nombre} onChange={(e) => { perfil.nombre = e.target.value }} />
      </label>
      <p>{perfil.nombre} vive en {perfil.ciudad}</p>
    </div>
  )
}
`,
        solution: `import { useState } from 'react'

export default function EditorPerfil() {
  const [perfil, setPerfil] = useState({ nombre: 'Ada', ciudad: 'Londres' })

  return (
    <div>
      <label>
        Nombre
        <input value={perfil.nombre} onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })} />
      </label>
      <label>
        Ciudad
        <input value={perfil.ciudad} onChange={(e) => setPerfil({ ...perfil, ciudad: e.target.value })} />
      </label>
      <p>
        {perfil.nombre} vive en {perfil.ciudad}
      </p>
    </div>
  )
}
`,
        hints: ['`setPerfil({ ...perfil, nombre: e.target.value })`'],
        tests: `
test('editar ciudad', async () => {
  render(<EditorPerfil />)
  const __c = screen.getByLabelText('Ciudad')
  await userEvent.clear(__c)
  await userEvent.type(__c, 'París')
  expect(screen.getByText(/vive en/)).toHaveTextContent('Ada vive en París')
})
test('editar nombre', async () => {
  render(<EditorPerfil />)
  await userEvent.type(screen.getByLabelText('Nombre'), ' L.')
  expect(screen.getByText(/vive en/)).toHaveTextContent('Ada L. vive en Londres')
})`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué `items.push(x); setItems(items)` no actualiza la pantalla?',
        options: [
          'Porque push no funciona en React',
          'Porque es el mismo array: React compara por referencia y no detecta el cambio',
          'Porque falta un await',
        ],
        answer: 1,
        explanation: 'Crea un array nuevo: `setItems([...items, x])`.',
      },
    ],
  },

  g10: {
    exercises: [
      {
        id: 'g10-e1',
        title: 'Formulario de registro',
        language: 'javascript',
        react: true,
        prompt: `\`Registro({ onRegistrar })\`: un \`<form>\` con:

- input \`Email\` y input \`Contraseña\` (\`type="password"\`), ambos con label y controlados,
- checkbox \`Acepto los términos\`,
- botón **Crear cuenta**, deshabilitado hasta que el email contenga \`@\`, la contraseña tenga al menos 8 caracteres y se acepten los términos,
- si la contraseña tiene entre 1 y 7 caracteres, un \`<p>\` con \`Mínimo 8 caracteres\`.

Al enviar: \`preventDefault\`, llama a \`onRegistrar({ email, contraseña })\` y limpia los tres campos.`,
        starter: `import { useState } from 'react'

export default function Registro({ onRegistrar = console.log }) {
  return (
    <form>
      <button type="submit">Crear cuenta</button>
    </form>
  )
}
`,
        solution: `import { useState } from 'react'

export default function Registro({ onRegistrar = console.log }) {
  const [email, setEmail] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [acepto, setAcepto] = useState(false)

  const valido = email.includes('@') && contraseña.length >= 8 && acepto

  function manejarSubmit(e) {
    e.preventDefault()
    if (!valido) return
    onRegistrar({ email, contraseña })
    setEmail('')
    setContraseña('')
    setAcepto(false)
  }

  return (
    <form onSubmit={manejarSubmit}>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Contraseña
        <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
      </label>
      {contraseña.length > 0 && contraseña.length < 8 && <p>Mínimo 8 caracteres</p>}
      <label>
        <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} />
        Acepto los términos
      </label>
      <button type="submit" disabled={!valido}>
        Crear cuenta
      </button>
    </form>
  )
}
`,
        hints: ['Tres `useState`. La validez se **calcula**, no se guarda.', 'Checkbox: `checked` y `e.target.checked`.', '`<form onSubmit={...}>` con `e.preventDefault()`.'],
        tests: `
async function __llenar(email, pass, acepto) {
  if (email) await userEvent.type(screen.getByLabelText('Email'), email)
  if (pass) await userEvent.type(screen.getByLabelText('Contraseña'), pass)
  if (acepto) await userEvent.click(screen.getByLabelText('Acepto los términos'))
}
const __boton = () => screen.getByRole('button', { name: 'Crear cuenta' })
test('deshabilitado al inicio', () => {
  render(<Registro />)
  expect(__boton()).toBeDisabled()
})
test('contraseña corta', async () => {
  render(<Registro />)
  await __llenar('a@b.c', '123', true)
  expect(screen.getByText('Mínimo 8 caracteres')).toBeTruthy()
  expect(__boton()).toBeDisabled()
})
test('sin términos', async () => {
  render(<Registro />)
  await __llenar('a@b.c', '12345678', false)
  expect(__boton()).toBeDisabled()
})
test('envía y limpia', async () => {
  const __envios = []
  render(<Registro onRegistrar={(d) => __envios.push(d)} />)
  await __llenar('ada@x.com', 'secreto123', true)
  await userEvent.click(__boton())
  expect(__envios).toEqual([{ email: 'ada@x.com', contraseña: 'secreto123' }])
  expect(screen.getByLabelText('Email')).toHaveValue('')
  expect(screen.getByLabelText('Acepto los términos').checked).toBe(false)
})`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué usar `<form onSubmit>` en vez de `onClick` en el botón?',
        options: ['Es obligatorio', 'Así también se envía al pulsar Enter, y es más accesible', 'Por rendimiento'],
        answer: 1,
        explanation: 'Y no olvides `e.preventDefault()` para que el navegador no recargue la página.',
      },
    ],
  },

  g11: {
    exercises: [
      {
        id: 'g11-e1',
        title: 'Acordeón',
        language: 'javascript',
        react: true,
        prompt:
          'Ahora cada `Panel` tiene su propio estado y pueden abrirse los dos a la vez. **Levanta el estado** a `Acordeon` para que solo uno esté abierto: `Panel` recibe `abierto` y `onMostrar` por props. El primero empieza abierto.',
        starter: `import { useState } from 'react'

function Panel({ titulo, children }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <section>
      <h3>{titulo}</h3>
      {abierto ? <p>{children}</p> : <button onClick={() => setAbierto(true)}>Mostrar {titulo}</button>}
    </section>
  )
}

export default function Acordeon() {
  return (
    <>
      <Panel titulo="Acerca de">Somos una academia de TypeScript.</Panel>
      <Panel titulo="Contacto">Escríbenos a hola@academia.dev.</Panel>
    </>
  )
}
`,
        solution: `import { useState } from 'react'

function Panel({ titulo, abierto, onMostrar, children }) {
  return (
    <section>
      <h3>{titulo}</h3>
      {abierto ? <p>{children}</p> : <button onClick={onMostrar}>Mostrar {titulo}</button>}
    </section>
  )
}

export default function Acordeon() {
  const [activo, setActivo] = useState(0)
  return (
    <>
      <Panel titulo="Acerca de" abierto={activo === 0} onMostrar={() => setActivo(0)}>
        Somos una academia de TypeScript.
      </Panel>
      <Panel titulo="Contacto" abierto={activo === 1} onMostrar={() => setActivo(1)}>
        Escríbenos a hola@academia.dev.
      </Panel>
    </>
  )
}
`,
        hints: ['El estado `activo` (índice) vive en `Acordeon`.', '`abierto={activo === 0}` y `onMostrar={() => setActivo(0)}`.'],
        tests: `
test('el primero empieza abierto', () => {
  render(<Acordeon />)
  expect(screen.getByText(/Somos una academia/)).toBeTruthy()
  expect(screen.queryByText(/Escríbenos/)).toBeNull()
})
test('abrir el segundo cierra el primero', async () => {
  render(<Acordeon />)
  await userEvent.click(screen.getByRole('button', { name: 'Mostrar Contacto' }))
  expect(screen.getByText(/Escríbenos/)).toBeTruthy()
  expect(screen.queryByText(/Somos una academia/)).toBeNull()
})
test('Panel es controlado', () => {
  render(<Panel titulo="X" abierto={true} onMostrar={() => {}}>contenido</Panel>)
  expect(screen.getByText('contenido')).toBeTruthy()
})`,
      },
      {
        id: 'g11-e2',
        title: 'Conversor de temperatura',
        language: 'javascript',
        react: true,
        prompt:
          'Dos inputs `Celsius` y `Fahrenheit` sincronizados: escribir en uno actualiza el otro (F = C × 9/5 + 32), redondeado a 1 decimal. Guarda **un solo** estado (los grados Celsius como string) en `Conversor` y crea un componente `CampoTemperatura({ label, valor, onCambiar })` que se use dos veces.',
        starter: `import { useState } from 'react'

export default function Conversor() {
  return (
    <div>
      <label>Celsius <input /></label>
      <label>Fahrenheit <input /></label>
    </div>
  )
}
`,
        solution: `import { useState } from 'react'

const redondear = (n) => String(Math.round(n * 10) / 10)

function CampoTemperatura({ label, valor, onCambiar }) {
  return (
    <label>
      {label} <input value={valor} onChange={(e) => onCambiar(e.target.value)} />
    </label>
  )
}

export default function Conversor() {
  const [celsius, setCelsius] = useState('')
  const fahrenheit = celsius === '' ? '' : redondear((Number(celsius) * 9) / 5 + 32)

  return (
    <div>
      <CampoTemperatura label="Celsius" valor={celsius} onCambiar={setCelsius} />
      <CampoTemperatura
        label="Fahrenheit"
        valor={fahrenheit}
        onCambiar={(f) => setCelsius(f === '' ? '' : redondear(((Number(f) - 32) * 5) / 9))}
      />
    </div>
  )
}
`,
        hints: ['Fahrenheit se **calcula** a partir de Celsius en cada render.', 'Al escribir en Fahrenheit, convierte a Celsius y guarda eso.'],
        tests: `
test('celsius a fahrenheit', async () => {
  render(<Conversor />)
  await userEvent.type(screen.getByLabelText('Celsius'), '100')
  expect(screen.getByLabelText('Fahrenheit')).toHaveValue('212')
})
test('fahrenheit a celsius', async () => {
  render(<Conversor />)
  await userEvent.type(screen.getByLabelText('Fahrenheit'), '50')
  expect(screen.getByLabelText('Celsius')).toHaveValue('10')
})
test('CampoTemperatura existe', () => expect(typeof CampoTemperatura).toBe('function'))`,
      },
    ],
    quiz: [
      {
        question: 'Dos componentes hermanos necesitan el mismo dato. ¿Dónde va el estado?',
        options: ['Duplicado en ambos', 'En el ancestro común más cercano', 'En una variable global'],
        answer: 1,
        explanation: 'Los datos bajan por props; los cambios suben por callbacks.',
      },
    ],
  },

  g12: {
    exercises: [
      {
        id: 'g12-e1',
        title: 'Sincronizar el título',
        language: 'javascript',
        react: true,
        prompt:
          "`Titulo({ pendientes })` debe poner `document.title` en `(N) Mis tareas` cada vez que cambie `pendientes`, y devolver un `<h1>Mis tareas</h1>`. Al desmontarse, restaura el título a `TS Academy`.",
        starter: `import { useEffect } from 'react'

export default function Titulo({ pendientes = 3 }) {
  document.title = \`(\${pendientes}) Mis tareas\`
  return <h1>Mis tareas</h1>
}
`,
        solution: `import { useEffect } from 'react'

export default function Titulo({ pendientes = 3 }) {
  useEffect(() => {
    document.title = \`(\${pendientes}) Mis tareas\`
    return () => {
      document.title = 'TS Academy'
    }
  }, [pendientes])
  return <h1>Mis tareas</h1>
}
`,
        hints: ['`useEffect(() => { ... }, [pendientes])`', 'La función que devuelve el efecto es la limpieza.'],
        tests: `
test('actualiza el título', () => {
  const { rerender } = render(<Titulo pendientes={2} />)
  expect(document.title).toBe('(2) Mis tareas')
  rerender(<Titulo pendientes={5} />)
  expect(document.title).toBe('(5) Mis tareas')
})
test('restaura al desmontar', () => {
  const { unmount } = render(<Titulo pendientes={1} />)
  unmount()
  expect(document.title).toBe('TS Academy')
})`,
      },
      {
        id: 'g12-e2',
        title: 'Cargar datos',
        language: 'javascript',
        react: true,
        prompt:
          "`Usuario({ id })`: al montarse (y cuando cambie `id`), pide `https://api.test/usuarios/<id>` con `fetch`. Mientras carga muestra `Cargando…`; cuando llega, un `<h2>` con `nombre`; si la respuesta no es `ok`, `<p role=\"alert\">No encontrado</p>`. Ignora respuestas de un `id` anterior.",
        starter: `import { useEffect, useState } from 'react'

export default function Usuario({ id = 1 }) {
  return <p>Cargando…</p>
}
`,
        solution: `import { useEffect, useState } from 'react'

export default function Usuario({ id = 1 }) {
  const [estado, setEstado] = useState({ tipo: 'cargando' })

  useEffect(() => {
    let cancelado = false
    setEstado({ tipo: 'cargando' })
    fetch(\`https://api.test/usuarios/\${id}\`)
      .then(async (r) => {
        if (cancelado) return
        if (!r.ok) return setEstado({ tipo: 'error' })
        const datos = await r.json()
        if (!cancelado) setEstado({ tipo: 'ok', usuario: datos })
      })
      .catch(() => {
        if (!cancelado) setEstado({ tipo: 'error' })
      })
    return () => {
      cancelado = true
    }
  }, [id])

  if (estado.tipo === 'cargando') return <p>Cargando…</p>
  if (estado.tipo === 'error') return <p role="alert">No encontrado</p>
  return <h2>{estado.usuario.nombre}</h2>
}
`,
        hints: ['Un solo estado con `tipo: \'cargando\' | \'ok\' | \'error\'` evita estados imposibles.', 'Usa una variable `cancelado` y la limpieza del efecto.'],
        tests: `${MOCK_FETCH}
test('carga y muestra', async () => {
  __mockFetch({ 'https://api.test/usuarios/1': { nombre: 'Ada' } })
  render(<Usuario id={1} />)
  expect(screen.getByText('Cargando…')).toBeTruthy()
  expect(await screen.findByRole('heading', { name: 'Ada' })).toBeTruthy()
})
test('no encontrado', async () => {
  __mockFetch({})
  render(<Usuario id={9} />)
  expect(await screen.findByRole('alert')).toHaveTextContent('No encontrado')
})
test('cambia de id', async () => {
  const __llamadas = __mockFetch({ 'https://api.test/usuarios/1': { nombre: 'Ada' }, 'https://api.test/usuarios/2': { nombre: 'Grace' } })
  const { rerender } = render(<Usuario id={1} />)
  rerender(<Usuario id={2} />)
  expect(await screen.findByRole('heading', { name: 'Grace' })).toBeTruthy()
  await new Promise((r) => setTimeout(r, 30))
  expect(screen.getByRole('heading')).toHaveTextContent('Grace')
  expect(__llamadas).toEqual(['https://api.test/usuarios/1', 'https://api.test/usuarios/2'])
})`,
      },
    ],
    quiz: [
      {
        question: '¿Cuándo se ejecuta `useEffect(fn, [])`?',
        options: ['En cada render', 'Solo después del primer render', 'Nunca'],
        answer: 1,
        explanation: 'Con dependencias vacías, solo al montar (y su limpieza al desmontar).',
      },
      {
        question: 'Necesitas mostrar las tareas filtradas. ¿Qué haces?',
        options: [
          'Un estado `filtradas` actualizado con useEffect',
          'Calcularlas en el render: `const filtradas = tareas.filter(...)`',
        ],
        answer: 1,
        explanation: 'No uses efectos para datos derivados.',
      },
    ],
  },

  g13: {
    exercises: [
      {
        id: 'g13-e1',
        title: 'App de tareas',
        language: 'javascript',
        react: true,
        prompt: 'Construye la app completa descrita en la lección. Exporta `App` por defecto.',
        starter: `import { useState } from 'react'

export default function App() {
  return (
    <main>
      <h1>Mis tareas</h1>
    </main>
  )
}
`,
        solution: `import { useState } from 'react'

const FILTROS = {
  Todas: () => true,
  Pendientes: (t) => !t.hecha,
  Hechas: (t) => t.hecha,
}

function Formulario({ onAgregar }) {
  const [titulo, setTitulo] = useState('')
  function manejarSubmit(e) {
    e.preventDefault()
    const limpio = titulo.trim()
    if (!limpio) return
    onAgregar(limpio)
    setTitulo('')
  }
  return (
    <form onSubmit={manejarSubmit}>
      <label>
        Nueva tarea
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </label>
      <button type="submit">Agregar</button>
    </form>
  )
}

function Filtros({ filtro, onCambiar }) {
  return (
    <div>
      {Object.keys(FILTROS).map((f) => (
        <button key={f} aria-pressed={filtro === f} onClick={() => onCambiar(f)}>
          {f}
        </button>
      ))}
    </div>
  )
}

function ItemTarea({ tarea, onAlternar, onBorrar }) {
  return (
    <li>
      <label>
        <input type="checkbox" checked={tarea.hecha} onChange={() => onAlternar(tarea.id)} />
        {tarea.titulo}
      </label>
      <button aria-label={\`Borrar \${tarea.titulo}\`} onClick={() => onBorrar(tarea.id)}>
        Borrar
      </button>
    </li>
  )
}

function Lista({ tareas, onAlternar, onBorrar }) {
  if (tareas.length === 0) return <p>No hay tareas</p>
  return (
    <ul>
      {tareas.map((t) => (
        <ItemTarea key={t.id} tarea={t} onAlternar={onAlternar} onBorrar={onBorrar} />
      ))}
    </ul>
  )
}

function Resumen({ pendientes }) {
  return <p>{pendientes} {pendientes === 1 ? 'pendiente' : 'pendientes'}</p>
}

export default function App() {
  const [tareas, setTareas] = useState([])
  const [filtro, setFiltro] = useState('Todas')

  function agregar(titulo) {
    const id = tareas.reduce((max, t) => Math.max(max, t.id), 0) + 1
    setTareas([...tareas, { id, titulo, hecha: false }])
  }

  function alternar(id) {
    setTareas(tareas.map((t) => (t.id === id ? { ...t, hecha: !t.hecha } : t)))
  }

  function borrar(id) {
    setTareas(tareas.filter((t) => t.id !== id))
  }

  return (
    <main>
      <h1>Mis tareas</h1>
      <Formulario onAgregar={agregar} />
      <Filtros filtro={filtro} onCambiar={setFiltro} />
      <Lista tareas={tareas.filter(FILTROS[filtro])} onAlternar={alternar} onBorrar={borrar} />
      <Resumen pendientes={tareas.filter((t) => !t.hecha).length} />
    </main>
  )
}
`,
        hints: [
          'Empieza por el estado en `App` y el formulario; luego la lista; luego filtros y resumen.',
          'Un objeto `{ Todas: () => true, Pendientes: (t) => !t.hecha, ... }` simplifica los filtros.',
          'El label del checkbox puede envolver al input y al título: `<label><input type="checkbox" />{titulo}</label>`.',
        ],
        tests: `
async function __agregar(t) {
  await userEvent.type(screen.getByLabelText('Nueva tarea'), t + '{Enter}')
}
const __items = () => screen.queryAllByRole('listitem').map((li) => li.querySelector('label').textContent)
test('vacía al inicio', () => {
  render(<App />)
  expect(screen.getByText('No hay tareas')).toBeTruthy()
  expect(screen.getByText(/pendiente/)).toHaveTextContent('0 pendientes')
})
test('agregar con Enter y limpia', async () => {
  render(<App />)
  await __agregar('Leer')
  expect(__items()).toEqual(['Leer'])
  expect(screen.getByLabelText('Nueva tarea')).toHaveValue('')
  expect(screen.getByText(/pendiente/)).toHaveTextContent('1 pendiente')
})
test('ignora títulos vacíos', async () => {
  render(<App />)
  await __agregar('   ')
  expect(screen.getByText('No hay tareas')).toBeTruthy()
})
test('marcar como hecha y filtrar', async () => {
  render(<App />)
  await __agregar('A'); await __agregar('B')
  await userEvent.click(screen.getByLabelText('A'))
  expect(screen.getByText(/pendiente/)).toHaveTextContent('1 pendiente')
  await userEvent.click(screen.getByRole('button', { name: 'Hechas' }))
  expect(__items()).toEqual(['A'])
  expect(screen.getByRole('button', { name: 'Hechas' }).getAttribute('aria-pressed')).toBe('true')
  await userEvent.click(screen.getByRole('button', { name: 'Pendientes' }))
  expect(__items()).toEqual(['B'])
})
test('borrar', async () => {
  render(<App />)
  await __agregar('A'); await __agregar('B')
  await userEvent.click(screen.getByRole('button', { name: 'Borrar A' }))
  expect(__items()).toEqual(['B'])
})`,
      },
    ],
    quiz: [
      {
        question: '¿Dónde vive el estado `filtro` y por qué?',
        options: [
          'En Filtros, porque es quien lo cambia',
          'En App, porque lo necesitan Filtros (para mostrarlo) y la lista (para filtrar)',
          'En Lista',
        ],
        answer: 1,
        explanation: 'Ancestro común de quienes lo usan.',
      },
    ],
  },
}
