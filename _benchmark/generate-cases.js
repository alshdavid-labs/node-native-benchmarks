const TOTAL = process.env.CASES ? parseInt(process.env.CASES, 10) : 5_000_000

const uniqueNumbers = new Set()

process.stdout.write(`Generating cases (${TOTAL}) `)

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
export const cases = []

for (let i = 0; i < TOTAL; i++) {
  cases.push([numbers[i], numbers[TOTAL + i]])
}
