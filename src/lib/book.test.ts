import { describe, expect, it } from 'vitest'
import { book, getChapter, getQuote, quoteText, quoteToPlainText } from './book'
import { searchBook } from './search'

describe('conteúdo do livro', () => {
  it('tem as 33 seções e as 427 citações', () => {
    expect(book.chapters).toHaveLength(33)
    expect(book.total).toBe(427)
    expect(
      book.chapters.reduce((sum, chapter) => sum + chapter.quotes.length, 0),
    ).toBe(427)
  })

  it('não tem citações nem atribuições vazias', () => {
    for (const chapter of book.chapters) {
      expect(chapter.title.length).toBeGreaterThan(0)
      expect(chapter.quotes.length).toBeGreaterThan(0)
      for (const quote of chapter.quotes) {
        expect(quote.source.trim().length).toBeGreaterThan(0)
        expect(quote.blocks.length).toBeGreaterThan(0)
        expect(quoteToPlainText(quote).trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('preserva listas numeradas como blocos', () => {
    const chapter = getChapter(4)
    const quote = chapter?.quotes.find((item) =>
      item.blocks.some((block) => block.type === 'ol'),
    )
    expect(quote).toBeDefined()
    const list = quote?.blocks.find((block) => block.type === 'ol')
    expect(list && list.type === 'ol' ? list.items.length : 0).toBeGreaterThan(3)
  })

  it('encontra citações e permite navegar por id', () => {
    const quote = getQuote(17, 1)
    expect(quote).toBeDefined()
    expect(quoteText(quote!).length).toBeGreaterThan(20)
    expect(getChapter(999)).toBeUndefined()
  })

  it('a busca no livro real encontra resultados relevantes', () => {
    const hits = searchBook(book, 'tigres de papel')
    expect(hits.length).toBeGreaterThan(0)
    expect(hits.some((hit) => hit.chapter.id === 6)).toBe(true)
  })

  it('a busca ignora acentos no livro real', () => {
    const comAcento = searchBook(book, 'exército')
    const semAcento = searchBook(book, 'exercito')
    expect(semAcento.length).toBe(comAcento.length)
    expect(semAcento.length).toBeGreaterThan(0)
  })
})
