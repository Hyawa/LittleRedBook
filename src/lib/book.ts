import rawBook from '@/data/quotes.json'
import type { Book, Chapter, Quote, TextBlock } from './types'

export const book = rawBook as unknown as Book

export function getChapter(chapterId: number): Chapter | undefined {
  return book.chapters.find((chapter) => chapter.id === chapterId)
}

export function getQuote(chapterId: number, quoteId: number): Quote | undefined {
  return getChapter(chapterId)?.quotes.find((quote) => quote.id === quoteId)
}

/** Texto corrido, usado na busca. */
export function quoteText(quote: Quote): string {
  return quote.blocks
    .map((block) => (block.type === 'p' ? block.text : block.items.join(' ')))
    .join(' ')
}

/** Texto formatado, usado ao copiar ou partilhar. */
export function quoteToPlainText(quote: Quote): string {
  return quote.blocks
    .map((block) => {
      if (block.type === 'p') return block.text
      return block.items
        .map((item, index) => `${index + 1}. ${item}`)
        .join('\n')
    })
    .join('\n\n')
}

export function countWords(block: TextBlock): number {
  const text = block.type === 'p' ? block.text : block.items.join(' ')
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export function savedCountForChapter(
  chapter: Chapter,
  saved: string[],
): number {
  return saved.filter((key) => key.startsWith(`${chapter.id}:`)).length
}

export function nextChapterId(chapterId: number): number | null {
  return chapterId < book.chapters.length ? chapterId + 1 : null
}

export function previousChapterId(chapterId: number): number | null {
  return chapterId > 1 ? chapterId - 1 : null
}
