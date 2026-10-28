import { useState } from 'react'
import { BookOpen, Copy } from 'lucide-react'
import { toast } from 'sonner'
import type { Chapter, Quote } from '@/lib/types'
import { quoteText, quoteToPlainText } from '@/lib/book'
import { excerpt } from '@/lib/format'
import { routeToHash } from '@/lib/router'
import { copyText, quoteShareText } from '@/lib/share'
import { QuoteBody } from './QuoteBody'
import { RichText } from './RichText'
import { SaveQuoteButton } from './SaveQuoteButton'
import { Button } from './ui/button'

const PREVIEW_LENGTH = 300

export function SavedQuoteCard({
  chapter,
  quote,
}: {
  chapter: Chapter
  quote: Quote
}) {
  const [expanded, setExpanded] = useState(false)
  const text = quoteText(quote)
  const canExpand = text.length > PREVIEW_LENGTH

  const onCopy = async () => {
    const ok = await copyText(quoteShareText(chapter, quote))
    if (ok) toast.success('Citação copiada')
    else toast.error('Não foi possível copiar')
  }

  return (
    <article className="rounded-2xl border border-border/70 bg-card p-4 shadow-[0_2px_10px_-8px_rgba(38,26,21,.35)]">
      <div className="flex items-start justify-between gap-2">
        <span className="font-label text-[0.58rem] tracking-[0.18em] text-accent">
          N.º {quote.number}
        </span>
        <SaveQuoteButton
          chapterId={chapter.id}
          quoteId={quote.id}
          className="-mt-2 -mr-2"
        />
      </div>

      <div className="mt-2">
        {expanded ? (
          <QuoteBody quote={quote} className="text-[1.02rem]" />
        ) : (
          <p className="font-serif text-[1.02rem] leading-relaxed whitespace-pre-line text-foreground/90">
            {excerpt(quoteToPlainText(quote), PREVIEW_LENGTH)}
          </p>
        )}
      </div>

      {canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 min-h-9 text-[0.72rem] font-semibold text-primary underline-offset-4 hover:underline"
        >
          {expanded ? 'Mostrar menos' : 'Ler citação completa'}
        </button>
      ) : null}

      <p className="mt-3 line-clamp-2 border-l-2 border-gold/35 pl-3 font-serif text-[0.75rem] leading-relaxed text-muted-foreground italic">
        <RichText text={quote.source} />
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-border/40 pt-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-10 gap-1.5 px-2.5 text-primary"
        >
          <a
            href={routeToHash({
              name: 'reader',
              chapterId: chapter.id,
              quoteId: quote.id,
            })}
          >
            <BookOpen className="size-4" aria-hidden="true" />
            Abrir
          </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-10 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Copy className="size-4" aria-hidden="true" />
          Copiar
        </Button>
        <span className="ml-auto pr-1 text-[0.62rem] text-muted-foreground/80">
          Seção {chapter.numeral}
        </span>
      </div>
    </article>
  )
}
