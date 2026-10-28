import { useEffect, useState } from 'react'
import { useHashRoute } from '@/hooks/useHashRoute'
import { LibraryProvider } from '@/state/library'
import { SettingsProvider } from '@/state/settings'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { BottomNav } from '@/components/BottomNav'
import { SettingsSheet } from '@/components/SettingsSheet'
import { HomePage } from '@/pages/HomePage'
import { ChaptersPage } from '@/pages/ChaptersPage'
import { ReaderPage } from '@/pages/ReaderPage'
import { SearchPage } from '@/pages/SearchPage'
import { SavedPage } from '@/pages/SavedPage'

export default function App() {
  const { route, navigate, canGoBack } = useHashRoute()
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    if (route.name === 'reader' && route.quoteId) return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route])

  const openSettings = () => setSettingsOpen(true)
  const pageKey =
    route.name === 'reader'
      ? `reader-${route.chapterId}`
      : route.name

  return (
    <SettingsProvider>
      <TooltipProvider>
        <LibraryProvider>
          <div className="flex min-h-svh flex-col">
            <div key={pageKey} className="flex-1 animate-rise">
              {route.name === 'home' ? (
                <HomePage onOpenSettings={openSettings} />
              ) : null}

              {route.name === 'chapters' ? (
                <ChaptersPage onOpenSettings={openSettings} />
              ) : null}

              {route.name === 'reader' ? (
                <ReaderPage
                  chapterId={route.chapterId}
                  quoteId={route.quoteId}
                  canGoBack={canGoBack}
                  onBack={() => navigate({ name: 'chapters' })}
                  onOpenSettings={openSettings}
                />
              ) : null}

              {route.name === 'search' ? (
                <SearchPage
                  key={`search-${route.query}`}
                  initialQuery={route.query}
                  onOpenSettings={openSettings}
                />
              ) : null}

              {route.name === 'saved' ? (
                <SavedPage onOpenSettings={openSettings} />
              ) : null}
            </div>

            {route.name !== 'reader' ? <BottomNav route={route} /> : null}
          </div>

          <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
          <Toaster />
        </LibraryProvider>
      </TooltipProvider>
    </SettingsProvider>
  )
}
