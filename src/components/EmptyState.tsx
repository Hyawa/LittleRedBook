import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center px-4 py-14 text-center',
        className,
      )}
    >
      <div className="relative mb-5 flex size-16 items-center justify-center rounded-full border border-gold/25 bg-gold/5 text-accent">
        <span className="absolute inset-2 rounded-full border border-gold/15" />
        {icon}
      </div>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
