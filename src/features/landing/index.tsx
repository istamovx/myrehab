import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Activity, ArrowRight, BarChart3, Brain, Building2,
  Calendar, Check, ChevronRight, Heart, Lock, Menu,
  Shield, Sparkles, Star, TrendingUp, Users, X, Zap,
} from 'lucide-react'

/* ─── Scroll-reveal ──────────────────────────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ─── Animated counter ──────────────────────────────────────────────────────── */
function Counter({ to, suffix = '', started }: { to: number; suffix?: string; started: boolean }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!started) return
    let t0: number | null = null
    const D = 1600
    const tick = (ts: number) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / D, 1)
      const eased = 1 - (1 - p) ** 3
      setV(Math.floor(eased * to))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [to, started])
  return <>{v}{suffix}</>
}

/* ─── Data ───────────────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: BarChart3, color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  title: 'Real vaqtda tahlil',   desc: "Bemorlarning ko'rsatkichlari va davolash natijalarini real vaqtda kuzating." },
  { icon: Brain,     color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', title: 'AI Diagnostika',        desc: "Sun'iy intellekt yordamida aniq diagnostika va individual davolash rejalari." },
  { icon: Calendar,  color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  title: 'Aqlli Jadval',          desc: 'Bemorlar va shifokorlar uchun uchrashuvlarni avtomatik tuzib bering.' },
  { icon: Users,     color: '#10b981', bg: 'rgba(16,185,129,0.12)', title: 'Jamoa Boshqaruvi',      desc: "Ko'p shifokorli klinikalar uchun hamkorlik va vazifalar boshqaruvi." },
  { icon: Shield,    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', title: 'Xavfsizlik',            desc: "ISO 27001 asosida tibbiy ma'lumotlarni to'liq himoya qilish." },
  { icon: Activity,  color: '#ec4899', bg: 'rgba(236,72,153,0.12)', title: 'Kuzatuv Tizimi',        desc: 'Davolash jarayonidagi har qadam va bemor holati kuzatiladi.' },
]

const STEPS = [
  { n: '01', icon: Building2, title: "Ro'yxatdan o'ting",      desc: "Klinikangizni platformaga qo'shing. Tashkilot va shifokorlar ma'lumotlarini kiriting." },
  { n: '02', icon: Users,     title: "Ma'lumotlarni kiriting", desc: "Mavjud bemorlar ro'yxati va davolash protokollarini tizimga yuklang." },
  { n: '03', icon: BarChart3, title: 'Natijalarni kuzating',   desc: "Real vaqtda tahlillar va hisobotlar orqali klinikangizni samarali boshqaring." },
]

const STATS = [
  { to: 24,   suffix: '+',  label: 'Faol tashkilot',         icon: Building2  },
  { to: 1200, suffix: '+',  label: 'Bemor',                  icon: Heart      },
  { to: 98,   suffix: '%',  label: 'Muvaffaqiyat darajasi',  icon: TrendingUp },
  { to: 49,   suffix: '/5', label: 'Foydalanuvchi reytingi', icon: Star       },
]

const TESTIMONIALS = [
  { name: 'Dr. Kamol Rashidov', role: 'Bosh vrach, Shifobaxsh Klinika',  initials: 'KR', grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'rgba(99,102,241,0.3)',  text: "MyRehab klinikamizni tubdan o'zgartirdi. Bemorlar bilan ishlash 3 barobar samaraliroq bo'ldi va natijalar ancha yaxshilandi." },
  { name: 'Nilufar Azimova',    role: 'Mudir, Hayot Tib Markazi',         initials: 'NA', grad: 'linear-gradient(135deg,#8b5cf6,#ec4899)', border: 'rgba(139,92,246,0.3)', text: "AI diagnostika funksiyasi bizga noyob imkoniyat yaratdi. Hozir har bir bemor individual davolash rejasiga ega." },
  { name: 'Bobur Qodirov',      role: 'Reabilitolog, RehaPlus',            initials: 'BQ', grad: 'linear-gradient(135deg,#10b981,#06b6d4)', border: 'rgba(16,185,129,0.3)',  text: "Platforma juda intuitiv va texnik yordam ajoyib. Jamoamiz bir kunda o'zlashtirib oldi. Qat'iy tavsiya qilaman!" },
]

const PRICING = [
  {
    name: 'Starter',    price: '199 000', desc: 'Kichik klinikalar uchun',     highlight: false, badge: null,
    features: ['20 ta bemor/oy', '3 ta shifokor', 'Asosiy hisobotlar', 'Email yordam', '5 GB saqlash'],
    cta: 'Boshlash',
  },
  {
    name: 'Business',   price: '499 000', desc: "O'rta klinikalar uchun",       highlight: true,  badge: 'Eng mashhur',
    features: ['Cheksiz bemorlar', '15 ta shifokor', 'AI diagnostika', '24/7 yordam', '50 GB saqlash', 'API integratsiya'],
    cta: "Sinab ko'rish",
  },
  {
    name: 'Enterprise', price: null,      desc: 'Katta tibbiy markazlar uchun', highlight: false, badge: null,
    features: ['Cheksiz hamma narsa', 'Maxsus sozlamalar', 'Dedicated server', 'SLA kafolati', 'Maxsus API', 'Shaxsiy menejer'],
    cta: "Bog'lanish",
  },
]

const TRUST_NAMES = ['Shifobaxsh Klinika','Hayot Tib Markazi','RehaPlus','MedCore','NovaMed','HealthFirst','VitaRehab','ProMedic','CareZone','TibMehr']

/* ─── Navbar ─────────────────────────────────────────────────────────────────── */
function Navbar({ scrolled, open, setOpen }: { scrolled: boolean; open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(2,8,23,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="" className="w-8 h-8 shrink-0" />
          <span className="font-bold text-[17px] text-white tracking-tight">My<span style={{ color: '#818cf8' }}>Rehab</span></span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {[['Xususiyatlar','#features'],['Qanday ishlaydi','#how-it-works'],['Narxlar','#pricing']].map(([l,h]) => (
            <a key={h} href={h} className="text-sm transition-colors" style={{ color: 'rgba(248,250,252,0.6)' }}
               onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
               onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.6)')}>
              {l}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm px-4 py-2 transition-colors" style={{ color: 'rgba(248,250,252,0.7)' }}>
            Kirish
          </Link>
          <Link
            to="/login"
            className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 24px rgba(99,102,241,0.4)', transition: 'all 0.2s ease' }}
          >
            Bepul boshlash
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 transition-colors" style={{ color: 'rgba(248,250,252,0.7)' }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-5" style={{ background: 'rgba(2,8,23,0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {[['Xususiyatlar','#features'],['Qanday ishlaydi','#how-it-works'],['Narxlar','#pricing']].map(([l,h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="block py-3 text-sm border-b transition-colors"
               style={{ color: 'rgba(248,250,252,0.65)', borderColor: 'rgba(255,255,255,0.06)' }}>
              {l}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-2">
            <Link to="/login" className="text-center py-2.5 text-sm" style={{ color: 'rgba(248,250,252,0.7)' }}>Kirish</Link>
            <Link to="/login" className="text-center py-3 rounded-xl font-semibold text-sm text-white"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              Bepul boshlash
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 700, height: 700, top: -200, left: -200, background: 'radial-gradient(circle,rgba(99,102,241,0.22) 0%,transparent 65%)', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite' }} />
        <div className="absolute rounded-full" style={{ width: 600, height: 600, bottom: -100, right: -100, background: 'radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 65%)', filter: 'blur(60px)', animation: 'float 13s ease-in-out infinite reverse' }} />
        <div className="absolute rounded-full" style={{ width: 350, height: 350, top: '40%', left: '52%', background: 'radial-gradient(circle,rgba(6,182,212,0.13) 0%,transparent 65%)', filter: 'blur(50px)', animation: 'float 11s ease-in-out infinite 3s' }} />
      </div>
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left: text */}
        <div style={{ animation: 'heroFadeUp 0.7s ease-out both' }}>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7 text-sm font-semibold"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}
          >
            <Sparkles size={14} />
            Sog'liqni saqlashning aqlli platformasi
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-extrabold leading-[1.06] tracking-tight mb-6">
            <span className="text-white">Reabilitatsiyani</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg,#a5b4fc 0%,#8b5cf6 50%,#06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block' }}>
              yangi bosqichga
            </span>
            <br />
            <span className="text-white">olib chiqing</span>
          </h1>

          <p className="text-lg leading-relaxed mb-9 max-w-xl" style={{ color: 'rgba(248,250,252,0.58)' }}>
            Klinikangizni raqamli transformatsiyaga olib chiqing. AI tahlil, real vaqtda monitoring va aqlli jadval bilan bemorlaringizga eng yaxshi natija bering.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white text-[15px]"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 32px rgba(99,102,241,0.45)', transition: 'all 0.2s ease', animation: 'pulseGlow 3s ease-in-out infinite' }}
            >
              Bepul boshlash <ArrowRight size={17} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(248,250,252,0.8)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)' }}
            >
              Ko'proq bilish <ChevronRight size={16} />
            </a>
          </div>

          <div className="flex items-center gap-8 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {[['24+', 'Tashkilot'], ['1200+', 'Bemor'], ['98%', 'Muvaffaqiyat']].map(([v, l]) => (
              <div key={l}>
                <div className="text-xl font-bold" style={{ color: '#818cf8' }}>{v}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(248,250,252,0.4)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: dashboard mockup */}
        <div className="relative hidden lg:block" style={{ animation: 'heroFadeUp 0.7s ease-out 0.18s both' }}>
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 40px 120px rgba(0,0,0,0.65), 0 0 80px rgba(99,102,241,0.12)', animation: 'float 8s ease-in-out infinite' }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex gap-1.5">
                {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.75 }} />)}
              </div>
              <div className="flex-1 mx-4 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>myrehab.uz/dashboard</span>
              </div>
            </div>
            {/* Content */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white">Bosh sahifa</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>● Jonli</span>
              </div>
              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {[['Bemorlar','234','+12%','#6366f1'],['Shifokorlar','18','+2','#8b5cf6'],['Uchrashuvlar','47','+8','#06b6d4']].map(([l,v,c,col]) => (
                  <div key={l} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.38)' }}>{l}</div>
                    <div className="text-[17px] font-bold" style={{ color: col }}>{v}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#34d399' }}>{c}</div>
                  </div>
                ))}
              </div>
              {/* Chart */}
              <div className="rounded-xl p-3.5 mb-3.5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>Oylik ko'rsatkich</div>
                <div className="flex items-end gap-1.5 h-16">
                  {[38,62,48,75,52,90,66,82].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 5 || i === 7 ? 'linear-gradient(180deg,#6366f1,#8b5cf6)' : 'rgba(99,102,241,0.22)', transition: 'height 1s ease' }} />
                  ))}
                </div>
              </div>
              {/* Activity */}
              <div className="space-y-1.5">
                <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.38)' }}>Oxirgi faoliyat</div>
                {[['Ali Valiyev',"Mashg'ulot",'#6366f1'],['Diyor Ahmedov','Nazorat','#10b981'],['Sarvar Mirzayev','Baholash','#f59e0b']].map(([n,a,c]) => (
                  <div key={n} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{n}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${c}22`, color: c }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -right-10 top-16 flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
               style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.28)', backdropFilter: 'blur(12px)', animation: 'float 5s ease-in-out infinite 1s', boxShadow: '0 8px 32px rgba(16,185,129,0.18)' }}>
            <TrendingUp size={14} style={{ color: '#34d399' }} />
            <div><div className="text-xs font-bold text-white">+24%</div><div className="text-xs" style={{ color: '#34d399' }}>o'sish</div></div>
          </div>
          <div className="absolute -left-12 bottom-20 flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
               style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.28)', backdropFilter: 'blur(12px)', animation: 'float 6s ease-in-out infinite 2.2s', boxShadow: '0 8px 32px rgba(99,102,241,0.18)' }}>
            <Users size={14} style={{ color: '#818cf8' }} />
            <div><div className="text-xs font-bold text-white">12 yangi</div><div className="text-xs" style={{ color: '#818cf8' }}>bemor</div></div>
          </div>
          <div className="absolute -left-8 top-10 flex items-center gap-2 px-3 py-2 rounded-xl"
               style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.28)', backdropFilter: 'blur(12px)', animation: 'float 7s ease-in-out infinite 0.5s' }}>
            <Sparkles size={12} style={{ color: '#c4b5fd' }} />
            <span className="text-xs font-semibold" style={{ color: '#c4b5fd' }}>AI faol</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Trust strip ────────────────────────────────────────────────────────────── */
function TrustSection() {
  return (
    <section className="py-12 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-center text-sm font-semibold mb-8 tracking-widest uppercase" style={{ color: 'rgba(248,250,252,0.3)' }}>
        Bizga ishongan klinikalar
      </p>
      <div className="relative">
        <div style={{ display: 'flex', animation: 'marquee 30s linear infinite', width: 'max-content' }}>
          {[...TRUST_NAMES, ...TRUST_NAMES].map((name, i) => (
            <div key={i} className="flex items-center gap-2 mx-8 whitespace-nowrap">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.2)' }}>
                <Activity size={12} style={{ color: '#818cf8' }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: 'rgba(248,250,252,0.45)' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Features ───────────────────────────────────────────────────────────────── */
function FeaturesSection() {
  const { ref, visible } = useInView()
  return (
    <section id="features" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
               style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
            <Zap size={13} /> Imkoniyatlar
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Nima uchun <span style={{ background: 'linear-gradient(135deg,#818cf8,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>MyRehab?</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(248,250,252,0.5)' }}>
            Zamonaviy klinikalar uchun to'liq raqamli echim — boshqaruvdan tortib AI diagnostikagacha.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <FeatureCard key={f.title} f={f} icon={<Icon size={22} style={{ color: f.color }} />} delay={i * 80} />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ f, icon, delay }: { f: typeof FEATURES[0]; icon: React.ReactNode; delay: number }) {
  const { ref, visible } = useInView(0.12)
  return (
    <div
      ref={ref}
      className="p-6 rounded-2xl group cursor-default transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.3s, background 0.3s`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.background = 'rgba(99,102,241,0.06)'
        el.style.borderColor = 'rgba(99,102,241,0.35)'
        el.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.background = 'rgba(255,255,255,0.03)'
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.transform = 'none'
      }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: f.bg }}>
        {icon}
      </div>
      <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(248,250,252,0.5)' }}>{f.desc}</p>
    </div>
  )
}

