import { Check, ChevronRight } from 'lucide-react'
import type { Chapter } from '@/lib/types'
import { citationLabel } from '@/lib/format'
import { routeToHash } from '@/lib/router'
import { cn } from '@/lib/utils'

export function ChapterRow({
  chapter,
  isRead,
  savedCount = 0,
  className,
}: {
  chapter: Chapter
  isRead: boolean
  savedCount?: number
  className?: string
}) {
  return (
    <a
      href={routeToHash({ name: 'reader', chapterId: chapter.id })}
      className={cn(
        'group flex items-center gap-3.5 rounded-2xl px-3 py-3 transition-colors duration-200 hover:bg-secondary/50 sm:gap-4',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl border font-label text-[0.62rem] tracking-[0.05em] transition-colors sm:size-11 sm:text-[0.68rem]',
          isRead
            ? 'border-primary/30 bg-primary/5 text-primary'
            : 'border-gold/30 bg-gold/[0.04] text-accent',
        )}
      >
        {chapter.numeral}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[1.06rem] leading-snug font-semibold transition-colors group-hover:text-primary sm:text-[1.12rem]">
          {chapter.title}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.7rem] text-muted-foreground">
          <span>{citationLabel(chapter.quotes.length)}</span>
          {savedCount > 0 ? (
            <span className="text-accent">
              · {savedCount} {savedCount === 1 ? 'salva' : 'salvas'}
            </span>
          ) : null}
          {isRead ? (
            <span className="inline-flex items-center gap-0.5 text-primary">
              <Check className="size-3" aria-hidden="true" /> lida
            </span>
          ) : null}
        </span>
      </span>

      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </a>
  )
}
