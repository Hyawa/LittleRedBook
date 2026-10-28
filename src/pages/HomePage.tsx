import { ArrowRight, BookOpen, ChevronRight, WifiOff } from 'lucide-react'
import { book, getChapter, quoteText } from '@/lib/book'
import { quoteOfDay } from '@/lib/daily'
import { excerpt, citationLabel, formatLongDate } from '@/lib/format'
import { readingPercent } from '@/lib/progress'
import { routeToHash } from '@/lib/router'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useLibrary } from '@/state/library'
import { AppHeader } from '@/components/AppHeader'
import { BookCover } from '@/components/BookCover'
import { ChapterRow } from '@/components/ChapterRow'
import { HeaderSettingsButton } from '@/components/HeaderSettingsButton'
import { ProgressBar } from '@/components/ProgressBar'
import { RichText } from '@/components/RichText'
import { SaveQuoteButton } from '@/components/SaveQuoteButton'
import { Star, StarRule } from '@/components/Star'
import { Button } from '@/components/ui/button'

export function HomePage({
  onOpenSettings,
}: {
  onOpenSettings: () => void
}) {
  useDocumentTitle('Citações — Livro Vermelho')

  const { state } = useLibrary()
  const daily = quoteOfDay(book)
  const dailyText = quoteText(daily.quote)
  const lastChapter = state.lastRead
    ? getChapter(state.lastRead.chapterId)
    : undefined
  const nextChapter =
    lastChapter ??
    book.chapters.find((chapter) => !state.read.includes(chapter.id)) ??
    book.chapters[0]
  const continueQuoteId =
    lastChapter && state.lastRead ? state.lastRead.quoteId : undefined
  const startHref = routeToHash({
    name: 'reader',
    chapterId: nextChapter.id,
    quoteId: continueQuoteId,
  })
  const dailyHref = routeToHash({
    name: 'reader',
    chapterId: daily.chapter.id,
    quoteId: daily.quote.id,
  })
  const percent = readingPercent(state.read, book.chapters.length)
  const started = state.read.length > 0 || Boolean(state.lastRead)

  return (
    <div className="pb-28 md:pb-32">
      <AppHeader
        brand
        eyebrow="Citações do Presidente Mao"
        title="O Livro Vermelho"
        actions={<HeaderSettingsButton onClick={onOpenSettings} />}
      />

      <main>
        <div className="app-shell pt-4 sm:pt-6">
          <BookCover>
            <Button
              asChild
              variant="gold"
              size="lg"
              className="w-full text-[0.95rem]"
            >
              <a href={startHref}>
                <BookOpen aria-hidden="true" />
                {started ? 'Continuar a leitura' : 'Começar a leitura'}
              </a>
            </Button>
          </BookCover>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">
            <WifiOff className="size-3" aria-hidden="true" />
            Leitura disponível sem internet
          </p>
        </div>

        <section className="app-shell mt-8" aria-labelledby="citacao-do-dia">
          <div className="flex items-baseline justify-between gap-3">
            <h2
              id="citacao-do-dia"
              className="label-caps flex items-center gap-2 text-[0.6rem] text-muted-foreground"
            >
              <Star className="size-2.5 text-gold" aria-hidden="true" />
              Citação do dia
            </h2>
            <span className="text-[0.66rem] text-muted-foreground">
              {formatLongDate()}
            </span>
          </div>

          <div className="relative mt-3 overflow-hidden rounded-[1.4rem] border border-border/80 bg-card p-5 shadow-[0_18px_40px_-32px_rgba(38,26,21,.5)]">
            <Star
              aria-hidden="true"
              className="absolute -top-7 -right-7 size-28 rotate-12 text-gold/[0.07]"
            />
            <div className="relative">
              <blockquote className="font-serif text-[1.15rem] leading-[1.65] text-foreground">
                “{excerpt(dailyText, 300)}”
              </blockquote>
              <p className="mt-3 line-clamp-2 border-l-2 border-gold/35 pl-3 font-serif text-[0.78rem] leading-relaxed text-muted-foreground italic">
                — <RichText text={daily.quote.source} />
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-1.5">
                <a
                  href={dailyHref}
                  className="inline-flex min-h-10 items-center gap-1.5 text-[0.8rem] font-semibold text-primary"
                >
                  Ler no livro
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </a>
                <SaveQuoteButton
                  chapterId={daily.chapter.id}
                  quoteId={daily.quote.id}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="app-shell mt-7" aria-labelledby="sua-leitura">
          <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2
                id="sua-leitura"
                className="font-display text-lg font-semibold"
              >
                Sua leitura
              </h2>
              <span className="font-label text-[0.58rem] text-muted-foreground">
                {state.read.length} / {book.chapters.length}
              </span>
            </div>
            <ProgressBar
              value={percent}
              className="mt-2.5"
              label="Seções concluídas"
            />
            <p className="mt-2 text-[0.72rem] text-muted-foreground">
              {percent === 100
                ? 'Você concluiu todas as seções.'
                : percent === 0
                  ? 'Comece pela primeira seção.'
                  : `${percent}% do livro concluído.`}
            </p>
            {lastChapter && state.lastRead ? (
              <a
                href={routeToHash({
                  name: 'reader',
                  chapterId: lastChapter.id,
                  quoteId: state.lastRead.quoteId,
                })}
                className="mt-3 flex min-h-12 items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2 transition-colors hover:border-gold/40 hover:bg-secondary/40"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/5 font-label text-[0.55rem] text-accent">
                  {lastChapter.numeral}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="label-caps block text-[0.5rem] text-muted-foreground">
                    Retomar
                  </span>
                  <span className="block truncate font-display text-[0.98rem] font-semibold">
                    {lastChapter.title}
                  </span>
                </span>
                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground/60"
                  aria-hidden="true"
                />
              </a>
            ) : null}
          </div>
        </section>

        <section className="app-shell mt-8" aria-labelledby="secoes">
          <div className="flex items-end justify-between gap-3">
            <h2 id="secoes" className="font-display text-2xl font-semibold">
              As seções
            </h2>
            <a
              href="#/secoes"
              className="inline-flex min-h-9 items-center gap-0.5 text-xs font-semibold text-primary"
            >
              Ver todas
              <ChevronRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-3 divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/70 bg-card/60 px-2">
            {book.chapters.slice(0, 4).map((chapter) => (
              <ChapterRow
                key={chapter.id}
                chapter={chapter}
                isRead={state.read.includes(chapter.id)}
                savedCount={
                  state.saved.filter((key) =>
                    key.startsWith(`${chapter.id}:`),
                  ).length
                }
              />
            ))}
          </div>
          <p className="mt-2 px-1 text-[0.68rem] text-muted-foreground">
            {citationLabel(book.total)} em {book.chapters.length} seções
          </p>
        </section>

        <footer className="app-shell mt-10 pb-6 text-center">
          <StarRule />
          <p className="mt-4 font-label text-[0.52rem] tracking-[0.2em] text-muted-foreground/70 uppercase">
            Edição de 1972 · leitura offline
          </p>
        </footer>
      </main>
    </div>
  )
}
