import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Plus, FileText, Download, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { cn } from '@/lib/utils'

const DOCS = [
  { id: 1, categoryKey: 'protocols', name: 'Hip Replacement Protocol v3.2.pdf',  size: '2.4 MB', updated: 'Apr 12, 2025', type: 'pdf' },
  { id: 2, categoryKey: 'protocols', name: 'Knee Rehabilitation Guidelines.pdf', size: '1.8 MB', updated: 'Apr 08, 2025', type: 'pdf' },
  { id: 3, categoryKey: 'forms',     name: 'Patient Intake Form.docx',           size: '156 KB', updated: 'Apr 01, 2025', type: 'docx' },
  { id: 4, categoryKey: 'forms',     name: 'Consent Form Template.pdf',          size: '320 KB', updated: 'Mar 25, 2025', type: 'pdf' },
  { id: 5, categoryKey: 'research',  name: 'Q1 2025 Outcomes Report.pdf',        size: '4.1 MB', updated: 'Mar 31, 2025', type: 'pdf' },
  { id: 6, categoryKey: 'research',  name: 'AI-Assisted Rehab Study.pdf',        size: '3.7 MB', updated: 'Mar 15, 2025', type: 'pdf' },
]

const CAT_BADGE: Record<string, string> = {
  protocols: 'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)]',
  forms:     'bg-[var(--bg-warning-primary)] text-[var(--text-warning-primary)]',
  research:  'bg-[var(--bg-success-primary)] text-[var(--text-success-primary)]',
  templates: 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]',
}

export function DocsPage() {
  const { t } = useTranslation()
  const [activeCat, setActiveCat] = useState('all')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  function handleUpload() {
    if (!uploadFile) return
    setUploadSuccess(true)
    setTimeout(() => { setUploadSuccess(false); setUploadOpen(false); setUploadFile(null) }, 1500)
  }

  const CATEGORIES = [
    { key: 'all',       label: t('documents.allCategories') },
    { key: 'protocols', label: t('documents.protocols') },
    { key: 'forms',     label: t('documents.forms') },
    { key: 'research',  label: t('documents.research') },
    { key: 'templates', label: t('documents.templates') },
  ]

  const filtered = activeCat === 'all' ? DOCS : DOCS.filter(d => d.categoryKey === activeCat)

  return (
    <div>
      <PageHeader
        title={t('documents.title')}
        subtitle={t('documents.subtitle', { count: DOCS.length })}
        crumbs={[{ label: t('nav.documents') }]}
        actions={
          <>
            <div className="w-44 sm:w-56">
              <Input placeholder={t('documents.searchPlaceholder')} leftIcon={<Search />} uiSize="sm" />
            </div>
            <Button size="sm" onClick={() => setUploadOpen(true)}>
              <Plus size={15} />
              {t('documents.upload')}
            </Button>
          </>
        }
      />

      {/* Category tabs */}
      <div className="flex items-center gap-1.5 flex-wrap mb-5">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCat(cat.key)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer',
              activeCat === cat.key
                ? 'bg-[var(--fg-brand-primary)] text-white shadow-xs'
                : 'bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] shadow-xs',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] [box-shadow:var(--shadow-xs)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--bg-secondary-subtle)] border-b border-[var(--border-secondary)]">
                {[t('documents.name'), t('documents.category'), t('documents.size'), t('documents.lastUpdated'), ''].map((h, i) => (
                  <th key={i} className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id} className="border-b border-[var(--border-secondary)] last:border-0 hover:bg-[var(--bg-secondary-subtle)] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-[var(--bg-error-primary)] flex items-center justify-center shrink-0">
                        <FileText size={15} className="text-[var(--fg-error-primary)]" />
                      </div>
                      <span className="text-[14px] font-medium text-[var(--text-primary)]">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      'px-2.5 py-0.5 text-[12px] font-medium rounded-full',
                      CAT_BADGE[doc.categoryKey] ?? 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]',
                    )}>
                      {t(`documents.${doc.categoryKey}` as any, doc.categoryKey)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[14px] text-[var(--text-tertiary)]">{doc.size}</td>
                  <td className="px-5 py-4 text-[14px] text-[var(--text-tertiary)]">{doc.updated}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                      <button className="size-8 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--text-secondary)] cursor-pointer">
                        <Eye size={14} />
                      </button>
                      <button className="size-8 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--text-secondary)] cursor-pointer">
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-[var(--border-secondary)] bg-[var(--bg-secondary-subtle)]">
          <p className="text-[13px] text-[var(--text-tertiary)]">
            {t('documents.showingOf', { count: filtered.length, total: DOCS.length })}
          </p>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setUploadOpen(false)} />
          <div className="relative bg-[var(--bg-primary)] rounded-2xl shadow-xl w-full max-w-sm p-6 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">{t('documents.upload')}</h3>
              <button onClick={() => setUploadOpen(false)} className="text-[var(--text-tertiary)]">
                <Plus size={18} className="rotate-45" />
              </button>
            </div>
            {uploadSuccess ? (
              <div className="text-center py-6">
                <p className="text-green-600 text-[16px] font-semibold">✓ Fayl yuklandi!</p>
                <p className="text-[13px] text-[var(--text-tertiary)] mt-1">{uploadFile?.name}</p>
              </div>
            ) : (
              <>
                <div
                  className="border-2 border-dashed border-[var(--border-secondary)] rounded-xl p-8 text-center cursor-pointer hover:border-[var(--fg-brand-primary)] transition-colors"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Plus size={32} className="mx-auto mb-2 text-[var(--text-quaternary)] rotate-0" />
                  <p className="text-[14px] font-medium text-[var(--text-secondary)]">
                    {uploadFile ? uploadFile.name : 'Fayl tanlash yoki bu yerga tashlang'}
                  </p>
                  <p className="text-[12px] text-[var(--text-quaternary)] mt-1">PDF, DOCX, XLSX — max 10MB</p>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xlsx,.xls"
                    onChange={e => setUploadFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setUploadOpen(false)} className="flex-1 py-2.5 rounded-lg border border-[var(--border-secondary)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                    {t('common.cancel')}
                  </button>
                  <button onClick={handleUpload} disabled={!uploadFile}
                    className="flex-1 py-2.5 rounded-lg bg-[var(--fg-brand-primary)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40"
                  >
                    Yuklash
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
