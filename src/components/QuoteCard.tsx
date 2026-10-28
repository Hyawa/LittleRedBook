import type { Chapter, Quote } from '@/lib/types'
import { QuoteBody } from './QuoteBody'
import { QuoteActions } from './QuoteActions'
import { RichText } from './RichText'
import { cn } from '@/lib/utils'

export function QuoteCard({
  chapter,
  quote,
  highlighted = false,
}: {
  chapter: Chapter
  quote: Quote
  highlighted?: boolean
}) {
  return (
    <article
      id={`secao-${chapter.id}-citacao-${quote.id}`}
      data-quote-id={quote.id}
      className={cn(
        'scroll-mt-24 px-1 py-7 transition-colors sm:px-2 sm:py-8',
        highlighted && 'quote-highlight',
      )}
    >
      <div className="mb-3 flex items-center gap-3" aria-hidden="true">
        <span className="font-label text-[0.6rem] tracking-[0.2em] text-accent">
          N.º {quote.number}
        </span>
        <span className="hairline flex-1 opacity-70" />
      </div>

      <QuoteBody quote={quote} />

      <footer className="mt-4 border-l-2 border-gold/35 pl-3">
        <p className="font-serif text-[0.82rem] leading-relaxed text-muted-foreground italic">
          <RichText text={quote.source} />
        </p>
      </footer>

      <QuoteActions chapter={chapter} quote={quote} className="mt-3 -ml-3" />
    </article>
  )
}
