import { cn } from '@/lib/utils'

export function Star({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn('size-4', className)}
      fill="currentColor"
    >
      <path d="M12 2.4l2.9 6.03 6.6.84-4.85 4.55 1.23 6.54L12 17.18 6.12 20.36l1.23-6.54L2.5 9.27l6.6-.84L12 2.4z" />
    </svg>
  )
}

export function StarRule({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex items-center justify-center gap-3', className)}
      aria-hidden="true"
    >
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
      <Star className="size-2.5 text-gold" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
    </div>
  )
}
