import { supabase } from '@/lib/supabase'
import type { Appointment, AppointmentInsert, AppointmentUpdate } from '@/types/database.types'

interface AppointmentFilters {
  doctorId?: string
  patientId?: string
  status?: Appointment['status']
  date?: string
}

export async function getAppointments(
  organizationId: string,
  filters?: AppointmentFilters,
): Promise<Appointment[]> {
  if (!supabase) return []
  let query = supabase
    .from('appointments')
    .select('*')
    .eq('organization_id', organizationId)

  if (filters?.doctorId) query = query.eq('doctor_id', filters.doctorId)
  if (filters?.patientId) query = query.eq('patient_id', filters.patientId)
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.date) {
    query = query
      .gte('scheduled_at', `${filters.date}T00:00:00.000Z`)
      .lte('scheduled_at', `${filters.date}T23:59:59.999Z`)
  }

  const { data, error } = await query.order('scheduled_at')
  if (error) throw error
  return data ?? []
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createAppointment(data: AppointmentInsert): Promise<Appointment | null> {
  if (!supabase) return null
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return appointment
}

export async function updateAppointment(
  id: string,
  data: AppointmentUpdate,
): Promise<Appointment | null> {
  if (!supabase) return null
  const { data: appointment, error } = await supabase
    .from('appointments')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return appointment
}

export async function cancelAppointment(id: string): Promise<Appointment | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getTodayAppointments(organizationId: string): Promise<Appointment[]> {
  if (!supabase) return []
  const today = new Date().toISOString().slice(0, 10)
  return getAppointments(organizationId, { date: today })
}

export async function getProfilesByIds(ids: string[]): Promise<Record<string, string>> {
  if (!supabase || ids.length === 0) return {}
  const { data } = await supabase.from('profiles').select('id, name').in('id', ids)
  return Object.fromEntries((data ?? []).map(d => [d.id, d.name]))
}
