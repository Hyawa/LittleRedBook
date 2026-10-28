import { useEffect, useState } from 'react'
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Type,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  book,
  countWords,
  getChapter,
  nextChapterId,
  previousChapterId,
} from '@/lib/book'
import { citationLabel } from '@/lib/format'
import { routeToHash } from '@/lib/router'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useLibrary } from '@/state/library'
import { AppHeader } from '@/components/AppHeader'
import { EmptyState } from '@/components/EmptyState'
import { QuoteCard } from '@/components/QuoteCard'
import { StarRule } from '@/components/Star'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ReaderPage({
  chapterId,
  quoteId,
  canGoBack,
  onBack,
  onOpenSettings,
}: {
  chapterId: number
  quoteId?: number
  canGoBack: boolean
  onBack: () => void
  onOpenSettings: () => void
}) {
  const chapter = getChapter(chapterId)
  const [progress, setProgress] = useState(0)
  const [highlighted, setHighlighted] = useState<number | null>(null)
  const { state, setLastRead, markRead, unmarkRead } = useLibrary()

  useDocumentTitle(
    chapter ? `${chapter.numeral}. ${chapter.title} — Citações` : 'Citações',
  )

  useEffect(() => {
    if (!chapter) return
    const target = quoteId ?? chapter.quotes[0]?.id
    if (target) setLastRead(chapter.id, target)
  }, [chapter, quoteId, setLastRead])

  useEffect(() => {
    if (!chapter) return

    if (!quoteId) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    let clearHighlight = 0
    const timer = window.setTimeout(() => {
      const element = document.getElementById(
        `secao-${chapter.id}-citacao-${quoteId}`,
      )
      if (!element) return
      const top = element.getBoundingClientRect().top + window.scrollY - 84
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' })
      setHighlighted(quoteId)
      clearHighlight = window.setTimeout(() => {
        setHighlighted((current) => (current === quoteId ? null : current))
      }, 2600)
    }, 120)

    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(clearHighlight)
    }
  }, [chapter, quoteId])

  useEffect(() => {
    if (!chapter) return
    let frame = 0

    const update = () => {
      frame = 0
      const max =
        document.documentElement.scrollHeight - window.innerHeight
      setProgress(
        max > 0
          ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100)))
          : 0,
      )

      const elements =
        document.querySelectorAll<HTMLElement>('[data-quote-id]')
      let current: HTMLElement | null = null
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= 150) current = element
        else break
      }
      if (current) {
        const id = Number(current.dataset.quoteId)
        if (Number.isInteger(id) && id > 0) {
          setLastRead(chapter.id, id)
        }
      }
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [chapter, setLastRead])

  if (!chapter) {
    return (
      <div className="pb-16">
        <AppHeader
          back
          onBack={onBack}
          eyebrow="Citações"
          title="Seção não encontrada"
        />
        <EmptyState
          icon={<ChevronLeft className="size-6" />}
          title="Seção não encontrada"
          description="O endereço pode estar incompleto. Volte ao índice para escolher uma seção."
          action={
            <Button asChild>
              <a href="#/secoes">Voltar ao índice</a>
            </Button>
          }
        />
      </div>
    )
  }

  const isRead = state.read.includes(chapter.id)
  const previous = previousChapterId(chapter.id)
  const next = nextChapterId(chapter.id)
  const previousChapter = previous ? getChapter(previous) : undefined
  const nextChapter = next ? getChapter(next) : undefined
  const words = chapter.quotes.reduce(
    (sum, quote) =>
      sum + quote.blocks.reduce((total, block) => total + countWords(block), 0),
    0,
  )
  const minutes = Math.max(1, Math.round(words / 200))

  const toggleRead = () => {
    if (isRead) {
      unmarkRead(chapter.id)
      toast('Seção desmarcada', {
        description: 'Ela não conta mais no seu progresso.',
      })
    } else {
      markRead(chapter.id)
      toast.success('Seção concluída', {
        description: `${chapter.numeral}. ${chapter.title}`,
      })
    }
  }

  const goBack = () => {
    if (canGoBack) window.history.back()
    else onBack()
  }

  return (
    <div className="pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <AppHeader
        back
        onBack={goBack}
        eyebrow={`Seção ${chapter.numeral}`}
        title={chapter.title}
        progress={progress}
        actions={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenSettings}
                aria-label="Ajustes de leitura"
                className="rounded-full text-muted-foreground hover:text-foreground"
              >
                <Type className="size-[1.15rem]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tamanho e tema</TooltipContent>
          </Tooltip>
        }
      />

      <main>
        <header className="app-shell pt-7 pb-1 text-center sm:pt-10">
          <div className="flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-r from-transparent to-gold/50"
            />
            <span className="label-caps text-[0.6rem] text-accent">
              Seção {chapter.numeral}
            </span>
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-l from-transparent to-gold/50"
            />
          </div>

          <h1 className="mx-auto mt-3 max-w-[24ch] font-display text-[2.35rem] leading-[1.02] font-semibold tracking-[-0.018em] text-balance sm:text-5xl">
            {chapter.title}
          </h1>

          <p className="mt-3 text-[0.66rem] tracking-[0.15em] text-muted-foreground uppercase">
            {citationLabel(chapter.quotes.length)} · {minutes} min de leitura
          </p>

          <StarRule className="mt-5" />
        </header>

        <div className="mx-auto mt-2 w-full max-w-[41rem] divide-y divide-border/50 px-4 sm:px-6">
          {chapter.quotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              chapter={chapter}
              quote={quote}
              highlighted={highlighted === quote.id}
            />
          ))}
        </div>

        <div className="mx-auto mt-8 w-full max-w-[41rem] space-y-6 px-4 sm:px-6">
          <section
            aria-labelledby="fim-secao"
            className="rounded-2xl border border-border/70 bg-card/70 p-5 text-center"
          >
            <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-gold/25 bg-gold/5 text-accent">
              {isRead ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <Check className="size-5" />
              )}
            </div>
            <h2
              id="fim-secao"
              className="mt-3 font-display text-xl font-semibold"
            >
              {isRead ? 'Seção concluída' : 'Chegou ao fim da seção'}
            </h2>
            <p className="mx-auto mt-1 max-w-[34ch] text-[0.75rem] leading-relaxed text-muted-foreground">
              {isRead
                ? 'Ela já conta no seu progresso de leitura.'
                : 'Marque como lida para acompanhar o seu progresso.'}
            </p>
            <Button
              variant={isRead ? 'outline' : 'default'}
              onClick={toggleRead}
              className="mt-4 min-w-52"
            >
              {isRead ? (
                <>
                  <RotateCcw aria-hidden="true" />
                  Desmarcar seção
                </>
              ) : (
                <>
                  <Check aria-hidden="true" />
                  Marcar como lida
                </>
              )}
            </Button>
          </section>

          <nav
            aria-label="Navegação entre seções"
            className="grid grid-cols-2 gap-3"
          >
            {previousChapter ? (
              <a
                href={routeToHash({
                  name: 'reader',
                  chapterId: previousChapter.id,
                })}
                className="group flex min-h-24 flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-3.5 text-left transition-colors hover:border-gold/40 hover:bg-card"
              >
                <span className="label-caps flex items-center gap-1 text-[0.5rem] text-muted-foreground">
                  <ChevronLeft className="size-3" aria-hidden="true" />
                  Anterior
                </span>
                <span className="mt-1 line-clamp-2 font-display text-[0.95rem] leading-snug font-semibold group-hover:text-primary">
                  {previousChapter.numeral}. {previousChapter.title}
                </span>
              </a>
            ) : (
              <span aria-hidden="true" />
            )}

            {nextChapter ? (
              <a
                href={routeToHash({
                  name: 'reader',
                  chapterId: nextChapter.id,
                })}
                className="group flex min-h-24 flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-3.5 text-right transition-colors hover:border-gold/40 hover:bg-card"
              >
                <span className="label-caps flex items-center justify-end gap-1 text-[0.5rem] text-muted-foreground">
                  Próxima
                  <ChevronRight className="size-3" aria-hidden="true" />
                </span>
                <span className="mt-1 line-clamp-2 font-display text-[0.95rem] leading-snug font-semibold group-hover:text-primary">
                  {nextChapter.numeral}. {nextChapter.title}
                </span>
              </a>
            ) : (
              <span aria-hidden="true" />
            )}
          </nav>

          <footer className="pb-2 text-center">
            <p className="text-[0.66rem] leading-relaxed text-muted-foreground">
              Fonte: {book.edition}
            </p>
            <a
              href="#/secoes"
              className="mt-2 inline-flex min-h-10 items-center text-[0.72rem] font-semibold text-primary underline-offset-4 hover:underline"
            >
              Voltar ao índice
            </a>
          </footer>
        </div>
      </main>
    </div>
  )
}
