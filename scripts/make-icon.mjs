// Genera build/icon.ico (multi-tamaño) y build/icon.png a partir de build/icon.svg.
// Uso: npm run icon
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const here = path.dirname(fileURLToPath(import.meta.url))
const buildDir = path.join(here, '..', 'build')
mkdirSync(buildDir, { recursive: true })

const svg = readFileSync(path.join(buildDir, 'icon.svg'))

// Tamaños que Windows usa dentro de un .ico
const sizes = [16, 24, 32, 48, 64, 128, 256]
const pngs = await Promise.all(
  sizes.map((s) => sharp(svg).resize(s, s).png().toBuffer()),
)

// PNG grande de respaldo (útil para otros usos)
const png512 = await sharp(svg).resize(512, 512).png().toBuffer()
writeFileSync(path.join(buildDir, 'icon.png'), png512)

const ico = await pngToIco(pngs)
writeFileSync(path.join(buildDir, 'icon.ico'), ico)

console.log('✓ build/icon.ico y build/icon.png generados')
