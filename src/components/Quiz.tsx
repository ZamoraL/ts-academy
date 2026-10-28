import { useState } from 'react'
import { useProgress } from '../store/progress'
import type { QuizQuestion } from '../types'
import { CodeBlock } from './CodeBlock'
import { Markdown } from './Markdown'

interface QuizProps {
  unitId: string
  questions: QuizQuestion[]
  /** Empieza sin respuestas aunque haya un intento guardado (repasos). Al corregir, se guarda igual. */
  nuevo?: boolean
}

export function Quiz({ unitId, questions, nuevo = false }: QuizProps) {
  const saved = useProgress((s) => (nuevo ? undefined : s.quizzes[unitId]))
  const saveQuiz = useProgress((s) => s.saveQuiz)
  const [answers, setAnswers] = useState<(number | null)[]>(saved?.answers ?? questions.map(() => null))
  const [submitted, setSubmitted] = useState(saved?.submitted ?? false)

  const score = questions.filter((q, i) => answers[i] === q.answer).length
  const complete = answers.every((a) => a !== null)

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <h2 className="mb-4 text-lg font-semibold text-white">Mini quiz</h2>
      <ol className="space-y-6">
        {questions.map((q, i) => (
          <li key={i}>
            <div className="font-medium text-slate-100">
              {i + 1}. <Markdown inline>{q.question}</Markdown>
            </div>
            {q.code && <CodeBlock code={q.code} lang="tsx" />}
            <div className="mt-2 grid gap-2">
              {q.options.map((opt, j) => {
                const chosen = answers[i] === j
                const style = !submitted
                  ? chosen
                    ? 'border-brand-400 bg-brand-500/10'
                    : 'border-slate-800 hover:border-slate-600'
                  : j === q.answer
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : chosen
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-slate-800 opacity-60'
                return (
                  <button
                    key={j}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => a.map((v, k) => (k === i ? j : v)))}
                    className={`rounded-lg border px-3 py-2 text-left text-sm ${style}`}
                  >
                    <code className="font-mono">{opt}</code>
                  </button>
                )
              })}
            </div>
            {submitted && <p className="mt-2 text-sm text-slate-400">{q.explanation}</p>}
          </li>
        ))}
      </ol>
      <div className="mt-6 flex items-center gap-4">
        {submitted ? (
          <>
            <span className="text-sm">
              Resultado: <strong className="text-white">{score}/{questions.length}</strong>
            </span>
            <button
              onClick={() => {
                const empty = questions.map(() => null)
                setAnswers(empty)
                setSubmitted(false)
                saveQuiz(unitId, { answers: empty, submitted: false })
              }}
              className="rounded-md border border-slate-700 px-4 py-1.5 text-sm hover:bg-slate-800"
            >
              Repetir
            </button>
          </>
        ) : (
          <button
            disabled={!complete}
            onClick={() => {
              setSubmitted(true)
              saveQuiz(unitId, { answers, submitted: true })
            }}
            className="rounded-md bg-brand-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-40"
          >
            Corregir
          </button>
        )}
      </div>
    </section>
  )
}
