import type { Book, Chapter, Quote } from './types'
import { quoteText } from './book'

export interface SearchHit {
  chapter: Chapter
  quote: Quote
  snippet: string
  terms: string[]
  score: number
}

const MARKS = /\p{M}/gu

export function normalize(value: string): string {
  return value.normalize('NFD').replace(MARKS, '').toLowerCase()
}

/** Normaliza preservando o mapa de cada caractere para o texto original. */
export function normalizeWithMap(value: string) {
  let text = ''
  const map: number[] = []
  let index = 0
  for (const char of value) {
    const normalized = char.normalize('NFD').replace(MARKS, '').toLowerCase()
    for (const part of normalized) {
      text += part
      map.push(index)
    }
    index += char.length
  }
  return { text, map }
}

const SNIPPET_LENGTH = 220
const SNIPPET_LEAD = 65

function makeSnippet(value: string, normalizedIndex: number): string {
  if (value.length <= SNIPPET_LENGTH) return value

  let start = Math.max(0, normalizedIndex - SNIPPET_LEAD)
  if (start > 0) {
    const space = value.indexOf(' ', start)
    if (space !== -1 && space < normalizedIndex) start = space + 1
  }

  let end = Math.min(value.length, start + SNIPPET_LENGTH)
  if (end < value.length) {
    const space = value.lastIndexOf(' ', end)
    if (space > normalizedIndex) end = space
  }

  const prefix = start > 0 ? '… ' : ''
  const suffix = end < value.length ? ' …' : ''
  return `${prefix}${value.slice(start, end).trim()}${suffix}`
}

export function searchBook(
  book: Book,
  rawQuery: string,
  limit = 60,
): SearchHit[] {
  const terms = [
    ...new Set(normalize(rawQuery).split(/\s+/).filter(Boolean)),
  ].slice(0, 8)

  if (terms.length === 0) return []

  const hits: SearchHit[] = []

  for (const chapter of book.chapters) {
    for (const quote of chapter.quotes) {
      const text = quoteText(quote)
      const source = quote.source ?? ''
      const normalizedText = normalize(text)
      const normalizedSource = normalize(source)

      const matchesAll = terms.every(
        (term) =>
          normalizedText.includes(term) || normalizedSource.includes(term),
      )
      if (!matchesAll) continue

      const textMatches = terms.filter((term) =>
        normalizedText.includes(term),
      ).length
      const sourceMatches = terms.filter((term) =>
        normalizedSource.includes(term),
      ).length
      const phraseBonus = normalizedText.includes(terms.join(' ')) ? 6 : 0

      let anchor = normalizedText.indexOf(terms[0])
      if (anchor < 0) {
        // Só a atribuição contém o termo: mostra o início da citação.
        anchor = 0
      }

      hits.push({
        chapter,
        quote,
        snippet: makeSnippet(text, anchor),
        terms,
        score: textMatches * 10 + sourceMatches * 3 + phraseBonus,
      })
    }
  }

  return hits
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.chapter.id - b.chapter.id ||
        a.quote.id - b.quote.id,
    )
    .slice(0, limit)
}

/** Intervalos do trecho que devem ser realçados. */
export function highlightRanges(
  snippet: string,
  terms: string[],
): Array<[number, number]> {
  if (terms.length === 0) return []
  const { text, map } = normalizeWithMap(snippet)
  const ranges: Array<[number, number]> = []

  for (const term of terms) {
    if (!term) continue
    let from = 0
    while (from <= text.length) {
      const at = text.indexOf(term, from)
      if (at === -1) break
      const start = map[at] ?? 0
      const end = (map[at + term.length - 1] ?? start) + 1
      ranges.push([start, end])
      from = at + term.length
    }
  }

  return ranges
    .sort((a, b) => a[0] - b[0] || b[1] - a[1])
    .filter((range, index, all) => {
      const previous = all[index - 1]
      return !previous || range[0] >= previous[1]
    })
}
