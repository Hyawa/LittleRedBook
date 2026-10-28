import { Star } from './Star'
import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex size-9 shrink-0 items-center justify-center rounded-[0.55rem] border border-[#5c0a0f] bg-[linear-gradient(145deg,#a51c24,#7d0f16)] text-gold-bright shadow-[0_2px_6px_rgba(60,10,14,.28)]',
        className,
      )}
    >
      <span className="absolute inset-[3px] rounded-[0.35rem] border border-gold/25" />
      <Star className="size-3.5" />
    </span>
  )
}
