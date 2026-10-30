import { useState } from 'react'
import { useProgress } from '../store/progress'
import type { QuizQuestion } from '../types'
import { CodeBlock } from './CodeBlock'
import { Markdown } from './Markdown'
import { btn } from './styles'

interface QuizProps {
  unitId: string
  questions: QuizQuestion[]
  /** Empieza sin respuestas aunque haya un intento guardado (repasos). Al corregir, se guarda igual. */
  nuevo?: boolean
}

const LETRAS = 'abcdefgh'

/** Las opciones suelen ser código; las frases normales se leen mejor en la fuente de texto. */
const esProsa = (s: string) => /^[\p{L}\s,.;¿?¡!()]+$/u.test(s) && /\s/.test(s) && !/^(true|false|null|undefined)$/.test(s)

export function Quiz({ unitId, questions, nuevo = false }: QuizProps) {
  const saved = useProgress((s) => (nuevo ? undefined : s.quizzes[unitId]))
  const saveQuiz = useProgress((s) => s.saveQuiz)
  const [answers, setAnswers] = useState<(number | null)[]>(saved?.answers ?? questions.map(() => null))
  const [submitted, setSubmitted] = useState(saved?.submitted ?? false)

  const score = questions.filter((q, i) => answers[i] === q.answer).length
  const pendientes = answers.filter((a) => a === null).length

  return (
    <section aria-labelledby={`quiz-${unitId}`}>
      <h2 id={`quiz-${unitId}`} className="font-display mb-4 text-xl">
        Mini quiz
      </h2>
      <ol className="space-y-6">
        {questions.map((q, i) => (
          <li key={i}>
            <fieldset>
              <legend className="flex gap-3 font-bold">
                <span className="tabular font-mono text-xs leading-6 font-normal text-fg-muted">{i + 1}.</span>
                <span>
                  <Markdown inline>{q.question}</Markdown>
                </span>
              </legend>
              {q.code && (
                <div className="ml-6">
                  <CodeBlock code={q.code} lang="tsx" />
                </div>
              )}
              <div className="mt-2 ml-6 divide-y divide-border rounded-sm border border-border">
                {q.options.map((opt, j) => {
                  const chosen = answers[i] === j
                  const correcta = submitted && j === q.answer
                  const fallo = submitted && chosen && j !== q.answer
                  return (
                    <label
                      key={j}
                      className={`flex min-h-10 cursor-pointer items-center gap-3 px-3 py-2 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent-ink ${
                        submitted ? 'cursor-default' : 'hover:bg-surface-2'
                      } ${chosen && !submitted ? 'bg-surface-2' : ''} ${submitted && !correcta && !fallo ? 'text-fg-muted' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`${unitId}-${i}`}
                        checked={chosen}
                        disabled={submitted}
                        onChange={() => setAnswers((a) => a.map((v, k) => (k === i ? j : v)))}
                        className="sr-only"
                      />
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-sm border font-mono text-[11px] ${
                          correcta
                            ? 'border-success bg-success text-on-success'
                            : fallo
                              ? 'border-danger bg-danger text-on-danger'
                              : chosen
                                ? 'border-accent bg-accent text-on-accent'
                                : 'border-border text-fg-muted'
                        }`}
                        aria-hidden
                      >
                        {correcta ? '✓' : fallo ? '✗' : LETRAS[j]}
                      </span>
                      {esProsa(opt) ? <span>{opt}</span> : <code className="font-mono">{opt}</code>}
                      {correcta && <span className="sr-only">(respuesta correcta)</span>}
                      {fallo && <span className="sr-only">(tu respuesta, incorrecta)</span>}
                    </label>
                  )
                })}
              </div>
              {submitted && <p className="mt-2 ml-6 text-sm text-fg-muted">{q.explanation}</p>}
            </fieldset>
          </li>
        ))}
      </ol>
      <div className="mt-6 ml-6 flex flex-wrap items-center gap-4" aria-live="polite">
        {submitted ? (
          <>
            <span className="tabular font-mono text-sm">
              {score}/{questions.length} correctas
            </span>
            <button
              onClick={() => {
                const empty = questions.map(() => null)
                setAnswers(empty)
                setSubmitted(false)
                saveQuiz(unitId, { answers: empty, submitted: false })
              }}
              className={btn.secondary}
            >
              Repetir quiz
            </button>
          </>
        ) : (
          <>
            <button
              disabled={pendientes > 0}
              onClick={() => {
                setSubmitted(true)
                saveQuiz(unitId, { answers, submitted: true })
              }}
              className={btn.secondary}
            >
              Corregir respuestas
            </button>
            {pendientes > 0 && (
              <span className="text-sm text-fg-muted">
                {pendientes === 1 ? 'Falta 1 pregunta por responder.' : `Faltan ${pendientes} preguntas por responder.`}
              </span>
            )}
          </>
        )}
      </div>
    </section>
  )
}
