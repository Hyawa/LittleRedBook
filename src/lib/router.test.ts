import { describe, expect, it } from 'vitest'
import { parseHash, routeToHash } from './router'

describe('parseHash', () => {
  it('reconhece a página inicial', () => {
    expect(parseHash('')).toEqual({ name: 'home' })
    expect(parseHash('#/')).toEqual({ name: 'home' })
    expect(parseHash('#/desconhecido')).toEqual({ name: 'home' })
  })

  it('reconhece as seções', () => {
    expect(parseHash('#/secoes')).toEqual({ name: 'chapters' })
  })

  it('reconhece uma seção e uma citação', () => {
    expect(parseHash('#/secoes/17')).toEqual({
      name: 'reader',
      chapterId: 17,
    })
    expect(parseHash('#/secoes/17?c=3')).toEqual({
      name: 'reader',
      chapterId: 17,
      quoteId: 3,
    })
  })

  it('rejeita seções inválidas', () => {
    expect(parseHash('#/secoes/0')).toEqual({ name: 'chapters' })
    expect(parseHash('#/secoes/abc')).toEqual({ name: 'chapters' })
    expect(parseHash('#/secoes/999')).toEqual({ name: 'chapters' })
  })

  it('lê e descodifica a busca', () => {
    expect(parseHash('#/buscar?q=classes%20sociais')).toEqual({
      name: 'search',
      query: 'classes sociais',
    })
    expect(parseHash('#/buscar')).toEqual({ name: 'search', query: '' })
  })

  it('reconhece os salvos', () => {
    expect(parseHash('#/salvos')).toEqual({ name: 'saved' })
  })
})

describe('routeToHash', () => {
  it('faz round-trip das rotas', () => {
    const routes = [
      { name: 'home' as const },
      { name: 'chapters' as const },
      { name: 'reader' as const, chapterId: 17, quoteId: 3 },
      { name: 'reader' as const, chapterId: 2 },
      { name: 'search' as const, query: 'povo & partido' },
      { name: 'saved' as const },
    ]
    for (const route of routes) {
      expect(parseHash(routeToHash(route))).toEqual(route)
    }
  })
})
