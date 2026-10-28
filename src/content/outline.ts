import type { Block, UnitKind } from '../types'

const MDN = 'https://developer.mozilla.org/es/docs/Web/JavaScript'
const TS = 'https://www.typescriptlang.org/docs/handbook'
const REACT = 'https://es.react.dev'

export const BLOCKS: Block[] = [
  { id: 'a', title: 'JavaScript desde cero', description: 'Variables, tipos, control de flujo, funciones, arrays y objetos.' },
  { id: 'b', title: 'JavaScript moderno', description: 'Destructuring, módulos, clases, closures y asincronía.' },
  { id: 'c', title: 'TypeScript: fundamentos', description: 'Qué es TS, el compilador y los tipos del día a día.' },
  { id: 'd', title: 'TypeScript: intermedio', description: 'Narrowing, funciones, tipos de objeto y clases.' },
  { id: 'e', title: 'TypeScript: avanzado', description: 'Genéricos y manipulación de tipos.' },
  { id: 'f', title: 'Ecosistema TypeScript', description: 'Módulos, archivos de declaración y tsconfig.' },
  { id: 'g', title: 'React básico', description: 'Componentes, JSX, props, estado y efectos.' },
  { id: 'h', title: 'React + TypeScript', description: 'Tipar props, hooks, eventos y context.' },
  { id: 'i', title: 'Proyecto final', description: 'Una app completa con React y TypeScript.' },
]

export interface OutlineEntry {
  id: string
  blockId: string
  title: string
  kind: UnitKind
  minutes: number
  sources: { label: string; url: string }[]
}

/**
 * El id identifica la unidad en el progreso guardado, las lecciones (`lessons/<id>.md`) y el contenido.
 * NUNCA cambies ni reutilices un id: el orden lo da la posición en el array, no el id.
 * Para una unidad nueva en medio de un bloque, usa el siguiente número libre de ese bloque.
 */
type Row = [id: string, title: string, url: string, kind?: UnitKind]

function block(blockId: string, sourceLabel: string, rows: Row[]): OutlineEntry[] {
  return rows.map(([id, title, url, kind = 'lesson']) => ({
    id,
    blockId,
    title,
    kind,
    minutes: 30,
    sources: url ? [{ label: sourceLabel, url }] : [],
  }))
}

