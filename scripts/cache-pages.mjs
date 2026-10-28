import { mkdir, writeFile, access } from 'node:fs/promises'

const BASE = 'https://www.marxists.org/portugues/mao/1966/citas'
const dir = new URL('./.cache/', import.meta.url)
await mkdir(dir, { recursive: true })
const files = ['index.htm', ...Array.from({ length: 33 }, (_, i) => `cap${String(i + 1).padStart(2, '0')}.htm`)]
for (const file of files) {
  const target = new URL(file, dir)
  try {
    await access(target)
    console.log('cached', file)
    continue
  } catch {}
  const res = await fetch(`${BASE}/${file}`)
  if (!res.ok) throw new Error(`${file}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(target, buf)
  console.log('saved ', file, buf.length)
}
