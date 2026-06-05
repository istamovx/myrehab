export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          subscription_tier: 'starter' | 'business' | 'enterprise'
          subscription_status: 'trial' | 'active' | 'expired' | 'cancelled'
          trial_ends_at: string | null
          max_doctors: number
          max_patients: number
          settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          subscription_tier: 'starter' | 'business' | 'enterprise'
          subscription_status: 'trial' | 'active' | 'expired' | 'cancelled'
          trial_ends_at?: string | null
          max_doctors: number
          max_patients: number
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          subscription_tier?: 'starter' | 'business' | 'enterprise'
          subscription_status?: 'trial' | 'active' | 'expired' | 'cancelled'
          trial_ends_at?: string | null
          max_doctors?: number
          max_patients?: number
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          organization_id: string | null
          role: 'super_admin' | 'admin' | 'doctor' | 'patient'
          name: string
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          telegram_chat_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id?: string | null
          role: 'super_admin' | 'admin' | 'doctor' | 'patient'
          name: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          telegram_chat_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          role?: 'super_admin' | 'admin' | 'doctor' | 'patient'
          name?: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          telegram_chat_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          id: string
          organization_id: string
          specialization: string | null
          license_number: string | null
          experience_years: number | null
          bio: string | null
          consultation_fee: number | null
          working_hours: Json | null
        }
        Insert: {
          id: string
          organization_id: string
          specialization?: string | null
          license_number?: string | null
          experience_years?: number | null
          bio?: string | null
          consultation_fee?: number | null
          working_hours?: Json | null
        }
        Update: {
          id?: string
          organization_id?: string
          specialization?: string | null
          license_number?: string | null
          experience_years?: number | null
          bio?: string | null
          consultation_fee?: number | null
          working_hours?: Json | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          id: string
          organization_id: string
          date_of_birth: string | null
          gender: 'male' | 'female' | null
          blood_type: string | null
          height_cm: number | null
          weight_kg: number | null
          allergies: string[] | null
          emergency_contact: Json | null
          assigned_doctor_id: string | null
          diagnosis_primary: string | null
          diagnosis_icd10: string[] | null
        }
        Insert: {
          id: string
          organization_id: string
          date_of_birth?: string | null
          gender?: 'male' | 'female' | null
          blood_type?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          allergies?: string[] | null
          emergency_contact?: Json | null
          assigned_doctor_id?: string | null
          diagnosis_primary?: string | null
          diagnosis_icd10?: string[] | null
        }
        Update: {
          id?: string
          organization_id?: string
          date_of_birth?: string | null
          gender?: 'male' | 'female' | null
          blood_type?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          allergies?: string[] | null
          emergency_contact?: Json | null
          assigned_doctor_id?: string | null
          diagnosis_primary?: string | null
          diagnosis_icd10?: string[] | null
        }
        Relationships: []
      }
      icd10_codes: {
        Row: {
          code: string
          description_uz: string | null
          description_ru: string | null
          description_en: string | null
          category: string | null
          chapter: string | null
        }
        Insert: {
          code: string
          description_uz?: string | null
          description_ru?: string | null
          description_en?: string | null
          category?: string | null
          chapter?: string | null
        }
        Update: {
          code?: string
          description_uz?: string | null
          description_ru?: string | null
          description_en?: string | null
          category?: string | null
          chapter?: string | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          organization_id: string
          visit_date: string
          chief_complaint: string | null
          anamnesis: string | null
          objective_data: string | null
          diagnosis_codes: string[] | null
          diagnosis_description: string | null
          treatment_plan: string | null
          prescriptions: Json[] | null
          voice_transcript: string | null
          attachments: string[] | null
          follow_up_date: string | null
          status: 'draft' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          organization_id: string
          visit_date: string
          chief_complaint?: string | null
          anamnesis?: string | null
          objective_data?: string | null
          diagnosis_codes?: string[] | null
          diagnosis_description?: string | null
          treatment_plan?: string | null
          prescriptions?: Json[] | null
          voice_transcript?: string | null
          attachments?: string[] | null
          follow_up_date?: string | null
          status?: 'draft' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          organization_id?: string
          visit_date?: string
          chief_complaint?: string | null
          anamnesis?: string | null
          objective_data?: string | null
          diagnosis_codes?: string[] | null
          diagnosis_description?: string | null
          treatment_plan?: string | null
          prescriptions?: Json[] | null
          voice_transcript?: string | null
          attachments?: string[] | null
          follow_up_date?: string | null
          status?: 'draft' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          organization_id: string
          scheduled_at: string
          duration_minutes: number
          type: 'in_person' | 'video'
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          reason: string | null
          notes: string | null
          video_room_url: string | null
          telegram_notified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          organization_id: string
          scheduled_at: string
          duration_minutes: number
          type: 'in_person' | 'video'
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          reason?: string | null
          notes?: string | null
          video_room_url?: string | null
          telegram_notified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          organization_id?: string
          scheduled_at?: string
          duration_minutes?: number
          type?: 'in_person' | 'video'
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          reason?: string | null
          notes?: string | null
          video_room_url?: string | null
          telegram_notified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          id: string
          organization_id: string | null
          name: string
          description: string | null
          video_url: string | null
          thumbnail_url: string | null
          category: 'strength' | 'flexibility' | 'cardio' | 'balance' | 'coordination'
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration_minutes: number | null
          muscle_groups: string[] | null
          instructions: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          name: string
          description?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          category: 'strength' | 'flexibility' | 'cardio' | 'balance' | 'coordination'
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration_minutes?: number | null
          muscle_groups?: string[] | null
          instructions?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          name?: string
          description?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          category?: 'strength' | 'flexibility' | 'cardio' | 'balance' | 'coordination'
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          duration_minutes?: number | null
          muscle_groups?: string[] | null
          instructions?: string[] | null
          created_at?: string
        }
        Relationships: []
      }
      rehab_plans: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          organization_id: string
          name: string
          description: string | null
          diagnosis_codes: string[] | null
          start_date: string
          end_date: string | null
          status: 'active' | 'completed' | 'paused' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          organization_id: string
          name: string
          description?: string | null
          diagnosis_codes?: string[] | null
          start_date: string
          end_date?: string | null
          status?: 'active' | 'completed' | 'paused' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          organization_id?: string
          name?: string
          description?: string | null
          diagnosis_codes?: string[] | null
          start_date?: string
          end_date?: string | null
          status?: 'active' | 'completed' | 'paused' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      plan_exercises: {
        Row: {
          id: string
          plan_id: string
          exercise_id: string
          sets: number | null
          reps: number | null
          duration_seconds: number | null
          frequency_per_week: number | null
          day_of_week: number[] | null
          notes: string | null
          order_index: number
        }
        Insert: {
          id?: string
          plan_id: string
          exercise_id: string
          sets?: number | null
          reps?: number | null
          duration_seconds?: number | null
          frequency_per_week?: number | null
          day_of_week?: number[] | null
          notes?: string | null
          order_index: number
        }
        Update: {
          id?: string
          plan_id?: string
          exercise_id?: string
          sets?: number | null
          reps?: number | null
          duration_seconds?: number | null
          frequency_per_week?: number | null
          day_of_week?: number[] | null
          notes?: string | null
          order_index?: number
        }
        Relationships: []
      }
      exercise_logs: {
        Row: {
          id: string
          plan_exercise_id: string
          patient_id: string
          completed_at: string
          sets_completed: number | null
          reps_completed: number | null
          duration_seconds: number | null
          pain_level: number | null
          notes: string | null
          date: string
        }
        Insert: {
          id?: string
          plan_exercise_id: string
          patient_id: string
          completed_at: string
          sets_completed?: number | null
          reps_completed?: number | null
          duration_seconds?: number | null
          pain_level?: number | null
          notes?: string | null
          date: string
        }
        Update: {
          id?: string
          plan_exercise_id?: string
          patient_id?: string
          completed_at?: string
          sets_completed?: number | null
          reps_completed?: number | null
          duration_seconds?: number | null
          pain_level?: number | null
          notes?: string | null
          date?: string
        }
        Relationships: []
      }
      vitals: {
        Row: {
          id: string
          patient_id: string
          recorded_by: string | null
          recorded_at: string
          heart_rate: number | null
          blood_pressure_systolic: number | null
          blood_pressure_diastolic: number | null
          temperature_celsius: number | null
          oxygen_saturation: number | null
          weight_kg: number | null
          pain_level: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          patient_id: string
          recorded_by?: string | null
          recorded_at: string
          heart_rate?: number | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          temperature_celsius?: number | null
          oxygen_saturation?: number | null
          weight_kg?: number | null
          pain_level?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          patient_id?: string
          recorded_by?: string | null
          recorded_at?: string
          heart_rate?: number | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          temperature_celsius?: number | null
          oxygen_saturation?: number | null
          weight_kg?: number | null
          pain_level?: number | null
          notes?: string | null
        }
        Relationships: []
      }
      symptom_logs: {
        Row: {
          id: string
          patient_id: string
          logged_at: string
          symptoms: Json[] | null
          pain_location: string | null
          pain_level: number | null
          description: string | null
        }
        Insert: {
          id?: string
          patient_id: string
          logged_at: string
          symptoms?: Json[] | null
          pain_location?: string | null
          pain_level?: number | null
          description?: string | null
        }
        Update: {
          id?: string
          patient_id?: string
          logged_at?: string
          symptoms?: Json[] | null
          pain_location?: string | null
          pain_level?: number | null
          description?: string | null
        }
        Relationships: []
      }
      lab_results: {
        Row: {
          id: string
          patient_id: string
          ordered_by: string | null
          organization_id: string
          test_name: string
          test_code: string | null
          results: Json | null
          status: 'pending' | 'in_progress' | 'completed'
          ordered_at: string
          completed_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          patient_id: string
          ordered_by?: string | null
          organization_id: string
          test_name: string
          test_code?: string | null
          results?: Json | null
          status?: 'pending' | 'in_progress' | 'completed'
          ordered_at: string
          completed_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          patient_id?: string
          ordered_by?: string | null
          organization_id?: string
          test_name?: string
          test_code?: string | null
          results?: Json | null
          status?: 'pending' | 'in_progress' | 'completed'
          ordered_at?: string
          completed_at?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          id: string
          organization_id: string
          name: string
          category: 'medication' | 'consumable' | 'equipment'
          unit: string
          quantity: number
          min_quantity: number
          unit_price: number | null
          supplier: string | null
          expiry_date: string | null
          barcode: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          category: 'medication' | 'consumable' | 'equipment'
          unit: string
          quantity: number
          min_quantity: number
          unit_price?: number | null
          supplier?: string | null
          expiry_date?: string | null
          barcode?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          category?: 'medication' | 'consumable' | 'equipment'
          unit?: string
          quantity?: number
          min_quantity?: number
          unit_price?: number | null
          supplier?: string | null
          expiry_date?: string | null
          barcode?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_usage: {
        Row: {
          id: string
          inventory_item_id: string
          organization_id: string
          used_by: string | null
          patient_id: string | null
          quantity: number
          reason: string | null
          used_at: string
        }
        Insert: {
          id?: string
          inventory_item_id: string
          organization_id: string
          used_by?: string | null
          patient_id?: string | null
          quantity: number
          reason?: string | null
          used_at: string
        }
        Update: {
          id?: string
          inventory_item_id?: string
          organization_id?: string
          used_by?: string | null
          patient_id?: string | null
          quantity?: number
          reason?: string | null
          used_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          id: string
          organization_id: string | null
          user_id: string | null
          event_type: string
          source: string | null
          campaign: string | null
          properties: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          event_type: string
          source?: string | null
          campaign?: string | null
          properties?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          event_type?: string
          source?: string | null
          campaign?: string | null
          properties?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string
          data: Json | null
          is_read: boolean
          sent_via: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          body: string
          data?: Json | null
          is_read?: boolean
          sent_via?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          body?: string
          data?: Json | null
          is_read?: boolean
          sent_via?: string[] | null
          created_at?: string
        }
        Relationships: []
      }
      dmed_sync_logs: {
        Row: {
          id: string
          organization_id: string
          record_type: string
          record_id: string
          dmed_id: string | null
          sync_status: 'pending' | 'synced' | 'failed' | 'skipped'
          last_synced_at: string | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          record_type: string
          record_id: string
          dmed_id?: string | null
          sync_status?: 'pending' | 'synced' | 'failed' | 'skipped'
          last_synced_at?: string | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          record_type?: string
          record_id?: string
          dmed_id?: string | null
          sync_status?: 'pending' | 'synced' | 'failed' | 'skipped'
          last_synced_at?: string | null
          error_message?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      subscription_tier: 'starter' | 'business' | 'enterprise'
      subscription_status: 'trial' | 'active' | 'expired' | 'cancelled'
      user_role: 'super_admin' | 'admin' | 'doctor' | 'patient'
      appointment_type: 'in_person' | 'video'
      appointment_status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
      exercise_category: 'strength' | 'flexibility' | 'cardio' | 'balance' | 'coordination'
      exercise_difficulty: 'beginner' | 'intermediate' | 'advanced'
      rehab_plan_status: 'active' | 'completed' | 'paused' | 'cancelled'
      lab_result_status: 'pending' | 'in_progress' | 'completed'
      inventory_category: 'medication' | 'consumable' | 'equipment'
      dmed_sync_status: 'pending' | 'synced' | 'failed' | 'skipped'
      record_status: 'draft' | 'completed'
      gender: 'male' | 'female'
    }
    CompositeTypes: Record<string, never>
  }
}

// ---------------------------------------------------------------------------
// Convenience row type re-exports
// ---------------------------------------------------------------------------

export type Organization = Database['public']['Tables']['organizations']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Doctor = Database['public']['Tables']['doctors']['Row']
export type Patient = Database['public']['Tables']['patients']['Row']
export type ICD10Code = Database['public']['Tables']['icd10_codes']['Row']
export type MedicalRecord = Database['public']['Tables']['medical_records']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type Exercise = Database['public']['Tables']['exercises']['Row']
export type RehabPlan = Database['public']['Tables']['rehab_plans']['Row']
export type PlanExercise = Database['public']['Tables']['plan_exercises']['Row']
export type ExerciseLog = Database['public']['Tables']['exercise_logs']['Row']
export type Vitals = Database['public']['Tables']['vitals']['Row']
export type SymptomLog = Database['public']['Tables']['symptom_logs']['Row']
export type LabResult = Database['public']['Tables']['lab_results']['Row']
export type InventoryItem = Database['public']['Tables']['inventory_items']['Row']
export type InventoryUsage = Database['public']['Tables']['inventory_usage']['Row']
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type DmedSyncLog = Database['public']['Tables']['dmed_sync_logs']['Row']

// ---------------------------------------------------------------------------
// Convenience Insert type re-exports
// ---------------------------------------------------------------------------

export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type DoctorInsert = Database['public']['Tables']['doctors']['Insert']
export type PatientInsert = Database['public']['Tables']['patients']['Insert']
export type ICD10CodeInsert = Database['public']['Tables']['icd10_codes']['Insert']
export type MedicalRecordInsert = Database['public']['Tables']['medical_records']['Insert']
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']
export type ExerciseInsert = Database['public']['Tables']['exercises']['Insert']
export type RehabPlanInsert = Database['public']['Tables']['rehab_plans']['Insert']
export type PlanExerciseInsert = Database['public']['Tables']['plan_exercises']['Insert']
export type ExerciseLogInsert = Database['public']['Tables']['exercise_logs']['Insert']
export type VitalsInsert = Database['public']['Tables']['vitals']['Insert']
export type SymptomLogInsert = Database['public']['Tables']['symptom_logs']['Insert']
export type LabResultInsert = Database['public']['Tables']['lab_results']['Insert']
export type InventoryItemInsert = Database['public']['Tables']['inventory_items']['Insert']
export type InventoryUsageInsert = Database['public']['Tables']['inventory_usage']['Insert']
export type AnalyticsEventInsert = Database['public']['Tables']['analytics_events']['Insert']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type DmedSyncLogInsert = Database['public']['Tables']['dmed_sync_logs']['Insert']

// ---------------------------------------------------------------------------
// Convenience Update type re-exports
// ---------------------------------------------------------------------------

export type OrganizationUpdate = Database['public']['Tables']['organizations']['Update']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type DoctorUpdate = Database['public']['Tables']['doctors']['Update']
export type PatientUpdate = Database['public']['Tables']['patients']['Update']
export type ICD10CodeUpdate = Database['public']['Tables']['icd10_codes']['Update']
export type MedicalRecordUpdate = Database['public']['Tables']['medical_records']['Update']
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update']
export type ExerciseUpdate = Database['public']['Tables']['exercises']['Update']
export type RehabPlanUpdate = Database['public']['Tables']['rehab_plans']['Update']
export type PlanExerciseUpdate = Database['public']['Tables']['plan_exercises']['Update']
export type ExerciseLogUpdate = Database['public']['Tables']['exercise_logs']['Update']
export type VitalsUpdate = Database['public']['Tables']['vitals']['Update']
export type SymptomLogUpdate = Database['public']['Tables']['symptom_logs']['Update']
export type LabResultUpdate = Database['public']['Tables']['lab_results']['Update']
export type InventoryItemUpdate = Database['public']['Tables']['inventory_items']['Update']
export type InventoryUsageUpdate = Database['public']['Tables']['inventory_usage']['Update']
export type AnalyticsEventUpdate = Database['public']['Tables']['analytics_events']['Update']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']
export type DmedSyncLogUpdate = Database['public']['Tables']['dmed_sync_logs']['Update']

// ---------------------------------------------------------------------------
// Enum type re-exports
// ---------------------------------------------------------------------------

export type SubscriptionTier = Database['public']['Enums']['subscription_tier']
export type SubscriptionStatus = Database['public']['Enums']['subscription_status']
export type UserRole = Database['public']['Enums']['user_role']
export type AppointmentType = Database['public']['Enums']['appointment_type']
export type AppointmentStatus = Database['public']['Enums']['appointment_status']
export type ExerciseCategory = Database['public']['Enums']['exercise_category']
export type ExerciseDifficulty = Database['public']['Enums']['exercise_difficulty']
export type RehabPlanStatus = Database['public']['Enums']['rehab_plan_status']
export type LabResultStatus = Database['public']['Enums']['lab_result_status']
export type InventoryCategory = Database['public']['Enums']['inventory_category']
export type DmedSyncStatus = Database['public']['Enums']['dmed_sync_status']
export type RecordStatus = Database['public']['Enums']['record_status']
export type Gender = Database['public']['Enums']['gender']
