import { supabase } from '@/lib/supabase'
import type {
  InventoryItem,
  InventoryItemInsert,
  InventoryItemUpdate,
  InventoryUsage,
  InventoryUsageInsert,
} from '@/types/database.types'

export async function getInventory(organizationId: string): Promise<InventoryItem[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('organization_id', organizationId)
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getLowStockItems(organizationId: string): Promise<InventoryItem[]> {
  if (!supabase) return []
  const all = await getInventory(organizationId)
  return all.filter(item => item.quantity <= item.min_quantity)
}

export async function createItem(data: InventoryItemInsert): Promise<InventoryItem | null> {
  if (!supabase) return null
  const { data: item, error } = await supabase
    .from('inventory_items')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return item
}

export async function updateItem(
  id: string,
  data: InventoryItemUpdate,
): Promise<InventoryItem | null> {
  if (!supabase) return null
  const { data: item, error } = await supabase
    .from('inventory_items')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return item
}

export async function deleteItem(id: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('inventory_items').delete().eq('id', id)
  if (error) throw error
}

export async function logUsage(
  data: Omit<InventoryUsageInsert, 'used_at'>,
): Promise<InventoryUsage | null> {
  if (!supabase) return null
  const { data: usage, error } = await supabase
    .from('inventory_usage')
    .insert({ ...data, used_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return usage
}

export async function getUsageHistory(
  organizationId: string,
  limit = 100,
): Promise<InventoryUsage[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('inventory_usage')
    .select('*')
    .eq('organization_id', organizationId)
    .order('used_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function adjustStock(id: string, newQuantity: number): Promise<InventoryItem | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('inventory_items')
    .update({ quantity: newQuantity })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
