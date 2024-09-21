import { readFileSync } from 'node:fs'

// Read the markdown file into a string.
// TODO: Fix markdown file argument.
const readMarkdownFile = (filePath) => {
  try {
    return readFileSync(filePath, 'utf-8')
  } catch (err) {
    console.error(`Error reading file: ${err.message}`)
  }
}

// Extract markdown headings from the content and return their levels and text.
const extractHeadings = (content) => {
  // Regular expression to match headings: one or more `#` symbols followed by a space and text.
  const headingRegex = /^(#+)\s+(.*)/gm

  // Extract headings using `matchAll`.
  const headings = [...content.matchAll(headingRegex)]
  console.log(headings)

  // Parse the matched headings.
  return headings.map(match => ({
    level: match[1].length,  // Number of `#` symbols represents the heading level.
    text: match[2]           // The heading text itself.
  }))
}

const fileContent = readMarkdownFile('./aux/dummy-readmeas/README_DUMMY.md')
const headings = extractHeadings(fileContent)
console.log(headings)

