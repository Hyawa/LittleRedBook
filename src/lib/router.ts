import { book } from './book'

export type Route =
  | { name: 'home' }
  | { name: 'chapters' }
  | { name: 'reader'; chapterId: number; quoteId?: number }
  | { name: 'search'; query: string }
  | { name: 'saved' }

const TOTAL_CHAPTERS = book.chapters.length

function positiveInteger(value: string | null): number | null {
  if (value === null) return null
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : null
}

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#/, '')
  const [pathPart, queryPart = ''] = clean.split('?')
  const parts = pathPart.split('/').filter(Boolean)
  const params = new URLSearchParams(queryPart)

  if (parts.length === 0) return { name: 'home' }

  if (parts[0] === 'secoes') {
    if (!parts[1]) return { name: 'chapters' }
    const chapterId = positiveInteger(parts[1])
    if (chapterId === null || chapterId > TOTAL_CHAPTERS) {
      return { name: 'chapters' }
    }
    const quoteId = positiveInteger(params.get('c'))
    return quoteId
      ? { name: 'reader', chapterId, quoteId }
      : { name: 'reader', chapterId }
  }

  if (parts[0] === 'buscar') {
    return { name: 'search', query: params.get('q') ?? '' }
  }

  if (parts[0] === 'salvos') return { name: 'saved' }

  return { name: 'home' }
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/'
    case 'chapters':
      return '#/secoes'
    case 'reader':
      return route.quoteId
        ? `#/secoes/${route.chapterId}?c=${route.quoteId}`
        : `#/secoes/${route.chapterId}`
    case 'search':
      return route.query
        ? `#/buscar?q=${encodeURIComponent(route.query)}`
        : '#/buscar'
    case 'saved':
      return '#/salvos'
  }
}
