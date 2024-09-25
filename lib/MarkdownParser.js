import { readFileSync } from 'node:fs'

export class MarkdownParser {
  #content
  #sections

  constructor (filePath) {
    this.#content = this.#readMarkdownFile(filePath)
    this.#sections = this.#extractSections(this.#content)
  }
  // Read the markdown file into a string.
  #readMarkdownFile (filePath) {
    try {
      return readFileSync(filePath, 'utf-8')
    } catch (err) {
      console.error(`Error reading file: ${err.message}`)
    }
  }

  // Extract markdown headings from the content and return their levels and text.
  #extractSections (content) {
    // Regex to match headings: both # style and underline style
    const headingRegex = /^(#+)\s*(.*)|^(.+)\n(=+|-+)\s*$/gm

    const sections = []
    let match
    let lastIndex = 0 // Track last heading.

    while ((match = headingRegex.exec(content)) !== null) {

      const headingStartIndex = match.index

      // Grab the body text between last heading and current heading.
      if (sections.length > 0) {
        const previousSection = sections[sections.length - 1]

        previousSection.body = content.slice(lastIndex, headingStartIndex).trim()
      }

      if (match[1]) {
        // Handle `#`-style headings.
        sections.push({
          level: match[1].length,  // The number of `#` defines the heading level.
          heading: match[2].trim(),    // The heading text itself.
          body: ''
        })
      } else if (match[3] && match[4]) {
        // Handle underline-style headings.
        const underline = match[4].trim()  // Capture the underline.
        const level = underline[0] === '=' ? 1 : 2  // Determine if it's h1 or h2.
        sections.push({
          level: level,
          Heading: match[3].trim(),  // The heading text is in the line above the underline.
          body: ''
        })
      }

      // Update lastIndex to the end of the current heading.
      lastIndex = headingRegex.lastIndex
    }

    // Capture the body text after the last heading.
    if (sections.length > 0) {
      const lastSection = sections[sections.length - 1]
      lastSection.body = content.slice(lastIndex).trim()
    }

    return sections
  }

  getSections () {
    return this.#sections
  }
}

export default MarkdownParser
