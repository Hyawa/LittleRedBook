import { Fragment, type ReactNode } from 'react'

const TOKEN = /(_[^_\n]+_|\*\*[^*\n]+\*\*)/g

/** Interpreta a ênfase simples que veio do texto original. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean)

  return (
    <>
      {parts.map((part, index): ReactNode => {
        if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
          return (
            <em key={index} className="italic">
              {part.slice(1, -1)}
            </em>
          )
        }
        if (
          part.startsWith('**') &&
          part.endsWith('**') &&
          part.length > 4
        ) {
          return (
            <strong key={index} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <Fragment key={index}>{part}</Fragment>
      })}
    </>
  )
}
