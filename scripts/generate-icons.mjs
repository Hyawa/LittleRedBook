/**
 * Gera os ícones PWA a partir de um SVG (sharp).
 * Uso: node scripts/generate-icons.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const iconsDir = path.join(root, 'public', 'icons')
await mkdir(iconsDir, { recursive: true })

const STAR =
  'M12 2.4l2.9 6.03 6.6.84-4.85 4.55 1.23 6.54L12 17.18 6.12 20.36l1.23-6.54L2.5 9.27l6.6-.84L12 2.4z'

function coverSvg({ padding = 28, starScale = 11.67, radius = 36 } = {}) {
  const starSize = 24 * starScale
  const offset = (512 - starSize) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a81e26"/>
      <stop offset="0.5" stop-color="#8a1119"/>
      <stop offset="1" stop-color="#5b090e"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f8e8bb"/>
      <stop offset="1" stop-color="#c49a3d"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect x="${padding}" y="${padding}" width="${512 - padding * 2}" height="${512 - padding * 2}" rx="${radius}" fill="none" stroke="#e6ce97" stroke-opacity="0.55" stroke-width="6"/>
  <rect x="${padding + 20}" y="${padding + 20}" width="${512 - (padding + 20) * 2}" height="${512 - (padding + 20) * 2}" rx="${Math.max(8, radius - 10)}" fill="none" stroke="#e6ce97" stroke-opacity="0.22" stroke-width="3"/>
  <g transform="translate(${offset} ${offset}) scale(${starScale})">
    <path d="${STAR}" fill="url(#gold)"/>
  </g>
</svg>`
}

const base = coverSvg()
const maskable = coverSvg({ padding: 64, starScale: 9.4, radius: 8 })

const targets = [
  { svg: base, file: 'icon-192.png', size: 192 },
  { svg: base, file: 'icon-512.png', size: 512 },
  { svg: base, file: 'icon-96.png', size: 96 },
  { svg: maskable, file: 'icon-maskable-512.png', size: 512 },
]

for (const { svg, file, size } of targets) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(iconsDir, file))
  console.log(`✓ public/icons/${file} (${size}×${size})`)
}

await sharp(Buffer.from(base))
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, 'public', 'apple-touch-icon.png'))
console.log('✓ public/apple-touch-icon.png (180×180)')

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a81e26"/>
      <stop offset="1" stop-color="#6d0b12"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f8e8bb"/>
      <stop offset="1" stop-color="#c49a3d"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#bg)"/>
  <rect x="4.5" y="4.5" width="55" height="55" rx="11" fill="none" stroke="#e6ce97" stroke-opacity="0.55" stroke-width="1.5"/>
  <g transform="translate(11 11) scale(1.75)">
    <path d="${STAR}" fill="url(#gold)"/>
  </g>
</svg>`
await writeFile(path.join(root, 'public', 'favicon.svg'), favicon, 'utf8')
console.log('✓ public/favicon.svg')
