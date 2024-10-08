// Import built-in node modules for handling files.
import { readFileSync } from 'node:fs'

// Import internal dependencies.
import { HeadingDictionary, Dictionary } from './HeadingDictionary.js'

/**
 * Represents a parsed section of a Markdown document.
 *
 * @interface Section
 * @property {number} level - The level of the heading (e.g., 1 for h1, 2 for h2).
 * @property {string} heading - The text of the heading.
 * @property {string} body - The content/body text that follows the heading.
 */
export interface Section {
  level: number
  heading: string
  body: string
}

/**
 * A class for parsing and extracting structured sections from a Markdown file.
 *
 * This class is designed to be extended by context-specific processors (such as
 * 'RepoReadmeProcessor', and 'ChangelogProcessor') to handle specialized data
 * extraction tasks.
 *
 * @class MarkdownParser
 * @property {string} #content - The raw Markdown content of the file.
 * @property {Section[]} #sections - An array of parsed sections, each containing a heading and its body content.
 * @property {Dictionary | null} #dictionary - The merged dictionary for keyword-based searches, or null if none.
 *
 * @throws Will throw an error if the file cannot be read.
 */
export class MarkdownParser {
  #content: string
  #sections: Section[]
  #dictionaryInstance: HeadingDictionary | null

  /**
   * Constructs a MarkdownParser instance.
   *
   * @param {string} markdownFilePath - Path to the markdown file to parse.
   * @param {string[]} dictionaryFilePaths - Array of paths to dictionary files to be merged (optional).
   */
  constructor(markdownFilePath: string, dictionaryFilePaths: string[] = []) {
    this.#content = this.#readMarkdownFile(markdownFilePath)
    this.#sections = this.#extractSections(this.#content)

    // If dictionary paths are provided, use them. Otherwise, pass an empty object to HeadingDictionary.
    if (dictionaryFilePaths.length > 0) {
      this.#dictionaryInstance = new HeadingDictionary(this.#mergeDictionaries(dictionaryFilePaths))
    } else {
      this.#dictionaryInstance = new HeadingDictionary({}) // Pass an empty dictionary.
    }
  }

  /**
 * Merges multiple dictionaries into a single dictionary object.
 *
 * This method processes an array of file paths or inline dictionary objects,
 * loading and combining all dictionary data into one consolidated dictionary.
 *
 * @param {(string | Dictionary)[]} dictionaryFilePaths - An array of file paths to dictionary files or direct dictionary objects.
 * @returns {Dictionary} The combined dictionary containing keywords from all provided dictionaries.
 *
 * @throws Will throw an error if a file path is invalid or the dictionary file cannot be loaded.
 */
  #mergeDictionaries(dictionaryFilePaths: (string | Dictionary)[]): Dictionary {
    let mergedDictionary: Dictionary = {}

    dictionaryFilePaths.forEach((pathOrDict) => {
      if (typeof pathOrDict === 'string') {
        // If it's a path, load the dictionary from file.
        const dictionary = new HeadingDictionary(pathOrDict).dictionary
        mergedDictionary = { ...mergedDictionary, ...dictionary }
      } else {
        // If it's an object, directly merge.
        mergedDictionary = { ...mergedDictionary, ...pathOrDict }
      }
    })

