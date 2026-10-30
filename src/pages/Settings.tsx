import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlanForm } from '../components/PlanForm'
import { btn } from '../components/styles'
import { PageHeader } from '../components/ui'
import { EXERCISES, UNITS } from '../content'
import { todayISO } from '../lib/date'
import { parseProgressData } from '../lib/importProgress'
import { setTemaPreferido, useTemaPreferido, type TemaPreferido } from '../lib/theme'
import { exportProgress, useProgress } from '../store/progress'

const KNOWN_IDS = { units: new Set(UNITS.map((u) => u.id)), exercises: new Set(EXERCISES.map((e) => e.id)) }

export function Settings() {
  const config = useProgress((s) => s.config)
  const setConfig = useProgress((s) => s.setConfig)
  const importData = useProgress((s) => s.importData)
  const reset = useProgress((s) => s.reset)
  const navigate = useNavigate()
  const fileInput = useRef<HTMLInputElement>(null)
  const [planGuardado, setPlanGuardado] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; texto: string } | null>(null)
  const tema = useTemaPreferido()

  function download() {
    const blob = new Blob([JSON.stringify(exportProgress(), null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `ts-academy-${todayISO()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function upload(file: File) {
    try {
      const data = parseProgressData(JSON.parse(await file.text()), KNOWN_IDS)
      if (!data) throw new Error('formato')
      const ok = confirm(
        'Importar reemplaza todo tu progreso actual.\n\n' +
          'Importa solo respaldos que hayas exportado tú: el código guardado en el archivo se ejecuta al comprobar un ejercicio.',
      )
      if (!ok) return setMessage(null)
      importData(data)
      setMessage({ ok: true, texto: 'Progreso importado.' })
    } catch {
      setMessage({
        ok: false,
        texto: 'Ese archivo no es un respaldo de TS Academy. Tu progreso actual no cambió.',
      })
    }
  }

  return (
    <div className="space-y-12">
      <PageHeader title="Ajustes" meta="Plan, apariencia y respaldo de tu progreso." />

      <section aria-labelledby="ajustes-plan" className="max-w-2xl">
        <h2 id="ajustes-plan" className="text-lg font-bold">
          Plan
        </h2>
        <p className="mb-6 mt-1 text-fg-muted">
          Cambiar ritmo o duración no borra nada: lo completado se conserva y lo pendiente se reparte de nuevo desde hoy.
        </p>
        <PlanForm
          key={JSON.stringify(config)}
          initial={config}
          submitLabel="Guardar cambios"
          onSubmit={(c) => {
            setConfig(c)
            setPlanGuardado(true)
          }}
        />
        <p className="mt-3 h-5 text-sm text-success-ink" aria-live="polite">
          {planGuardado && '✓ Plan actualizado.'}
        </p>
      </section>

      <section aria-labelledby="ajustes-tema" className="max-w-2xl border-t border-border pt-8">
        <h2 id="ajustes-tema" className="text-lg font-bold">
          Apariencia
        </h2>
        <p className="mb-4 mt-1 text-fg-muted">Se guarda solo en este navegador.</p>
        <div
          role="radiogroup"
          aria-labelledby="ajustes-tema"
          className="inline-flex gap-px overflow-hidden rounded-sm border border-border bg-border"
        >
          {(
            [
              ['sistema', 'Como el sistema'],
              ['claro', 'Claro'],
              ['oscuro', 'Oscuro'],
            ] as [TemaPreferido, string][]
          ).map(([valor, texto]) => (
            <label
              key={valor}
              className={`flex min-h-10 cursor-pointer items-center px-4 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-accent-ink ${
                tema === valor ? 'bg-fg font-bold text-bg' : 'bg-surface hover:bg-surface-2'
              }`}
            >
              <input
                type="radio"
                name="tema"
                checked={tema === valor}
                onChange={() => setTemaPreferido(valor)}
                className="sr-only"
              />
              {texto}
            </label>
          ))}
        </div>
      </section>

      <section aria-labelledby="ajustes-respaldo" className="max-w-2xl border-t border-border pt-8">
        <h2 id="ajustes-respaldo" className="text-lg font-bold">
          Respaldo
        </h2>
        <p className="mb-4 mt-1 text-fg-muted">
          El progreso vive en este navegador. Exporta un archivo para no perderlo o para seguir en otro equipo.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={download} className={btn.secondary}>
            Exportar JSON
          </button>
          <button onClick={() => fileInput.current?.click()} className={btn.secondary}>
            Importar JSON
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void upload(file)
              e.target.value = ''
            }}
          />
        </div>
        <p
          className={`mt-3 min-h-5 text-sm ${message?.ok ? 'text-success-ink' : 'text-danger-ink'}`}
          aria-live="polite"
        >
          {message && `${message.ok ? '✓' : '✗'} ${message.texto}`}
        </p>
      </section>

      <section aria-labelledby="ajustes-borrar" className="max-w-2xl border-t border-border pt-8">
        <h2 id="ajustes-borrar" className="text-lg font-bold">
          Empezar de cero
        </h2>
        <p className="mb-4 mt-1 text-fg-muted">
          Borra unidades completadas, código de los ejercicios, quizzes y notas. Exporta antes si quieres conservarlos.
        </p>
        <button
          onClick={() => {
            if (confirm('¿Borrar todo el progreso, ejercicios y notas? No se puede deshacer.')) {
              reset()
              navigate('/bienvenida')
            }
          }}
          className={btn.danger}
        >
          Borrar todo el progreso
        </button>
      </section>
    </div>
  )
}
