import { supabase } from '@/lib/supabase'
import type { DmedSyncLog } from '@/types/database.types'

export interface DmedPatient {
  id: string
  first_name: string
  last_name: string
  middle_name?: string
  birth_date: string
  gender: 'male' | 'female'
  passport_number?: string
  pinfl?: string
  phone?: string
  address?: string
  district_code?: string
  region_code?: string
}

export interface DmedSyncResult {
  success: boolean
  dmed_id?: string
  error?: string
}

export function isDmedConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_DMED_API_URL && import.meta.env.VITE_DMED_API_KEY,
  )
}

async function logSync(
  organizationId: string,
  recordType: string,
  recordId: string,
): Promise<string | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('dmed_sync_logs')
    .insert({
      organization_id: organizationId,
      record_type: recordType,
      record_id: recordId,
      sync_status: 'pending',
    })
    .select('id')
    .single()
  if (error) return null
  return data?.id ?? null
}

async function updateSyncLog(
  logId: string,
  result: { sync_status: DmedSyncLog['sync_status']; dmed_id?: string; error_message?: string },
): Promise<void> {
  if (!supabase) return
  await supabase
    .from('dmed_sync_logs')
    .update({
      sync_status: result.sync_status,
      dmed_id: result.dmed_id ?? null,
      error_message: result.error_message ?? null,
      last_synced_at: new Date().toISOString(),
    })
    .eq('id', logId)
}

export async function syncPatient(
  patientId: string,
  organizationId: string,
): Promise<DmedSyncResult> {
  if (!isDmedConfigured()) return { success: false, error: 'Dmed API sozlanmagan' }

  const logId = await logSync(organizationId, 'patient', patientId)

  try {
    const response = await fetch(
      `${import.meta.env.VITE_DMED_API_URL}/patients`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_DMED_API_KEY}`,
        },
        body: JSON.stringify({ patient_id: patientId, organization_id: organizationId }),
      },
    )

    if (!response.ok) {
      const message = `HTTP ${response.status}`
      if (logId) await updateSyncLog(logId, { sync_status: 'failed', error_message: message })
      return { success: false, error: message }
    }

    const json = (await response.json()) as { dmed_id?: string }
    const dmedId = json.dmed_id
    if (logId) await updateSyncLog(logId, { sync_status: 'synced', dmed_id: dmedId })
    return { success: true, dmed_id: dmedId }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (logId) await updateSyncLog(logId, { sync_status: 'failed', error_message: message })
    return { success: false, error: message }
  }
}

export async function syncMedicalRecord(
  recordId: string,
  organizationId: string,
): Promise<DmedSyncResult> {
  if (!isDmedConfigured()) return { success: false, error: 'Dmed API sozlanmagan' }

  const logId = await logSync(organizationId, 'medical_record', recordId)

  try {
    const response = await fetch(
      `${import.meta.env.VITE_DMED_API_URL}/medical-records`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_DMED_API_KEY}`,
        },
        body: JSON.stringify({ record_id: recordId, organization_id: organizationId }),
      },
    )

    if (!response.ok) {
      const message = `HTTP ${response.status}`
      if (logId) await updateSyncLog(logId, { sync_status: 'failed', error_message: message })
      return { success: false, error: message }
    }

    const json = (await response.json()) as { dmed_id?: string }
    const dmedId = json.dmed_id
    if (logId) await updateSyncLog(logId, { sync_status: 'synced', dmed_id: dmedId })
    return { success: true, dmed_id: dmedId }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (logId) await updateSyncLog(logId, { sync_status: 'failed', error_message: message })
    return { success: false, error: message }
  }
}

export async function getSyncStatus(organizationId: string): Promise<DmedSyncLog[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('dmed_sync_logs')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function retryFailedSync(organizationId: string): Promise<void> {
  if (!supabase) return
  const { data, error } = await supabase
    .from('dmed_sync_logs')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('sync_status', 'failed')
  if (error) throw error

  const failed = data ?? []
  await Promise.allSettled(
    failed.map(log => {
      if (log.record_type === 'patient') return syncPatient(log.record_id, organizationId)
      if (log.record_type === 'medical_record') return syncMedicalRecord(log.record_id, organizationId)
      return Promise.resolve()
    }),
  )
}
