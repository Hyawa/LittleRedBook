import { Copy, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Chapter, Quote } from '@/lib/types'
import { copyText, quoteShareText, shareQuote } from '@/lib/share'
import { SaveQuoteButton } from './SaveQuoteButton'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

export function QuoteActions({
  chapter,
  quote,
  className,
}: {
  chapter: Chapter
  quote: Quote
  className?: string
}) {
  const onCopy = async () => {
    const ok = await copyText(quoteShareText(chapter, quote))
    if (ok) toast.success('Citação copiada')
    else toast.error('Não foi possível copiar')
  }

  const onShare = async () => {
    const result = await shareQuote(chapter, quote)
    if (result === 'copied') {
      toast.success('Texto copiado para partilhar')
    } else if (result === 'error') {
      toast.error('Não foi possível partilhar')
    }
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-0.5', className)}>
      <SaveQuoteButton
        chapterId={chapter.id}
        quoteId={quote.id}
        showLabel
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={onCopy}
        className="h-11 gap-2 px-3 text-muted-foreground hover:text-foreground"
      >
        <Copy className="size-[1.05rem]" aria-hidden="true" />
        Copiar
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onShare}
        className="h-11 gap-2 px-3 text-muted-foreground hover:text-foreground"
      >
        <Share2 className="size-[1.05rem]" aria-hidden="true" />
        Partilhar
      </Button>
    </div>
  )
}
