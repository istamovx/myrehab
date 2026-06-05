import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string | undefined
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// When env vars are absent the app runs in demo/mock mode.
export const SUPABASE_ENABLED = Boolean(supabaseUrl && supabaseKey)

export const supabase = SUPABASE_ENABLED
  ? createClient<Database>(supabaseUrl!, supabaseKey!)
  : null
