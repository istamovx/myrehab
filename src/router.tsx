import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppLayout } from './components/layout/app-layout'
import { DashboardPage } from './features/dashboard'
import { PatientsListPage } from './features/patients/list'
import { PatientDetailPage } from './features/patients/detail'
import { InsightsPage } from './features/insights'
import { AppointmentsPage } from './features/appointments'
import { DocsPage } from './features/docs'
import { TeamPage } from './features/team'

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' })
  },
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const patientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patients',
  component: PatientsListPage,
})

const patientDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patients/$patientId',
  component: PatientDetailPage,
})

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/insights',
  component: InsightsPage,
})

const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointments',
  component: AppointmentsPage,
})

const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/docs',
  component: DocsPage,
})

const teamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/team',
  component: TeamPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  patientsRoute,
  patientDetailRoute,
  insightsRoute,
  appointmentsRoute,
  docsRoute,
  teamRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
