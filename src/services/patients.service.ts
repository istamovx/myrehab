import { supabase } from '@/lib/supabase'
import type {
  Patient,
  PatientInsert,
  PatientUpdate,
  Profile,
  ProfileInsert,
} from '@/types/database.types'

export async function getPatients(organizationId: string): Promise<Patient[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('organization_id', organizationId)
    .order('id')
  if (error) throw error
  return data ?? []
}

export async function getPatient(id: string): Promise<(Patient & { profile: Profile }) | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('patients')
    .select('*, profile:profiles(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as (Patient & { profile: Profile }) | null
}

export async function createPatient(data: {
  email: string
  name: string
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female'
  blood_type?: string
  height_cm?: number
  weight_kg?: number
  allergies?: string[]
  assigned_doctor_id?: string
  organization_id: string
}): Promise<Patient | null> {
  if (!supabase) return null

  const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
    email: data.email,
    email_confirm: true,
  })
  if (signUpError) throw signUpError

  const userId = authData.user.id

  const profileInsert: ProfileInsert = {
    id: userId,
    organization_id: data.organization_id,
    role: 'patient',
    name: data.name,
    phone: data.phone ?? null,
  }
  const { error: profileError } = await supabase.from('profiles').insert(profileInsert)
  if (profileError) throw profileError

  const patientInsert: PatientInsert = {
    id: userId,
    organization_id: data.organization_id,
    date_of_birth: data.date_of_birth ?? null,
    gender: data.gender ?? null,
    blood_type: data.blood_type ?? null,
    height_cm: data.height_cm ?? null,
    weight_kg: data.weight_kg ?? null,
    allergies: data.allergies ?? null,
    assigned_doctor_id: data.assigned_doctor_id ?? null,
  }
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .insert(patientInsert)
    .select()
    .single()
  if (patientError) throw patientError
  return patient
}

export async function updatePatient(id: string, data: PatientUpdate): Promise<Patient | null> {
  if (!supabase) return null
  const { data: patient, error } = await supabase
    .from('patients')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return patient
}

export async function searchPatients(organizationId: string, query: string): Promise<Patient[]> {
  if (!supabase) return []
  const term = `%${query}%`
  const { data, error } = await supabase
    .from('patients')
    .select('*, profile:profiles!inner(name, phone)')
    .eq('organization_id', organizationId)
    .or(`name.ilike.${term},phone.ilike.${term}`, { foreignTable: 'profiles' })
  if (error) throw error
  return (data ?? []) as Patient[]
}
