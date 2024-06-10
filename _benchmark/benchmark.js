export class Result {
  raw
  

  constructor(timeMs) {
    this.raw = timeMs
  }

  get femtoseconds() {
    return parseInt(this.raw * 1000 * 1000 * 1000 * 1000, 10)
  }

  get picoseconds() {
    return parseInt(this.raw * 1000 * 1000 * 1000, 10)
  }

  get nanoseconds() {
    return parseInt(this.raw * 1000 * 1000, 10)
  }

  get microseconds() {
    return parseInt(this.raw * 1000, 10)
  }

  get milliseconds() {
    return parseInt(this.raw, 10)
  }

  get seconds() {
    return parseFloat((this.raw / 1000).toFixed(2))
  }

}

export class Benchmark {
  ids = new Map()

  getId(id) {
    return this.ids.get(id) || []
  }

  start(id) {
    performance.mark(id)    
  }
  
  end(id) {
    const result = performance.measure(id, id).duration
    performance.clearMarks(id)
    performance.clearMeasures(id)
    return result
  }

  commit(id, result) {
    const lookup = this.getId(id)
    lookup.push(result)
    this.ids.set(id, lookup)
  }

  average(id) {
    const lookup = this.getId(id)
    const result =  lookup.reduce((a, b) => a + b, 0) / lookup.length
    return new Result(result)
  }

  min(id) {
    const lookup = this.getId(id)
    if (!lookup || lookup.length === 0) {
      return undefined
    }
    let m = lookup[0]
    for (const i of lookup) {
      if (i < m) {
        m = i
      }
    }
    return new Result(m)
  }

  max(id) {
    const lookup = this.getId(id)
    if (!lookup || lookup.length === 0) {
      return undefined
    }
    let m = lookup[0]
    for (const i of lookup) {
      if (i > m) {
        m = i
      }
    }
    return new Result(m)
  }

  count(id) {
    return this.getId(id).length
  }

  quartile(id, q) {
    const found = this.getId(id)
    const data = structuredClone(found).sort((a,b) => a - b);
    var pos = ((data.length) - 1) * q;
    var base = Math.floor(pos);
    var rest = pos - base;
    if( (data[base+1]!==undefined) ) {
      return new Result(data[base] + rest * (data[base+1] - data[base]));
    } else {
      return new Result(data[base]);
    }
  }

  median(id) {
    const found = this.getId(id)
    const mid = Math.floor(found.length / 2);
    const sortedArr = found.sort((a, b) => a - b);
  
    if (found.length % 2 === 0) {
       return new Result((sortedArr[mid - 1] + sortedArr[mid]) / 2);
    } else {
       return new Result(sortedArr[mid]);
    }
  }

  total(id) {
    const found = this.getId(id)
    return new Result(found.reduce((a, b) => a + b, 0))
  }
}
