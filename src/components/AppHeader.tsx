import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { BrandMark } from './BrandMark'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface AppHeaderProps {
  title: string
  eyebrow?: string
  back?: boolean
  onBack?: () => void
  actions?: ReactNode
  brand?: boolean
  progress?: number
  className?: string
}

export function AppHeader({
  title,
  eyebrow,
  back = false,
  onBack,
  actions,
  brand = false,
  progress,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        'glass-bar sticky top-0 z-40 border-b border-border/50 pt-[env(safe-area-inset-top)]',
        className,
      )}
    >
      <div className="app-shell flex min-h-16 items-center gap-2 py-2">
        {back ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onBack}
            aria-label="Voltar"
            className="-ml-2 shrink-0 rounded-full"
          >
            <ChevronLeft className="size-5" />
          </Button>
        ) : brand ? (
          <BrandMark />
        ) : null}

        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="label-caps truncate text-[0.58rem] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <p className="truncate font-display text-[1.18rem] leading-tight font-semibold tracking-[-0.01em]">
            {title}
          </p>
        </div>

        {actions ? (
          <div className="flex shrink-0 items-center gap-0.5">{actions}</div>
        ) : null}
      </div>

      {typeof progress === 'number' ? (
        <div
          className="absolute inset-x-0 bottom-0 h-[2px] bg-border/30"
          aria-hidden="true"
        >
          <div
            className="h-full bg-primary transition-[width] duration-150 ease-out"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      ) : null}
    </header>
  )
}
