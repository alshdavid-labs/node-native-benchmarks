import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const TOTAL = 1_000_000

const uniqueNumbers = new Set()

process.stdout.write('Generating cases ')

while (uniqueNumbers.size < (TOTAL * 2)) {
    const a = parseInt((Math.random()*10000000000).toFixed(), 10)
    if (a.toString().length !== 10) continue
    uniqueNumbers.add(a)
    if (uniqueNumbers.size !== 0 && (uniqueNumbers.size / 100_000) % 1 === 0) {
      process.stdout.write('.')
    }
}

process.stdout.write('\n')


const numbers = Array.from(uniqueNumbers)
const cases = []

for (let i = 0; i < TOTAL; i++) {
  cases.push([numbers[i], numbers[TOTAL + i]])
}

const output = JSON.stringify(cases, null, 2)
writeFileSync(join(__dirname, 'cases.json'), output, 'utf8')
