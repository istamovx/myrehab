import { supabase } from '@/lib/supabase'
import type { MedicalRecord, MedicalRecordInsert, MedicalRecordUpdate } from '@/types/database.types'

export async function getPatientRecords(patientId: string): Promise<MedicalRecord[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('medical_records')
    .select('*')
    .eq('patient_id', patientId)
    .order('visit_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getMedicalRecord(id: string): Promise<MedicalRecord | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('medical_records')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createMedicalRecord(data: MedicalRecordInsert): Promise<MedicalRecord | null> {
  if (!supabase) return null
  const { data: record, error } = await supabase
    .from('medical_records')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return record
}

export async function updateMedicalRecord(
  id: string,
  data: MedicalRecordUpdate,
): Promise<MedicalRecord | null> {
  if (!supabase) return null
  const { data: record, error } = await supabase
    .from('medical_records')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return record
}

export async function saveDraft(
  data: MedicalRecordInsert & { id?: string },
): Promise<MedicalRecord | null> {
  if (!supabase) return null
  const { data: record, error } = await supabase
    .from('medical_records')
    .upsert({ ...data, status: 'draft' })
    .select()
    .single()
  if (error) throw error
  return record
}

export async function submitRecord(id: string): Promise<MedicalRecord | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('medical_records')
    .update({ status: 'completed' })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
