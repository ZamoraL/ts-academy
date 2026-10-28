import type { UnitContent } from '../index'

// Bloque I: proyecto final "Gestor de gastos". Cada unidad es un archivo independiente,
// así que las piezas de unidades anteriores se incluyen ya resueltas en el código inicial.

const DOMINIO = `const CATEGORIAS = ['comida', 'transporte', 'ocio', 'hogar', 'otros'] as const
type Categoria = (typeof CATEGORIAS)[number]

interface Gasto {
  readonly id: string
  descripcion: string
  monto: number
  categoria: Categoria
  fecha: string // 'YYYY-MM-DD'
}

type NuevoGasto = Omit<Gasto, 'id'>
type CambiosGasto = Partial<NuevoGasto>
type ResumenPorCategoria = Record<Categoria, number>

interface Filtros {
  categoria: Categoria | 'todas'
  mes: string | null // 'YYYY-MM'
}
`

const UTILS = `const formato = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
const redondear = (n: number) => Math.round(n * 100) / 100

function formatearMonto(n: number): string {
  return formato.format(n)
}

function mesDe(fecha: string): string {
  return fecha.slice(0, 7)
}

function totalGeneral(gastos: readonly Gasto[]): number {
  return redondear(gastos.reduce((t, g) => t + g.monto, 0))
}

function totalPorCategoria(gastos: readonly Gasto[]): ResumenPorCategoria {
  const resumen = Object.fromEntries(CATEGORIAS.map((c) => [c, 0])) as ResumenPorCategoria
  for (const g of gastos) resumen[g.categoria] = redondear(resumen[g.categoria] + g.monto)
  return resumen
}

function filtrarGastos(gastos: readonly Gasto[], filtros: Filtros): Gasto[] {
  return gastos.filter(
    (g) =>
      (filtros.categoria === 'todas' || g.categoria === filtros.categoria) &&
      (filtros.mes === null || mesDe(g.fecha) === filtros.mes),
  )
}
`

const COMPONENTES = `const ICONOS: Record<Categoria, string> = {
  comida: '🍔',
  transporte: '🚌',
  ocio: '🎬',
  hogar: '🏠',
  otros: '📦',
}

function Monto({ valor }: { valor: number }) {
  return <span>{formatearMonto(valor)}</span>
}

function EtiquetaCategoria({ categoria }: { categoria: Categoria }) {
  return (
    <span>
      {ICONOS[categoria]} {categoria}
    </span>
  )
}

interface FilaGastoProps {
  gasto: Gasto
  onBorrar: (id: Gasto['id']) => void
}

function FilaGasto({ gasto, onBorrar }: FilaGastoProps) {
  return (
    <li>
      <span>{gasto.descripcion}</span> <EtiquetaCategoria categoria={gasto.categoria} /> <Monto valor={gasto.monto} />{' '}
      <button aria-label={\`Borrar \${gasto.descripcion}\`} onClick={() => onBorrar(gasto.id)}>
        ✕
      </button>
    </li>
  )
}

function ListaGastos({ gastos, onBorrar }: { gastos: readonly Gasto[]; onBorrar: (id: string) => void }) {
  if (gastos.length === 0) return <p>Sin gastos</p>
  const ordenados = [...gastos].sort((a, b) => b.fecha.localeCompare(a.fecha))
  return (
    <ul>
      {ordenados.map((g) => (
        <FilaGasto key={g.id} gasto={g} onBorrar={onBorrar} />
      ))}
    </ul>
  )
}
`

const REDUCER = `type Accion =
  | { tipo: 'agregar'; gasto: Gasto }
  | { tipo: 'borrar'; id: string }
  | { tipo: 'editar'; id: string; cambios: CambiosGasto }
  | { tipo: 'cargar'; gastos: Gasto[] }

function reducer(estado: Gasto[], accion: Accion): Gasto[] {
  switch (accion.tipo) {
    case 'agregar':
      return [...estado, accion.gasto]
    case 'borrar':
      return estado.filter((g) => g.id !== accion.id)
    case 'editar':
      return estado.map((g) => (g.id === accion.id ? { ...g, ...accion.cambios } : g))
    case 'cargar':
      return accion.gastos
    default: {
      const _exhaustivo: never = accion
      return _exhaustivo
    }
  }
}
`

