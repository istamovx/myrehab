import { supabase } from '@/lib/supabase'
import type { Json, LabResult, LabResultInsert, LabResultUpdate } from '@/types/database.types'

interface LabResultFilters {
  patientId?: string
  status?: LabResult['status']
}

export async function getLabResults(
  organizationId: string,
  filters?: LabResultFilters,
): Promise<LabResult[]> {
  if (!supabase) return []
  let query = supabase
    .from('lab_results')
    .select('*')
    .eq('organization_id', organizationId)

  if (filters?.patientId) query = query.eq('patient_id', filters.patientId)
  if (filters?.status) query = query.eq('status', filters.status)

  const { data, error } = await query.order('ordered_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getPatientLabResults(patientId: string): Promise<LabResult[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('lab_results')
    .select('*')
    .eq('patient_id', patientId)
    .order('ordered_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createLabResult(data: LabResultInsert): Promise<LabResult | null> {
  if (!supabase) return null
  const { data: result, error } = await supabase
    .from('lab_results')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return result
}

export async function updateLabResult(
  id: string,
  data: LabResultUpdate,
): Promise<LabResult | null> {
  if (!supabase) return null
  const { data: result, error } = await supabase
    .from('lab_results')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return result
}

export async function completeLabResult(id: string, results: Json): Promise<LabResult | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('lab_results')
    .update({
      status: 'completed',
      results,
      completed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
