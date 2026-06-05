import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

async function sendMessage(chatId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

async function getLinkedPatient(chatId: string) {
  const { data } = await supabase
    .from('telegram_subscriptions')
    .select('patient_id, profiles(name)')
    .eq('telegram_chat_id', chatId)
    .single()
  return data
}

async function handleStart(chatId: string) {
  const text =
    `🏥 <b>MyRehab botiga xush kelibsiz!</b>\n\n` +
    `Bu bot sizning reabilitatsiya jarayoningizni kuzatib borish uchun mo'ljallangan.\n\n` +
    `<b>Botni ulash uchun:</b>\n` +
    `1. MyRehab veb ilovasiga kiring\n` +
    `2. <b>Sozlamalar → Telegram</b> bo'limiga o'ting\n` +
    `3. Ushbu chat ID'ni kiriting: <code>${chatId}</code>\n\n` +
    `Hisob ulangandan so'ng quyidagi buyruqlardan foydalanishingiz mumkin:\n` +
    `/today — bugungi mashqlar\n` +
    `/appointment — keyingi qabulingiz\n` +
    `/vitals — ko'rsatkichlarni kiritish\n` +
    `/help — yordam`
  await sendMessage(chatId, text)
}

async function handleToday(chatId: string) {
  const linked = await getLinkedPatient(chatId)
  if (!linked) {
    await sendMessage(chatId, '❌ Hisobingiz hali ulanmagan.\n\n/start buyrug\'ini yuboring va ko\'rsatmalarni bajaring.')
    return
  }

  const today = new Date().toISOString().slice(0, 10)

  const { data: logs } = await supabase
    .from('exercise_logs')
    .select('plan_exercise_id, sets_completed, reps_completed, date')
    .eq('patient_id', linked.patient_id)
    .eq('date', today)

  const { data: plans } = await supabase
    .from('rehab_plans')
    .select('id, name, plan_exercises(id, sets, reps, exercises(name))')
    .eq('patient_id', linked.patient_id)
    .eq('status', 'active')

  if (!plans || plans.length === 0) {
    await sendMessage(chatId, `📋 Bugun uchun faol reabilitatsiya rejasi topilmadi.\n\nShifokoringizga murojaat qiling.`)
    return
  }

  const completedIds = new Set((logs ?? []).map(l => l.plan_exercise_id))
  let lines = `🏋️ <b>Bugungi mashqlar</b> (${today})\n\n`

  for (const plan of plans) {
    lines += `📌 <b>${plan.name}</b>\n`
    const exercises = (plan as any).plan_exercises ?? []
    if (exercises.length === 0) {
      lines += `  Mashqlar yo'q\n`
    }
    for (const pe of exercises) {
      const done = completedIds.has(pe.id)
      const exName = (pe as any).exercises?.name ?? 'Noma\'lum mashq'
      const setsReps = [pe.sets && `${pe.sets} set`, pe.reps && `${pe.reps} marta`].filter(Boolean).join(' × ')
      lines += `  ${done ? '✅' : '⬜'} ${exName}${setsReps ? ` — ${setsReps}` : ''}\n`
    }
    lines += '\n'
  }

  const total = plans.flatMap((p: any) => p.plan_exercises ?? []).length
  const done = completedIds.size
  lines += `<b>Natija:</b> ${done}/${total} bajarildi`

  await sendMessage(chatId, lines)
}

async function handleAppointment(chatId: string) {
  const linked = await getLinkedPatient(chatId)
  if (!linked) {
    await sendMessage(chatId, '❌ Hisobingiz ulanmagan. /start yuboring.')
    return
  }

  const { data: appointment } = await supabase
    .from('appointments')
    .select('scheduled_at, duration_minutes, type, reason, status')
    .eq('patient_id', linked.patient_id)
    .in('status', ['scheduled', 'confirmed'])
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(1)
    .single()

  if (!appointment) {
    await sendMessage(chatId, `📅 Yaqin qabullar topilmadi.\n\nYangi qabul olish uchun MyRehab ilovasiga kiring.`)
    return
  }

  const dt = new Date(appointment.scheduled_at)
  const dateStr = dt.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' })
  const timeStr = dt.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
  const typeLabel = appointment.type === 'video' ? '📹 Online (video)' : '🏥 Klinikada'

  const text =
    `📅 <b>Keyingi qabulingiz</b>\n\n` +
    `📆 Sana: <b>${dateStr}</b>\n` +
    `🕐 Vaqt: <b>${timeStr}</b>\n` +
    `⏱ Davomiyligi: ${appointment.duration_minutes} daqiqa\n` +
    `${typeLabel}\n` +
    (appointment.reason ? `📝 Sabab: ${appointment.reason}\n` : '') +
    `\nQabuldan oldin masofaviy aloqa uchun MyRehab ilovasini tekshiring.`

  await sendMessage(chatId, text)
}

async function handleVitals(chatId: string) {
  const linked = await getLinkedPatient(chatId)
  if (!linked) {
    await sendMessage(chatId, '❌ Hisobingiz ulanmagan. /start yuboring.')
    return
  }

  const text =
    `💊 <b>Ko'rsatkichlarni kiritish</b>\n\n` +
    `Vitallarga oid ma'lumotlarni kiritish uchun MyRehab ilovasiga o'ting:\n\n` +
    `1. <b>Bemor profili</b> → <b>Vitals</b>\n` +
    `2. Yangi o'lchov qo'shing\n\n` +
    `Kuzatiladigan ko'rsatkichlar:\n` +
    `• Arterial qon bosimi\n` +
    `• Yurak urishi (puls)\n` +
    `• Tana harorati\n` +
    `• Kislorod to'yinganligi (SpO₂)\n` +
    `• Og'irlik\n` +
    `• Og'riq darajasi (0–10)\n\n` +
    `📱 <a href="https://myrehab.app">myrehab.app</a> orqali kiriting`
  await sendMessage(chatId, text)
}

async function handleHelp(chatId: string) {
  const text =
    `ℹ️ <b>MyRehab Bot — mavjud buyruqlar</b>\n\n` +
    `/start — botni ulash va hisob ro'yxatga olish\n` +
    `/today — bugungi mashqlar ro'yxati\n` +
    `/appointment — keyingi qabul ma'lumotlari\n` +
    `/vitals — ko'rsatkichlarni kiritish yo'riqnomasi\n` +
    `/help — ushbu yordam xabari\n\n` +
    `❓ Muammo yuzaga kelsa, MyRehab ilovasining qo'llab-quvvatlash bo'limiga murojaat qiling.`
  await sendMessage(chatId, text)
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('ok')
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return new Response('ok')
  }

  const message = body?.message
  if (!message) {
    return new Response('ok')
  }

  const chatId = String(message.chat?.id ?? '')
  const text: string = message.text ?? ''

  if (!chatId) {
    return new Response('ok')
  }

  const command = text.split(' ')[0].toLowerCase()

  switch (command) {
    case '/start':
      await handleStart(chatId)
      break
    case '/today':
      await handleToday(chatId)
      break
    case '/appointment':
      await handleAppointment(chatId)
      break
    case '/vitals':
      await handleVitals(chatId)
      break
    case '/help':
      await handleHelp(chatId)
      break
    default:
      await sendMessage(chatId, "Buyruq topilmadi. /help buyrug'ini yuboring.")
  }

  return new Response('ok')
})
