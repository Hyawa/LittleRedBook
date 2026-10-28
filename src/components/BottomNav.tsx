import { BookOpen, Bookmark, Home, Search } from 'lucide-react'
import type { Route } from '@/lib/router'
import { cn } from '@/lib/utils'

const ITEMS = [
  { name: 'home', label: 'Hoje', href: '#/', icon: Home },
  { name: 'chapters', label: 'Seções', href: '#/secoes', icon: BookOpen },
  { name: 'search', label: 'Buscar', href: '#/buscar', icon: Search },
  { name: 'saved', label: 'Salvos', href: '#/salvos', icon: Bookmark },
] as const

function activeTab(route: Route) {
  if (route.name === 'reader') return 'chapters'
  return route.name
}

export function BottomNav({ route }: { route: Route }) {
  const active = activeTab(route)

  return (
    <nav
      aria-label="Navegação principal"
      className="glass-bar fixed inset-x-0 bottom-0 z-40 border-t border-border/60 pb-[env(safe-area-inset-bottom)] md:inset-x-auto md:bottom-5 md:left-1/2 md:w-auto md:-translate-x-1/2 md:rounded-full md:border md:border-border/70 md:px-2 md:pb-0 md:shadow-[0_20px_50px_-24px_rgba(38,26,21,.55)]"
    >
      <div className="mx-auto grid w-full max-w-md grid-cols-4 md:flex md:w-auto md:max-w-none md:gap-0.5">
        {ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = active === item.name
          return (
            <a
              key={item.name}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group relative flex min-h-14 flex-col items-center justify-center gap-1 px-3 py-2 text-[0.58rem] font-semibold tracking-[0.12em] uppercase transition-colors md:min-h-12 md:flex-row md:gap-2 md:rounded-full md:px-4 md:py-2 md:text-[0.62rem]',
                isActive
                  ? 'text-primary md:bg-secondary/80'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {isActive ? (
                <span
                  className="absolute top-0 h-[2px] w-7 rounded-full bg-primary md:hidden"
                  aria-hidden="true"
                />
              ) : null}
              <Icon
                className={cn(
                  'size-5 transition-transform duration-200 group-active:scale-90 md:size-[1.05rem]',
                  isActive && 'stroke-[2.2]',
                )}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
