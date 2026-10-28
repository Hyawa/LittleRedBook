import { Bookmark, BookmarkCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useLibrary } from '@/state/library'
import { Button } from './ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip'
import { cn } from '@/lib/utils'

export function SaveQuoteButton({
  chapterId,
  quoteId,
  showLabel = false,
  className,
}: {
  chapterId: number
  quoteId: number
  showLabel?: boolean
  className?: string
}) {
  const { isSaved, toggleSave } = useLibrary()
  const saved = isSaved(chapterId, quoteId)
  const label = saved ? 'Remover dos salvos' : 'Salvar citação'

  const onClick = () => {
    toggleSave(chapterId, quoteId)
    if (saved) {
      toast('Citação removida dos salvos')
    } else {
      toast.success('Citação salva', {
        description: 'Você encontra tudo na aba Salvos.',
      })
    }
  }

  const button = (
    <Button
      variant="ghost"
      size={showLabel ? 'sm' : 'icon'}
      aria-pressed={saved}
      aria-label={label}
      onClick={onClick}
      className={cn(
        'gap-2 text-muted-foreground hover:text-foreground',
        showLabel && 'h-11 px-3',
        saved && 'text-primary hover:text-primary',
        className,
      )}
    >
      {saved ? (
        <BookmarkCheck className="size-[1.15rem] fill-primary/10" />
      ) : (
        <Bookmark className="size-[1.15rem]" />
      )}
      {showLabel ? <span>{saved ? 'Salvo' : 'Salvar'}</span> : null}
    </Button>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
