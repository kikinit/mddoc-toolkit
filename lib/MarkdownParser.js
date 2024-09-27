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
          heading: match[3].trim(),  // The heading text is in the line above the underline.
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

  // Format a section of text, removing unnecessary characters.
  formatText (text) {
    return text
      .replace(/\n{3,}/g, '\n\n')  // Replace 3 or more newlines with two (preserving paragraph breaks)
      .trim()                      // Trim any leading or trailing spaces
  }

  // Get all section objects with level, heading and body.
  get sections () {
    return this.#sections
  }

  // Count number of headings of each level.
  countHeadingsByLevel () {
    const headingCounts = {}

    this.#sections.forEach(section => {
      const level = section.level

      if (headingCounts[level]) {
        headingCounts[level] += 1
      } else {
        headingCounts[level] = 1
      }
    })

    return headingCounts
  }

  // Get title of README, that is, the h1 (first h1 if multiple).
  get title () {
    const titleSection = this.#sections.find(section => section.level === 1)
    return titleSection ? titleSection.heading : null
  }

  // Get number of headings for the level provided (all levels if no level provided).
  getHeadingLevels (level = null) {
    // Create the heading counts object
    const headingCounts = this.countHeadingsByLevel()

    // If a specific level is provided, return the count for that level.
    if (level) {
      return headingCounts[level] || 0  // Return 0 if the level doesn't exist.
    }

    return headingCounts
  }

  // Get an array of the section(s) for the provided heading keayword.
  getSectionsWithHeading (keyword) {
    // TODO: Validate input

    const matchingSections = this.sections.filter(section => section.heading.toLowerCase().includes(keyword.toLowerCase()))
    return matchingSections || null
  }
}

export default MarkdownParser
