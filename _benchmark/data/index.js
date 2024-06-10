import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const data = JSON.parse(readFileSync(join(__dirname, 'cases.json'), 'utf-8'))