/* ─── How it works ───────────────────────────────────────────────────────────── */
function HowItWorksSection() {
  const { ref, visible } = useInView()
  return (
    <section id="how-it-works" className="py-28 relative" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div ref={ref} className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
               style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', color: '#22d3ee' }}>
            <Activity size={13} /> Jarayon
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Qanday <span style={{ background: 'linear-gradient(135deg,#22d3ee,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ishlaydi?</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(248,250,252,0.5)' }}>
            3 oddiy qadam bilan klinikangizni raqamlashtirishni boshlang.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <StepCard key={s.n} s={s} icon={<Icon size={20} />} delay={i * 120} />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StepCard({ s, icon, delay }: { s: typeof STEPS[0]; icon: React.ReactNode; delay: number }) {
  const { ref, visible } = useInView(0.12)
  return (
    <div
      ref={ref}
      className="relative p-7 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="absolute -top-4 -left-1 text-5xl font-black select-none" style={{ color: 'rgba(99,102,241,0.15)', letterSpacing: '-2px' }}>{s.n}</div>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 mt-2" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(248,250,252,0.5)' }}>{s.desc}</p>
    </div>
  )
}

/* ─── Stats ──────────────────────────────────────────────────────────────────── */
function StatsSection() {
  const { ref, visible } = useInView(0.2)
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="rounded-3xl p-8 sm:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8"
          style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.1) 0%,rgba(139,92,246,0.08) 50%,rgba(6,182,212,0.08) 100%)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          {STATS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="text-center" style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'scale(0.9)', transition: `all 0.6s ease ${i * 120}ms` }}>
                <div className="inline-flex w-12 h-12 rounded-2xl items-center justify-center mb-4" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                  <Icon size={20} />
                </div>
                <div className="text-4xl sm:text-5xl font-black mb-1" style={{ background: 'linear-gradient(135deg,#fff,#a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  <Counter to={s.to} suffix={s.suffix} started={visible} />
                </div>
                <p className="text-sm font-medium" style={{ color: 'rgba(248,250,252,0.5)' }}>{s.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ───────────────────────────────────────────────────────────── */
function TestimonialsSection() {
  const { ref, visible } = useInView()
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
               style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}>
            <Star size={13} /> Fikrlar
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Mijozlarimiz nima <span style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>deydi?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => {
            const { ref: tRef, visible: tv } = useInView(0.12)
            return (
              <div
                key={t.name}
                ref={tRef}
                className="p-6 rounded-2xl flex flex-col gap-4"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${t.border}`,
                  opacity: tv ? 1 : 0,
                  transform: tv ? 'none' : 'translateY(24px)',
                  transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`,
                }}
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, si) => <Star key={si} size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />)}
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(248,250,252,0.7)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: t.grad }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs" style={{ color: 'rgba(248,250,252,0.45)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Pricing ────────────────────────────────────────────────────────────────── */
function PricingSection() {
  const { ref, visible } = useInView()
  return (
    <section id="pricing" className="py-28 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div ref={ref} className="text-center mb-16" style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
               style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#c4b5fd' }}>
            <Lock size={13} /> Narxlar
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Sizga mos <span style={{ background: 'linear-gradient(135deg,#c4b5fd,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>tarif rejasini</span> tanlang
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(248,250,252,0.5)' }}>14 kun bepul sinab ko'ring. Kredit karta shart emas.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {PRICING.map((p, i) => {
            const { ref: pRef, visible: pv } = useInView(0.1)
            return (
              <div
                key={p.name}
                ref={pRef}
                className="relative p-7 rounded-2xl flex flex-col gap-5"
                style={{
                  background: p.highlight ? 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.1))' : 'rgba(255,255,255,0.025)',
                  border: p.highlight ? '1px solid rgba(99,102,241,0.45)' : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: p.highlight ? '0 0 40px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08)' : 'none',
                  transform: p.highlight ? 'scale(1.03)' : 'scale(1)',
                  opacity: pv ? 1 : 0,
                  transition: `opacity 0.6s ease ${i * 100}ms, transform 0.3s ease`,
                }}
              >
                {p.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white"
                       style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
                    {p.badge}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color: p.highlight ? '#a5b4fc' : 'rgba(248,250,252,0.5)' }}>{p.name}</div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    {p.price
                      ? <><span className="text-3xl font-black text-white">{p.price}</span><span className="text-sm" style={{ color: 'rgba(248,250,252,0.45)' }}>so'm/oy</span></>
                      : <span className="text-2xl font-black text-white">Muloqot</span>
                    }
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(248,250,252,0.45)' }}>{p.desc}</p>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: p.highlight ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.08)' }}>
                        <Check size={10} style={{ color: p.highlight ? '#818cf8' : 'rgba(255,255,255,0.5)' }} />
                      </div>
                      <span style={{ color: 'rgba(248,250,252,0.7)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className="block text-center py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={p.highlight
                    ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 0 24px rgba(99,102,241,0.4)' }
                    : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(248,250,252,0.8)' }
                  }
                >
                  {p.cta}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ────────────────────────────────────────────────────────────────────── */
function CtaSection() {
  const { ref, visible } = useInView(0.2)
  return (
    <section className="py-28 px-4">
      <div
        ref={ref}
        className="max-w-5xl mx-auto rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%)',
          border: '1px solid rgba(99,102,241,0.35)',
          boxShadow: '0 0 80px rgba(99,102,241,0.2)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(24px)',
          transition: 'all 0.8s ease',
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full" style={{ background: 'rgba(99,102,241,0.3)', filter: 'blur(50px)' }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-semibold"
               style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(248,250,252,0.85)' }}>
            <Sparkles size={14} /> 14 kun bepul sinab ko'ring
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Klinikangizni bugun<br />
            <span style={{ background: 'linear-gradient(135deg,#a5b4fc,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              yangilashni boshlang
            </span>
          </h2>
          <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: 'rgba(248,250,252,0.6)' }}>
            Kredit karta shart emas. O'rnatish zarur emas. Hoziroq boshlang.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white text-[15px] transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)' }}
            >
              Bepul ro'yxatdan o'tish <ArrowRight size={17} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-[15px] transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 32px rgba(99,102,241,0.5)' }}
            >
              Demo ko'rish
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────────────────────── */
function FooterSection() {
  return (
    <footer className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo.svg" alt="" className="w-8 h-8 shrink-0" />
              <span className="font-bold text-lg text-white">My<span style={{ color: '#818cf8' }}>Rehab</span></span>
            </a>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(248,250,252,0.4)' }}>
              Sog'liqni saqlashning aqlli raqamli platformasi.
            </p>
          </div>
          {[
            { title: 'Platforma', links: ['Xususiyatlar', 'Narxlar', 'Integratsiyalar', 'Yangiliklar'] },
            { title: 'Kompaniya',  links: ["Biz haqimizda", 'Blog', "Hamkorlar", 'Ish o\'rinlari'] },
            { title: 'Yordam',    links: ["Qo'llanma", 'API', 'Muammo bildirish', 'Aloqa'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm transition-colors" style={{ color: 'rgba(248,250,252,0.4)' }}
                       onMouseEnter={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.8)')}
                       onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.4)')}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm" style={{ color: 'rgba(248,250,252,0.3)' }}>© 2025 MyRehab. Barcha huquqlar himoyalangan.</p>
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: '#818cf8' }}>
            Tizimga kirish <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </footer>
  )
}

/* ─── Main export ────────────────────────────────────────────────────────────── */
export function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <div
      className="text-white overflow-x-hidden"
      style={{ background: '#020817', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", minHeight: '100vh' }}
    >
      <Navbar scrolled={scrolled} open={mobileOpen} setOpen={setMobileOpen} />
      <HeroSection />
      <TrustSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <FooterSection />
    </div>
  )
}
