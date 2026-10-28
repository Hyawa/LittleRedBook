import { Fragment } from 'react'
import { highlightRanges } from '@/lib/search'

export function HighlightedText({
  text,
  terms,
}: {
  text: string
  terms: string[]
}) {
  const ranges = highlightRanges(text, terms)
  if (ranges.length === 0) return <>{text}</>

  let cursor = 0
  const parts = []

  ranges.forEach(([start, end], index) => {
    if (start > cursor) {
      parts.push(
        <Fragment key={`text-${index}`}>{text.slice(cursor, start)}</Fragment>,
      )
    }
    parts.push(
      <mark
        key={`mark-${index}`}
        className="rounded-[0.2em] bg-gold/35 px-[0.08em] text-foreground"
      >
        {text.slice(start, end)}
      </mark>,
    )
    cursor = end
  })

  if (cursor < text.length) {
    parts.push(<Fragment key="tail">{text.slice(cursor)}</Fragment>)
  }

  return <>{parts}</>
}
