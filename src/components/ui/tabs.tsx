import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface TabItem {
  value: string
  label: ReactNode
  content: ReactNode
}

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (v: string) => void
  items: TabItem[]
  className?: string
  listClassName?: string
  variant?: 'pills' | 'underline'
}

export function Tabs({ defaultValue, value, onValueChange, items, className, listClassName, variant = 'pills' }: TabsProps) {
  return (
    <BaseTabs.Root defaultValue={defaultValue} value={value} onValueChange={onValueChange} className={className}>
      <BaseTabs.List
        className={cn(
          'flex items-center',
          variant === 'pills' && 'gap-1 p-1 bg-gray-100 rounded-xl w-fit',
          variant === 'underline' && 'gap-0 border-b border-gray-200',
          listClassName,
        )}
      >
        {items.map((item) => (
          <BaseTabs.Tab
            key={item.value}
            value={item.value}
            className={cn(
              'text-sm font-medium cursor-pointer outline-none transition-all',
              variant === 'pills' && [
                'px-4 py-2 rounded-lg text-gray-500',
                'data-[selected]:bg-white data-[selected]:text-navy data-[selected]:shadow-sm',
                'hover:text-navy',
              ],
              variant === 'underline' && [
                'px-4 py-2.5 text-gray-500 border-b-2 border-transparent -mb-px',
                'data-[selected]:text-primary data-[selected]:border-primary',
                'hover:text-navy',
              ],
            )}
          >
            {item.label}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {items.map((item) => (
        <BaseTabs.Panel key={item.value} value={item.value} className="outline-none">
          {item.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  )
}
