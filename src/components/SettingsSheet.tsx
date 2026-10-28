import { useEffect, useState } from 'react'
import {
  Check,
  Download,
  ExternalLink,
  RotateCcw,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { toast } from 'sonner'
import { book } from '@/lib/book'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useLibrary } from '@/state/library'
import { useSettings, type ReadingTheme } from '@/state/settings'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Slider } from './ui/slider'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet'
import { cn } from '@/lib/utils'

const SOURCE_URL =
  'https://www.marxists.org/portugues/mao/1966/citas/index.htm'

const THEMES: Array<{
  id: ReadingTheme
  label: string
  background: string
  foreground: string
  border: string
}> = [
  {
    id: 'paper',
    label: 'Papel',
    background: '#f7f0e2',
    foreground: '#971b22',
    border: '#e0d0b8',
  },
  {
    id: 'light',
    label: 'Claro',
    background: '#fdfaf4',
    foreground: '#971b22',
    border: '#e7dbc9',
  },
  {
    id: 'dark',
    label: 'Escuro',
    background: '#16110f',
    foreground: '#d9b45b',
    border: '#382c25',
  },
]

export function SettingsSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { settings, setTheme, setFontSize, increaseFont, decreaseFont } =
    useSettings()
  const { resetProgress } = useLibrary()
  const { canInstall, installed, install } = useInstallPrompt()
  const online = useOnlineStatus()
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    if (!confirmReset) return
    const timeout = window.setTimeout(() => setConfirmReset(false), 4000)
    return () => window.clearTimeout(timeout)
  }, [confirmReset])

  const handleOpenChange = (next: boolean) => {
    if (!next) setConfirmReset(false)
    onOpenChange(next)
  }

  const onReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    resetProgress()
    setConfirmReset(false)
    toast.success('Progresso reiniciado', {
      description: 'As citações salvas foram mantidas.',
    })
  }

  const onInstall = async () => {
    const accepted = await install()
    if (accepted) toast.success('Aplicativo instalado')
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="overflow-y-auto overscroll-contain"
        aria-describedby="settings-description"
      >
        <SheetHeader className="pb-1">
          <SheetTitle>Ajustes de leitura</SheetTitle>
          <SheetDescription id="settings-description">
            Escolha o conforto visual e conheça esta edição.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-7 px-5 pb-6">
          <section aria-labelledby="tema-label">
            <h3
              id="tema-label"
              className="label-caps text-[0.6rem] text-muted-foreground"
            >
              Tema
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {THEMES.map((theme) => {
                const active = settings.theme === theme.id
                return (
                  <button
                    key={theme.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTheme(theme.id)}
                    className={cn(
                      'rounded-2xl border p-2 text-left transition-[border-color,background-color,box-shadow] duration-200',
                      active
                        ? 'border-primary/60 bg-primary/[0.045] shadow-[inset_0_0_0_1px_rgba(151,27,34,.12)]'
                        : 'border-border hover:border-gold/40',
                    )}
                  >
                    <span
                      className="flex h-14 items-center justify-center rounded-xl border"
                      style={{
                        background: theme.background,
                        borderColor: theme.border,
                      }}
                    >
                      <span
                        className="font-display text-2xl font-semibold"
                        style={{ color: theme.foreground }}
                      >
                        Aa
                      </span>
                    </span>
                    <span className="mt-2 flex items-center justify-between px-0.5 text-[0.72rem] font-semibold">
                      {theme.label}
                      {active ? (
                        <Check
                          className="size-3.5 text-primary"
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section aria-labelledby="fonte-label">
            <div className="flex items-baseline justify-between">
              <h3
                id="fonte-label"
                className="label-caps text-[0.6rem] text-muted-foreground"
              >
                Tamanho do texto
              </h3>
              <span className="font-label text-[0.58rem] text-muted-foreground">
                {settings.fontSize} px
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={decreaseFont}
                disabled={settings.fontSize <= 16}
                aria-label="Diminuir tamanho do texto"
                className="shrink-0 rounded-full"
              >
                <span className="font-display text-base">A</span>
              </Button>
              <Slider
                min={16}
                max={26}
                step={1}
                value={[settings.fontSize]}
                onValueChange={([value]) => setFontSize(value)}
                aria-label="Tamanho do texto em píxeis"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon-sm"
                onClick={increaseFont}
                disabled={settings.fontSize >= 26}
                aria-label="Aumentar tamanho do texto"
                className="shrink-0 rounded-full"
              >
                <span className="font-display text-xl">A</span>
              </Button>
            </div>

            <div className="mt-4 rounded-2xl border border-border/70 bg-paper-deep/60 px-4 py-3.5">
              <p className="reader-body text-foreground/90">
                Ajuste o tamanho até que a leitura fique confortável.
              </p>
            </div>
          </section>

          <Separator />

          <section aria-labelledby="sobre-label" className="space-y-3">
            <h3
              id="sobre-label"
              className="label-caps text-[0.6rem] text-muted-foreground"
            >
              Sobre esta edição
            </h3>
            <div>
              <p className="font-display text-lg leading-tight font-semibold">
                {book.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {book.edition}
              </p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {book.notes}
            </p>
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-primary underline-offset-4 hover:underline"
            >
              Marxists Internet Archive
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>

            <div className="rounded-2xl border border-border/70 bg-secondary/30 p-3.5">
              <div className="flex items-center gap-2">
                {online ? (
                  <Wifi className="size-4 text-accent" aria-hidden="true" />
                ) : (
                  <WifiOff className="size-4 text-accent" aria-hidden="true" />
                )}
                <p className="text-[0.8rem] font-semibold">
                  {online ? 'Conteúdo disponível offline' : 'Você está offline'}
                </p>
              </div>
              <p className="mt-1 text-[0.7rem] leading-relaxed text-muted-foreground">
                {online
                  ? 'O texto, a busca e os salvos ficam neste dispositivo. Depois da primeira visita, o app abre sem internet.'
                  : 'Tudo continua funcionando: o texto completo e a busca estão guardados no dispositivo.'}
              </p>
            </div>

            {canInstall ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={onInstall}
              >
                <Download aria-hidden="true" />
                Instalar aplicativo
              </Button>
            ) : installed ? (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check className="size-3.5 text-primary" aria-hidden="true" />
                Aplicativo instalado neste dispositivo.
              </p>
            ) : (
              <p className="text-[0.7rem] leading-relaxed text-muted-foreground">
                Para instalar, abra o menu do navegador e escolha{' '}
                <span className="font-semibold">“Adicionar à tela inicial”</span>.
              </p>
            )}
          </section>

          <Separator />

          <section aria-labelledby="progresso-label" className="space-y-2">
            <h3
              id="progresso-label"
              className="label-caps text-[0.6rem] text-muted-foreground"
            >
              Progresso
            </h3>
            <Button
              variant="outline"
              onClick={onReset}
              className={cn(
                'w-full',
                confirmReset &&
                  'border-destructive/50 text-destructive hover:bg-destructive/5 hover:text-destructive',
              )}
            >
              <RotateCcw aria-hidden="true" />
              {confirmReset ? 'Tocar de novo para confirmar' : 'Reiniciar progresso'}
            </Button>
            <p className="text-[0.68rem] leading-relaxed text-muted-foreground">
              Apaga as seções concluídas e a última leitura. As citações salvas
              permanecem.
            </p>
          </section>

          <p className="pb-1 text-center font-label text-[0.5rem] tracking-[0.18em] text-muted-foreground/60 uppercase">
            Citações · edição de 1972 · leitura offline
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
