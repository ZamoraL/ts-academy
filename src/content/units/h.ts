import type { UnitContent } from '../index'

// Bloque H: React + TypeScript. Ejercicios .tsx: vista previa + comprobación de tipos.
// Los tests (no se comprueban sus tipos) usan Testing Library. Nombres con prefijo __.

const MOCK_FETCH = `
function __mockFetch(rutas: Record<string, unknown>) {
  const llamadas: string[] = []
  globalThis.fetch = (async (url: string) => {
    llamadas.push(String(url))
    await new Promise((r) => setTimeout(r, 10))
    const cuerpo = rutas[String(url)]
    if (cuerpo === undefined) return { ok: false, status: 404, json: async () => ({}) }
    return { ok: true, status: 200, json: async () => cuerpo }
  }) as any
  return llamadas
}
`

export const unitsH: Record<string, UnitContent> = {
  h01: {
    exercises: [
      {
        id: 'h01-e1',
        title: 'Tu primer .tsx',
        language: 'typescript',
        react: true,
        prompt:
          "Este componente funcionaba en JSX, pero en TSX hay errores: las props no tienen tipo. Tipa `Saludo` (`nombre`: string, `veces`: number opcional, por defecto 1) para que no queden errores. Debe mostrar `¡Hola, Ada!` repetido `veces` veces (separado por espacios) en un `<p>`.",
        starter: `function Saludo({ nombre, veces = 1 }) {
  return <p>{Array(veces).fill(\`¡Hola, \${nombre}!\`).join(' ')}</p>
}

export default function App() {
  return <Saludo nombre="Ada" veces={2} />
}
`,
        solution: `function Saludo({ nombre, veces = 1 }: { nombre: string; veces?: number }) {
  return <p>{Array(veces).fill(\`¡Hola, \${nombre}!\`).join(' ')}</p>
}

export default function App() {
  return <Saludo nombre="Ada" veces={2} />
}
`,
        hints: ['`{ nombre, veces = 1 }: { nombre: string; veces?: number }`'],
        tests: `
test('repite', () => {
  render(<Saludo nombre="Ada" veces={2} />)
  expect(screen.getByText(/Hola/).textContent).toBe('¡Hola, Ada! ¡Hola, Ada!')
})
test('una vez por defecto', () => {
  render(<Saludo nombre="Grace" />)
  expect(screen.getByText(/Hola/).textContent).toBe('¡Hola, Grace!')
})`,
        typeTests: `
const _ok = <Saludo nombre="x" />
// @ts-expect-error nombre debe ser string
const _mal = <Saludo nombre={1} />
// @ts-expect-error falta nombre
const _falta = <Saludo />`,
      },
    ],
    quiz: [
      {
        question: '¿Qué extensión usa un archivo con JSX en un proyecto TypeScript?',
        options: ['.ts', '.tsx', '.jsx'],
        answer: 1,
        explanation: 'Los archivos sin JSX siguen siendo .ts.',
      },
    ],
  },

  h02: {
    exercises: [
      {
        id: 'h02-e1',
        title: 'Botón tipado',
        language: 'typescript',
        react: true,
        prompt: `Crea \`Boton\` cuyas props **extiendan** las de un \`<button>\` nativo (\`ComponentProps<'button'>\`) y añadan \`variante?: 'primario' | 'peligro'\` (por defecto \`'primario'\`). Debe renderizar un \`<button>\` con \`className={\`btn btn-\${variante}\`}\` y pasar el resto de props (\`onClick\`, \`disabled\`, \`type\`, \`children\`...).`,
        starter: `export default function Boton(props) {
  return <button>{props.children}</button>
}
`,
        solution: `import type { ComponentProps } from 'react'

interface BotonProps extends ComponentProps<'button'> {
  variante?: 'primario' | 'peligro'
}

export default function Boton({ variante = 'primario', ...resto }: BotonProps) {
  return <button className={\`btn btn-\${variante}\`} {...resto} />
}
`,
        hints: ["`interface BotonProps extends ComponentProps<'button'> { variante?: ... }`", 'Desestructura `variante` y pasa `{...resto}` al `<button>`.'],
        tests: `
test('clase por variante', () => {
  render(<Boton variante="peligro">Borrar</Boton>)
  expect(screen.getByRole('button', { name: 'Borrar' }).className).toBe('btn btn-peligro')
})
test('variante por defecto', () => {
  render(<Boton>OK</Boton>)
  expect(screen.getByRole('button').className).toBe('btn btn-primario')
})
test('pasa props nativas', async () => {
  let __n = 0
  render(<Boton onClick={() => { __n++ }} type="submit">Ir</Boton>)
  await userEvent.click(screen.getByRole('button'))
  expect(__n).toBe(1)
  expect(screen.getByRole('button').getAttribute('type')).toBe('submit')
})`,
        typeTests: `
const _a = <Boton disabled aria-label="x" onClick={(e) => e.currentTarget.blur()}>x</Boton>
// @ts-expect-error variante inválida
const _b = <Boton variante="enorme">x</Boton>`,
      },
      {
        id: 'h02-e2',
        title: 'Props discriminadas',
        language: 'typescript',
        react: true,
        prompt: `Define \`AvisoProps\` como unión discriminada por \`tipo\`:

- \`{ tipo: 'exito'; mensaje: string }\` → \`<p role="status">✅ mensaje</p>\`
- \`{ tipo: 'error'; mensaje: string; onReintentar: () => void }\` → \`<div role="alert">\` con \`❌ mensaje\` y un botón **Reintentar**.

Así TS exige \`onReintentar\` solo en los errores.`,
        starter: `export default function Aviso(props: { tipo: string; mensaje: string; onReintentar?: () => void }) {
  return <p>{props.mensaje}</p>
}
`,
        solution: `type AvisoProps =
  | { tipo: 'exito'; mensaje: string }
  | { tipo: 'error'; mensaje: string; onReintentar: () => void }

export default function Aviso(props: AvisoProps) {
  if (props.tipo === 'exito') return <p role="status">✅ {props.mensaje}</p>
  return (
    <div role="alert">
      ❌ {props.mensaje}
      <button onClick={props.onReintentar}>Reintentar</button>
    </div>
  )
}
`,
        hints: ['No desestructures en el parámetro: necesitas `props.tipo` para estrechar la unión.'],
        tests: `
test('éxito', () => {
  render(<Aviso tipo="exito" mensaje="Guardado" />)
  expect(screen.getByRole('status')).toHaveTextContent('✅ Guardado')
})
test('error con reintentar', async () => {
  let __n = 0
  render(<Aviso tipo="error" mensaje="Falló" onReintentar={() => { __n++ }} />)
  expect(screen.getByRole('alert')).toHaveTextContent('❌ Falló')
  await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
  expect(__n).toBe(1)
})`,
        typeTests: `
// @ts-expect-error un error necesita onReintentar
const _a = <Aviso tipo="error" mensaje="x" />
// @ts-expect-error tipo desconocido
const _b = <Aviso tipo="info" mensaje="x" />`,
      },
    ],
    quiz: [
      {
        question: '¿Qué tipo usas para `children` que puede ser JSX, texto o nada?',
        options: ['JSX.Element', 'ReactNode', 'string'],
        answer: 1,
        explanation: '`ReactNode` cubre todo lo que React puede renderizar.',
      },
    ],
  },

  h03: {
    exercises: [
      {
        id: 'h03-e1',
        title: 'Estado que empieza en null',
        language: 'typescript',
        react: true,
        prompt:
          "`Perfil` tiene un estado `usuario` que empieza en `null`. El botón **Iniciar sesión** lo pone en `{ nombre: 'Ada', email: 'ada@x.com' }` y **Salir** lo vuelve a `null`. Con usuario, muestra `<p>Hola, Ada (ada@x.com)</p>` y el botón Salir; sin usuario, `<p>Nadie conectado</p>` y el botón Iniciar sesión. Corrige los errores de tipo.",
        starter: `import { useState } from 'react'

interface Usuario {
  nombre: string
  email: string
}

export default function Perfil() {
  const [usuario, setUsuario] = useState(null)

  return (
    <div>
      <p>Hola, {usuario.nombre} ({usuario.email})</p>
      <button onClick={() => setUsuario({ nombre: 'Ada', email: 'ada@x.com' })}>Iniciar sesión</button>
    </div>
  )
}
`,
        solution: `import { useState } from 'react'

interface Usuario {
  nombre: string
  email: string
}

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  if (!usuario) {
    return (
      <div>
        <p>Nadie conectado</p>
        <button onClick={() => setUsuario({ nombre: 'Ada', email: 'ada@x.com' })}>Iniciar sesión</button>
      </div>
    )
  }

  return (
    <div>
      <p>
        Hola, {usuario.nombre} ({usuario.email})
      </p>
      <button onClick={() => setUsuario(null)}>Salir</button>
    </div>
  )
}
`,
        hints: ['`useState<Usuario | null>(null)`', 'Un `if (!usuario) return ...` estrecha el tipo para el resto.'],
        tests: `
test('flujo', async () => {
  render(<Perfil />)
  expect(screen.getByText('Nadie conectado')).toBeTruthy()
  await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
  expect(screen.getByText(/Hola/)).toHaveTextContent('Hola, Ada (ada@x.com)')
  await userEvent.click(screen.getByRole('button', { name: 'Salir' }))
  expect(screen.getByText('Nadie conectado')).toBeTruthy()
})`,
      },
      {
        id: 'h03-e2',
        title: 'Filtro con unión de literales',
        language: 'typescript',
        react: true,
        prompt:
          "Define `type Talla = 'S' | 'M' | 'L'` y un estado `talla` tipado con ella (inicial `'M'`). Renderiza un botón por talla (con `aria-pressed` en la activa) y un párrafo `Talla elegida: M`. Además, `tallas` (el array de las tres) debe ser `useState<Talla[]>` de las seleccionadas como favoritas, con un botón **Favorita** que añade la talla actual (sin duplicados) y un párrafo `Favoritas: S, L`.",
        starter: `import { useState } from 'react'

const TALLAS = ['S', 'M', 'L']

export default function Tallas() {
  const [talla, setTalla] = useState('M')
  const [favoritas, setFavoritas] = useState([])

  return (
    <div>
      {TALLAS.map((t) => (
        <button key={t} onClick={() => setTalla(t)}>{t}</button>
      ))}
      <p>Talla elegida: {talla}</p>
    </div>
  )
}
`,
        solution: `import { useState } from 'react'

type Talla = 'S' | 'M' | 'L'
const TALLAS: Talla[] = ['S', 'M', 'L']

export default function Tallas() {
  const [talla, setTalla] = useState<Talla>('M')
  const [favoritas, setFavoritas] = useState<Talla[]>([])

  function marcarFavorita() {
    if (!favoritas.includes(talla)) setFavoritas([...favoritas, talla])
  }

  return (
    <div>
      {TALLAS.map((t) => (
        <button key={t} aria-pressed={t === talla} onClick={() => setTalla(t)}>
          {t}
        </button>
      ))}
      <p>Talla elegida: {talla}</p>
      <button onClick={marcarFavorita}>Favorita</button>
      <p>Favoritas: {favoritas.join(', ')}</p>
    </div>
  )
}
`,
        hints: ['`useState<Talla>(\'M\')` y `useState<Talla[]>([])`.', 'Sin el genérico, `useState([])` es `never[]`.'],
        tests: `
const __clic = (n: string) => userEvent.click(screen.getByRole('button', { name: n }))
test('elegir y favoritas', async () => {
  render(<Tallas />)
  await __clic('S'); await __clic('Favorita'); await __clic('Favorita')
  await __clic('L'); await __clic('Favorita')
  expect(screen.getByText(/Talla elegida/)).toHaveTextContent('Talla elegida: L')
  expect(screen.getByText(/Favoritas/)).toHaveTextContent('Favoritas: S, L')
  expect(screen.getByRole('button', { name: 'L' }).getAttribute('aria-pressed')).toBe('true')
})`,
        typeTests: `
type _t = Expect<Equal<Talla, 'S' | 'M' | 'L'>>`,
      },
    ],
    quiz: [
      {
        question: '¿Qué tipo tiene `x` en `const [x] = useState([])`?',
        options: ['unknown[]', 'never[]', 'any[]'],
        answer: 1,
        explanation: 'Un array vacío sin anotar se infiere como `never[]`: usa el genérico.',
      },
    ],
  },

  h04: {
    exercises: [
      {
        id: 'h04-e1',
        title: 'Contador con reducer',
        language: 'typescript',
        react: true,
        prompt: `Exporta \`type Accion\` (unión de \`incrementar\`, \`decrementar\`, \`reiniciar\` y \`{ tipo: 'cambiarPaso'; paso: number }\`) y \`reducer(estado: Estado, accion: Accion): Estado\` con un \`default\` exhaustivo. El componente muestra \`<p>Valor: N</p>\`, botones **+**, **−** y **Reiniciar**, y un input numérico con label \`Paso\`.`,
        starter: `import { useReducer } from 'react'

export interface Estado {
  valor: number
  paso: number
}

export default function Contador() {
  return <p>Valor: 0</p>
}
`,
        solution: `import { useReducer } from 'react'

export interface Estado {
  valor: number
  paso: number
}

export type Accion =
  | { tipo: 'incrementar' }
  | { tipo: 'decrementar' }
  | { tipo: 'reiniciar' }
  | { tipo: 'cambiarPaso'; paso: number }

export function reducer(estado: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case 'incrementar':
      return { ...estado, valor: estado.valor + estado.paso }
    case 'decrementar':
      return { ...estado, valor: estado.valor - estado.paso }
    case 'reiniciar':
      return { ...estado, valor: 0 }
    case 'cambiarPaso':
      return { ...estado, paso: accion.paso }
    default: {
      const _exhaustivo: never = accion
      return _exhaustivo
    }
  }
}

export default function Contador() {
  const [estado, dispatch] = useReducer(reducer, { valor: 0, paso: 1 })
  return (
    <div>
      <p>Valor: {estado.valor}</p>
      <button onClick={() => dispatch({ tipo: 'incrementar' })}>+</button>
      <button onClick={() => dispatch({ tipo: 'decrementar' })}>−</button>
      <button onClick={() => dispatch({ tipo: 'reiniciar' })}>Reiniciar</button>
      <label>
        Paso
        <input
          type="number"
          value={estado.paso}
          onChange={(e) => dispatch({ tipo: 'cambiarPaso', paso: Number(e.target.value) })}
        />
      </label>
    </div>
  )
}
`,
        hints: ['El reducer es una función pura con un `switch (accion.tipo)`.', '`const [estado, dispatch] = useReducer(reducer, { valor: 0, paso: 1 })`'],
        tests: `
test('reducer puro', () => {
  expect(reducer({ valor: 1, paso: 5 }, { tipo: 'incrementar' })).toEqual({ valor: 6, paso: 5 })
  expect(reducer({ valor: 1, paso: 5 }, { tipo: 'cambiarPaso', paso: 2 })).toEqual({ valor: 1, paso: 2 })
})
test('interfaz', async () => {
  render(<Contador />)
  const __p = screen.getByLabelText('Paso')
  await userEvent.clear(__p)
  await userEvent.type(__p, '3')
  await userEvent.click(screen.getByRole('button', { name: '+' }))
  await userEvent.click(screen.getByRole('button', { name: '+' }))
  await userEvent.click(screen.getByRole('button', { name: '−' }))
  expect(screen.getByText(/Valor/)).toHaveTextContent('Valor: 3')
  await userEvent.click(screen.getByRole('button', { name: 'Reiniciar' }))
  expect(screen.getByText(/Valor/)).toHaveTextContent('Valor: 0')
})`,
        typeTests: `
type _t = Expect<Equal<Accion['tipo'], 'incrementar' | 'decrementar' | 'reiniciar' | 'cambiarPaso'>>
// @ts-expect-error cambiarPaso necesita paso
reducer({ valor: 0, paso: 1 }, { tipo: 'cambiarPaso' })`,
      },
    ],
    quiz: [
      {
        question: '¿Puede un reducer llamar a `fetch` o a `Math.random()`?',
        options: ['Sí', 'No: debe ser puro; los valores aleatorios o externos van en la acción'],
        answer: 1,
        explanation: 'Mismo estado + misma acción = mismo resultado.',
      },
    ],
  },

  h05: {
    exercises: [
      {
        id: 'h05-e1',
        title: 'Handlers con nombre',
        language: 'typescript',
        react: true,
        prompt: `\`Buscador({ onBuscar })\` (con \`onBuscar: (texto: string) => void\`) tiene un formulario con un input (label \`Buscar\`). Escribe los handlers como **funciones con nombre y tipadas** (no inline):

- \`manejarCambio(e: ChangeEvent<HTMLInputElement>)\`: actualiza el estado.
- \`manejarTecla(e: KeyboardEvent<HTMLInputElement>)\`: con \`Escape\`, vacía el input.
- \`manejarSubmit(e: FormEvent<HTMLFormElement>)\`: \`preventDefault\` y llama a \`onBuscar\` con el texto sin espacios alrededor (si no está vacío).`,
        starter: `import { useState } from 'react'

export default function Buscador({ onBuscar = console.log }) {
  const [texto, setTexto] = useState('')

  function manejarCambio(e) {
    setTexto(e.target.value)
  }

  return (
    <form>
      <label>
        Buscar
        <input value={texto} onChange={manejarCambio} />
      </label>
    </form>
  )
}
`,
        solution: `import { useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'

interface BuscadorProps {
  onBuscar?: (texto: string) => void
}

export default function Buscador({ onBuscar = console.log }: BuscadorProps) {
  const [texto, setTexto] = useState('')

  function manejarCambio(e: ChangeEvent<HTMLInputElement>) {
    setTexto(e.target.value)
  }

  function manejarTecla(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') setTexto('')
  }

  function manejarSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const limpio = texto.trim()
    if (limpio) onBuscar(limpio)
  }

  return (
    <form onSubmit={manejarSubmit}>
      <label>
        Buscar
        <input value={texto} onChange={manejarCambio} onKeyDown={manejarTecla} />
      </label>
    </form>
  )
}
`,
        hints: ["`import { type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'`", 'Si no recuerdas un tipo, escribe el handler inline y pasa el ratón sobre `e`.'],
        tests: `
test('buscar con Enter', async () => {
  const __b: string[] = []
  render(<Buscador onBuscar={(t: string) => __b.push(t)} />)
  await userEvent.type(screen.getByLabelText('Buscar'), '  react  {Enter}')
  expect(__b).toEqual(['react'])
})
test('Escape vacía', async () => {
  render(<Buscador />)
  const __i = screen.getByLabelText('Buscar')
  await userEvent.type(__i, 'hola{Escape}')
  expect(__i).toHaveValue('')
})
test('vacío no busca', async () => {
  const __b: string[] = []
  render(<Buscador onBuscar={(t: string) => __b.push(t)} />)
  await userEvent.type(screen.getByLabelText('Buscar'), '   {Enter}')
  expect(__b).toEqual([])
})`,
        typeTests: `
// @ts-expect-error onBuscar recibe un string
const _a = <Buscador onBuscar={(n: number) => n} />`,
      },
    ],
    quiz: [
      {
        question: '¿Qué tipo tiene `e.target.value` en un `<input type="number">`?',
        options: ['number', 'string', 'number | string'],
        answer: 1,
        explanation: 'Siempre string. Usa `valueAsNumber` o `Number(...)`.',
      },
    ],
  },

  h06: {
    exercises: [
      {
        id: 'h06-e1',
        title: 'Enfocar con una ref',
        language: 'typescript',
        react: true,
        prompt:
          'Crea una ref tipada para el input (label `Nombre`). El botón **Editar** debe enfocar el input y seleccionar su texto (`select()`).',
        starter: `import { useRef } from 'react'

export default function Editor() {
  const inputRef = useRef(null)

  return (
    <div>
      <label>
        Nombre
        <input ref={inputRef} defaultValue="Ada" />
      </label>
      <button onClick={() => inputRef.current.focus()}>Editar</button>
    </div>
  )
}
`,
        solution: `import { useRef } from 'react'

export default function Editor() {
  const inputRef = useRef<HTMLInputElement>(null)

  function editar() {
    inputRef.current?.focus()
    inputRef.current?.select()
  }

  return (
    <div>
      <label>
        Nombre
        <input ref={inputRef} defaultValue="Ada" />
      </label>
      <button onClick={editar}>Editar</button>
    </div>
  )
}
`,
        hints: ['`useRef<HTMLInputElement>(null)`', '`current` puede ser `null`: usa `?.`.'],
        tests: `
test('enfoca y selecciona', async () => {
  render(<Editor />)
  await userEvent.click(screen.getByRole('button', { name: 'Editar' }))
  const __i = screen.getByLabelText('Nombre') as HTMLInputElement
  expect(document.activeElement).toBe(__i)
  expect(__i.selectionStart).toBe(0)
  expect(__i.selectionEnd).toBe(3)
})`,
      },
      {
        id: 'h06-e2',
        title: 'Cronómetro',
        language: 'typescript',
        react: true,
        prompt:
          '`Cronometro({ intervaloMs = 1000 })` muestra `<p>Ticks: N</p>` y botones **Iniciar** y **Parar**. Guarda el id del intervalo en una **ref** (no en el estado). Iniciar dos veces no debe crear dos intervalos. Limpia el intervalo al desmontar.',
        starter: `import { useRef, useState } from 'react'

export default function Cronometro({ intervaloMs = 1000 }) {
  const [ticks, setTicks] = useState(0)
  let id = null

  return (
    <div>
      <p>Ticks: {ticks}</p>
      <button onClick={() => { id = setInterval(() => setTicks(ticks + 1), intervaloMs) }}>Iniciar</button>
      <button onClick={() => clearInterval(id)}>Parar</button>
    </div>
  )
}
`,
        solution: `import { useEffect, useRef, useState } from 'react'

export default function Cronometro({ intervaloMs = 1000 }: { intervaloMs?: number }) {
  const [ticks, setTicks] = useState(0)
  const intervalo = useRef<number | null>(null)

  function parar() {
    if (intervalo.current !== null) clearInterval(intervalo.current)
    intervalo.current = null
  }

  function iniciar() {
    if (intervalo.current !== null) return
    intervalo.current = window.setInterval(() => setTicks((t) => t + 1), intervaloMs)
  }

  useEffect(() => parar, [])

  return (
    <div>
      <p>Ticks: {ticks}</p>
      <button onClick={iniciar}>Iniciar</button>
      <button onClick={parar}>Parar</button>
    </div>
  )
}
`,
        hints: ['`useRef<number | null>(null)` y `window.setInterval`.', 'Usa la función actualizadora: `setTicks((t) => t + 1)` (si no, el closure ve siempre el mismo `ticks`).', 'Limpieza al desmontar: `useEffect(() => parar, [])`.'],
        tests: `
const __esperar = (ms: number) => act(() => new Promise((r) => setTimeout(r, ms)))
test('cuenta y para', async () => {
  render(<Cronometro intervaloMs={20} />)
  await userEvent.click(screen.getByRole('button', { name: 'Iniciar' }))
  await userEvent.click(screen.getByRole('button', { name: 'Iniciar' }))
  await __esperar(110)
  await userEvent.click(screen.getByRole('button', { name: 'Parar' }))
  const __n = Number(screen.getByText(/Ticks/).textContent!.replace('Ticks: ', ''))
  expect(__n >= 3 && __n <= 7).toBe(true)
  await __esperar(60)
  expect(screen.getByText(/Ticks/)).toHaveTextContent('Ticks: ' + __n)
})`,
      },
    ],
    quiz: [
      {
        question: '¿Cambiar `ref.current` provoca un nuevo render?',
        options: ['Sí', 'No'],
        answer: 1,
        explanation: 'Por eso sirve para datos que no se muestran, como el id de un timer.',
      },
    ],
  },

  h07: {
    exercises: [
      {
        id: 'h07-e1',
        title: 'Contexto de sesión',
        language: 'typescript',
        react: true,
        prompt: `Implementa:

- \`SesionContext\` con tipo \`Sesion | null\` (defecto \`null\`).
- \`SesionProvider({ children })\`: guarda el \`usuario\` en estado (empieza en \`'Ada'\`) y provee \`{ usuario, cerrar }\` (\`cerrar\` lo pone en \`''\`).
- \`useSesion(): Sesion\`: lanza \`Error('useSesion debe usarse dentro de <SesionProvider>')\` si no hay proveedor.
- \`Barra\`: usando \`useSesion\`, muestra \`<span>Conectada: Ada</span>\` y un botón **Cerrar sesión**; si \`usuario\` es \`''\`, muestra \`<span>Sin sesión</span>\`.`,
        starter: `import { createContext, useContext, useState, type ReactNode } from 'react'

interface Sesion {
  usuario: string
  cerrar: () => void
}

function Barra() {
  return <span>Sin sesión</span>
}

export default function App() {
  return <Barra />
}
`,
        solution: `import { createContext, useContext, useState, type ReactNode } from 'react'

interface Sesion {
  usuario: string
  cerrar: () => void
}

const SesionContext = createContext<Sesion | null>(null)

function useSesion(): Sesion {
  const sesion = useContext(SesionContext)
  if (!sesion) throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  return sesion
}

function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState('Ada')
  return <SesionContext value={{ usuario, cerrar: () => setUsuario('') }}>{children}</SesionContext>
}

function Barra() {
  const { usuario, cerrar } = useSesion()
  if (!usuario) return <span>Sin sesión</span>
  return (
    <div>
      <span>Conectada: {usuario}</span>
      <button onClick={cerrar}>Cerrar sesión</button>
    </div>
  )
}

export default function App() {
  return (
    <SesionProvider>
      <Barra />
    </SesionProvider>
  )
}
`,
        hints: ['`createContext<Sesion | null>(null)`', 'En React 19: `<SesionContext value={...}>`.', 'El hook comprueba `null` y lanza un error claro.'],
        tests: `
test('con proveedor', async () => {
  render(<SesionProvider><Barra /></SesionProvider>)
  expect(screen.getByText(/Conectada/)).toHaveTextContent('Conectada: Ada')
  await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
  expect(screen.getByText('Sin sesión')).toBeTruthy()
})
test('sin proveedor lanza', () => {
  let __m = ''
  try { render(<Barra />) } catch (e) { __m = (e as Error).message }
  expect(__m).toBe('useSesion debe usarse dentro de <SesionProvider>')
})`,
        typeTests: `
type _r = Expect<Equal<ReturnType<typeof useSesion>, Sesion>>`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué crear un hook `useSesion` en vez de usar `useContext(SesionContext)` directamente?',
        options: [
          'Por estilo',
          'Para devolver `Sesion` (no `Sesion | null`) y dar un error claro si falta el proveedor',
          'Porque useContext no funciona con TypeScript',
        ],
        answer: 1,
        explanation: 'Quien consume no tiene que comprobar null en cada uso.',
      },
    ],
  },

  h08: {
    exercises: [
      {
        id: 'h08-e1',
        title: 'useToggle y useLocalStorage',
        language: 'typescript',
        react: true,
        prompt: `Implementa dos hooks:

- \`useToggle(inicial = false)\`: devuelve la **tupla** \`[activo, alternar]\` con tipo \`readonly [boolean, () => void]\`.
- \`useLocalStorage<T>(clave: string, inicial: T)\`: como \`useState\`, pero lee el valor inicial de \`localStorage\` (JSON) y guarda cada cambio. Devuelve \`readonly [T, (v: T) => void]\`.

El componente \`Preferencias\` ya los usa.`,
        starter: `import { useEffect, useState } from 'react'

function useToggle(inicial = false) {
  const [activo, setActivo] = useState(inicial)
  return [activo, () => setActivo(!activo)]
}

function useLocalStorage(clave, inicial) {
  return useState(inicial)
}

export default function Preferencias() {
  const [abierto, alternar] = useToggle()
  const [tema, setTema] = useLocalStorage<'claro' | 'oscuro'>('demo-tema', 'claro')
  return (
    <div>
      <button onClick={alternar}>{abierto ? 'Cerrar' : 'Abrir'}</button>
      {abierto && <p>Tema: {tema}</p>}
      <button onClick={() => setTema(tema === 'claro' ? 'oscuro' : 'claro')}>Cambiar tema</button>
    </div>
  )
}
`,
        solution: `import { useEffect, useState } from 'react'

function useToggle(inicial = false) {
  const [activo, setActivo] = useState(inicial)
  const alternar = () => setActivo((a) => !a)
  return [activo, alternar] as const
}

function useLocalStorage<T>(clave: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    const guardado = localStorage.getItem(clave)
    return guardado !== null ? (JSON.parse(guardado) as T) : inicial
  })

  useEffect(() => {
    localStorage.setItem(clave, JSON.stringify(valor))
  }, [clave, valor])

  return [valor, setValor] as const
}

export default function Preferencias() {
  const [abierto, alternar] = useToggle()
  const [tema, setTema] = useLocalStorage<'claro' | 'oscuro'>('demo-tema', 'claro')
  return (
    <div>
      <button onClick={alternar}>{abierto ? 'Cerrar' : 'Abrir'}</button>
      {abierto && <p>Tema: {tema}</p>}
      <button onClick={() => setTema(tema === 'claro' ? 'oscuro' : 'claro')}>Cambiar tema</button>
    </div>
  )
}
`,
        hints: ['Sin `as const`, TS infiere un array, no una tupla.', 'Pasa una función a `useState` para leer `localStorage` solo la primera vez.'],
        tests: `
const __CLAVE = '__test-tema'
function __Prueba() {
  const [tema, setTema] = useLocalStorage<string>(__CLAVE, 'claro')
  return <button onClick={() => setTema('oscuro')}>{tema}</button>
}
test('toggle', async () => {
  render(<Preferencias />)
  await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))
  expect(screen.getByText(/Tema/)).toBeTruthy()
  await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
  expect(screen.queryByText(/Tema/)).toBeNull()
})
test('localStorage', async () => {
  localStorage.removeItem(__CLAVE)
  const { unmount } = render(<__Prueba />)
  await userEvent.click(screen.getByRole('button', { name: 'claro' }))
  expect(localStorage.getItem(__CLAVE)).toBe('"oscuro"')
  unmount()
  render(<__Prueba />)
  expect(screen.getByRole('button').textContent).toBe('oscuro')
  localStorage.removeItem(__CLAVE)
})`,
        typeTests: `
declare function _probar(): ReturnType<typeof useToggle>
type _t = Expect<Equal<ReturnType<typeof useToggle>, readonly [boolean, () => void]>>
declare const _ls: ReturnType<typeof useLocalStorage<number>>
const _n: number = _ls[0]`,
      },
    ],
    quiz: [
      {
        question: 'Dos componentes llaman a `useContador()`. ¿Comparten el valor?',
        options: ['Sí', 'No: cada uno tiene su propio estado; se comparte la lógica'],
        answer: 1,
        explanation: 'Para compartir datos entre componentes usa estado levantado o Context.',
      },
    ],
  },

  h09: {
    exercises: [
      {
        id: 'h09-e1',
        title: 'Lista genérica',
        language: 'typescript',
        react: true,
        prompt:
          'Implementa `Lista<T>` con props `items: T[]`, `getKey: (item: T) => string | number`, `renderItem: (item: T) => ReactNode` y `vacio?: ReactNode` (se muestra si no hay items; por defecto `Sin elementos`). Renderiza un `<ul>` con un `<li>` por item.',
        starter: `import type { ReactNode } from 'react'

function Lista(props: { items: unknown[]; renderItem: (item: unknown) => ReactNode }) {
  return <ul>{props.items.map((i) => <li>{props.renderItem(i)}</li>)}</ul>
}

const LIBROS = [
  { isbn: '1', titulo: 'Dune', autor: 'Herbert' },
  { isbn: '2', titulo: 'Emma', autor: 'Austen' },
]

export default function App() {
  return <Lista items={LIBROS} renderItem={(l) => <b>{l.titulo}</b>} />
}
`,
        solution: `import type { ReactNode } from 'react'

interface ListaProps<T> {
  items: T[]
  getKey: (item: T) => string | number
  renderItem: (item: T) => ReactNode
  vacio?: ReactNode
}

function Lista<T>({ items, getKey, renderItem, vacio = 'Sin elementos' }: ListaProps<T>) {
  if (items.length === 0) return <p>{vacio}</p>
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

const LIBROS = [
  { isbn: '1', titulo: 'Dune', autor: 'Herbert' },
  { isbn: '2', titulo: 'Emma', autor: 'Austen' },
]

export default function App() {
  return <Lista items={LIBROS} getKey={(l) => l.isbn} renderItem={(l) => <b>{l.titulo}</b>} />
}
`,
        hints: ['`interface ListaProps<T> { ... }` y `function Lista<T>(props: ListaProps<T>)`.', 'TS infiere `T` desde `items`.'],
        tests: `
test('renderiza', () => {
  render(<Lista items={[{ id: 1, n: 'a' }, { id: 2, n: 'b' }]} getKey={(x) => x.id} renderItem={(x) => x.n.toUpperCase()} />)
  expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['A', 'B'])
})
test('vacía', () => {
  render(<Lista items={[]} getKey={() => 1} renderItem={() => null} />)
  expect(screen.getByText('Sin elementos')).toBeTruthy()
})`,
        typeTests: `
const _ok = <Lista items={[{ id: 1, n: 'a' }]} getKey={(x) => x.id} renderItem={(x) => x.n} />
// @ts-expect-error x es { id: number; n: string }
const _mal = <Lista items={[{ id: 1, n: 'a' }]} getKey={(x) => x.id} renderItem={(x) => x.otro} />`,
      },
      {
        id: 'h09-e2',
        title: 'Select tipado',
        language: 'typescript',
        react: true,
        prompt:
          'Implementa `Select<T extends string>` con props `label: string`, `opciones: readonly T[]`, `valor: NoInfer<T>` y `onCambiar: (v: T) => void`. Renderiza un `<label>` con el texto y un `<select>` controlado.\n\n`NoInfer<T>` (TS 5.4) evita que TS use `valor` para deducir `T`: así `T` sale solo de `opciones` y un `valor` que no esté entre ellas es un error.',
        starter: `import { useState } from 'react'

const TALLAS = ['S', 'M', 'L'] as const
type Talla = (typeof TALLAS)[number]

export default function App() {
  const [talla, setTalla] = useState<Talla>('M')
  return <p>Talla: {talla}</p>
}
`,
        solution: `import { useState } from 'react'

interface SelectProps<T extends string> {
  label: string
  opciones: readonly T[]
  valor: NoInfer<T>
  onCambiar: (v: T) => void
}

function Select<T extends string>({ label, opciones, valor, onCambiar }: SelectProps<T>) {
  return (
    <label>
      {label}
      <select value={valor} onChange={(e) => onCambiar(e.target.value as T)}>
        {opciones.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

const TALLAS = ['S', 'M', 'L'] as const
type Talla = (typeof TALLAS)[number]

export default function App() {
  const [talla, setTalla] = useState<Talla>('M')
  return (
    <div>
      <Select label="Talla" opciones={TALLAS} valor={talla} onCambiar={setTalla} />
      <p>Talla: {talla}</p>
    </div>
  )
}
`,
        hints: ['El DOM devuelve `string`: `e.target.value as T`.', 'Sin `NoInfer`, `valor="c"` haría que TS deduzca `T = \'a\' | \'b\' | \'c\'` en vez de dar error.'],
        tests: `
test('cambia', async () => {
  render(<App />)
  await userEvent.selectOptions(screen.getByLabelText('Talla'), 'L')
  expect(screen.getByText(/Talla:/)).toHaveTextContent('Talla: L')
})`,
        typeTests: `
const _ok = <Select label="x" opciones={['a', 'b'] as const} valor="a" onCambiar={(v) => v} />
// @ts-expect-error valor no está entre las opciones
const _mal = <Select label="x" opciones={['a', 'b'] as const} valor="c" onCambiar={() => {}} />`,
      },
    ],
    quiz: [
      {
        question: 'En un `.tsx`, ¿cómo escribes una función flecha genérica?',
        options: ['const F = <T>(p: P<T>) => ...', 'const F = <T,>(p: P<T>) => ...', 'No se puede'],
        answer: 1,
        explanation: 'La coma evita que `<T>` se lea como etiqueta JSX.',
      },
    ],
  },

  h10: {
    exercises: [
      {
        id: 'h10-e1',
        title: 'useFetch genérico',
        language: 'typescript',
        react: true,
        prompt: `Implementa:

- \`type EstadoPeticion<T>\`: \`{ estado: 'cargando' }\` | \`{ estado: 'error'; error: string }\` | \`{ estado: 'ok'; datos: T }\`.
- \`useFetch<T>(url: string): EstadoPeticion<T>\`: hace la petición en un efecto (ignora respuestas viejas), con error \`HTTP <status>\` si no es \`ok\`.
- \`Posts\`: usa \`useFetch<Post[]>('https://api.test/posts')\` y muestra \`Cargando…\`, \`<p role="alert">\` con el error, o un \`<ul>\` con los títulos.`,
        starter: `import { useEffect, useState } from 'react'

interface Post {
  id: number
  title: string
}

export default function Posts() {
  return <p>Cargando…</p>
}
`,
        solution: `import { useEffect, useState } from 'react'

interface Post {
  id: number
  title: string
}

type EstadoPeticion<T> = { estado: 'cargando' } | { estado: 'error'; error: string } | { estado: 'ok'; datos: T }

function useFetch<T>(url: string): EstadoPeticion<T> {
  const [resultado, setResultado] = useState<EstadoPeticion<T>>({ estado: 'cargando' })

  useEffect(() => {
    let cancelado = false
    setResultado({ estado: 'cargando' })
    async function cargar() {
      try {
        const r = await fetch(url)
        if (!r.ok) throw new Error(\`HTTP \${r.status}\`)
        const datos = (await r.json()) as T
        if (!cancelado) setResultado({ estado: 'ok', datos })
      } catch (e) {
        if (!cancelado) setResultado({ estado: 'error', error: e instanceof Error ? e.message : String(e) })
      }
    }
    void cargar()
    return () => {
      cancelado = true
    }
  }, [url])

  return resultado
}

export default function Posts() {
  const r = useFetch<Post[]>('https://api.test/posts')
  if (r.estado === 'cargando') return <p>Cargando…</p>
  if (r.estado === 'error') return <p role="alert">{r.error}</p>
  return (
    <ul>
      {r.datos.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  )
}
`,
        hints: ['La función del efecto no puede ser async: define `async function cargar()` dentro y llámala.', 'Estrecha con `if (r.estado === ...)` en el componente.'],
        tests: `${MOCK_FETCH}
test('ok', async () => {
  __mockFetch({ 'https://api.test/posts': [{ id: 1, title: 'Hola' }, { id: 2, title: 'Mundo' }] })
  render(<Posts />)
  expect(screen.getByText('Cargando…')).toBeTruthy()
  await screen.findAllByRole('listitem')
  expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Hola', 'Mundo'])
})
test('error', async () => {
  __mockFetch({})
  render(<Posts />)
  expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 404')
})`,
        typeTests: `
declare const _e: EstadoPeticion<string>
if (_e.estado === 'ok') { const _d: string = _e.datos }
type _r = Expect<Equal<ReturnType<typeof useFetch<number>>, EstadoPeticion<number>>>`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué no se puede escribir `useEffect(async () => { ... })`?',
        options: [
          'Porque fetch no funciona en efectos',
          'Porque la función del efecto debe devolver la limpieza (o nada), no una promesa',
          'Sí se puede',
        ],
        answer: 1,
        explanation: 'Define una función async dentro y llámala.',
      },
    ],
  },

  h11: {
    exercises: [
      {
        id: 'h11-e1',
        title: 'Validar una respuesta con Zod',
        language: 'typescript',
        react: true,
        prompt: `Define el schema \`UsuarioSchema\` con Zod: \`id\` (number), \`nombre\` (string no vacío), \`email\` (email) y \`rol\` (\`'admin' | 'lector'\`). Deriva \`type Usuario = z.infer<typeof UsuarioSchema>\`.

\`FichaUsuario\` pide \`https://api.test/usuario\` y valida la respuesta con \`safeParse\`: si es válida, muestra \`<h2>nombre</h2>\` y \`<p>rol</p>\`; si no, \`<p role="alert">Datos inválidos</p>\`.`,
        starter: `import { useEffect, useState } from 'react'
import { z } from 'zod'

export default function FichaUsuario() {
  const [usuario, setUsuario] = useState<any>(null)

  useEffect(() => {
    fetch('https://api.test/usuario')
      .then((r) => r.json())
      .then(setUsuario)
  }, [])

  if (!usuario) return <p>Cargando…</p>
  return <h2>{usuario.nombre}</h2>
}
`,
        solution: `import { useEffect, useState } from 'react'
import { z } from 'zod'

const UsuarioSchema = z.object({
  id: z.number(),
  nombre: z.string().min(1),
  email: z.string().email(),
  rol: z.enum(['admin', 'lector']),
})

type Usuario = z.infer<typeof UsuarioSchema>

type Estado = { tipo: 'cargando' } | { tipo: 'invalido' } | { tipo: 'ok'; usuario: Usuario }

export default function FichaUsuario() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' })

  useEffect(() => {
    fetch('https://api.test/usuario')
      .then((r) => r.json())
      .then((datos: unknown) => {
        const r = UsuarioSchema.safeParse(datos)
        setEstado(r.success ? { tipo: 'ok', usuario: r.data } : { tipo: 'invalido' })
      })
  }, [])

  if (estado.tipo === 'cargando') return <p>Cargando…</p>
  if (estado.tipo === 'invalido') return <p role="alert">Datos inválidos</p>
  return (
    <div>
      <h2>{estado.usuario.nombre}</h2>
      <p>{estado.usuario.rol}</p>
    </div>
  )
}
`,
        hints: ["`z.object({ id: z.number(), ..., rol: z.enum(['admin', 'lector']) })`", '`safeParse` devuelve `{ success: true, data }` o `{ success: false, error }`.'],
        tests: `${MOCK_FETCH}
test('válido', async () => {
  __mockFetch({ 'https://api.test/usuario': { id: 1, nombre: 'Ada', email: 'ada@x.com', rol: 'admin' } })
  render(<FichaUsuario />)
  expect(await screen.findByRole('heading', { name: 'Ada' })).toBeTruthy()
  expect(screen.getByText('admin')).toBeTruthy()
})
test('email inválido', async () => {
  __mockFetch({ 'https://api.test/usuario': { id: 1, nombre: 'Ada', email: 'no-es-email', rol: 'admin' } })
  render(<FichaUsuario />)
  expect(await screen.findByRole('alert')).toHaveTextContent('Datos inválidos')
})
test('rol inválido', async () => {
  __mockFetch({ 'https://api.test/usuario': { id: 1, nombre: 'Ada', email: 'a@x.com', rol: 'jefe' } })
  render(<FichaUsuario />)
  expect(await screen.findByRole('alert')).toBeTruthy()
})`,
        typeTests: `
type _u = Expect<Equal<Usuario, { id: number; nombre: string; email: string; rol: 'admin' | 'lector' }>>`,
      },
    ],
    quiz: [
      {
        question: '¿Qué ventaja tiene `Schema.parse(await r.json())` frente a `(await r.json()) as T`?',
        options: [
          'Ninguna, es lo mismo',
          'Valida en runtime: si la API devuelve otra cosa, falla ahí con un mensaje claro',
          'Es más rápido',
        ],
        answer: 1,
        explanation: '`as T` es solo una promesa al compilador.',
      },
    ],
  },

  h12: {
    exercises: [
      {
        id: 'h12-e1',
        title: 'App de tareas en TypeScript',
        language: 'typescript',
        react: true,
        prompt: 'Migra la app de tareas a TS con un reducer tipado, como describe la lección. Exporta `reducer`, `Tarea`, `Accion` y `Filtro`; `App` por defecto.',
        starter: `import { useReducer, useState } from 'react'

export default function App() {
  return (
    <main>
      <h1>Mis tareas</h1>
    </main>
  )
}
`,
        solution: `import { useReducer, useState, type FormEvent } from 'react'

export interface Tarea {
  id: number
  titulo: string
  hecha: boolean
}

export type Filtro = 'Todas' | 'Pendientes' | 'Hechas'

export type Accion =
  | { tipo: 'agregar'; titulo: string }
  | { tipo: 'alternar'; id: number }
  | { tipo: 'borrar'; id: number }
  | { tipo: 'limpiarHechas' }

export function reducer(tareas: Tarea[], accion: Accion): Tarea[] {
  switch (accion.tipo) {
    case 'agregar': {
      const id = tareas.reduce((max, t) => Math.max(max, t.id), 0) + 1
      return [...tareas, { id, titulo: accion.titulo, hecha: false }]
    }
    case 'alternar':
      return tareas.map((t) => (t.id === accion.id ? { ...t, hecha: !t.hecha } : t))
    case 'borrar':
      return tareas.filter((t) => t.id !== accion.id)
    case 'limpiarHechas':
      return tareas.filter((t) => !t.hecha)
    default: {
      const _exhaustivo: never = accion
      return _exhaustivo
    }
  }
}

const FILTROS: Record<Filtro, (t: Tarea) => boolean> = {
  Todas: () => true,
  Pendientes: (t) => !t.hecha,
  Hechas: (t) => t.hecha,
}

function Formulario({ onAgregar }: { onAgregar: (titulo: string) => void }) {
  const [titulo, setTitulo] = useState('')
  function manejarSubmit(e: FormEvent<HTMLFormElement>) {
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

function Filtros({ filtro, onCambiar }: { filtro: Filtro; onCambiar: (f: Filtro) => void }) {
  return (
    <div>
      {(Object.keys(FILTROS) as Filtro[]).map((f) => (
        <button key={f} aria-pressed={filtro === f} onClick={() => onCambiar(f)}>
          {f}
        </button>
      ))}
    </div>
  )
}

interface ListaProps {
  tareas: Tarea[]
  onAlternar: (id: number) => void
  onBorrar: (id: number) => void
}

function Lista({ tareas, onAlternar, onBorrar }: ListaProps) {
  if (tareas.length === 0) return <p>No hay tareas</p>
  return (
    <ul>
      {tareas.map((t) => (
        <li key={t.id}>
          <label>
            <input type="checkbox" checked={t.hecha} onChange={() => onAlternar(t.id)} />
            {t.titulo}
          </label>
          <button aria-label={\`Borrar \${t.titulo}\`} onClick={() => onBorrar(t.id)}>
            Borrar
          </button>
        </li>
      ))}
    </ul>
  )
}

export default function App() {
  const [tareas, dispatch] = useReducer(reducer, [])
  const [filtro, setFiltro] = useState<Filtro>('Todas')
  const pendientes = tareas.filter((t) => !t.hecha).length
  const hayHechas = tareas.some((t) => t.hecha)

  return (
    <main>
      <h1>Mis tareas</h1>
      <Formulario onAgregar={(titulo) => dispatch({ tipo: 'agregar', titulo })} />
      <Filtros filtro={filtro} onCambiar={setFiltro} />
      <Lista
        tareas={tareas.filter(FILTROS[filtro])}
        onAlternar={(id) => dispatch({ tipo: 'alternar', id })}
        onBorrar={(id) => dispatch({ tipo: 'borrar', id })}
      />
      <p>
        {pendientes} {pendientes === 1 ? 'pendiente' : 'pendientes'}
      </p>
      {hayHechas && <button onClick={() => dispatch({ tipo: 'limpiarHechas' })}>Limpiar hechas</button>}
    </main>
  )
}
`,
        hints: [
          'Empieza por `Tarea`, `Accion` y `reducer` (con `default` exhaustivo).',
          '`useReducer(reducer, [])` infiere el tipo del estado a partir del reducer.',
          '`Record<Filtro, (t: Tarea) => boolean>` obliga a definir los tres filtros.',
        ],
        tests: `
async function __agregar(t: string) {
  await userEvent.type(screen.getByLabelText('Nueva tarea'), t + '{Enter}')
}
const __items = () => screen.queryAllByRole('listitem').map((li) => li.querySelector('label')!.textContent)
test('reducer', () => {
  const __s = reducer([], { tipo: 'agregar', titulo: 'A' })
  expect(__s).toEqual([{ id: 1, titulo: 'A', hecha: false }])
  const __s2 = reducer(__s, { tipo: 'alternar', id: 1 })
  expect(__s2[0].hecha).toBe(true)
  expect(__s[0].hecha).toBe(false)
  expect(reducer(__s2, { tipo: 'limpiarHechas' })).toEqual([])
})
test('flujo completo', async () => {
  render(<App />)
  await __agregar('A'); await __agregar('B'); await __agregar('C')
  await userEvent.click(screen.getByLabelText('B'))
  expect(screen.getByText(/pendiente/)).toHaveTextContent('2 pendientes')
  await userEvent.click(screen.getByRole('button', { name: 'Hechas' }))
  expect(__items()).toEqual(['B'])
  await userEvent.click(screen.getByRole('button', { name: 'Todas' }))
  await userEvent.click(screen.getByRole('button', { name: 'Borrar A' }))
  expect(__items()).toEqual(['B', 'C'])
  await userEvent.click(screen.getByRole('button', { name: 'Limpiar hechas' }))
  expect(__items()).toEqual(['C'])
  expect(screen.queryByRole('button', { name: 'Limpiar hechas' })).toBeNull()
})`,
        typeTests: `
type _f = Expect<Equal<Filtro, 'Todas' | 'Pendientes' | 'Hechas'>>
type _a = Expect<Equal<Accion['tipo'], 'agregar' | 'alternar' | 'borrar' | 'limpiarHechas'>>
// @ts-expect-error agregar necesita titulo
reducer([], { tipo: 'agregar' })
// @ts-expect-error a una tarea le falta hecha
const _t: Tarea = { id: 1, titulo: 'x' }`,
      },
    ],
    quiz: [
      {
        question: '¿Qué ventaja tiene probar el reducer por separado?',
        options: [
          'Ninguna',
          'Es una función pura: se prueba sin interfaz, rápido y sin clics',
          'Es obligatorio en TypeScript',
        ],
        answer: 1,
        explanation: 'La lógica queda separada de la presentación.',
      },
    ],
  },
}
