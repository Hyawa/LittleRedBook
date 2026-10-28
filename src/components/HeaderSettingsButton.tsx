import { SlidersHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip'

export function HeaderSettingsButton({
  onClick,
}: {
  onClick: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          aria-label="Ajustes de leitura"
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontal className="size-[1.15rem]" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Ajustes de leitura</TooltipContent>
    </Tooltip>
  )
}
