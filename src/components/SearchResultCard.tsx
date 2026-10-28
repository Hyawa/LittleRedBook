import { ChevronRight } from 'lucide-react'
import type { SearchHit } from '@/lib/search'
import { routeToHash } from '@/lib/router'
import { HighlightedText } from './HighlightedText'
import { RichText } from './RichText'

export function SearchResultCard({ hit }: { hit: SearchHit }) {
  const { chapter, quote, snippet, terms } = hit

  return (
    <a
      href={routeToHash({
        name: 'reader',
        chapterId: chapter.id,
        quoteId: quote.id,
      })}
      className="group block rounded-2xl border border-border/70 bg-card p-4 shadow-[0_2px_10px_-8px_rgba(38,26,21,.35)] transition-[border-color,box-shadow,transform] duration-200 hover:border-gold/40 hover:shadow-[0_10px_30px_-20px_rgba(38,26,21,.5)] active:scale-[0.995]"
      aria-label={`Abrir citação ${quote.number} da seção ${chapter.numeral}: ${chapter.title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="label-caps text-[0.56rem] leading-relaxed text-accent">
          Seção {chapter.numeral} · {chapter.title}
        </span>
        <span className="font-label text-[0.58rem] whitespace-nowrap text-muted-foreground/80">
          N.º {quote.number}
        </span>
      </div>

      <p className="mt-2.5 font-serif text-[0.98rem] leading-relaxed text-foreground/90">
        <HighlightedText text={snippet} terms={terms} />
      </p>

      <div className="mt-2.5 flex items-end justify-between gap-3">
        <p className="line-clamp-1 flex-1 text-[0.72rem] text-muted-foreground italic">
          <RichText text={quote.source} />
        </p>
        <ChevronRight
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </a>
  )
}
