import { describe, expect, it } from 'vitest'
import { quoteOfDay } from './daily'
import { tinyBook } from './test-fixtures'

describe('quoteOfDay', () => {
  it('é determinística para o mesmo dia', () => {
    const date = new Date(2026, 9, 24)
    const first = quoteOfDay(tinyBook, date)
    const second = quoteOfDay(tinyBook, date)
    expect(first).toEqual(second)
  })

  it('avança uma citação por dia', () => {
    const today = quoteOfDay(tinyBook, new Date(2026, 9, 24))
    const tomorrow = quoteOfDay(tinyBook, new Date(2026, 9, 25))
    expect(tomorrow.quote.id).not.toBe(today.quote.id)
  })

  it('volta ao início depois de percorrer o livro', () => {
    const start = new Date(2026, 0, 1)
    const later = new Date(2026, 0, 1 + tinyBook.total)
    expect(quoteOfDay(tinyBook, later)).toEqual(quoteOfDay(tinyBook, start))
  })

  it('devolve capítulo e citação válidos', () => {
    const result = quoteOfDay(tinyBook, new Date(2026, 9, 24))
    expect(result.chapter.id).toBeGreaterThanOrEqual(1)
    expect(result.quote.number).toBeGreaterThanOrEqual(1)
    expect(result.chapter.quotes).toContain(result.quote)
  })
})
