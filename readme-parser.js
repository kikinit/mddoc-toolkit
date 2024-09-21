import { readFileSync } from 'node:fs'

// Read the markdown file into a string.
const readMarkdownFile = (filePath) => {
  try {
    return readFileSync(filePath, 'utf-8')
  } catch (err) {
    console.error(`Error reading file: ${err.message}`)
  }
}

// Extract markdown headings from the content and return their levels and text.
const extractHeadings = (content) => {
  // Regex to match headings: both # style and underline style
  const headingRegex = /^(#+)\s*(.*)|^(.+)\n(=+|-+)\s*$/gm

  const headings = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    if (match[1]) {
      // Handle `#`-style headings.
      headings.push({
        level: match[1].length,  // The number of `#` defines the heading level.
        text: match[2].trim()    // The heading text itself.
      })
    } else if (match[3] && match[4]) {
      // Handle underline-style headings.
      const underline = match[4].trim()  // Capture the underline.
      const level = underline[0] === '=' ? 1 : 2  // Determine if it's h1 or h2.
      headings.push({
        level: level,
        text: match[3].trim()  // The heading text is in the line above the underline.
      })
    }
  }
  return headings
}

const fileContent = readMarkdownFile('./aux/dummy-readmeas/README_DUMMY.md')
const headings = extractHeadings(fileContent)
console.log(headings)

