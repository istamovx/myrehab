import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'

export function trackEvent(type: string, properties?: Record<string, unknown>): void {
  if (!supabase) return
  const user = useAuthStore.getState().user
  supabase
    .from('analytics_events')
    .insert({
      event_type: type,
      user_id: user?.username ?? null,
      properties: (properties ?? null) as import('@/types/database.types').Json,
      source: typeof window !== 'undefined' ? window.location.pathname : null,
    })
    .then(() => { /* fire-and-forget */ })
}

export async function getOrganizationStats(organizationId: string): Promise<{
  totalPatients: number
  activePatients: number
  totalDoctors: number
  appointmentsThisMonth: number
  completedAppointments: number
  revenueThisMonth: number
  patientsBySource: Record<string, number>
}> {
  if (!supabase) {
    return {
      totalPatients: 0,
      activePatients: 0,
      totalDoctors: 0,
      appointmentsThisMonth: 0,
      completedAppointments: 0,
      revenueThisMonth: 0,
      patientsBySource: {},
    }
  }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const [
    { count: totalPatients },
    { count: totalDoctors },
    { count: appointmentsThisMonth },
    { count: completedAppointments },
    sourceRows,
  ] = await Promise.all([
    supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId),
    supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('scheduled_at', monthStart)
      .lte('scheduled_at', monthEnd),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('status', 'completed')
      .gte('scheduled_at', monthStart)
      .lte('scheduled_at', monthEnd),
    supabase
      .from('analytics_events')
      .select('source')
      .eq('organization_id', organizationId)
      .not('source', 'is', null)
      .gte('created_at', monthStart),
  ])

  const patientsBySource: Record<string, number> = {}
  for (const row of sourceRows.data ?? []) {
    if (row.source) patientsBySource[row.source] = (patientsBySource[row.source] ?? 0) + 1
  }

  return {
    totalPatients: totalPatients ?? 0,
    activePatients: totalPatients ?? 0,
    totalDoctors: totalDoctors ?? 0,
    appointmentsThisMonth: appointmentsThisMonth ?? 0,
    completedAppointments: completedAppointments ?? 0,
    revenueThisMonth: 0,
    patientsBySource,
  }
}

export async function getPatientAcquisitionBySource(
  organizationId: string,
  days = 30,
): Promise<{ source: string; count: number }[]> {
  if (!supabase) return []
  const since = new Date()
  since.setDate(since.getDate() - days)
  const { data, error } = await supabase
    .from('analytics_events')
    .select('source')
    .eq('organization_id', organizationId)
    .not('source', 'is', null)
    .gte('created_at', since.toISOString())
  if (error) throw error
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    if (row.source) counts[row.source] = (counts[row.source] ?? 0) + 1
  }
  return Object.entries(counts).map(([source, count]) => ({ source, count }))
}

export async function getMonthlyRevenue(
  _organizationId: string,
  months = 6,
): Promise<{ month: string; amount: number }[]> {
  if (!supabase) return []
  const results: { month: string; amount: number }[] = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthLabel = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    results.push({ month: monthLabel, amount: 0 })
  }
  return results
}

export async function getAppointmentTrend(
  organizationId: string,
  days = 30,
): Promise<{ date: string; count: number }[]> {
  if (!supabase) return []
  const since = new Date()
  since.setDate(since.getDate() - days)
  const { data, error } = await supabase
    .from('appointments')
    .select('scheduled_at')
    .eq('organization_id', organizationId)
    .gte('scheduled_at', since.toISOString())
  if (error) throw error

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    const date = row.scheduled_at.slice(0, 10)
    counts[date] = (counts[date] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
