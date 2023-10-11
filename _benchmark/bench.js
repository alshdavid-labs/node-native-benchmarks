const { data } = require('./data')
const { Benchmark } = require('./lib')

const LIMIT = process.env.BENCH_LIMIT ? parseInt(process.env.BENCH_LIMIT) : null
const NAME = process.env.BENCH_NAME ? process.env.BENCH_NAME : null

let results = undefined
const b = new Benchmark()

const lib = require(`../${NAME}`)

const funcs = [
  lib.divide,
  lib.multiply,
  lib.add,
]

process.stdout.write(`${NAME}\n\n`)

for (const func of funcs) {
  process.stdout.write(`${func.name.padEnd(1 + Math.max(...(funcs.map(el => el.name.length))))} `)

  for (let i = 0; i < data.length; i++) {
    if (LIMIT !== null && b.count(NAME) >= LIMIT) break
    const [x, y] = data[i]
    const start = performance.now()
    const result = func(x, y)
    if (result === undefined) {
      throw new Error('yo')
    }
    const duration = performance.now() - start
    if (duration === 0) {
      i--
      continue
    }
    b.commit(NAME, duration)
    if (i !== 0 && (i / 300_000) % 1 === 0) {
      process.stdout.write('.')
    }
  }
  process.stdout.write('\n')
}

process.stdout.write('\n')

console.log(`Processing Results`)

results = {
  Name: NAME,
  'Raw (ms)': b.min(NAME).raw,
  'Min (ps)': b.min(NAME).picoseconds,
  'Low Quartile (ps)': b.quartile(NAME, 0.25).picoseconds,
  'High Quartile (ps)': b.quartile(NAME, 0.75).picoseconds,
  'p99 (ps)': b.quartile(NAME, 0.99).picoseconds,
  'Max (ps)': b.max(NAME).picoseconds,
  'Average (ps)': b.average(NAME).picoseconds,
  'Median (ps)': b.median(NAME).picoseconds,
  'Samples': b.count(NAME)
}
console.table(results)
console.log()
console.log(Object.keys(results).join(','))
console.log(Object.values(results).join(','))
