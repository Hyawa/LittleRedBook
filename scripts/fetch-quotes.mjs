/**
 * Gera src/data/quotes.json a partir das páginas de
 * "Citações do Presidente Mao Zedong" (marxists.org).
 *
 * As páginas são guardadas em scripts/.cache para permitir
 * regenerar o conteúdo sem depender da rede.
 *
 * Uso: node scripts/fetch-quotes.mjs [--refresh]
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const BASE = 'https://www.marxists.org/portugues/mao/1966/citas'
const REFRESH = process.argv.includes('--refresh')
const CACHE = new URL('./.cache/', import.meta.url)
const ROMAN = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI',
  'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI',
  'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
  'XXXI', 'XXXII', 'XXXIII',
]

const ENTITIES = {
  nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  mdash: '—', ndash: '–', hellip: '…', laquo: '«', raquo: '»',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
}

const decodeEntities = (text) =>
  text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code) => {
    if (code.startsWith('#x') || code.startsWith('#X')) {
      return String.fromCodePoint(Number.parseInt(code.slice(2), 16))
    }
    if (code.startsWith('#')) {
      return String.fromCodePoint(Number(code.slice(1)))
    }
    return ENTITIES[code.toLowerCase()] ?? entity
  })

/** Converte HTML inline para texto + marcação mínima de ênfase. */
const inline = (html) =>
  decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<i>([\s\S]*?)<\/i>/gi, '_$1_')
      .replace(/<em>([\s\S]*?)<\/em>/gi, '_$1_')
      .replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**')
      .replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/_{3,}/g, '_')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim()

function extract(html, tag, className) {
  const attr = className
    ? `[^>]*class=["'][^"']*${className}[^"']*["'][^>]*`
    : '[^>]*'
  return html.match(new RegExp(`<${tag}${attr}>([\\s\\S]*?)</${tag}>`, 'i'))?.[1] ?? null
}

/** Divide o corpo de uma citação em parágrafos e listas. */
function parseBlocks(body) {
  const blocks = []
  const pattern =
    /<(ol|ul)\b[^>]*>([\s\S]*?)<\/\1>|<p\b[^>]*>([\s\S]*?)<\/p>|<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi
  for (const match of body.matchAll(pattern)) {
    if (match[1]) {
      const items = [...match[2].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((item) => inline(item[1]))
        .filter(Boolean)
      if (items.length) {
        blocks.push({ type: match[1].toLowerCase() === 'ol' ? 'ol' : 'ul', items })
      }
      continue
    }
    const text = inline(match[3] ?? match[4] ?? '')
    if (text) blocks.push({ type: 'p', text })
  }
  return blocks
}

function parseChapter(html, index) {
  const title = inline((extract(html, 'h4') ?? '').replace(/^[IVXL]+\.\s*/, ''))
  const main = extract(html, 'main') ?? ''

  const quotes = []
  const sources = [...main.matchAll(/<p\b[^>]*class=["'][^"']*\bcita\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi)]
  let cursor = 0

  for (const source of sources) {
    const body = main.slice(cursor, source.index)
    cursor = source.index + source[0].length
    const blocks = parseBlocks(body)
    if (!blocks.length) continue
    quotes.push({
      id: quotes.length + 1,
      number: quotes.length + 1,
      blocks,
      source: inline(source[1]),
    })
  }

  const rest = parseBlocks(main.slice(cursor))
  if (rest.length) {
    // Conteúdo final sem atribuição: pertence à última citação.
    const last = quotes.at(-1)
    if (last) last.blocks.push(...rest)
    else
      quotes.push({
        id: 1,
        number: 1,
        blocks: rest,
        source: '',
      })
  }

  return {
    id: index + 1,
    numeral: ROMAN[index],
    title: index === 1 ? 'As classes e a luta de classes' : title,
    quotes,
  }
}

async function load(file) {
  const cacheFile = new URL(file, CACHE)
  if (!REFRESH) {
    try {
      return await readFile(cacheFile, 'utf8')
    } catch {
      /* baixa abaixo */
    }
  }
  const res = await fetch(`${BASE}/${file}`)
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`)
  const html = await res.text()
  await mkdir(CACHE, { recursive: true })
  await writeFile(cacheFile, html, 'utf8')
  return html
}

const chapters = []
for (let index = 0; index < ROMAN.length; index += 1) {
  const file = `cap${String(index + 1).padStart(2, '0')}.htm`
  const chapter = parseChapter(await load(file), index)
  if (!chapter.title || chapter.quotes.length === 0) {
    throw new Error(`${file}: conteúdo não reconhecido`)
  }
  const blocks = chapter.quotes.reduce((sum, quote) => sum + quote.blocks.length, 0)
  console.log(
    `${file} · ${chapter.numeral}. ${chapter.title} · ${chapter.quotes.length} citações · ${blocks} blocos`,
  )
  chapters.push(chapter)
}

const total = chapters.reduce((sum, chapter) => sum + chapter.quotes.length, 0)
const book = {
  title: 'Citações do Presidente Mao Zedong',
  shortTitle: 'Citações',
  subtitle: 'O Livro Vermelho',
  edition: 'Pequim: Edições em Línguas Estrangeiras, 1972',
  notes:
    'Tradução segundo a edição de 1972, com correções para as normas ortográficas e de romanização vigentes em 2024.',
  source: 'Marxists Internet Archive — marxists.org/portugues/mao/1966/citas',
  total,
  chapters,
}

const output = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'data',
  'quotes.json',
)
await mkdir(path.dirname(output), { recursive: true })
await writeFile(output, JSON.stringify(book), 'utf8')
console.log(`\n✓ ${chapters.length} seções · ${total} citações → ${output}`)
