import { supabase } from '@/lib/supabase'
import type { Vitals, VitalsInsert } from '@/types/database.types'

export async function getVitals(patientId: string, limit = 50): Promise<Vitals[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('vitals')
    .select('*')
    .eq('patient_id', patientId)
    .order('recorded_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getLatestVitals(patientId: string): Promise<Vitals | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('vitals')
    .select('*')
    .eq('patient_id', patientId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

export async function logVitals(data: VitalsInsert): Promise<Vitals | null> {
  if (!supabase) return null
  const { data: vitals, error } = await supabase
    .from('vitals')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return vitals
}

export async function getVitalsHistory(patientId: string, days = 30): Promise<Vitals[]> {
  if (!supabase) return []
  const since = new Date()
  since.setDate(since.getDate() - days)
  const { data, error } = await supabase
    .from('vitals')
    .select('*')
    .eq('patient_id', patientId)
    .gte('recorded_at', since.toISOString())
    .order('recorded_at', { ascending: true })
  if (error) throw error
  return data ?? []
}
