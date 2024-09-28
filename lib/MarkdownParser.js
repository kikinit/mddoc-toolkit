// Import built-in node modules for handling files.
import { readFileSync } from 'node:fs'

// Import internal dependencies.
import { HeadingDictionary } from './HeadingDictionary.js'

export class MarkdownParser {
  #content
  #sections
  #dictionary

  constructor (filePath, dictionaryFilePath) {
    this.#content = this.#readMarkdownFile(filePath)
    this.#sections = this.#extractSections(this.#content)
    this.#dictionary = new HeadingDictionary(dictionaryFilePath).dictionary
  }

  // MAIN PARSING LOGIC

  // Read the markdown file into a string.
  #readMarkdownFile (filePath) {
    try {
      return readFileSync(filePath, 'utf-8')
    } catch (err) {
      console.error(`Error reading file: ${err.message}`)
    }
  }

  // Extract markdown headings from the content and return their levels, headings and body text.
  #extractSections (content) {
    const headings = this.#extractHeadings(content)
    const sections = []

    headings.forEach((heading, index) => {
      // Find where the next heading starts, or the end of the content.
      const nextHeadingIndex = headings[index + 1]?.startIndex || content.length

      // Extract the body text between the current heading and the next one.
      const bodyText = this.#extractBody(content, heading.endIndex, nextHeadingIndex)

      sections.push({
        level: heading.level,
        heading: heading.text,
        body: bodyText.trim()  // Trim to remove excess whitespace.
      })
    })

    return sections
  }

  // Extract headings with level and start index.
  #extractHeadings (content) {
    // Regex to match headings: both # style and underline style.
    const headingRegex = /^(#+)\s*(.*)|^(.+)\n(=+|-+)\s*$/gm
    const headings = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = this.#determineHeadingLevelFromMatch(match)
      const text = match[1] ? match[2].trim() : match[3].trim()

      // Capture both start and end indices for the heading.
      headings.push({
        level: level,
        text: text,
        startIndex: match.index,
        endIndex: headingRegex.lastIndex  // End of the heading.
      })
    }

    return headings
  }


  // Determine heading level (h1, h2, etc.).
  #determineHeadingLevelFromMatch (match) {
    if (match[1]) {
      return match[1].length  // Number of `#` determines heading level.
    } else if (match[3] && match[4]) {
      const underline = match[4].trim()
      return underline[0] === '=' ? 1 : 2  // '=' for h1, '-' for h2.
    }
    return null
  }

  // Extract body content between two heading indices
  #extractBody (content, startIndex, endIndex) {
    return content.slice(startIndex, endIndex)
  }

  // CONTEXT RELATED METHODS

  // Dictionary-based search for context-specific sections.
  findSectionByKeywords (sectionType) {
    if (!this.#dictionary) throw new Error('No dictionary provided for keyword search.')

    const keywords = this.#dictionary[sectionType] || []
    return this.#sections.find(section =>
      keywords.some(keyword => section.heading.toLowerCase().includes(keyword))
    )
  }

  // General template method for extracting sections.
  getSectionWithTemplate (sectionType, errorMessage) {
    const section = this.findSectionByKeywords(sectionType)
    if (!section) throw new Error(errorMessage)

    return {
      title: section.heading,
      body: this.formatText(section.body)
    }
  }

  // GENERAL PUBLIC METHODS

  // Format a section of text, removing unnecessary characters.
  formatText (text) {
    return text
      .replace(/\n{3,}/g, '\n\n')  // Replace 3 or more newlines with two (preserving paragraph breaks)
      .trim()                      // Trim any leading or trailing spaces
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

  // Get all section objects with level, heading and body.
  get sections () {
    return this.#sections
  }

  // Get title of README, that is, the h1 (first h1 if multiple).
  get title () {
    const titleSection = this.#sections.find(section => section.level === 1)

    if (!titleSection) {
      throw new Error('Title (h1) not found in the README.')
    }

    return titleSection.heading
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

  // Get an array of the section(s) for the provided heading keyword.
  getSectionsWithHeading (keyword) {
    // TODO: Validate input
    const matchingSections = this.#sections.filter(section => section.heading.toLowerCase().includes(keyword.toLowerCase()))

    if (matchingSections.length === 0) {
      throw new Error(`No heading found with provided keyword: '${keyword}'`)

    }
    return matchingSections
  }
}

export default MarkdownParser
