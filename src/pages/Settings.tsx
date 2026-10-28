import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlanForm } from '../components/PlanForm'
import { EXERCISES, UNITS } from '../content'
import { todayISO } from '../lib/date'
import { parseProgressData } from '../lib/importProgress'
import { exportProgress, useProgress } from '../store/progress'

const KNOWN_IDS = { units: new Set(UNITS.map((u) => u.id)), exercises: new Set(EXERCISES.map((e) => e.id)) }

export function Settings() {
  const config = useProgress((s) => s.config)
  const setConfig = useProgress((s) => s.setConfig)
  const importData = useProgress((s) => s.importData)
  const reset = useProgress((s) => s.reset)
  const navigate = useNavigate()
  const fileInput = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

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
      setMessage('Progreso importado.')
    } catch {
      setMessage('El archivo no es un respaldo válido de TS Academy.')
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold text-white">Ajustes del plan</h1>
        <p className="mb-6 mt-1 text-sm text-slate-400">
          Cambiar ritmo o duración no borra nada: lo completado se conserva y lo pendiente se reparte de nuevo desde hoy.
        </p>
        <PlanForm
          key={JSON.stringify(config)}
          initial={config}
          submitLabel="Guardar cambios"
          onSubmit={(c) => {
            setConfig(c)
            setMessage('Plan actualizado.')
          }}
        />
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold text-white">Respaldo</h2>
        <p className="mb-3 text-sm text-slate-400">
          El progreso se guarda en este navegador. Exporta un respaldo para no perderlo o para pasarlo a otro equipo.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={download} className="rounded-md border border-slate-700 px-4 py-1.5 text-sm hover:bg-slate-800">
            Exportar JSON
          </button>
          <button
            onClick={() => fileInput.current?.click()}
            className="rounded-md border border-slate-700 px-4 py-1.5 text-sm hover:bg-slate-800"
          >
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
          <button
            onClick={() => {
              if (confirm('¿Borrar todo el progreso, ejercicios y notas? No se puede deshacer.')) {
                reset()
                navigate('/bienvenida')
              }
            }}
            className="rounded-md border border-red-900 px-4 py-1.5 text-sm text-red-400 hover:bg-red-950"
          >
            Borrar todo
          </button>
        </div>
      </section>

      {message && <p className="text-sm text-emerald-400">{message}</p>}
    </div>
  )
}
