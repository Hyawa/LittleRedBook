import { book, getChapter } from './book'

export interface LastRead {
  chapterId: number
  quoteId: number
}

export interface ReadingState {
  saved: string[]
  read: number[]
  lastRead: LastRead | null
}

export const DEFAULT_STATE: ReadingState = {
  saved: [],
  read: [],
  lastRead: null,
}

export function quoteKey(chapterId: number, quoteId: number): string {
  return `${chapterId}:${quoteId}`
}

export function isSaved(
  state: ReadingState,
  chapterId: number,
  quoteId: number,
): boolean {
  return state.saved.includes(quoteKey(chapterId, quoteId))
}

export function toggleSaved(
  state: ReadingState,
  chapterId: number,
  quoteId: number,
): ReadingState {
  const key = quoteKey(chapterId, quoteId)
  return {
    ...state,
    saved: state.saved.includes(key)
      ? state.saved.filter((item) => item !== key)
      : [...state.saved, key],
  }
}

export function removeSaved(
  state: ReadingState,
  chapterId: number,
  quoteId: number,
): ReadingState {
  const key = quoteKey(chapterId, quoteId)
  if (!state.saved.includes(key)) return state
  return { ...state, saved: state.saved.filter((item) => item !== key) }
}

export function markChapterRead(
  state: ReadingState,
  chapterId: number,
): ReadingState {
  if (state.read.includes(chapterId)) return state
  return { ...state, read: [...state.read, chapterId] }
}

export function unmarkChapterRead(
  state: ReadingState,
  chapterId: number,
): ReadingState {
  if (!state.read.includes(chapterId)) return state
  return {
    ...state,
    read: state.read.filter((item) => item !== chapterId),
  }
}

export function readingPercent(read: number[], total: number): number {
  if (total <= 0) return 0
  return Math.round((read.length / total) * 100)
}

export function setLastRead(
  state: ReadingState,
  chapterId: number,
  quoteId: number,
): ReadingState {
  return { ...state, lastRead: { chapterId, quoteId } }
}

export function parseReadingState(raw: string | null): ReadingState {
  if (!raw) return DEFAULT_STATE

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return DEFAULT_STATE
  }

  if (!parsed || typeof parsed !== 'object') return DEFAULT_STATE
  const data = parsed as Record<string, unknown>
  const totalChapters = book.chapters.length

  const saved: string[] = []
  if (Array.isArray(data.saved)) {
    const seen = new Set<string>()
    for (const item of data.saved) {
      if (typeof item !== 'string') continue
      const match = /^([1-9]\d*):([1-9]\d*)$/.exec(item)
      if (!match) continue
      if (Number(match[1]) > totalChapters) continue
      if (seen.has(item)) continue
      seen.add(item)
      saved.push(item)
    }
  }

  const read: number[] = []
  if (Array.isArray(data.read)) {
    const seen = new Set<number>()
    for (const item of data.read) {
      if (typeof item !== 'number' || !Number.isInteger(item)) continue
      if (item < 1 || item > totalChapters) continue
      if (seen.has(item)) continue
      seen.add(item)
      read.push(item)
    }
  }

  let lastRead: LastRead | null = null
  const candidate = data.lastRead as Record<string, unknown> | undefined
  if (candidate && typeof candidate === 'object') {
    const chapterId = candidate.chapterId
    const quoteId = candidate.quoteId
    if (
      typeof chapterId === 'number' &&
      typeof quoteId === 'number' &&
      Number.isInteger(chapterId) &&
      Number.isInteger(quoteId) &&
      getChapter(chapterId)?.quotes.some((quote) => quote.id === quoteId)
    ) {
      lastRead = { chapterId, quoteId }
    }
  }

  return { saved, read, lastRead }
}
