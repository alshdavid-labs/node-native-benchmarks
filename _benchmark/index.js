
const { data } = require('./data')
const { Benchmark } = require('./lib')
const fs = require('fs')
const path = require('path')

const benchmarks = [
  "addon_c",
  "addon_napi",
  "addon_neon",
  "ffi_koffi",
  "ffi_napi",
  "javascript",
  "wasm",
]

const LIMIT = process.env.BENCH_LIMIT ? parseInt(process.env.BENCH_LIMIT) : null

const results = []
const b = new Benchmark()

for (const NAME of benchmarks) {
  process.stdout.write(NAME.padEnd(1 + Math.max(...(benchmarks.map(el => el.length)))))

  const lib = require(`../${NAME}`)

  const funcs = [
    lib.divide,
    lib.multiply,
    lib.add,
  ]

  for (const func of funcs) {
    for (let i = 0; i < data.length; i++) {
      if (LIMIT !== null && b.count(NAME) >= LIMIT) break
      const [x, y] = data[i]
      b.start(NAME)
      const result = func(x, y)
      if (result === undefined) {
        throw new Error('yo')
      }
      const duration = b.end(NAME)
      if (duration === 0) {
        i--
        continue
      }
      b.commit(NAME, duration)
      if (i !== 0 && (i / 100_000) % 1 === 0) {
        process.stdout.write('.')
      }
    }
  }

  process.stdout.write('\n')
}

process.stdout.write('\n')

for (const NAME of benchmarks) {
  console.log(`Processing Results ${NAME}`)
  results.push({
    Name: NAME,
    'Min (fs)': b.min(NAME).femtoseconds,
    'Low Quartile (fs)': b.quartile(NAME, 0.25).femtoseconds,
    'High Quartile (fs)': b.quartile(NAME, 0.75).femtoseconds,
    'p99 (fs)': b.quartile(NAME, 0.99).femtoseconds,
    // 'Max (fs)': b.max(NAME).femtoseconds,          // not useful
    // 'Average (fs)': b.average(NAME).femtoseconds,  // not useful
    'Median (fs)': b.median(NAME).femtoseconds,
    // 'Samples': b.count(NAME)                       // not useful
  })
}

process.stdout.write('\n')
console.table(results)
process.stdout.write('\n')

if (fs.existsSync(path.join(process.cwd(), 'report.csv'))) {
  fs.rmSync(path.join(process.cwd(), 'report.csv'))
}

fs.appendFileSync(path.join(process.cwd(), 'report.csv'), Object.keys(results[0]).join(','), 'utf8')
fs.appendFileSync(path.join(process.cwd(), 'report.csv'), '\n', 'utf8')

for (const result of results) {
  fs.appendFileSync(path.join(process.cwd(), 'report.csv'), Object.values(result).join(','), 'utf8')
  fs.appendFileSync(path.join(process.cwd(), 'report.csv'), '\n', 'utf8')
}
