import { useState } from 'react'
import { Search, Plus, FileText, Download, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const DOCS = [
  { id: 1, category: 'Protocols', name: 'Hip Replacement Protocol v3.2.pdf',    size: '2.4 MB', updated: 'Apr 12, 2025', type: 'pdf' },
  { id: 2, category: 'Protocols', name: 'Knee Rehabilitation Guidelines.pdf',   size: '1.8 MB', updated: 'Apr 08, 2025', type: 'pdf' },
  { id: 3, category: 'Forms',     name: 'Patient Intake Form.docx',             size: '156 KB', updated: 'Apr 01, 2025', type: 'docx' },
  { id: 4, category: 'Forms',     name: 'Consent Form Template.pdf',            size: '320 KB', updated: 'Mar 25, 2025', type: 'pdf' },
  { id: 5, category: 'Research',  name: 'Q1 2025 Outcomes Report.pdf',          size: '4.1 MB', updated: 'Mar 31, 2025', type: 'pdf' },
  { id: 6, category: 'Research',  name: 'AI-Assisted Rehab Study.pdf',          size: '3.7 MB', updated: 'Mar 15, 2025', type: 'pdf' },
]

const CATEGORIES = ['All', 'Protocols', 'Forms', 'Research', 'Templates']

const CAT_BADGE: Record<string, string> = {
  Protocols: 'bg-brand-50 text-brand-700',
  Forms:     'bg-warning-50 text-warning-700',
  Research:  'bg-success-50 text-success-700',
  Templates: 'bg-gray-100 text-gray-600',
}

export function DocsPage() {
  const [activeCat, setActiveCat] = useState('All')

  const filtered = activeCat === 'All' ? DOCS : DOCS.filter(d => d.category === activeCat)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500 mt-0.5">{DOCS.length} files available</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search documents..." leftIcon={<Search size={14} />} className="w-52" />
          <Button size="md">
            <Plus size={15} />
            Upload
          </Button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer',
              activeCat === cat
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 shadow-xs',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-[var(--shadow-xs)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Name', 'Category', 'Size', 'Last updated', ''].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-error-50 flex items-center justify-center shrink-0">
                      <FileText size={15} className="text-error-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={cn(
                    'px-2.5 py-0.5 text-xs font-medium rounded-full',
                    CAT_BADGE[doc.category] ?? 'bg-gray-100 text-gray-600',
                  )}>
                    {doc.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{doc.size}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{doc.updated}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                    <button className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer">
                      <Eye size={14} />
                    </button>
                    <button className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer">
                      <Download size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{filtered.length}</span> of {DOCS.length} documents
          </p>
        </div>
      </div>
    </div>
  )
}
