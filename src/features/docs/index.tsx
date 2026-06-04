import { Search, Plus, FileText, Download, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const DOCS = [
  { id: 1, category: 'Protocols', name: 'Hip Replacement Protocol v3.2.pdf', size: '2.4 MB', updated: '12.04.2025', type: 'pdf' },
  { id: 2, category: 'Protocols', name: 'Knee Rehabilitation Guidelines.pdf', size: '1.8 MB', updated: '08.04.2025', type: 'pdf' },
  { id: 3, category: 'Forms', name: 'Patient Intake Form.docx', size: '156 KB', updated: '01.04.2025', type: 'docx' },
  { id: 4, category: 'Forms', name: 'Consent Form Template.pdf', size: '320 KB', updated: '25.03.2025', type: 'pdf' },
  { id: 5, category: 'Research', name: 'Q1 2025 Outcomes Report.pdf', size: '4.1 MB', updated: '31.03.2025', type: 'pdf' },
  { id: 6, category: 'Research', name: 'AI-Assisted Rehab Study.pdf', size: '3.7 MB', updated: '15.03.2025', type: 'pdf' },
]

const CATEGORIES = ['All', 'Protocols', 'Forms', 'Research', 'Templates']

export function DocsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-navy">Documents</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search documents..." leftIcon={<Search size={15} />} className="w-56" />
          <Button size="md">
            <Plus size={16} />
            Upload
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer first:bg-primary first:text-white bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Name', 'Category', 'Size', 'Last updated', ''].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DOCS.map(doc => (
              <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-danger" />
                    </div>
                    <span className="text-sm font-medium text-navy">{doc.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 text-xs font-medium bg-primary-light text-primary rounded-lg">
                    {doc.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{doc.size}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{doc.updated}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-navy cursor-pointer">
                      <Eye size={14} />
                    </button>
                    <button className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-navy cursor-pointer">
                      <Download size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
