
import { data } from './data/index.js'
import { Benchmark } from './benchmark.js'
import { existsSync, rmSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'
import * as addon_neon from "addon_neon"
import * as addon_napi from "addon_napi"
import * as addon_c from "addon_c"
import * as ffi_koffi from "ffi_koffi"
import * as javascript from "javascript"
import * as wasm from "wasm"

const benchmarks = {
  addon_c,
  addon_napi,
  addon_neon,
  ffi_koffi,
  javascript,
  wasm,
}

const RETRIES = 3
const LIMIT = process.env.BENCH_LIMIT ? parseInt(process.env.BENCH_LIMIT) : null

const results = []
const b = new Benchmark()

for (const [NAME, lib] of Object.entries(benchmarks)) {
  process.stdout.write(NAME.padEnd(1 + Math.max(...(Object.keys(benchmarks).map(el => el.length)))))

  const funcs = [
    lib.divide,
    lib.multiply,
    lib.add,
  ]

  for (const func of funcs) {
    for (let i = 0; i < RETRIES; i++) {
      b.start(NAME)
      for (let i = 0; i < data.length; i++) {
        const result = func(...data[i])
        if (result === undefined) {
          throw new Error('Invalid result')
        }
      }
      const duration = b.end(NAME)
      b.commit(NAME, duration)
      process.stdout.write('.')
    }
  }

  process.stdout.write('\n')
}

process.stdout.write('\n')

for (const NAME of Object.keys(benchmarks)) {
  console.log(`Processing Results ${NAME}`)
  results.push({
    Name: NAME,
    'Min': b.min(NAME).femtoseconds,
    // 'Low Quartile': b.quartile(NAME, 0.25).milliseconds,
    // 'High Quartile': b.quartile(NAME, 0.75).milliseconds,
    // 'p99': b.quartile(NAME, 0.99).milliseconds,
    'Average': b.average(NAME).milliseconds,
    'Median': b.median(NAME).milliseconds,
    'Total': b.total(NAME).milliseconds,
    'Samples': b.count(NAME)
  })
}

results.sort((a, b) => a.Total - b.Total)

process.stdout.write('\n')
console.table(results)
process.stdout.write('\n')

if (existsSync(join(process.cwd(), 'report.csv'))) {
  rmSync(join(process.cwd(), 'report.csv'))
}

appendFileSync(join(process.cwd(), 'report.csv'), Object.keys(results[0]).join(','), 'utf8')
appendFileSync(join(process.cwd(), 'report.csv'), '\n', 'utf8')

for (const result of results) {
  appendFileSync(join(process.cwd(), 'report.csv'), Object.values(result).join(','), 'utf8')
  appendFileSync(join(process.cwd(), 'report.csv'), '\n', 'utf8')
}