export const OUTLINE: OutlineEntry[] = [
  ...block('a', 'MDN', [
    ['a01', 'Qué es programar y tu primer programa', `${MDN}/Guide/Introduction`],
    ['a02', 'Variables: let y const', `${MDN}/Guide/Grammar_and_types#declaraciones`],
    ['a03', 'Tipos de datos primitivos', `${MDN}/Guide/Grammar_and_types#estructuras_y_tipos_de_datos`],
    ['a04', 'Operadores aritméticos y de asignación', `${MDN}/Guide/Expressions_and_operators`],
    ['a05', 'Comparación e igualdad estricta', `${MDN}/Guide/Expressions_and_operators#operadores_de_comparacion`],
    ['a06', 'Operadores lógicos y valores truthy/falsy', `${MDN}/Guide/Expressions_and_operators#operadores_logicos`],
    ['a07', 'Strings y template literals', `${MDN}/Guide/Text_formatting`],
    ['a08', 'Condicionales: if / else', `${MDN}/Guide/Control_flow_and_error_handling`],
    ['a09', 'switch y operador ternario', `${MDN}/Guide/Control_flow_and_error_handling#declaracion_switch`],
    ['a10', 'Bucles: for y while', `${MDN}/Guide/Loops_and_iteration`],
    ['a11', 'Funciones: declaración y parámetros', `${MDN}/Guide/Functions`],
    ['a12', 'Funciones flecha y return', `${MDN}/Reference/Functions/Arrow_functions`],
    ['a13', 'Alcance (scope)', `${MDN}/Guide/Functions#ambito_de_funcion`],
    ['a14', 'Arrays: crear, leer y modificar', `${MDN}/Guide/Indexed_collections`],
    ['a15', 'Recorrer arrays: for...of y forEach', `${MDN}/Reference/Statements/for...of`],
    ['a16', 'map, filter y find', `${MDN}/Reference/Global_Objects/Array/map`],
    ['a17', 'reduce, some, every', `${MDN}/Reference/Global_Objects/Array/reduce`],
    ['a18', 'Objetos: propiedades y métodos', `${MDN}/Guide/Working_with_objects`],
    ['a19', 'Arrays de objetos', `${MDN}/Guide/Working_with_objects`],
    ['a20', 'Manejo de errores: try / catch', `${MDN}/Guide/Control_flow_and_error_handling#declaraciones_de_manejo_de_excepciones`],
    ['a21', 'Proyecto A · parte 1: lista de tareas en consola', '', 'project'],
    ['a22', 'Proyecto A · parte 2: filtros y estadísticas', '', 'project'],
  ]),
  ...block('b', 'MDN', [
    ['b01', 'Destructuring de objetos y arrays', `${MDN}/Reference/Operators/Destructuring_assignment`],
    ['b02', 'Spread y rest', `${MDN}/Reference/Operators/Spread_syntax`],
    ['b03', 'Optional chaining y nullish coalescing', `${MDN}/Reference/Operators/Optional_chaining`],
    ['b04', 'Closures', `${MDN}/Closures`],
    ['b05', 'Clases: constructor y métodos', `${MDN}/Reference/Classes`],
    ['b06', 'Herencia con extends', `${MDN}/Reference/Classes/extends`],
    ['b07', 'Módulos: import y export', `${MDN}/Guide/Modules`],
    ['b08', 'Map y Set', `${MDN}/Guide/Keyed_collections`],
    ['b09', 'JSON', `${MDN}/Reference/Global_Objects/JSON`],
    ['b10', 'El event loop y callbacks', `${MDN}/Event_loop`],
    ['b11', 'Promesas', `${MDN}/Guide/Using_promises`],
    ['b12', 'async / await', `${MDN}/Reference/Statements/async_function`],
    ['b13', 'fetch y APIs', 'https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch'],
    ['b14', 'Proyecto B · parte 1: cliente de una API pública', '', 'project'],
    ['b15', 'Proyecto B · parte 2: caché y manejo de errores', '', 'project'],
  ]),
  ...block('c', 'TS Handbook', [
    ['c01', 'Por qué TypeScript', `${TS}/typescript-from-scratch.html`],
    ['c02', 'The Basics: chequeo estático', `${TS}/2/basic-types.html`],
    ['c03', 'El compilador tsc y tsconfig', `${TS}/2/basic-types.html#tsc-the-typescript-compiler`],
    ['c04', 'Anotaciones de tipos e inferencia', `${TS}/2/everyday-types.html#type-annotations-on-variables`],
    ['c05', 'Tipos primitivos y arrays', `${TS}/2/everyday-types.html#the-primitives-string-number-and-boolean`],
    ['c06', 'any, unknown y noImplicitAny', `${TS}/2/everyday-types.html#any`],
    ['c07', 'Funciones: parámetros y retorno', `${TS}/2/everyday-types.html#functions`],
    ['c08', 'Tipos de objeto y propiedades opcionales', `${TS}/2/everyday-types.html#object-types`],
    ['c09', 'Union types', `${TS}/2/everyday-types.html#union-types`],
    ['c10', 'Type aliases e interfaces', `${TS}/2/everyday-types.html#type-aliases`],
    ['c11', 'Literal types', `${TS}/2/everyday-types.html#literal-types`],
    ['c12', 'null, undefined y strictNullChecks', `${TS}/2/everyday-types.html#null-and-undefined`],
    ['c13', 'Type assertions y non-null', `${TS}/2/everyday-types.html#type-assertions`],
    ['c14', 'Proyecto C: tipar la lista de tareas', '', 'project'],
  ]),
  ...block('d', 'TS Handbook', [
    ['d01', 'Narrowing con typeof', `${TS}/2/narrowing.html#typeof-type-guards`],
    ['d02', 'Truthiness e igualdad', `${TS}/2/narrowing.html#truthiness-narrowing`],
    ['d03', 'in e instanceof', `${TS}/2/narrowing.html#the-in-operator-narrowing`],
    ['d04', 'Análisis de flujo de control', `${TS}/2/narrowing.html#control-flow-analysis`],
    ['d05', 'Type predicates', `${TS}/2/narrowing.html#using-type-predicates`],
    ['d06', 'Discriminated unions', `${TS}/2/narrowing.html#discriminated-unions`],
    ['d07', 'never y exhaustividad', `${TS}/2/narrowing.html#exhaustiveness-checking`],
    ['d08', 'Tipos de función y call signatures', `${TS}/2/functions.html`],
    ['d09', 'Parámetros opcionales y rest', `${TS}/2/functions.html#optional-parameters`],
    ['d10', 'Sobrecargas de funciones', `${TS}/2/functions.html#function-overloads`],
    ['d11', 'void, object, unknown, never en funciones', `${TS}/2/functions.html#other-types-to-know-about`],
    ['d12', 'readonly e index signatures', `${TS}/2/objects.html#readonly-properties`],
    ['d13', 'Extender tipos e intersecciones', `${TS}/2/objects.html#extending-types`],
    ['d14', 'Tuplas y arrays readonly', `${TS}/2/objects.html#tuple-types`],
    ['d15', 'Clases: campos y constructores', `${TS}/2/classes.html`],
    ['d16', 'Modificadores public, private, protected', `${TS}/2/classes.html#member-visibility`],
    ['d17', 'implements, abstract y static', `${TS}/2/classes.html#implements-clauses`],
    ['d18', 'Proyecto D · parte 1: máquina de estados tipada', '', 'project'],
    ['d19', 'Proyecto D · parte 2: inventario con clases', '', 'project'],
  ]),
  ...block('e', 'TS Handbook', [
    ['e01', 'Genéricos: hola mundo', `${TS}/2/generics.html`],
    ['e02', 'Funciones y tipos genéricos', `${TS}/2/generics.html#generic-types`],
    ['e03', 'Restricciones con extends', `${TS}/2/generics.html#generic-constraints`],
    ['e04', 'Clases genéricas y valores por defecto', `${TS}/2/generics.html#generic-classes`],
    ['e05', 'El operador keyof', `${TS}/2/keyof-types.html`],
    ['e06', 'typeof en tipos', `${TS}/2/typeof-types.html`],
    ['e07', 'Indexed access types', `${TS}/2/indexed-access-types.html`],
    ['e08', 'Conditional types', `${TS}/2/conditional-types.html`],
    ['e09', 'infer', `${TS}/2/conditional-types.html#inferring-within-conditional-types`],
    ['e10', 'Conditional types distributivos', `${TS}/2/conditional-types.html#distributive-conditional-types`],
    ['e11', 'Mapped types', `${TS}/2/mapped-types.html`],
    ['e12', 'Key remapping con as', `${TS}/2/mapped-types.html#key-remapping-via-as`],
    ['e13', 'Template literal types', `${TS}/2/template-literal-types.html`],
    ['e14', 'Utility types: Partial, Required, Readonly', `${TS}/utility-types.html`],
    ['e15', 'Utility types: Pick, Omit, Record', `${TS}/utility-types.html#picktype-keys`],
    ['e16', 'Utility types: ReturnType, Parameters, Awaited', `${TS}/utility-types.html#returntypetype`],
    ['e17', 'Proyecto E · parte 1: store tipado genérico', '', 'project'],
    ['e18', 'Proyecto E · parte 2: eventos con template literals', '', 'project'],
  ]),
  ...block('f', 'TS Handbook', [
    ['f01', 'Módulos en TypeScript', `${TS}/2/modules.html`],
    ['f02', 'import type y verbatimModuleSyntax', `${TS}/2/modules.html#typescript-specific-es-module-syntax`],
    ['f03', 'Archivos de declaración .d.ts', `${TS}/declaration-files/introduction.html`],
    ['f04', 'tsconfig a fondo: strict', 'https://www.typescriptlang.org/tsconfig#strict'],
    ['f05', 'tsconfig: module, target, lib', 'https://www.typescriptlang.org/tsconfig#module'],
    ['f06', 'Enums y alternativas', `${TS}/enums.html`],
    ['f07', 'Proyecto F: librería con tipos publicados', '', 'project'],
  ]),
  ...block('g', 'react.dev', [
    ['g01', 'Qué es React', `${REACT}/learn`],
    ['g02', 'Tu primer componente', `${REACT}/learn/your-first-component`],
    ['g03', 'JSX', `${REACT}/learn/writing-markup-with-jsx`],
    ['g04', 'Props', `${REACT}/learn/passing-props-to-a-component`],
    ['g05', 'Renderizado condicional', `${REACT}/learn/conditional-rendering`],
    ['g06', 'Listas y keys', `${REACT}/learn/rendering-lists`],
    ['g07', 'Eventos', `${REACT}/learn/responding-to-events`],
    ['g08', 'Estado con useState', `${REACT}/learn/state-a-components-memory`],
    ['g09', 'Actualizar objetos y arrays en el estado', `${REACT}/learn/updating-objects-in-state`],
    ['g10', 'Formularios controlados', `${REACT}/reference/react-dom/components/input`],
    ['g11', 'Compartir estado entre componentes', `${REACT}/learn/sharing-state-between-components`],
    ['g12', 'Efectos con useEffect', `${REACT}/learn/synchronizing-with-effects`],
    ['g13', 'Proyecto G: lista de tareas en React', '', 'project'],
  ]),
  ...block('h', 'react.dev', [
    ['h01', 'Configurar React + TypeScript', `${REACT}/learn/typescript`],
    ['h02', 'Tipar props y children', `${REACT}/learn/typescript#typing-component-props`],
    ['h03', 'useState tipado', `${REACT}/learn/typescript#typing-usestate`],
    ['h04', 'useReducer con discriminated unions', `${REACT}/learn/typescript#typing-usereducer`],
    ['h05', 'Tipar eventos del DOM', `${REACT}/learn/typescript#typing-dom-events`],
    ['h06', 'useRef tipado', `${REACT}/reference/react/useRef`],
    ['h07', 'Context tipado', `${REACT}/learn/typescript#typing-usecontext`],
    ['h08', 'Custom hooks tipados', `${REACT}/learn/reusing-logic-with-custom-hooks`],
    ['h09', 'Componentes genéricos', `${TS}/2/generics.html`],
    ['h10', 'Fetch de datos tipado', `${REACT}/learn/synchronizing-with-effects#fetching-data`],
    ['h11', 'Validar datos externos con Zod', 'https://zod.dev'],
    ['h12', 'Proyecto H: migrar la app de tareas a TS', '', 'project'],
  ]),
  ...block('i', '', [
    ['i01', 'Proyecto final · diseño y tipos del dominio', '', 'project'],
    ['i02', 'Proyecto final · estructura del proyecto', '', 'project'],
    ['i03', 'Proyecto final · componentes base', '', 'project'],
    ['i04', 'Proyecto final · estado y reducers', '', 'project'],
    ['i05', 'Proyecto final · datos remotos', '', 'project'],
    ['i06', 'Proyecto final · formularios y validación', '', 'project'],
    ['i07', 'Proyecto final · tests', '', 'project'],
    ['i08', 'Proyecto final · pulido y despliegue', '', 'project'],
  ]),
]
