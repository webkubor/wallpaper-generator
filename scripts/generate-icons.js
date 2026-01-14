import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const inputSvg = path.join(rootDir, 'public', 'logo.svg')
const outputDir = path.join(rootDir, 'public', 'icons')
const sizes = [192, 512]

const run = async () => {
  try {
    await fs.access(inputSvg)
    await fs.mkdir(outputDir, { recursive: true })

    await Promise.all(
      sizes.map((size) => {
        const outputFile = path.join(outputDir, `icon-${size}.png`)
        return sharp(inputSvg)
          .resize(size, size)
          .png({ quality: 92 })
          .toFile(outputFile)
      })
    )

    console.log('图标已生成:', sizes.map((size) => `icon-${size}.png`).join(', '))
  } catch (error) {
    console.error('图标生成失败，请检查 logo.svg 是否存在', error)
    process.exit(1)
  }
}

run()
