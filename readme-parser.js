import { readFileSync } from 'node:fs'

// Read the markdown file into a string.
// TODO: Fix markdown file argument.
const content = readFileSync('./aux/dummy-readmeas/README_DUMMY.md', 'utf-8')

console.log(content)