const FORMULARIO = `const FormularioSchema = z.object({
  descripcion: z.string().trim().min(3, 'Mínimo 3 caracteres'),
  monto: z.coerce.number().positive('Debe ser mayor que 0'),
  categoria: z.enum(CATEGORIAS),
  fecha: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, 'Fecha inválida'),
})

interface ValoresFormulario {
  descripcion: string
  monto: string
  categoria: Categoria
  fecha: string
}

type Errores = Partial<Record<keyof ValoresFormulario, string[]>>

const VACIO: ValoresFormulario = { descripcion: '', monto: '', categoria: 'comida', fecha: '' }

function FormularioGasto({ onGuardar }: { onGuardar: (g: NuevoGasto) => void }) {
  const [valores, setValores] = useState<ValoresFormulario>(VACIO)
  const [errores, setErrores] = useState<Errores>({})

  function cambiar<K extends keyof ValoresFormulario>(campo: K, valor: ValoresFormulario[K]) {
    setValores((v) => ({ ...v, [campo]: valor }))
  }

  function manejarSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const r = FormularioSchema.safeParse(valores)
    if (!r.success) {
      setErrores(r.error.flatten().fieldErrors)
      return
    }
    onGuardar(r.data)
    setValores(VACIO)
    setErrores({})
  }

  return (
    <form onSubmit={manejarSubmit} noValidate>
      <label>
        Descripción
        <input
          value={valores.descripcion}
          aria-invalid={errores.descripcion ? true : undefined}
          aria-describedby={errores.descripcion ? 'error-descripcion' : undefined}
          onChange={(e) => cambiar('descripcion', e.target.value)}
        />
      </label>
      {errores.descripcion && <p id="error-descripcion">{errores.descripcion[0]}</p>}
      <label>
        Monto
        <input
          type="number"
          step="0.01"
          value={valores.monto}
          aria-invalid={errores.monto ? true : undefined}
          aria-describedby={errores.monto ? 'error-monto' : undefined}
          onChange={(e) => cambiar('monto', e.target.value)}
        />
      </label>
      {errores.monto && <p id="error-monto">{errores.monto[0]}</p>}
      <label>
        Categoría
        <select value={valores.categoria} onChange={(e) => cambiar('categoria', e.target.value as Categoria)}>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label>
        Fecha
        <input
          type="date"
          value={valores.fecha}
          aria-invalid={errores.fecha ? true : undefined}
          aria-describedby={errores.fecha ? 'error-fecha' : undefined}
          onChange={(e) => cambiar('fecha', e.target.value)}
        />
      </label>
      {errores.fecha && <p id="error-fecha">{errores.fecha[0]}</p>}
      <button type="submit">Guardar</button>
    </form>
  )
}
`

const EJEMPLO = `const EJEMPLO: Gasto[] = [
  { id: 'g1', descripcion: 'Supermercado', monto: 850.5, categoria: 'comida', fecha: '2026-03-02' },
  { id: 'g2', descripcion: 'Metro', monto: 50, categoria: 'transporte', fecha: '2026-03-05' },
  { id: 'g3', descripcion: 'Cine', monto: 180, categoria: 'ocio', fecha: '2026-02-20' },
]
`

const MOCK_FETCH = `
function __mockFetch(rutas: Record<string, unknown>) {
  globalThis.fetch = (async (url: string) => {
    await new Promise((r) => setTimeout(r, 10))
    const cuerpo = rutas[String(url)]
    if (cuerpo === undefined) return { ok: false, status: 500, json: async () => ({}) }
    return { ok: true, status: 200, json: async () => cuerpo }
  }) as any
}
`

const DATOS_TEST = `
const __g = (id: string, monto: number, categoria: Categoria, fecha: string, descripcion = id): Gasto => ({ id, descripcion, monto, categoria, fecha })
const __gastos: Gasto[] = [
  __g('a', 100.1, 'comida', '2026-03-01'),
  __g('b', 200.2, 'comida', '2026-03-15'),
  __g('c', 50, 'transporte', '2026-02-10'),
  __g('d', 0.1, 'ocio', '2026-03-20'),
]
`

const TEST_I07 = `
test('encabezado del mes', () => {
  render(<ResumenMensual gastos={__gastos} mes="2026-03" />)
  expect(screen.getByRole('heading')).toHaveTextContent('Resumen de 2026-03')
})
test('una fila por categoría con gastos, de mayor a menor', () => {
  render(<ResumenMensual gastos={__gastos} mes="2026-03" />)
  expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['comida: $300.30', 'ocio: $0.10'])
})
test('total del mes', () => {
  render(<ResumenMensual gastos={__gastos} mes="2026-03" />)
  expect(screen.getByText(/Total/)).toHaveTextContent('Total: $300.40')
})
test('mes sin gastos', () => {
  render(<ResumenMensual gastos={__gastos} mes="2025-01" />)
  expect(screen.getByText('Sin gastos este mes')).toBeTruthy()
  expect(screen.queryByRole('list')).toBeNull()
})`

