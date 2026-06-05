import { supabase } from '@/lib/supabase'
import type { Notification, NotificationInsert } from '@/types/database.types'

export async function getUnreadNotifications(userId: string): Promise<Notification[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function markAsRead(id: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
  if (error) throw error
}

export async function markAllAsRead(userId: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
  if (error) throw error
}

export async function createNotification(data: NotificationInsert): Promise<Notification | null> {
  if (!supabase) return null
  const { data: notification, error } = await supabase
    .from('notifications')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return notification
}

export async function getNotificationCount(userId: string): Promise<number> {
  if (!supabase) return 0
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)
  if (error) throw error
  return count ?? 0
}
