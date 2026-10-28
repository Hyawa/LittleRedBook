import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Search, WifiOff, X } from 'lucide-react'
import { book } from '@/lib/book'
import { searchBook } from '@/lib/search'
import { routeToHash } from '@/lib/router'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { AppHeader } from '@/components/AppHeader'
import { EmptyState } from '@/components/EmptyState'
import { HeaderSettingsButton } from '@/components/HeaderSettingsButton'
import { SearchResultCard } from '@/components/SearchResultCard'
import { Star } from '@/components/Star'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const SUGGESTIONS = [
  'povo',
  'guerra',
  'Partido',
  'juventude',
  'mulheres',
  'estudo',
  'contradição',
  'massas',
]

export function SearchPage({
  initialQuery,
  onOpenSettings,
}: {
  initialQuery: string
  onOpenSettings: () => void
}) {
  useDocumentTitle('Buscar — Citações')
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const deferredQuery = useDeferredValue(query)
  const allResults = useMemo(
    () => searchBook(book, deferredQuery, 500),
    [deferredQuery],
  )
  const results = allResults.slice(0, 100)
  const trimmed = deferredQuery.trim()

  useEffect(() => {
    const hash = routeToHash({ name: 'search', query })
    window.history.replaceState(null, '', hash)
  }, [query])

  const chooseSuggestion = (term: string) => {
    setQuery(term)
    inputRef.current?.focus()
  }

  return (
    <div className="pb-28 md:pb-32">
      <AppHeader
        eyebrow={`${book.total} citações`}
        title="Buscar"
        actions={<HeaderSettingsButton onClick={onOpenSettings} />}
      />

      <main>
        <div className="app-shell pt-4">
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              inputRef.current?.blur()
            }}
          >
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 size-[1.05rem] -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Palavra ou expressão"
                aria-label="Buscar nas citações"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="search"
                className="h-13 pl-11 pr-12 text-[0.98rem]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  aria-label="Limpar busca"
                  className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </form>

          <p className="mt-2 flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
            <WifiOff className="size-3" aria-hidden="true" />
            A busca funciona no dispositivo, sem internet.
          </p>
        </div>

        {trimmed ? (
          <section
            className="app-shell mt-6"
            aria-label="Resultados da busca"
            aria-live="polite"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl font-semibold">
                {allResults.length}{' '}
                {allResults.length === 1 ? 'resultado' : 'resultados'}
              </h2>
              <span className="max-w-[45%] truncate text-[0.68rem] text-muted-foreground">
                para “{trimmed}”
              </span>
            </div>

            {allResults.length ? (
              <div className="mt-3 space-y-3">
                {results.map((hit) => (
                  <SearchResultCard
                    key={`${hit.chapter.id}:${hit.quote.id}`}
                    hit={hit}
                  />
                ))}
                {allResults.length > results.length ? (
                  <p className="px-1 pt-1 text-center text-[0.7rem] text-muted-foreground">
                    Mostrando as primeiras {results.length} citações. Refine a
                    busca para ver menos resultados.
                  </p>
                ) : null}
              </div>
            ) : (
              <EmptyState
                icon={<Search className="size-6" />}
                title="Nenhuma citação encontrada"
                description={`Não encontramos “${trimmed}”. Tente uma palavra mais curta, o singular ou outra grafia.`}
                action={
                  <Button variant="outline" onClick={() => setQuery('')}>
                    Limpar busca
                  </Button>
                }
              />
            )}
          </section>
        ) : (
          <section className="app-shell mt-7" aria-labelledby="sugestoes">
            <h2
              id="sugestoes"
              className="label-caps text-[0.6rem] text-muted-foreground"
            >
              Sugestões
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => chooseSuggestion(term)}
                  className="min-h-10 rounded-full border border-border/80 bg-card px-4 text-[0.82rem] font-semibold transition-colors hover:border-gold/45 hover:bg-secondary/60"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="relative mt-8 overflow-hidden rounded-[1.4rem] border border-border/70 bg-card p-5">
              <Star
                aria-hidden="true"
                className="absolute -top-6 -right-6 size-24 rotate-12 text-gold/[0.07]"
              />
              <div className="relative">
                <div className="flex items-center gap-2 text-accent">
                  <Star className="size-3" aria-hidden="true" />
                  <span className="label-caps text-[0.54rem]">
                    Leitura atenta
                  </span>
                </div>
                <p className="mt-3 font-display text-[1.45rem] leading-tight font-semibold">
                  Encontre uma ideia, uma palavra, uma passagem.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A busca percorre as {book.total} citações e também as
                  atribuições de cada texto.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
