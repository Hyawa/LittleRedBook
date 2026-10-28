import { useDeferredValue, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { book } from '@/lib/book'
import { normalize } from '@/lib/search'
import { readingPercent } from '@/lib/progress'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useLibrary } from '@/state/library'
import { AppHeader } from '@/components/AppHeader'
import { ChapterRow } from '@/components/ChapterRow'
import { EmptyState } from '@/components/EmptyState'
import { HeaderSettingsButton } from '@/components/HeaderSettingsButton'
import { ProgressBar } from '@/components/ProgressBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ChaptersPage({
  onOpenSettings,
}: {
  onOpenSettings: () => void
}) {
  useDocumentTitle('Seções — Citações')
  const { state } = useLibrary()
  const [filter, setFilter] = useState('')
  const deferredFilter = useDeferredValue(filter)
  const percent = readingPercent(state.read, book.chapters.length)

  const filtered = useMemo(() => {
    const term = normalize(deferredFilter.trim())
    if (!term) return book.chapters
    return book.chapters.filter(
      (chapter) =>
        normalize(chapter.title).includes(term) ||
        chapter.numeral.toLowerCase().includes(term) ||
        normalize(`${chapter.numeral}. ${chapter.title}`).includes(term),
    )
  }, [deferredFilter])

  return (
    <div className="pb-28 md:pb-32">
      <AppHeader
        eyebrow="Índice completo"
        title="As seções"
        actions={<HeaderSettingsButton onClick={onOpenSettings} />}
      />

      <main>
        <div className="app-shell pt-6">
          <p className="label-caps text-[0.6rem] text-accent">
            {book.total} citações
          </p>
          <h1 className="mt-1 font-display text-[2.4rem] leading-[1.02] font-semibold tracking-[-0.015em]">
            33 seções
          </h1>
          <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
            Percorra o livro na ordem original ou retome de onde parou.
          </p>

          <div className="mt-5 rounded-2xl border border-border/70 bg-card/70 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="label-caps text-[0.56rem] text-muted-foreground">
                Seu progresso
              </span>
              <span className="font-label text-[0.58rem] text-muted-foreground">
                {state.read.length} de {book.chapters.length} · {percent}%
              </span>
            </div>
            <ProgressBar
              value={percent}
              className="mt-2.5"
              label="Seções concluídas"
            />
          </div>

          <div className="relative mt-5">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-[1.05rem] -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Filtrar seções pelo título"
              aria-label="Filtrar seções pelo título"
              autoComplete="off"
              className="h-12 pl-11 pr-11 text-[0.95rem]"
            />
            {filter ? (
              <button
                type="button"
                onClick={() => setFilter('')}
                aria-label="Limpar filtro"
                className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>

        <section className="app-shell mt-4" aria-label="Lista de seções">
          {filtered.length ? (
            <div className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/70 bg-card/60 px-2">
              {filtered.map((chapter) => (
                <ChapterRow
                  key={chapter.id}
                  chapter={chapter}
                  isRead={state.read.includes(chapter.id)}
                  savedCount={state.saved.filter((key) =>
                    key.startsWith(`${chapter.id}:`),
                  ).length}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Search className="size-6" />}
              title="Nenhuma seção encontrada"
              description="Tente outra palavra ou limpe o filtro para ver as 33 seções."
              action={
                <Button variant="outline" onClick={() => setFilter('')}>
                  Limpar filtro
                </Button>
              }
            />
          )}

          <p className="mt-3 text-center text-[0.68rem] text-muted-foreground">
            {filtered.length} de {book.chapters.length} seções
          </p>
        </section>
      </main>
    </div>
  )
}
