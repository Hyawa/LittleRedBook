import { cn } from '@/lib/utils'

export function ProgressBar({
  value,
  className,
  label,
}: {
  value: number
  className?: string
  label?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={label ?? 'Progresso de leitura'}
      className={cn(
        'h-1.5 w-full overflow-hidden rounded-full bg-secondary',
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
