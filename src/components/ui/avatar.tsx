import { type HTMLAttributes } from 'react'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-[12px]',
  md: 'size-10 text-[14px]',
  lg: 'size-12 text-[16px]',
  xl: 'size-16 text-[20px]',
}

export function Avatar({ src, name, size = 'md', className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full overflow-hidden shrink-0 flex items-center justify-center font-semibold text-white',
        'bg-gradient-to-br from-[#2970FF] to-[#155EEF] [box-shadow:0_2px_6px_-2px_rgba(21,94,239,0.4)]',
        sizeMap[size],
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