    return mergedDictionary
  }

  // MAIN PARSING LOGIC

  /**
   * Reads the markdown file content as a string.
   *
   * @param {string} filePath - Path to the markdown file.
   * @returns {string} The content of the markdown file as a string.
   * @throws Will throw an error if the file cannot be read.
   */
  #readMarkdownFile(filePath: string): string {
    if (!filePath) {
      throw new Error('File path is not provided or is empty.')
    }

    try {
      return readFileSync(filePath, 'utf-8')
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error reading file: ${err.message}`)
      } else {
        console.error('Unknown error occurred during file read')
      }
      throw err // Re-throwing the error after logging it.
    }
  }

  /**
   * Extracts markdown sections based on headings and body text.
   *
   * @param {string} content - The markdown file content.
   * @returns {Section[]} Array of extracted sections with heading level, text, and body.
   */
  #extractSections(content: string): Section[] {
    const headings = this.#extractHeadings(content)
    const sections: Section[] = []

    headings.forEach((heading, index) => {
      // Find where the next heading starts, or the end of the content.
      const nextHeadingIndex = headings[index + 1]?.startIndex || content.length

      // Extract the body text between the current heading and the next one.
      const bodyText = this.#extractBody(
        content,
        heading.endIndex,
        nextHeadingIndex
      )

      sections.push({
        level: heading.level,
        heading: heading.text,
        body: bodyText.trim(),
      })
    })

    return sections
  }

  /**
   * Extracts markdown headings and their indices.
   *
   * @param {string} content - The markdown content to scan for headings.
   * @returns {Array} Array of objects containing heading level, text, and start/end indices.
   */
  #extractHeadings(
    content: string
  ): { level: number; text: string; startIndex: number; endIndex: number }[] {
    // Regex to match headings: both # style and underline style.
    const headingRegex = /^(#+)\s*(.*)|^(.+)\n(=+|-+)\s*$/gm
    const headings: {
      level: number
      text: string
      startIndex: number
      endIndex: number
    }[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = this.#determineHeadingLevelFromMatch(match)
      const text = match[1] ? match[2].trim() : match[3].trim()

      // Capture both start and end indices for the heading.
      headings.push({
        level: level,
        text: text,
        startIndex: match.index,
        endIndex: headingRegex.lastIndex,
      })
    }

    return headings
  }

  /**
   * Determines the level of the heading based on the regex match results.
   *
   * @param {RegExpExecArray} match - Regex match object.
   * @returns {number} The heading level (1 for h1, 2 for h2, etc.).
   */
  #determineHeadingLevelFromMatch(match: RegExpExecArray): number {
    if (match[1]) {
      return match[1].length // Number of `#` determines heading level.
    } else if (match[3] && match[4]) {
      const underline = match[4].trim()
      return underline[0] === '=' ? 1 : 2 // '=' for h1, '-' for h2.
    }
    return 0
  }

  /**
   * Extracts the body content between two heading indices.
   *
   * @param {string} content - The full content of the markdown file.
   * @param {number} startIndex - The start index of the body content.
   * @param {number} endIndex - The end index of the body content.
   * @returns {string} Extracted body content.
   */
  #extractBody(content: string, startIndex: number, endIndex: number): string {
    return content.slice(startIndex, endIndex)
  }

  /**
   * Validates the input keyword as string.
   *
   * @param {string} keyword - The keyword to search for in the headings.
   * @throws Will throw an error if the keyword is not a valid non-empty string.
   */
  #validateKeywordInput(keyword: string): void {
    if (typeof keyword !== 'string' || keyword.trim() === '') {
      throw new Error('Invalid keyword. It must be a non-empty string.')
    }
  }

  // CONTEXT RELATED HELPER METHODS

  /**
   * Extracts a section using a template approach based on the dictionary.
   *
   * This method is commonly used by standard context methods (such as
   * `get installationInstructions`, `get api`, `get cliUsage`, etc.) across different
   * processors to fetch and format specific sections based on context dictionaries.
   *
   * @param {string} sectionType - Type of section (based on the dictionary).
   * @param {string} errorMessage - Error message if the section is not found.
   * @returns {Object} The title and body of the matched section.
   * @throws {Error} If the section is not found.
   */
  protected getSectionWithTemplate(
    sectionType: string,
    errorMessage: string
  ): { title: string; body: string } {
    const section = this.getSectionByKeywordsInDictionary(sectionType)
    if (!section) throw new Error(errorMessage)

    return {
      title: section.heading,
      body: this.formatText(section.body),
    }
  }

  // DICTIONARY PUBLIC METHODS

  /**
   * Retrieves the full dictionary object.
   *
   * @returns {Dictionary | null} - The full dictionary or null if none is initialized.
   */
  public get dictionary(): Dictionary | null {
    return this.#dictionaryInstance ? this.#dictionaryInstance.dictionary : null
  }

  /**
   * Retrieves all keywords associated with a specific section type.
   * Proxy method that uses delegation from HeadingsDictionary.
   *
   * @param {string} section - The section type for which to retrieve keywords.
   * @returns {string[]} - Array of keywords associated with the section type.
   */
  public getKeywordsForSection(section: string): string[] {
    if (!this.#dictionaryInstance) {
      throw new Error('Dictionary is not initialized.')
    }
    return this.#dictionaryInstance.getKeywordsForSection(section)
  }

  /**
   * Adds a keyword to the specified section type.
   * Proxy method that uses delegation from HeadingsDictionary.
   *
   * @param {string} section - The section type to which the keyword will be added.
   * @param {string} keyword - The keyword to add.
   */
  public addKeywordForSection(section: string, keyword: string): void {
    if (!this.#dictionaryInstance) {
      throw new Error('Dictionary is not initialized.')
    }
    this.#dictionaryInstance.addKeywordForSection(section, keyword)
  }

  // GENERAL PUBLIC METHODS

  /**
   * Formats the body of a section by removing unnecessary characters.
   *
   * @param {string} text - The body content to format.
   * @returns {string} The formatted text.
   */
  protected formatText(text: string): string {
    return text
      .replace(/\n{3,}/g, '\n\n') // Replace 3 or more newlines with two (preserving paragraph breaks)
      .trim() // Trim any leading or trailing spaces
  }

  /**
   * Retrieves a section based on keywords from the dictionary.
   *
   * This method searches the parsed sections for a heading that matches any
   * keyword associated with the given `sectionType` in the dictionary.
   *
   * @param {string} sectionType - Type of section to look for (based on the dictionary).
   * @returns {Section | undefined} The matched section or undefined if not found.
   * @throws {Error} If no dictionary is provided.
   */
  getSectionByKeywordsInDictionary(sectionType: string): Section | undefined {
    if (!this.dictionary)
      throw new Error('No dictionary provided for keyword search.')

    const keywords = this.dictionary[sectionType] || []
    return this.#sections.find((section) =>
      keywords.some((keyword) =>
        section.heading.toLowerCase().includes(keyword)
      )
    )
  }

  /**
   * Counts the number of headings for each level.
   *
   * @returns {Record<number, number>} A record with heading levels as keys and counts as values.
   */
  countHeadingsByLevel(): Record<number, number> {
    const headingCounts: Record<number, number> = {}

    this.#sections.forEach((section) => {
      const level = section.level
      headingCounts[level] = (headingCounts[level] || 0) + 1
    })

    return headingCounts
  }

  /**
   * Returns all sections parsed from the markdown.
   *
   * @returns {Section[]} An array of section objects.
   */
  get sections(): Section[] {
    return this.#sections
  }

  /**
   * Returns the title of the README (the first h1 heading).
   *
   * @returns {string} The title of the README.
   * @throws {Error} If no h1 heading is found.
   */
  get title(): string {
    const titleSection = this.#sections.find((section) => section.level === 1)

    if (!titleSection) {
      throw new Error('Title (h1) not found in the README.')
    }

    return titleSection.heading
  }

  /**
   * Returns the count of headings for a specific level.
   * If no level is provided, it returns a count of all heading levels.
   *
   * @param {number | null} [level=null] - The level of heading to count.
   * @returns {number | Record<number, number>} The count for the specified level or all levels.
   */
  getHeadingLevels(
    level: number | null = null
  ): number | Record<number, number> {
    // Create the heading counts object
    const headingCounts = this.countHeadingsByLevel()

    // If a specific level is provided, return the count for that level.
    if (level) {
      return headingCounts[level] || 0 // Return 0 if the level doesn't exist.
    }

    return headingCounts
  }

  /**
   * Retrieves an array of sections whose headings contain the specified keyword.
   *
   * This method searches through the parsed sections and returns all sections
   * where the heading includes the provided keyword (case-insensitive).
   *
   * @param {string} keyword - The keyword to search for in section headings.
   * @returns {Section[]} An array of sections that contain the keyword in their headings.
   * @throws Will throw an error if no sections with the provided keyword are found.
   */
  getSectionsByHeading(keyword: string): Section[] {
    this.#validateKeywordInput(keyword)
    const matchingSections = this.#sections.filter((section) =>
      section.heading.toLowerCase().includes(keyword.toLowerCase())
    )

    if (matchingSections.length === 0) {
      throw new Error(`No heading found with provided keyword: '${keyword}'`)
    }
    return matchingSections
  }
}

export default MarkdownParser
