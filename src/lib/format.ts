const longDate = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const shortDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
})

export function formatLongDate(date: Date = new Date()): string {
  const text = longDate.format(date)
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatShortDate(date: Date = new Date()): string {
  return shortDate.format(date).toUpperCase()
}

export function citationLabel(count: number): string {
  return `${count} ${count === 1 ? 'citação' : 'citações'}`
}

export function sectionLabel(count: number): string {
  return `${count} ${count === 1 ? 'seção' : 'seções'}`
}

export function excerpt(text: string, max = 320): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const space = cut.lastIndexOf(' ')
  return `${cut.slice(0, space > max * 0.6 ? space : max).trimEnd()}…`
}

export function romanLabel(numeral: string): string {
  return `Seção ${numeral}`
}
