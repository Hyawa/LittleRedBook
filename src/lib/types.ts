export type TextBlock =
  | { type: 'p'; text: string }
  | { type: 'ol' | 'ul'; items: string[] }

export interface Quote {
  id: number
  number: number
  blocks: TextBlock[]
  source: string
}

export interface Chapter {
  id: number
  numeral: string
  title: string
  quotes: Quote[]
}

export interface Book {
  title: string
  shortTitle: string
  subtitle: string
  edition: string
  notes: string
  source: string
  total: number
  chapters: Chapter[]
}
