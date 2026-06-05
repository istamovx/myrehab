import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, ExternalLink } from 'lucide-react'
import { KNOWLEDGE_ARTICLES, type KnowledgeArticle } from '@/data/patient-mock-data'

type KnowledgeCategory = KnowledgeArticle['category'] | 'all'

const CATEGORIES: { key: KnowledgeCategory; labelKey: string }[] = [
  { key: 'all',           labelKey: 'patient.allCategories'    },
  { key: 'condition',     labelKey: 'patient.condition'        },
  { key: 'exercises',     labelKey: 'patient.exercisesCategory'},
  { key: 'medications',   labelKey: 'patient.medications'      },
  { key: 'warning_signs', labelKey: 'patient.warning_signs'    },
  { key: 'mental_health', labelKey: 'patient.mental_health'    },
  { key: 'motivation',    labelKey: 'patient.motivation'       },
]

export function PatientKnowledgePage() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<KnowledgeCategory>('all')
  const [articles, setArticles] = useState(KNOWLEDGE_ARTICLES)
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = category === 'all' ? articles : articles.filter(a => a.category === category)

  function markRead(id: string) {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a))
  }

  const unreadCount = articles.filter(a => !a.is_read).length

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('patient.healthKnowledge')}</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
            {unreadCount} {t('patient.unread')} · {articles.length - unreadCount} {t('patient.read')}
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ key, labelKey }) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              category === key
                ? 'bg-[var(--fg-brand-primary)] text-white'
                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-secondary)] hover:border-[var(--fg-brand-primary)]',
            ].join(' ')}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {filtered.map(article => (
          <div
            key={article.id}
            className={[
              'bg-[var(--bg-primary)] rounded-xl border transition-colors',
              !article.is_read ? 'border-[var(--fg-brand-primary)]' : 'border-[var(--border-secondary)]',
            ].join(' ')}
          >
            <button
              className="w-full text-left p-4"
              onClick={() => setExpanded(prev => prev === article.id ? null : article.id)}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{article.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{article.title}</h3>
                    {article.is_read && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{article.source}</p>
                </div>
                {!article.is_read && (
                  <span className="shrink-0 text-xs font-semibold text-[var(--fg-brand-primary)] bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded-full">
                    {t('patient.unread')}
                  </span>
                )}
              </div>
            </button>

            {expanded === article.id && (
              <div className="px-4 pb-4">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{article.body}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                    <ExternalLink size={12} />
                    {article.source}
                  </span>
                  {!article.is_read && (
                    <button
                      onClick={() => markRead(article.id)}
                      className="text-xs font-semibold text-[var(--fg-brand-primary)] hover:underline"
                    >
                      {t('patient.markRead')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[var(--text-tertiary)] py-12">Maqolalar topilmadi</p>
      )}
    </div>
  )
}
