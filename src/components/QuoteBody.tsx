import type { Quote } from '@/lib/types'
import { RichText } from './RichText'
import { cn } from '@/lib/utils'

export function QuoteBody({
  quote,
  className,
}: {
  quote: Quote
  className?: string
}) {
  return (
    <div className={cn('reader-body space-y-4 text-foreground', className)}>
      {quote.blocks.map((block, index) => {
        if (block.type === 'p') {
          return (
            <p key={index}>
              <RichText text={block.text} />
            </p>
          )
        }

        const ListTag = block.type === 'ol' ? 'ol' : 'ul'
        return (
          <ListTag
            key={index}
            className={cn(
              'space-y-2.5 pl-6 marker:text-accent',
              block.type === 'ol' ? 'list-decimal' : 'list-disc',
            )}
          >
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className="pl-1">
                <RichText text={item} />
              </li>
            ))}
          </ListTag>
        )
      })}
    </div>
  )
}
