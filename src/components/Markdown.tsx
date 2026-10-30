import { isValidElement, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'
import { link } from './styles'

function textoDe(nodo: ReactNode): string {
  if (typeof nodo === 'string') return nodo
  if (Array.isArray(nodo)) return nodo.map(textoDe).join('')
  return ''
}

const components: Components = {
  h2: (p) => <h2 className="mb-3 mt-10 text-xl font-bold tracking-tight" {...p} />,
  h3: (p) => <h3 className="mb-2 mt-6 font-bold" {...p} />,
  p: (p) => <p className="my-3 leading-7" {...p} />,
  ul: (p) => <ul className="my-3 list-disc space-y-1 pl-6 marker:text-fg-muted" {...p} />,
  ol: (p) => <ol className="my-3 list-decimal space-y-1 pl-6 marker:font-mono marker:text-fg-muted" {...p} />,
  a: (p) => <a className={link} target="_blank" rel="noreferrer" {...p} />,
  strong: (p) => <strong className="font-bold" {...p} />,
  blockquote: (p) => <blockquote className="my-4 rounded-sm bg-surface-2 px-4 py-1 [&_p]:my-2" {...p} />,
  table: (p) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...p} />
    </div>
  ),
  th: (p) => <th className="border-b border-fg/30 px-3 py-2 font-bold" {...p} />,
  td: (p) => <td className="border-b border-border px-3 py-2" {...p} />,
  pre: ({ children }) => {
    // react-markdown entrega <pre><code className="language-ts">…</code></pre>
    if (isValidElement<{ className?: string; children?: ReactNode }>(children)) {
      const lang = /language-(\w+)/.exec(children.props.className ?? '')?.[1]
      return <CodeBlock code={textoDe(children.props.children).replace(/\n$/, '')} lang={lang} />
    }
    return <CodeBlock code={textoDe(children)} />
  },
  code: ({ className, ...p }) =>
    className ? (
      <code className={className} {...p} />
    ) : (
      <code className="rounded-sm bg-surface-2 px-1 py-0.5 font-mono text-[0.875em]" {...p} />
    ),
}

const inlineComponents: Components = { ...components, p: (p) => <span {...p} /> }

/** `inline` evita el <p> envolvente, para textos cortos dentro de otros elementos. */
export function Markdown({ children, inline = false }: { children: string; inline?: boolean }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={inline ? inlineComponents : components}>
      {children}
    </ReactMarkdown>
  )
}
