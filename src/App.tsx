import { lazy, Suspense } from 'react'
import { createHashRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Onboarding } from './pages/Onboarding'
import { PlanPage } from './pages/PlanPage'
import { Settings } from './pages/Settings'
import { Syllabus } from './pages/Syllabus'
import { useProgress } from './store/progress'

// Monaco es pesado: solo se carga al abrir una unidad.
const UnitPage = lazy(() => import('./pages/UnitPage'))
const DevCheck = lazy(() => import('./pages/DevCheck'))
const ReviewPage = lazy(() => import('./pages/ReviewPage'))

function RequireConfig() {
  const config = useProgress((s) => s.config)
  return config ? <Outlet /> : <Navigate to="/bienvenida" replace />
}

const router = createHashRouter([
  { path: '/bienvenida', element: <Onboarding /> },
  {
    element: <RequireConfig />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'plan', element: <PlanPage /> },
          { path: 'temario', element: <Syllabus /> },
          {
            path: 'unidad/:unitId',
            element: (
              <Suspense fallback={<p className="text-slate-400">Cargando…</p>}>
                <UnitPage />
              </Suspense>
            ),
          },
          {
            path: 'repaso/:fecha',
            element: (
              <Suspense fallback={<p className="text-slate-400">Cargando…</p>}>
                <ReviewPage />
              </Suspense>
            ),
          },
          { path: 'ajustes', element: <Settings /> },
          ...(import.meta.env.DEV ? [{ path: 'dev/verificar', element: <Suspense><DevCheck /></Suspense> }] : []),
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