export const unitsI: Record<string, UnitContent> = {
  i01: {
    exercises: [
      {
        id: 'i01-e1',
        title: 'Tipos del dominio',
        language: 'typescript',
        prompt:
          'Define `CATEGORIAS` (tupla `as const` con `comida`, `transporte`, `ocio`, `hogar`, `otros`), `Categoria` (derivado), `Gasto`, `NuevoGasto`, `CambiosGasto`, `ResumenPorCategoria` y `Filtros`, como en la lección.',
        starter: '// Define aquí los tipos del dominio\n',
        solution: DOMINIO,
        hints: [
          '`const CATEGORIAS = [...] as const` y `type Categoria = (typeof CATEGORIAS)[number]`.',
          "`type NuevoGasto = Omit<Gasto, 'id'>`, `type CambiosGasto = Partial<NuevoGasto>`.",
          '`type ResumenPorCategoria = Record<Categoria, number>`.',
        ],
        tests: `
test('CATEGORIAS', () => expect(CATEGORIAS).toEqual(['comida', 'transporte', 'ocio', 'hogar', 'otros']))`,
        typeTests: `
type _c = Expect<Equal<Categoria, 'comida' | 'transporte' | 'ocio' | 'hogar' | 'otros'>>
type _d = Expect<Equal<Categoria, (typeof CATEGORIAS)[number]>>
type _g = Expect<Equal<keyof Gasto, 'id' | 'descripcion' | 'monto' | 'categoria' | 'fecha'>>
type _n = Expect<Equal<keyof NuevoGasto, 'descripcion' | 'monto' | 'categoria' | 'fecha'>>
type _m = Expect<Equal<Gasto['monto'], number>>
declare const _g1: Gasto
// @ts-expect-error id es readonly
_g1.id = 'x'
const _cambios: CambiosGasto = {}
// @ts-expect-error CambiosGasto no permite cambiar el id
const _cambios2: CambiosGasto = { id: 'x' }
// @ts-expect-error falta la categoría otros
const _r: ResumenPorCategoria = { comida: 0, transporte: 0, ocio: 0, hogar: 0 }
const _f: Filtros = { categoria: 'todas', mes: null }
// @ts-expect-error categoría inválida
const _f2: Filtros = { categoria: 'viajes', mes: null }`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué derivar `NuevoGasto` con `Omit<Gasto, \'id\'>` en vez de escribirlo a mano?',
        options: ['Es más corto', 'Si Gasto cambia, NuevoGasto se actualiza solo', 'Es obligatorio'],
        answer: 1,
        explanation: 'Una sola fuente de verdad: los tipos derivados no se desincronizan.',
      },
    ],
  },

  i02: {
    exercises: [
      {
        id: 'i02-e1',
        title: 'Funciones puras del dominio',
        language: 'typescript',
        prompt: `Implementa y **exporta**:

- \`formatearMonto(n)\`: con \`Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })\` → \`'$1,234.50'\`.
- \`mesDe(fecha)\`: \`'2026-03-15'\` → \`'2026-03'\`.
- \`totalGeneral(gastos)\`: suma redondeada a centavos.
- \`totalPorCategoria(gastos)\`: un \`ResumenPorCategoria\` con **todas** las categorías (0 si no hay gastos), redondeado.
- \`filtrarGastos(gastos, filtros)\`: por categoría (\`'todas'\` = sin filtro) y mes (\`null\` = sin filtro).

Los tipos del dominio ya están.`,
        starter: `${DOMINIO}
// Implementa y exporta las funciones
export function formatearMonto(n: number): string {
  throw new Error('Sin implementar')
}
`,
        solution: `${DOMINIO}
${UTILS.replace(/^function /gm, 'export function ')}`,
        hints: [
          'Crea el `Intl.NumberFormat` una vez, fuera de la función.',
          '`Object.fromEntries(CATEGORIAS.map((c) => [c, 0])) as ResumenPorCategoria` inicializa todas en 0.',
          'Redondear: `Math.round(n * 100) / 100`.',
        ],
        tests: `${DATOS_TEST}
const __exp = exports as Record<string, unknown>
test('formatearMonto', () => expect(formatearMonto(1234.5)).toBe('$1,234.50'))
test('mesDe', () => expect(mesDe('2026-03-15')).toBe('2026-03'))
test('totalGeneral redondea', () => expect(totalGeneral(__gastos)).toBe(350.4))
test('totalPorCategoria completo', () => expect(totalPorCategoria(__gastos)).toEqual({ comida: 300.3, transporte: 50, ocio: 0.1, hogar: 0, otros: 0 }))
test('filtrar por categoría', () => expect(filtrarGastos(__gastos, { categoria: 'comida', mes: null }).map((g) => g.id)).toEqual(['a', 'b']))
test('filtrar por mes', () => expect(filtrarGastos(__gastos, { categoria: 'todas', mes: '2026-02' }).map((g) => g.id)).toEqual(['c']))
test('filtrar por ambos', () => expect(filtrarGastos(__gastos, { categoria: 'ocio', mes: '2026-03' }).map((g) => g.id)).toEqual(['d']))
test('exporta las funciones', () => {
  for (const __f of ['formatearMonto', 'mesDe', 'totalGeneral', 'totalPorCategoria', 'filtrarGastos']) expect(typeof __exp[__f]).toBe('function')
})`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué las funciones del dominio no importan React?',
        options: [
          'Por rendimiento',
          'Son lógica pura: se prueban sin interfaz y se reutilizan en cualquier sitio',
          'Porque React no permite funciones puras',
        ],
        answer: 1,
        explanation: 'Separar dominio y presentación es clave para que una app escale.',
      },
    ],
  },

  i03: {
    exercises: [
      {
        id: 'i03-e1',
        title: 'Componentes base',
        language: 'typescript',
        react: true,
        prompt: `Con el dominio y las utilidades ya escritos, crea:

- \`Monto({ valor })\`: un \`<span>\` con el monto formateado.
- \`EtiquetaCategoria({ categoria })\`: \`<span>🍔 comida</span>\`, con iconos en un \`Record<Categoria, string>\` (🍔 comida, 🚌 transporte, 🎬 ocio, 🏠 hogar, 📦 otros).
- \`FilaGasto({ gasto, onBorrar })\`: un \`<li>\` con descripción, etiqueta, monto y un botón \`✕\` con \`aria-label="Borrar <descripción>"\`.
- \`ListaGastos({ gastos, onBorrar })\`: \`<ul>\` ordenado por fecha (más reciente primero, sin mutar las props), o \`<p>Sin gastos</p>\`.`,
        starter: `${DOMINIO}
${UTILS}
${EJEMPLO}
// Escribe aquí los componentes

export default function App() {
  return <p>Pendiente</p>
}
`,
        solution: `${DOMINIO}
${UTILS}
${EJEMPLO}
${COMPONENTES}
export default function App() {
  return <ListaGastos gastos={EJEMPLO} onBorrar={(id) => console.log('borrar', id)} />
}
`,
        hints: [
          'Usa `Gasto[\'id\']` en el tipo del callback.',
          'Copia antes de ordenar: `[...gastos].sort((a, b) => b.fecha.localeCompare(a.fecha))`.',
        ],
        tests: `${DATOS_TEST}
test('Monto', () => {
  render(<Monto valor={1234.5} />)
  expect(screen.getByText('$1,234.50')).toBeTruthy()
})
test('EtiquetaCategoria', () => {
  const { container } = render(<EtiquetaCategoria categoria="transporte" />)
  expect(container.textContent).toBe('🚌 transporte')
})
test('lista ordenada', () => {
  render(<ListaGastos gastos={__gastos} onBorrar={() => {}} />)
  expect(screen.getAllByRole('listitem').map((li) => li.querySelector('span')!.textContent)).toEqual(['d', 'b', 'a', 'c'])
  expect(__gastos[0].id).toBe('a')
})
test('borrar', async () => {
  const __b: string[] = []
  render(<ListaGastos gastos={__gastos} onBorrar={(id) => __b.push(id)} />)
  await userEvent.click(screen.getByRole('button', { name: 'Borrar b' }))
  expect(__b).toEqual(['b'])
})
test('vacía', () => {
  render(<ListaGastos gastos={[]} onBorrar={() => {}} />)
  expect(screen.getByText('Sin gastos')).toBeTruthy()
})`,
        typeTests: `
// @ts-expect-error categoría inválida
const _e = <EtiquetaCategoria categoria="viajes" />`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué un botón con solo un icono necesita `aria-label`?',
        options: ['Por estilo', 'Para que lectores de pantalla (y los tests) sepan qué hace', 'Es obligatorio en React'],
        answer: 1,
        explanation: 'Sin texto, el botón no tiene nombre accesible.',
      },
    ],
  },

  i04: {
    exercises: [
      {
        id: 'i04-e1',
        title: 'Reducer de gastos',
        language: 'typescript',
        react: true,
        prompt: `Define \`type Accion\` con \`agregar\` (gasto completo), \`borrar\` (id), \`editar\` (id + \`cambios: CambiosGasto\`) y \`cargar\` (array de gastos), y un \`reducer\` puro con \`default\` exhaustivo.

\`App\` usa \`useReducer(reducer, EJEMPLO)\`, muestra la lista (\`ListaGastos\` ya existe) con borrar conectado, un botón **Agregar café** que agrega \`{ descripcion: 'Café', monto: 45, categoria: 'comida', fecha: '2026-03-10' }\` con id \`crypto.randomUUID()\` (generado **fuera** del reducer), y un párrafo \`Total: $X\`.`,
        starter: `import { useReducer } from 'react'

${DOMINIO}
${UTILS}
${COMPONENTES}
${EJEMPLO}
// Define Accion y reducer

export default function App() {
  return <ListaGastos gastos={EJEMPLO} onBorrar={() => {}} />
}
`,
        solution: `import { useReducer } from 'react'

${DOMINIO}
${UTILS}
${COMPONENTES}
${EJEMPLO}
${REDUCER}
export default function App() {
  const [gastos, dispatch] = useReducer(reducer, EJEMPLO)

  function agregarCafe() {
    const nuevo: NuevoGasto = { descripcion: 'Café', monto: 45, categoria: 'comida', fecha: '2026-03-10' }
    dispatch({ tipo: 'agregar', gasto: { ...nuevo, id: crypto.randomUUID() } })
  }

  return (
    <main>
      <ListaGastos gastos={gastos} onBorrar={(id) => dispatch({ tipo: 'borrar', id })} />
      <button onClick={agregarCafe}>Agregar café</button>
      <p>Total: {formatearMonto(totalGeneral(gastos))}</p>
    </main>
  )
}
`,
        hints: [
          'El reducer no debe generar ids ni leer la fecha actual: eso va antes del `dispatch`.',
          "`editar`: `estado.map((g) => (g.id === accion.id ? { ...g, ...accion.cambios } : g))`.",
        ],
        tests: `${DATOS_TEST}
test('reducer: agregar, editar, borrar, cargar', () => {
  const __s1 = reducer([], { tipo: 'agregar', gasto: __gastos[0] })
  expect(__s1).toEqual([__gastos[0]])
  const __s2 = reducer(__s1, { tipo: 'editar', id: 'a', cambios: { monto: 5 } })
  expect(__s2[0].monto).toBe(5)
  expect(__s1[0].monto).toBe(100.1)
  expect(reducer(__s2, { tipo: 'borrar', id: 'a' })).toEqual([])
  expect(reducer([], { tipo: 'cargar', gastos: __gastos })).toEqual(__gastos)
})
test('interfaz', async () => {
  render(<App />)
  expect(screen.getByText(/Total/)).toHaveTextContent('Total: $1,080.50')
  await userEvent.click(screen.getByRole('button', { name: 'Agregar café' }))
  expect(screen.getByText(/Total/)).toHaveTextContent('Total: $1,125.50')
  await userEvent.click(screen.getByRole('button', { name: 'Borrar Supermercado' }))
  expect(screen.getByText(/Total/)).toHaveTextContent('Total: $275.00')
})`,
        typeTests: `
type _a = Expect<Equal<Accion['tipo'], 'agregar' | 'borrar' | 'editar' | 'cargar'>>
// @ts-expect-error editar no puede cambiar el id
reducer([], { tipo: 'editar', id: 'x', cambios: { id: 'y' } })
// @ts-expect-error agregar necesita un gasto con id
reducer([], { tipo: 'agregar', gasto: { descripcion: 'x', monto: 1, categoria: 'otros', fecha: '2026-01-01' } })`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué el id del gasto se genera antes del `dispatch` y no en el reducer?',
        options: [
          'Porque crypto no funciona en reducers',
          'Para que el reducer sea puro: misma entrada, misma salida',
          'Por rendimiento',
        ],
        answer: 1,
        explanation: 'Valores aleatorios o la fecha actual hacen impredecible un reducer.',
      },
    ],
  },

  i05: {
    exercises: [
      {
        id: 'i05-e1',
        title: 'Cargar gastos validados',
        language: 'typescript',
        react: true,
        prompt: `Implementa:

- \`GastoSchema\` con Zod (\`categoria: z.enum(CATEGORIAS)\`, fecha con regex \`YYYY-MM-DD\`).
- \`obtenerGastos(): Promise<Gasto[]>\`: pide \`https://api.test/gastos\`, lanza \`HTTP <status>\` si no es ok, y valida con \`z.array(GastoSchema).parse\`.
- \`usePeticion<T>(obtener: () => Promise<T>): EstadoPeticion<T>\`.
- \`GastosRemotos\`: \`Cargando…\`; si falla, \`<p role="alert">\` con \`El servidor envió datos inválidos\` (si es un \`z.ZodError\`) o \`No se pudo cargar\`; si va bien, la lista y \`Total: $X\`.`,
        starter: `import { useEffect, useState } from 'react'
import { z } from 'zod'

${DOMINIO}
${UTILS}
${COMPONENTES}
type EstadoPeticion<T> = { estado: 'cargando' } | { estado: 'error'; error: unknown } | { estado: 'ok'; datos: T }

export default function GastosRemotos() {
  return <p>Cargando…</p>
}
`,
        solution: `import { useEffect, useState } from 'react'
import { z } from 'zod'

${DOMINIO}
${UTILS}
${COMPONENTES}
type EstadoPeticion<T> = { estado: 'cargando' } | { estado: 'error'; error: unknown } | { estado: 'ok'; datos: T }

const GastoSchema = z.object({
  id: z.string(),
  descripcion: z.string(),
  monto: z.number(),
  categoria: z.enum(CATEGORIAS),
  fecha: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
})

async function obtenerGastos(): Promise<Gasto[]> {
  const r = await fetch('https://api.test/gastos')
  if (!r.ok) throw new Error(\`HTTP \${r.status}\`)
  return z.array(GastoSchema).parse(await r.json())
}

function usePeticion<T>(obtener: () => Promise<T>): EstadoPeticion<T> {
  const [resultado, setResultado] = useState<EstadoPeticion<T>>({ estado: 'cargando' })
  useEffect(() => {
    let cancelado = false
    obtener().then(
      (datos) => !cancelado && setResultado({ estado: 'ok', datos }),
      (error: unknown) => !cancelado && setResultado({ estado: 'error', error }),
    )
    return () => {
      cancelado = true
    }
  }, [obtener])
  return resultado
}

export default function GastosRemotos() {
  const r = usePeticion(obtenerGastos)
  if (r.estado === 'cargando') return <p>Cargando…</p>
  if (r.estado === 'error') {
    const mensaje = r.error instanceof z.ZodError ? 'El servidor envió datos inválidos' : 'No se pudo cargar'
    return <p role="alert">{mensaje}</p>
  }
  return (
    <div>
      <ListaGastos gastos={r.datos} onBorrar={() => {}} />
      <p>Total: {formatearMonto(totalGeneral(r.datos))}</p>
    </div>
  )
}
`,
        hints: [
          '`obtenerGastos` es estable (declarada fuera del componente): puede ir en las dependencias del efecto.',
          '`r.error instanceof z.ZodError` distingue errores de validación.',
        ],
        tests: `${MOCK_FETCH}
const __OK = [
  { id: '1', descripcion: 'Pan', monto: 30, categoria: 'comida', fecha: '2026-03-01' },
  { id: '2', descripcion: 'Taxi', monto: 120, categoria: 'transporte', fecha: '2026-03-02' },
]
test('carga y muestra el total', async () => {
  __mockFetch({ 'https://api.test/gastos': __OK })
  render(<GastosRemotos />)
  expect(screen.getByText('Cargando…')).toBeTruthy()
  expect(await screen.findByText(/Total/)).toHaveTextContent('Total: $150.00')
  expect(screen.getAllByRole('listitem')).toHaveLength(2)
})
test('datos inválidos', async () => {
  __mockFetch({ 'https://api.test/gastos': [{ ...__OK[0], categoria: 'viajes' }] })
  render(<GastosRemotos />)
  expect(await screen.findByRole('alert')).toHaveTextContent('El servidor envió datos inválidos')
})
test('error de servidor', async () => {
  __mockFetch({})
  render(<GastosRemotos />)
  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cargar')
})`,
        typeTests: `
type _s = Expect<Equal<z.infer<typeof GastoSchema>['categoria'], Categoria>>
type _o = Expect<Equal<ReturnType<typeof obtenerGastos>, Promise<Gasto[]>>>`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué pasar a `usePeticion` una función declarada fuera del componente?',
        options: [
          'Por estilo',
          'Porque es la misma en cada render; una función nueva en cada render reiniciaría el efecto sin fin',
          'Porque los hooks no aceptan funciones flecha',
        ],
        answer: 1,
        explanation: 'Las dependencias del efecto se comparan por referencia.',
      },
    ],
  },

  i06: {
    exercises: [
      {
        id: 'i06-e1',
        title: 'Formulario con Zod',
        language: 'typescript',
        react: true,
        prompt: `Implementa \`FormularioGasto({ onGuardar })\` con inputs controlados (labels \`Descripción\`, \`Monto\` (number), \`Categoría\` (select) y \`Fecha\` (date)) y un botón **Guardar**.

Al enviar, valida con un schema de Zod:

- descripción: sin espacios alrededor, mínimo 3 → \`Mínimo 3 caracteres\`
- monto: \`z.coerce.number()\` positivo → \`Debe ser mayor que 0\`
- fecha: \`YYYY-MM-DD\` → \`Fecha inválida\`

Si hay errores, muéstralos (el primero de cada campo) en un \`<p>\` junto al campo y marca el input con \`aria-invalid\`. Si es válido, llama a \`onGuardar\` con un \`NuevoGasto\` (monto ya numérico) y limpia el formulario.`,
        starter: `import { useState, type FormEvent } from 'react'
import { z } from 'zod'

${DOMINIO}
function FormularioGasto({ onGuardar }: { onGuardar: (g: NuevoGasto) => void }) {
  return <form></form>
}

export default function App() {
  return <FormularioGasto onGuardar={(g) => console.log(g)} />
}
`,
        solution: `import { useState, type FormEvent } from 'react'
import { z } from 'zod'

${DOMINIO}
${FORMULARIO}
export default function App() {
  return <FormularioGasto onGuardar={(g) => console.log(g)} />
}
`,
        hints: [
          '`r.error.flatten().fieldErrors` da `{ campo?: string[] }`.',
          'Un handler genérico: `cambiar<K extends keyof ValoresFormulario>(campo: K, valor: ValoresFormulario[K])`.',
          'Añade `noValidate` al `<form>` para que el navegador no bloquee el envío con su propia validación.',
        ],
        tests: `
const __val = (label: string, v: string) => fireEvent.change(screen.getByLabelText(label), { target: { value: v } })
test('errores por campo', async () => {
  render(<FormularioGasto onGuardar={() => {}} />)
  await userEvent.type(screen.getByLabelText('Descripción'), '  ab  ')
  __val('Monto', '0')
  await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
  expect(screen.getByText('Mínimo 3 caracteres')).toBeTruthy()
  expect(screen.getByText('Debe ser mayor que 0')).toBeTruthy()
  expect(screen.getByText('Fecha inválida')).toBeTruthy()
  expect(screen.getByLabelText('Monto').getAttribute('aria-invalid')).toBe('true')
})
test('guarda un gasto válido y limpia', async () => {
  const __g: unknown[] = []
  render(<FormularioGasto onGuardar={(x) => __g.push(x)} />)
  await userEvent.type(screen.getByLabelText('Descripción'), '  Comida con amigos ')
  __val('Monto', '320.5')
  await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'ocio')
  __val('Fecha', '2026-03-15')
  await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
  expect(__g).toEqual([{ descripcion: 'Comida con amigos', monto: 320.5, categoria: 'ocio', fecha: '2026-03-15' }])
  expect(screen.getByLabelText('Descripción')).toHaveValue('')
  expect(screen.queryByText('Fecha inválida')).toBeNull()
})`,
      },
    ],
    quiz: [
      {
        question: '¿Por qué el estado del formulario guarda `monto` como string?',
        options: [
          'Por error',
          'Porque los inputs siempre dan strings; Zod lo convierte y valida al enviar',
          'Porque Zod no soporta números',
        ],
        answer: 1,
        explanation: 'El tipo del formulario y el tipo del dominio son distintos; el schema los conecta.',
      },
    ],
  },

  i07: {
    exercises: [
      {
        id: 'i07-e1',
        title: 'TDD: resumen mensual',
        language: 'typescript',
        react: true,
        prompt: `Escribe \`ResumenMensual({ gastos, mes })\` para que pasen **estos tests** (son los mismos que ejecuta Comprobar):

\`\`\`tsx
const __gastos = [
  { id: 'a', monto: 100.1, categoria: 'comida', fecha: '2026-03-01', ... },
  { id: 'b', monto: 200.2, categoria: 'comida', fecha: '2026-03-15', ... },
  { id: 'c', monto: 50, categoria: 'transporte', fecha: '2026-02-10', ... },
  { id: 'd', monto: 0.1, categoria: 'ocio', fecha: '2026-03-20', ... },
]
${TEST_I07}
\`\`\`

Las utilidades del dominio (\`filtrarGastos\`, \`totalPorCategoria\`, \`totalGeneral\`, \`formatearMonto\`) ya están: úsalas.`,
        starter: `${DOMINIO}
${UTILS}
${EJEMPLO}
function ResumenMensual({ gastos, mes }: { gastos: readonly Gasto[]; mes: string }) {
  return <section></section>
}

export default function App() {
  return <ResumenMensual gastos={EJEMPLO} mes="2026-03" />
}
`,
        solution: `${DOMINIO}
${UTILS}
${EJEMPLO}
function ResumenMensual({ gastos, mes }: { gastos: readonly Gasto[]; mes: string }) {
  const delMes = filtrarGastos(gastos, { categoria: 'todas', mes })
  const filas = Object.entries(totalPorCategoria(delMes))
    .filter(([, total]) => total > 0)
    .sort(([, a], [, b]) => b - a)

  return (
    <section>
      <h2>Resumen de {mes}</h2>
      {filas.length === 0 ? (
        <p>Sin gastos este mes</p>
      ) : (
        <>
          <ul>
            {filas.map(([categoria, total]) => (
              <li key={categoria}>
                {categoria}: {formatearMonto(total)}
              </li>
            ))}
          </ul>
          <p>Total: {formatearMonto(totalGeneral(delMes))}</p>
        </>
      )}
    </section>
  )
}

export default function App() {
  return <ResumenMensual gastos={EJEMPLO} mes="2026-03" />
}
`,
        hints: [
          'Filtra por mes con `filtrarGastos`, luego `totalPorCategoria`.',
          '`Object.entries(...)` da pares `[categoria, total]`: filtra los 0 y ordena.',
          'Los tests usan `getAllByRole(\'listitem\')` y `textContent`: cuida el formato exacto `comida: $300.30`.',
        ],
        tests: `${DATOS_TEST}${TEST_I07}`,
      },
    ],
    quiz: [
      {
        question: '¿Qué consulta de Testing Library usas para comprobar que algo NO está en pantalla?',
        options: ['getBy...', 'queryBy...', 'findBy...'],
        answer: 1,
        explanation: '`queryBy` devuelve `null` en vez de lanzar un error.',
      },
      {
        question: '¿Qué prioriza Testing Library al consultar elementos?',
        options: ['Clases CSS', 'Roles y etiquetas accesibles, como los usaría una persona', 'IDs'],
        answer: 1,
        explanation: 'Probar como el usuario usa la interfaz hace los tests más robustos.',
      },
    ],
  },

  i08: {
    exercises: [
      {
        id: 'i08-e1',
        title: 'La app completa',
        language: 'typescript',
        react: true,
        prompt: `Todas las piezas están en el código inicial: dominio, utilidades, componentes, reducer y formulario. Escribe \`App\`:

- \`useReducer(reducer, EJEMPLO)\` para los gastos y \`useState<Filtros>\` (\`{ categoria: 'todas', mes: null }\`).
- \`FormularioGasto\`: al guardar, agrega el gasto con id \`crypto.randomUUID()\`.
- Un \`<select>\` con label \`Filtrar\` con la opción \`todas\` y las categorías.
- \`ListaGastos\` con los gastos **filtrados** (con \`useMemo\`) y borrar conectado.
- Un párrafo con \`aria-live="polite"\` y el texto \`Total: $X\` de los gastos filtrados.`,
        starter: `import { useMemo, useReducer, useState, type FormEvent } from 'react'
import { z } from 'zod'

${DOMINIO}
${UTILS}
${COMPONENTES}
${REDUCER}
${FORMULARIO}
${EJEMPLO}
export default function App() {
  return (
    <main>
      <h1>Mis gastos</h1>
    </main>
  )
}
`,
        solution: `import { useMemo, useReducer, useState, type FormEvent } from 'react'
import { z } from 'zod'

${DOMINIO}
${UTILS}
${COMPONENTES}
${REDUCER}
${FORMULARIO}
${EJEMPLO}
export default function App() {
  const [gastos, dispatch] = useReducer(reducer, EJEMPLO)
  const [filtros, setFiltros] = useState<Filtros>({ categoria: 'todas', mes: null })

  const filtrados = useMemo(() => filtrarGastos(gastos, filtros), [gastos, filtros])
  const total = useMemo(() => totalGeneral(filtrados), [filtrados])

  return (
    <main>
      <h1>Mis gastos</h1>
      <FormularioGasto onGuardar={(g) => dispatch({ tipo: 'agregar', gasto: { ...g, id: crypto.randomUUID() } })} />
      <label>
        Filtrar
        <select
          value={filtros.categoria}
          onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value as Filtros['categoria'] })}
        >
          <option value="todas">todas</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <ListaGastos gastos={filtrados} onBorrar={(id) => dispatch({ tipo: 'borrar', id })} />
      <p aria-live="polite">Total: {formatearMonto(total)}</p>
    </main>
  )
}
`,
        hints: [
          '`const filtrados = useMemo(() => filtrarGastos(gastos, filtros), [gastos, filtros])`',
          "El valor del select es `Filtros['categoria']`: necesitas `as` porque el DOM da string.",
        ],
        tests: `
const __val = (label: string, v: string) => fireEvent.change(screen.getByLabelText(label), { target: { value: v } })
const __total = () => screen.getByText(/^Total/)
test('total inicial', () => {
  render(<App />)
  expect(__total()).toHaveTextContent('Total: $1,080.50')
  expect(__total().getAttribute('aria-live')).toBe('polite')
})
test('agregar desde el formulario', async () => {
  render(<App />)
  await userEvent.type(screen.getByLabelText('Descripción'), 'Gasolina')
  __val('Monto', '600')
  await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'transporte')
  __val('Fecha', '2026-03-12')
  await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
  expect(__total()).toHaveTextContent('Total: $1,680.50')
  expect(screen.getByRole('button', { name: 'Borrar Gasolina' })).toBeTruthy()
})
test('filtrar y borrar', async () => {
  render(<App />)
  await userEvent.selectOptions(screen.getByLabelText('Filtrar'), 'transporte')
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  expect(__total()).toHaveTextContent('Total: $50.00')
  await userEvent.click(screen.getByRole('button', { name: 'Borrar Metro' }))
  expect(screen.getByText('Sin gastos')).toBeTruthy()
  await userEvent.selectOptions(screen.getByLabelText('Filtrar'), 'todas')
  expect(__total()).toHaveTextContent('Total: $1,030.50')
})`,
      },
    ],
    quiz: [
      {
        question: '¿Qué contiene la carpeta `dist/` tras `npm run build`?',
        options: ['El código TypeScript', 'Archivos estáticos (HTML, JS, CSS) listos para publicar', 'Los tests'],
        answer: 1,
        explanation: 'Se pueden publicar en cualquier hosting estático: Netlify, Vercel, GitHub Pages…',
      },
    ],
  },
}
