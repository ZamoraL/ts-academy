import { useEffect, useState } from 'react'
import { monaco } from '../exercise/monaco'

const LENGUAJES: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  typescript: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  javascript: 'javascript',
  json: 'json',
  bash: 'shell',
  sh: 'shell',
  css: 'css',
  html: 'html',
}

/** Bloque de código con el mismo resaltado que el editor. Sin lenguaje conocido, texto plano. */
export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const lenguaje = lang ? LENGUAJES[lang] : undefined
  const [html, setHtml] = useState<{ code: string; html: string } | null>(null)

  useEffect(() => {
    if (!lenguaje) return
    let cancelado = false
    // colorize escapa el texto y devuelve spans con las clases del tema de Monaco.
    void monaco.editor.colorize(code, lenguaje, { tabSize: 2 }).then((h) => {
      if (!cancelado) setHtml({ code, html: h })
    })
    return () => {
      cancelado = true
    }
  }, [code, lenguaje])

  const clase = 'my-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-4 font-mono text-sm leading-6'
  if (html && html.code === code) {
    return <pre className={clase} dangerouslySetInnerHTML={{ __html: html.html }} />
  }
  return (
    <pre className={clase}>
      <code className="text-slate-200">{code}</code>
    </pre>
  )
}
