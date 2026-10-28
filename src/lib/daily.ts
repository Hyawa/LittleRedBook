import type { Book, Chapter, Quote } from './types'
import { book as defaultBook } from './book'

export interface DailyQuote {
  chapter: Chapter
  quote: Quote
  /** Índice global (0-based) da citação no livro. */
  index: number
}

function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  )
}

export function quoteOfDay(
  book: Book = defaultBook,
  date: Date = new Date(),
): DailyQuote {
  const total = book.chapters.reduce(
    (sum, chapter) => sum + chapter.quotes.length,
    0,
  )
  if (total === 0) throw new Error('O livro não tem citações')

  const index = ((dayNumber(date) % total) + total) % total
  let cursor = index

  for (const chapter of book.chapters) {
    if (cursor < chapter.quotes.length) {
      return { chapter, quote: chapter.quotes[cursor], index }
    }
    cursor -= chapter.quotes.length
  }

  throw new Error('Citação não encontrada')
}
