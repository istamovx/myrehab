import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-xl',
}

// Deterministic color from name
const colors = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
]

function getColor(name: string) {
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return colors[idx % colors.length]
}

export function Avatar({ src, name, size = 'md', className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full overflow-hidden shrink-0 flex items-center justify-center font-semibold',
        sizeMap[size],
        !src && getColor(name),
        className,
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  )
}
