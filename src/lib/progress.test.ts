import { describe, expect, it } from 'vitest'
import {
  DEFAULT_STATE,
  isSaved,
  markChapterRead,
  parseReadingState,
  quoteKey,
  readingPercent,
  setLastRead,
  toggleSaved,
  unmarkChapterRead,
} from './progress'

describe('salvos', () => {
  it('adiciona e remove uma citação sem mutar o estado', () => {
    const original = parseReadingState(null)
    const added = toggleSaved(original, 4, 7)
    expect(original.saved).toEqual([])
    expect(added.saved).toEqual(['4:7'])
    expect(isSaved(added, 4, 7)).toBe(true)
    expect(isSaved(added, 4, 8)).toBe(false)

    const removed = toggleSaved(added, 4, 7)
    expect(removed.saved).toEqual([])
    expect(isSaved(removed, 4, 7)).toBe(false)
  })

  it('não duplica a mesma citação', () => {
    const state = toggleSaved(toggleSaved(DEFAULT_STATE, 1, 1), 1, 1)
    expect(state.saved).toEqual([])
  })

  it('usa a chave capítulo:citação', () => {
    expect(quoteKey(12, 3)).toBe('12:3')
  })
})

describe('progresso de leitura', () => {
  it('marca e desmarca capítulos de forma idempotente', () => {
    const once = markChapterRead(DEFAULT_STATE, 3)
    const twice = markChapterRead(once, 3)
    expect(once.read).toEqual([3])
    expect(twice.read).toEqual([3])

    expect(unmarkChapterRead(once, 3).read).toEqual([])
  })

  it('calcula a percentagem arredondada', () => {
    expect(readingPercent([], 33)).toBe(0)
    expect(readingPercent([1], 3)).toBe(33)
    expect(readingPercent([1, 2, 3], 3)).toBe(100)
    expect(readingPercent([1], 0)).toBe(0)
  })

  it('guarda a última leitura', () => {
    const state = setLastRead(DEFAULT_STATE, 17, 3)
    expect(state.lastRead).toEqual({ chapterId: 17, quoteId: 3 })
    expect('at' in state.lastRead!).toBe(false)
  })
})

describe('parseReadingState', () => {
  it('recupera estado inválido com segurança', () => {
    expect(parseReadingState('não é json')).toEqual(DEFAULT_STATE)
    expect(parseReadingState('null')).toEqual(DEFAULT_STATE)
    expect(parseReadingState('{"saved":"x"}')).toEqual(DEFAULT_STATE)
  })

  it('remove valores inválidos e duplicados', () => {
    const state = parseReadingState(
      JSON.stringify({
        saved: ['1:2', '1:2', 'x', '0:1', '33:427'],
        read: [1, 1, 999, -2, 2.5],
        lastRead: { chapterId: 5, quoteId: 2 },
      }),
    )
    expect(state.saved).toEqual(['1:2', '33:427'])
    expect(state.read).toEqual([1])
    expect(state.lastRead).toEqual({ chapterId: 5, quoteId: 2 })
  })
})
