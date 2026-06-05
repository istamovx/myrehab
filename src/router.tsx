import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppLayout } from './components/layout/app-layout'
import { PatientLayout } from './components/layout/patient-layout'
import { SuperAdminLayout } from './components/layout/super-admin-layout'
import { DashboardPage } from './features/dashboard'
import { PatientsListPage } from './features/patients/list'
import { PatientDetailPage } from './features/patients/detail'
import { DoctorsPage } from './features/doctors'
import { MembershipRequestsPage } from './features/membership'
import { SettingsPage } from './features/settings'
import { InsightsPage } from './features/insights'
import { AppointmentsPage } from './features/appointments'
import { DocsPage } from './features/docs'
import { TeamPage } from './features/team'
import { InventoryPage } from './features/inventory'
import { LabResultsPage } from './features/lab-results'
import { ExercisesPage } from './features/exercises'
import { TeleconsultationPage } from './features/teleconsultation'
import { MessagesPage } from './features/messages'
import { PatientTodayPage } from './features/patient/today'
import { PatientTeleconsultationPage } from './features/patient/teleconsultation'
import { PatientExercisesPage } from './features/patient/exercises'
import { PatientPlanPage } from './features/patient/plan'
import { PatientProgressPage } from './features/patient/progress'
import { PatientVitalsPage } from './features/patient/vitals'
import { PatientSymptomsPage } from './features/patient/symptoms'
import { PatientNutritionPage } from './features/patient/nutrition'
import { PatientKnowledgePage } from './features/patient/knowledge'
import { PatientMessagesPage } from './features/patient/messages'
import { PatientAppointmentsPage } from './features/patient/appointments'
import { PatientSettingsPage } from './features/patient/settings'
import { SuperAdminDashboardPage } from './features/super-admin/dashboard'
import { SuperAdminOrganizationsPage } from './features/super-admin/organizations'
import { SuperAdminPaymentsPage } from './features/super-admin/payments'
import { SuperAdminSettingsPage } from './features/super-admin/settings'
import { LoginPage } from './features/auth/login'
import { LandingPage } from './features/landing'
import { useAuthStore, homePathForRole, type Role } from './store/auth'

const rootRoute = createRootRoute({ component: Outlet })

// ── Auth guards ──────────────────────────────────────────────────────────────
function requireRole(role: Role) {
  const user = useAuthStore.getState().user
  if (!user) throw redirect({ to: '/login' })
  if (user.role !== role) throw redirect({ to: homePathForRole(user.role) })
}

// ── Login (public) ────────────────────────────────────────────────────────────
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (user) throw redirect({ to: homePathForRole(user.role) })
  },
  component: LoginPage,
})

// ── Root index → landing page for guests, dashboard for logged-in users ────────
const rootIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (user) throw redirect({ to: homePathForRole(user.role) })
  },
  component: LandingPage,
})

// ── Admin layout ─────────────────────────────────────────────────────────────
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_admin',
  beforeLoad: () => requireRole('doctor'),
  component: AppLayout,
})

const dashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const patientsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/patients',
  component: PatientsListPage,
})

const patientDetailRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/patients/$patientId',
  component: PatientDetailPage,
})

const doctorsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/doctors',
  component: DoctorsPage,
})

const membershipRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/membership-requests',
  component: MembershipRequestsPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/settings',
  component: SettingsPage,
})

const insightsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/insights',
  component: InsightsPage,
})

const appointmentsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/appointments',
  component: AppointmentsPage,
})

const docsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/docs',
  component: DocsPage,
})

const teamRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/team',
  component: TeamPage,
})

const inventoryRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/inventory',
  component: InventoryPage,
})

const labResultsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/lab-results',
  component: LabResultsPage,
})

const teleconsultationRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/teleconsultation',
  component: TeleconsultationPage,
})

const exercisesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/exercises',
  component: ExercisesPage,
})

const messagesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/messages',
  component: MessagesPage,
})

// ── Super Admin layout ────────────────────────────────────────────────────────
const superAdminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/super-admin',
  beforeLoad: () => requireRole('super_admin'),
  component: SuperAdminLayout,
})

const superAdminIndexRoute = createRoute({
  getParentRoute: () => superAdminLayoutRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/super-admin/dashboard' }) },
})

const superAdminDashboardRoute = createRoute({
  getParentRoute: () => superAdminLayoutRoute,
  path: '/dashboard',
  component: SuperAdminDashboardPage,
})

const superAdminOrganizationsRoute = createRoute({
  getParentRoute: () => superAdminLayoutRoute,
  path: '/organizations',
  component: SuperAdminOrganizationsPage,
})

const superAdminPaymentsRoute = createRoute({
  getParentRoute: () => superAdminLayoutRoute,
  path: '/payments',
  component: SuperAdminPaymentsPage,
})

const superAdminSettingsRoute = createRoute({
  getParentRoute: () => superAdminLayoutRoute,
  path: '/settings',
  component: SuperAdminSettingsPage,
})

// ── Patient layout ────────────────────────────────────────────────────────────
const patientLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient',
  beforeLoad: () => requireRole('patient'),
  component: PatientLayout,
})

const patientIndexRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/patient/today' }) },
})

const patientTodayRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/today',
  component: PatientTodayPage,
})

const patientExercisesRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/exercises',
  component: PatientExercisesPage,
})

const patientPlanRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/plan',
  component: PatientPlanPage,
})

const patientProgressRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/progress',
  component: PatientProgressPage,
})

const patientVitalsRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/vitals',
  component: PatientVitalsPage,
})

const patientSymptomsRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/symptoms',
  component: PatientSymptomsPage,
})

const patientNutritionRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/nutrition',
  component: PatientNutritionPage,
})

const patientKnowledgeRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/knowledge',
  component: PatientKnowledgePage,
})

const patientMessagesRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/messages',
  component: PatientMessagesPage,
})

const patientAppointmentsRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/appointments',
  component: PatientAppointmentsPage,
})

const patientTeleconsultationRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/teleconsultation',
  component: PatientTeleconsultationPage,
})

const patientSettingsRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: '/settings',
  component: PatientSettingsPage,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  rootIndexRoute,
  adminLayoutRoute.addChildren([
    dashboardRoute,
    patientsRoute,
    patientDetailRoute,
    doctorsRoute,
    membershipRoute,
    settingsRoute,
    insightsRoute,
    appointmentsRoute,
    docsRoute,
    teamRoute,
    inventoryRoute,
    labResultsRoute,
    teleconsultationRoute,
    exercisesRoute,
    messagesRoute,
  ]),
  superAdminLayoutRoute.addChildren([
    superAdminIndexRoute,
    superAdminDashboardRoute,
    superAdminOrganizationsRoute,
    superAdminPaymentsRoute,
    superAdminSettingsRoute,
  ]),
  patientLayoutRoute.addChildren([
    patientIndexRoute,
    patientTodayRoute,
    patientExercisesRoute,
    patientPlanRoute,
    patientProgressRoute,
    patientVitalsRoute,
    patientSymptomsRoute,
    patientNutritionRoute,
    patientKnowledgeRoute,
    patientMessagesRoute,
    patientAppointmentsRoute,
    patientTeleconsultationRoute,
    patientSettingsRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
