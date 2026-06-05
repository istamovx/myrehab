import { supabase } from '@/lib/supabase'
import type { Appointment, Doctor, DoctorUpdate, Profile } from '@/types/database.types'

export async function getDoctor(id: string): Promise<(Doctor & { profile: Profile }) | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('doctors')
    .select('*, profile:profiles(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as (Doctor & { profile: Profile }) | null
}

export async function getDoctors(organizationId: string): Promise<(Doctor & { profile: Profile })[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('doctors')
    .select('*, profile:profiles(*)')
    .eq('organization_id', organizationId)
  if (error) throw error
  return (data ?? []) as (Doctor & { profile: Profile })[]
}

export async function updateDoctor(id: string, data: DoctorUpdate): Promise<Doctor | null> {
  if (!supabase) return null
  const { data: doctor, error } = await supabase
    .from('doctors')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return doctor
}

export async function getDoctorSchedule(doctorId: string, date: string): Promise<Appointment[]> {
  if (!supabase) return []
  const dayStart = `${date}T00:00:00.000Z`
  const dayEnd = `${date}T23:59:59.999Z`
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('doctor_id', doctorId)
    .gte('scheduled_at', dayStart)
    .lte('scheduled_at', dayEnd)
    .order('scheduled_at')
  if (error) throw error
  return data ?? []
}
