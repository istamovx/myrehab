import { Search, Plus, Phone, Mail, MoreHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { DOCTORS } from '@/data/mock-data'

const SPECIALIZATIONS = ['All', 'Orthopedic', 'Physical Therapy', 'Radiology', 'Neurology']

export function TeamPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-navy">Team</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search team members..." leftIcon={<Search size={15} />} className="w-56" />
          <Button size="md">
            <Plus size={16} />
            Add member
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {SPECIALIZATIONS.map((s, i) => (
          <button
            key={s}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              i === 0
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DOCTORS.map(doc => (
          <div key={doc.id} className="bg-white rounded-2xl p-5 shadow-[var(--shadow-card)] hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <Avatar name={doc.name} size="lg" className="rounded-2xl" />
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 cursor-pointer">
                <MoreHorizontal size={16} />
              </button>
            </div>

            <h3 className="text-base font-bold text-navy">{doc.name}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{doc.role}</p>

            {doc.availableFrom && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-success font-medium">
                <span className="size-1.5 rounded-full bg-success" />
                Available {doc.availableFrom} – {doc.availableTo}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
              <button className="flex-1 h-9 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-primary-hover transition-colors cursor-pointer">
                <Phone size={13} />
                Call
              </button>
              <button className="size-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-navy transition-colors cursor-pointer">
                <Mail size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
