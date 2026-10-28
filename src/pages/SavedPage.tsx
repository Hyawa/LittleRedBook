import { useMemo } from 'react'
import { Bookmark, Search } from 'lucide-react'
import { book } from '@/lib/book'
import { citationLabel } from '@/lib/format'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useLibrary } from '@/state/library'
import { AppHeader } from '@/components/AppHeader'
import { EmptyState } from '@/components/EmptyState'
import { HeaderSettingsButton } from '@/components/HeaderSettingsButton'
import { SavedQuoteCard } from '@/components/SavedQuoteCard'
import { Button } from '@/components/ui/button'

export function SavedPage({
  onOpenSettings,
}: {
  onOpenSettings: () => void
}) {
  useDocumentTitle('Salvos — Citações')
  const { state } = useLibrary()

  const groups = useMemo(() => {
    return book.chapters
      .map((chapter) => {
        const quotes = state.saved
          .filter((key) => key.startsWith(`${chapter.id}:`))
          .map((key) =>
            chapter.quotes.find(
              (quote) => quote.id === Number(key.split(':')[1]),
            ),
          )
          .filter((quote) => quote !== undefined)
        return { chapter, quotes }
      })
      .filter((group) => group.quotes.length > 0)
  }, [state.saved])

  const total = groups.reduce((sum, group) => sum + group.quotes.length, 0)

  return (
    <div className="pb-28 md:pb-32">
      <AppHeader
        eyebrow="Guardadas neste dispositivo"
        title="Salvos"
        actions={<HeaderSettingsButton onClick={onOpenSettings} />}
      />

      <main>
        <div className="app-shell pt-6">
          <p className="label-caps text-[0.6rem] text-accent">Sua coleção</p>
          <h1 className="mt-1 font-display text-[2.4rem] leading-[1.02] font-semibold tracking-[-0.015em]">
            Citações salvas
          </h1>
          <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
            {total > 0
              ? `${citationLabel(total)} em ${groups.length} ${
                  groups.length === 1 ? 'seção' : 'seções'
                }, sempre à mão.`
              : 'Toque no marcador de qualquer citação para guardá-la aqui.'}
          </p>
        </div>

        {total > 0 ? (
          <div className="app-shell mt-6 space-y-8">
            {groups.map(({ chapter, quotes }) => (
              <section
                key={chapter.id}
                aria-labelledby={`salvos-${chapter.id}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/[0.04] font-label text-[0.56rem] text-accent"
                  >
                    {chapter.numeral}
                  </span>
                  <h2
                    id={`salvos-${chapter.id}`}
                    className="min-w-0 flex-1 truncate font-display text-xl font-semibold"
                  >
                    {chapter.title}
                  </h2>
                  <span className="font-label text-[0.56rem] text-muted-foreground">
                    {quotes.length}
                  </span>
                </div>
                <div className="mt-3 space-y-3">
                  {quotes.map((quote) => (
                    <SavedQuoteCard
                      key={quote.id}
                      chapter={chapter}
                      quote={quote}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <section className="app-shell mt-4">
            <EmptyState
              icon={<Bookmark className="size-6" />}
              title="Nenhuma citação salva"
              description="Ao ler, toque no marcador para guardar as passagens que quiser reler. Elas ficam neste dispositivo, mesmo offline."
              action={
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button asChild>
                    <a href="#/secoes">Explorar as seções</a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="#/buscar">
                      <Search aria-hidden="true" />
                      Buscar
                    </a>
                  </Button>
                </div>
              }
            />
          </section>
        )}
      </main>
    </div>
  )
}
