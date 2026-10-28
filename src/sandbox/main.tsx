// Página que corre dentro del iframe de los ejercicios de React.
// El código llega ya compilado a CommonJS; `require` provee React y nada más.
import { cleanup, configure, render, screen, fireEvent, act, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Component, type ReactNode } from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { createRoot, type Root } from 'react-dom/client'
import * as jsxRuntime from 'react/jsx-runtime'
import * as zod from 'zod'
import { format, makeExpect, runTests, type RunResponse } from '../exercise/expect'
import type { SandboxApi } from './api'

const MODULOS: Record<string, unknown> = {
  react: React,
  'react/jsx-runtime': jsxRuntime,
  'react-dom/client': ReactDOMClient,
  zod,
}

function requerir(nombre: string): unknown {
  if (nombre in MODULOS) return MODULOS[nombre]
  throw new Error(`No se puede importar "${nombre}" en los ejercicios (solo react y zod)`)
}

const LIMITE_BUCLE_MS = 2000

// Por defecto, los errores de Testing Library incluyen todo el DOM: dejamos solo el mensaje.
configure({
  getElementError(message) {
    const error = new Error((message ?? '').split('\n\n')[0])
    error.name = 'TestingLibraryElementError'
    return error
  },
})

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) return <div className="__error">Error al renderizar: {this.state.error.message}</div>
    return this.props.children
  }
}

let raiz: Root | null = null

function mostrarVistaPrevia(componente: unknown) {
  raiz?.unmount()
  raiz = createRoot(document.getElementById('preview')!)
  if (typeof componente === 'function') {
    raiz.render(
      <ErrorBoundary>{React.createElement(componente as React.ComponentType)}</ErrorBoundary>,
    )
  } else {
    raiz.render(<p style={{ color: '#64748b' }}>Exporta un componente por defecto (export default) para verlo aquí.</p>)
  }
}

const api: SandboxApi = {
  async ejecutar(code, conTests) {
    const logs: string[] = []
    const tests: { name: string; fn: () => unknown }[] = []
    const capture = (...args: unknown[]) => logs.push(args.map(format).join(' '))
    const fakeConsole = { log: capture, info: capture, warn: capture, error: capture }
    const exports: Record<string, unknown> = {}
    const inicio = Date.now()
    const guardia = () => {
      if (Date.now() - inicio > LIMITE_BUCLE_MS) throw new Error('El bucle tardó demasiado. ¿Es infinito?')
    }

    const response: RunResponse = { logs, tests: [] }
    try {
      const run = new Function(
        'console', 'test', 'expect', '__logs', 'exports', 'require', '__guardia',
        'render', 'screen', 'fireEvent', 'userEvent', 'act', 'waitFor', 'within',
        code,
      )
      run(
        fakeConsole, (name: string, fn: () => unknown) => tests.push({ name, fn }), makeExpect, logs, exports, requerir, guardia,
        render, screen, fireEvent, userEvent, act, waitFor, within,
      )
    } catch (e) {
      response.error = format(e)
    }

    // React reporta errores de render con console.error: los capturamos durante los tests.
    const consoleError = console.error
    console.error = capture
    try {
      if (!response.error && conTests) response.tests = await runTests(tests, cleanup)
    } finally {
      console.error = consoleError
    }

    mostrarVistaPrevia(exports.default)
    return response
  },
}

window.__sandbox = api
window.parent.postMessage({ tipo: 'sandbox-listo' }, '*')
