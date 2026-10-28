import { describe, expect, it } from 'vitest'
import { searchBook } from './search'
import { tinyBook } from './test-fixtures'

describe('searchBook', () => {
  it('ignora acentos e maiúsculas', () => {
    const hits = searchBook(tinyBook, 'EXERCITO')
    expect(hits).toHaveLength(1)
    expect(hits[0].quote.id).toBe(1)
    expect(hits[0].chapter.id).toBe(1)
  })

  it('exige todos os termos da busca', () => {
    const hits = searchBook(tinyBook, 'tigres papel')
    expect(hits).toHaveLength(1)
    expect(hits[0].quote.id).toBe(1)
    expect(hits[0].chapter.id).toBe(2)

    expect(searchBook(tinyBook, 'tigres guerra')).toHaveLength(0)
  })

  it('busca também na atribuição da citação', () => {
    const hits = searchBook(tinyBook, 'obras escolhidas')
    expect(hits).toHaveLength(1)
    expect(hits[0].quote.id).toBe(1)
  })

  it('ignora buscas vazias', () => {
    expect(searchBook(tinyBook, '   ')).toEqual([])
    expect(searchBook(tinyBook, '')).toEqual([])
  })

  it('devolve um trecho curto em vez do texto inteiro', () => {
    const longText = `${'palavra '.repeat(80)}revolução ${'fim '.repeat(80)}`
    const book = {
      ...tinyBook,
      chapters: [
        {
          ...tinyBook.chapters[0],
          quotes: [
            {
              id: 1,
              number: 1,
              blocks: [{ type: 'p' as const, text: longText }],
              source: 'Fonte',
            },
          ],
        },
      ],
    }

    const [hit] = searchBook(book, 'revolução')
    expect(hit.snippet.length).toBeLessThan(320)
    expect(hit.snippet).toContain('revolução')
    expect(hit.snippet.startsWith('…')).toBe(true)
    expect(hit.snippet.endsWith('…')).toBe(true)
  })

  it('marca os termos encontrados no trecho', () => {
    const [hit] = searchBook(tinyBook, 'exercito')
    expect(hit.terms).toContain('exercito')
    expect(hit.snippet.toLowerCase()).toContain('exército')
  })

  it('ordená resultados que casam no texto antes dos que casam só na fonte', () => {
    const hits = searchBook(tinyBook, 'guerra')
    expect(hits[0].quote.id).toBe(2)
    expect(hits[0].chapter.id).toBe(2)
  })
})
