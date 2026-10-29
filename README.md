# TS Academy

App para aprender JavaScript, TypeScript y React + TypeScript desde cero, con un plan diario adaptable y ejercicios verificados en el navegador.

- 128 unidades en 9 bloques (JS desde cero → JS moderno → TS → React → React + TS → proyecto final), basadas en MDN, el TypeScript Handbook y react.dev.
- 216 ejercicios con comprobación automática, quizzes y notas por unidad.
- Plan generado según la duración (3 meses, 6 meses, 1 año o personalizado) y el ritmo elegidos. Se recalcula solo si te saltas días o cambias de ritmo.
- Días de repaso y práctica semanal: rehacer ejercicios desde cero y repetir quizzes.
- Progreso en `localStorage`, exportable/importable como JSON.

## Uso

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # tests de scheduler, racha, estadísticas y contenido
npm run build
```

## Publicar en GitHub Pages

1. Sube el repo a GitHub (rama `main`).
2. En el repo: **Settings → Pages → Source: GitHub Actions**.
3. Cada push a `main` ejecuta `.github/workflows/deploy.yml` (tests + build) y publica `dist/`.

La app usa rutas relativas (`base: './'`) y rutas en el hash (`#/unidad/a01`), así que funciona en cualquier subcarpeta sin configurar nada más.

## Seguridad

No hay servidor ni cuentas: el progreso solo vive en el `localStorage` del navegador. Al importar un respaldo, el archivo se reconstruye campo a campo (`src/lib/importProgress.ts`) y se pide confirmación, porque el código guardado se ejecuta al comprobar un ejercicio.

## Estructura

| Ruta | Qué hay |
|---|---|
| `src/content/outline.ts` | Temario: bloques y unidades, con enlaces a la documentación oficial |
| `src/content/lessons/<id>.md` | Lección de cada unidad |
| `src/content/units/*.ts` | Ejercicios y quizzes, indexados por id de unidad |
| `src/lib/scheduler.ts` | Reparte las unidades pendientes según duración y ritmo |
| `src/exercise/` | Motor de ejercicios (ver abajo) |
| `src/sandbox/` + `sandbox.html` | Página que corre dentro del iframe de los ejercicios de React |
| `src/store/progress.ts` | Progreso (zustand + localStorage) |

## Motor de ejercicios

- **JS/TS**: Monaco comprueba los tipos (código del alumno + `typeTests`) y compila con su TypeScript a CommonJS; un Web Worker ejecuta el código con los `tests` y se corta a los 3 s.
- **React** (`react: true`, archivos `.jsx`/`.tsx`): el JS compilado corre en un iframe (`sandbox.html`) con React, Testing Library y Zod. `require` solo provee `react`, `react/jsx-runtime`, `react-dom/client` y `zod`. Los bucles con `{` llevan una guarda de tiempo (el iframe comparte hilo con la app). El componente exportado por defecto se muestra en la vista previa. El sandbox tiene su propio build (`vite.sandbox.config.ts`) con la versión de desarrollo de React, porque Testing Library necesita `act`.
- Los tipos de React y Zod se cargan en Monaco la primera vez que se abre un ejercicio de React.

## Escribir ejercicios

- `tests`: `test(nombre, fn)` y `expect(x)` con `toBe`, `toEqual`, `toContain`, `toThrow`, `toBeTruthy`, `toBeFalsy`, `toBeNull`, `toHaveLength` y, para React, `toHaveTextContent`, `toBeDisabled`, `toHaveValue`. `__logs` contiene la salida de consola; `exports` lo exportado por el alumno.
- En React, además: `render`, `screen`, `fireEvent`, `userEvent`, `act`, `waitFor`, `within`.
- `typeTests` (solo TS): se comprueban con el compilador y nunca se ejecutan. Usa `// @ts-expect-error` y `Expect<Equal<A, B>>`.
- Usa nombres con prefijo `__` en los tests para no chocar con variables del alumno.

En desarrollo, `/dev/verificar` comprueba que cada solución pase y cada código inicial falle (`?prefijo=g` limita a un bloque).
