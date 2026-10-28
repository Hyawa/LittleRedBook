import type { Chapter, Quote } from './types'
import { quoteToPlainText } from './book'

export function quoteShareText(chapter: Chapter, quote: Quote): string {
  return [
    quoteToPlainText(quote),
    '',
    `— ${quote.source}`,
    `Citações do Presidente Mao Zedong · Seção ${chapter.numeral}`,
  ].join('\n')
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* tenta o método alternativo */
  }

  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(area)
    return copied
  } catch {
    return false
  }
}

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'error'

export async function shareQuote(
  chapter: Chapter,
  quote: Quote,
): Promise<ShareResult> {
  const text = quoteShareText(chapter, quote)

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Citações do Presidente Mao Zedong',
        text,
      })
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'cancelled'
      }
    }
  }

  return (await copyText(text)) ? 'copied' : 'error'
}
