import { useState } from 'react'
import { Search, Plus, Phone, Mail, MoreHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { DOCTORS } from '@/data/mock-data'
import { cn } from '@/lib/utils'

const SPECIALIZATIONS = ['All', 'Orthopedic', 'Physical Therapy', 'Radiology', 'Neurology']

export function TeamPage() {
  const [activeSpec, setActiveSpec] = useState('All')

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Team</h1>
          <p className="text-sm text-gray-500 mt-0.5">{DOCTORS.length} team members</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search members..." leftIcon={<Search size={14} />} className="w-52" />
          <Button size="md">
            <Plus size={15} />
            Add member
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {SPECIALIZATIONS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSpec(s)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer',
              activeSpec === s
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 shadow-xs',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DOCTORS.map(doc => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-gray-200 shadow-[var(--shadow-xs)] p-5 hover:shadow-sm transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <Avatar name={doc.name} size="lg" className="rounded-xl" />
              <button className="opacity-0 group-hover:opacity-100 transition-opacity size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
                <MoreHorizontal size={15} />
              </button>
            </div>

            <h3 className="text-sm font-semibold text-gray-900">{doc.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{doc.role}</p>

            {doc.availableFrom && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-success-700 font-medium">
                <span className="size-1.5 rounded-full bg-success-600" />
                Available {doc.availableFrom}–{doc.availableTo}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
              <button className="flex-1 h-9 rounded-lg bg-brand-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-brand-700 transition-colors cursor-pointer shadow-xs">
                <Phone size={13} />
                Call
              </button>
              <button className="size-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer shadow-xs">
                <Mail size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
