import type { Book, Chapter } from './types'

export function makeQuote(
  id: number,
  text: string,
  source = 'Fonte de teste (1950)',
): Chapter['quotes'][number] {
  return {
    id,
    number: id,
    blocks: [{ type: 'p', text }],
    source,
  }
}

export function makeChapter(
  id: number,
  title: string,
  quotes: Chapter['quotes'],
): Chapter {
  return {
    id,
    numeral: String(id),
    title,
    quotes,
  }
}

export function makeBook(chapters: Chapter[]): Book {
  return {
    title: 'Livro de teste',
    shortTitle: 'Teste',
    subtitle: 'Subtítulo',
    edition: 'Edição de teste',
    notes: '',
    source: 'Fonte',
    total: chapters.reduce((sum, chapter) => sum + chapter.quotes.length, 0),
    chapters,
  }
}

export const tinyBook = makeBook([
  makeChapter(1, 'O partido', [
    makeQuote(
      1,
      'O exército popular deve servir ao povo com disciplina.',
      'Sobre o exército (1945), _Obras Escolhidas_',
    ),
    makeQuote(2, 'Unir o povo e apoiar as massas.', 'Ibidem'),
  ]),
  makeChapter(2, 'Tigres de papel', [
    makeQuote(
      1,
      'Todos os reacionários são tigres de papel.',
      'Entrevista (1946)',
    ),
    makeQuote(
      2,
      'A guerra popular mobiliza milhões de pessoas.',
      'Sobre a guerra (1938)',
    ),
  ]),
])
