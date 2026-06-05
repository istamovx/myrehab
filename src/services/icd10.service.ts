import { supabase } from '@/lib/supabase'
import type { ICD10Code } from '@/types/database.types'

export const COMMON_REHAB_CODES: ICD10Code[] = [
  { code: 'M54.5', description_uz: 'Umumiy bel og\'rig\'i', description_ru: 'Боль в нижней части спины', description_en: 'Low back pain', category: 'Muskuloskelet', chapter: 'M' },
  { code: 'M17.0', description_uz: 'Tizza bo\'g\'imining ikki tomonlama osteoartriti', description_ru: 'Двусторонний гонартроз', description_en: 'Bilateral primary osteoarthrosis of knee', category: 'Muskuloskelet', chapter: 'M' },
  { code: 'M16.0', description_uz: 'Kalça bo\'g\'imining ikki tomonlama osteoartriti', description_ru: 'Двусторонний коксартроз', description_en: 'Bilateral primary coxarthrosis', category: 'Muskuloskelet', chapter: 'M' },
  { code: 'S72.0', description_uz: 'Bo\'yin bo\'g\'imi sinishi', description_ru: 'Перелом шейки бедра', description_en: 'Fracture of neck of femur', category: 'Shikastlanish', chapter: 'S' },
  { code: 'S82.0', description_uz: 'Tizza qopqoqi sinishi', description_ru: 'Перелом надколенника', description_en: 'Fracture of patella', category: 'Shikastlanish', chapter: 'S' },
  { code: 'M47.8', description_uz: 'Boshqa spondyloz', description_ru: 'Другой спондилёз', description_en: 'Other spondylosis', category: 'Muskuloskelet', chapter: 'M' },
  { code: 'G35',   description_uz: 'Ko\'p skleroz', description_ru: 'Рассеянный склероз', description_en: 'Multiple sclerosis', category: 'Nevrologik', chapter: 'G' },
  { code: 'G81.0', description_uz: 'Gemiplegiya', description_ru: 'Гемиплегия', description_en: 'Hemiplegia', category: 'Nevrologik', chapter: 'G' },
  { code: 'I69.3', description_uz: 'Insultdan keyingi oqibatlar', description_ru: 'Последствия инфаркта мозга', description_en: 'Sequelae of cerebral infarction', category: 'Yurak-qon tomir', chapter: 'I' },
  { code: 'M75.1', description_uz: 'Yelka manjetining zararlanishi', description_ru: 'Повреждение ротаторной манжеты', description_en: 'Rotator cuff syndrome', category: 'Muskuloskelet', chapter: 'M' },
  { code: 'S43.4', description_uz: 'Yelka bo\'g\'imining cho\'zilishi', description_ru: 'Растяжение плечевого сустава', description_en: 'Sprain of shoulder joint', category: 'Shikastlanish', chapter: 'S' },
  { code: 'M23.2', description_uz: 'Tizza meniskining zararlanishi', description_ru: 'Повреждение мениска колена', description_en: 'Derangement of meniscus', category: 'Muskuloskelet', chapter: 'M' },
  { code: 'S93.4', description_uz: 'Oyoq bilagi bo\'g\'imining cho\'zilishi', description_ru: 'Растяжение голеностопного сустава', description_en: 'Sprain of ankle', category: 'Shikastlanish', chapter: 'S' },
  { code: 'M54.2', description_uz: 'Servikobraxial sindrom', description_ru: 'Цервикобрахиальный синдром', description_en: 'Cervicobrachial syndrome', category: 'Muskuloskelet', chapter: 'M' },
  { code: 'G60.0', description_uz: 'Hereditar motor va sezuvchan neyropatiya', description_ru: 'Наследственная моторно-сенсорная нейропатия', description_en: 'HMSN', category: 'Nevrologik', chapter: 'G' },
  { code: 'Z47.1', description_uz: 'Protezni olib tashlash keyin reabilitatsiya', description_ru: 'Реабилитация после удаления протеза', description_en: 'Follow-up care involving removal of joint prosthesis', category: 'Z-kodlar', chapter: 'Z' },
  { code: 'Z96.6', description_uz: 'Ortopedik bo\'g\'im protezi mavjudligi', description_ru: 'Наличие ортопедического сустава', description_en: 'Presence of orthopedic joint implant', category: 'Z-kodlar', chapter: 'Z' },
  { code: 'M54.4', description_uz: 'Lumbago sciatica bilan', description_ru: 'Люмбаго с ишиасом', description_en: 'Lumbago with sciatica', category: 'Muskuloskelet', chapter: 'M' },
  { code: 'G43.9', description_uz: 'Migran', description_ru: 'Мигрень', description_en: 'Migraine', category: 'Nevrologik', chapter: 'G' },
  { code: 'R52',   description_uz: 'Og\'riq', description_ru: 'Боль', description_en: 'Pain', category: 'Alomatlar', chapter: 'R' },
]

export async function searchICD10(query: string, limit = 20): Promise<ICD10Code[]> {
  if (!supabase) {
    const q = query.toLowerCase()
    return COMMON_REHAB_CODES.filter(
      c =>
        c.code.toLowerCase().includes(q) ||
        c.description_en?.toLowerCase().includes(q) ||
        c.description_ru?.toLowerCase().includes(q) ||
        c.description_uz?.toLowerCase().includes(q),
    ).slice(0, limit)
  }
  const { data, error } = await supabase
    .from('icd10_codes')
    .select('*')
    .or(
      `code.ilike.%${query}%,description_en.ilike.%${query}%,description_ru.ilike.%${query}%,description_uz.ilike.%${query}%`,
    )
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getICD10Code(code: string): Promise<ICD10Code | null> {
  if (!supabase) {
    return COMMON_REHAB_CODES.find(c => c.code === code) ?? null
  }
  const { data, error } = await supabase
    .from('icd10_codes')
    .select('*')
    .eq('code', code)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

export async function getICD10ByCategory(category: string): Promise<ICD10Code[]> {
  if (!supabase) {
    return COMMON_REHAB_CODES.filter(c => c.category === category)
  }
  const { data, error } = await supabase
    .from('icd10_codes')
    .select('*')
    .eq('category', category)
    .order('code')
  if (error) throw error
  return data ?? []
}
