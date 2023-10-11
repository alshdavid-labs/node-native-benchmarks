const fs = require('fs')
const path = require('path')

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'cases.json'), 'utf-8'))

module.exports = {
  data
}
