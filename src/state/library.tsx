import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_STATE,
  isSaved as isQuoteSaved,
  markChapterRead,
  parseReadingState,
  setLastRead as setLastReadInState,
  toggleSaved as toggleSavedInState,
  unmarkChapterRead,
  type ReadingState,
} from '@/lib/progress'

const STORAGE_KEY = 'citacoes:library:v1'

interface LibraryContextValue {
  state: ReadingState
  isSaved: (chapterId: number, quoteId: number) => boolean
  toggleSave: (chapterId: number, quoteId: number) => void
  markRead: (chapterId: number) => void
  unmarkRead: (chapterId: number) => void
  setLastRead: (chapterId: number, quoteId: number) => void
  resetProgress: () => void
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

function readInitialState(): ReadingState {
  try {
    return parseReadingState(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return DEFAULT_STATE
  }
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ReadingState>(readInitialState)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* armazenamento indisponível (modo privado) */
    }
  }, [state])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return
      setState(parseReadingState(event.newValue))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isSaved = useCallback(
    (chapterId: number, quoteId: number) =>
      isQuoteSaved(state, chapterId, quoteId),
    [state],
  )

  const toggleSave = useCallback((chapterId: number, quoteId: number) => {
    setState((current) => toggleSavedInState(current, chapterId, quoteId))
  }, [])

  const markRead = useCallback((chapterId: number) => {
    setState((current) => markChapterRead(current, chapterId))
  }, [])

  const unmarkRead = useCallback((chapterId: number) => {
    setState((current) => unmarkChapterRead(current, chapterId))
  }, [])

  const setLastRead = useCallback((chapterId: number, quoteId: number) => {
    setState((current) => {
      if (
        current.lastRead?.chapterId === chapterId &&
        current.lastRead.quoteId === quoteId
      ) {
        return current
      }
      return setLastReadInState(current, chapterId, quoteId)
    })
  }, [])

  const resetProgress = useCallback(() => {
    setState((current) => ({
      ...current,
      read: [],
      lastRead: null,
    }))
  }, [])

  const value = useMemo(
    () => ({
      state,
      isSaved,
      toggleSave,
      markRead,
      unmarkRead,
      setLastRead,
      resetProgress,
    }),
    [
      state,
      isSaved,
      toggleSave,
      markRead,
      unmarkRead,
      setLastRead,
      resetProgress,
    ],
  )

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibrary deve ser usado dentro de LibraryProvider')
  }
  return context
}
