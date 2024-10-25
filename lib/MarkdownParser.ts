// Import built-in node modules for handling files.
import { readFileSync } from 'node:fs'

// Import internal dependencies.
import { Section } from './types/types.js'
import { HeadingDictionary, Dictionary } from './HeadingDictionary.js'

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
  private content: string
  private parsedSections: Section[]
  private dictionaryInstance: HeadingDictionary | null

  /**
   * Constructs a MarkdownParser instance.
   *
   * Either provide a markdown file path or raw markdown content, and the optional custom dictionary file path.
   *
   * @param {string} markdownInput - Path to the markdown file or raw markdown content.
   * @param {boolean} isFilePath - Whether the first argument is a file path (default: true).
   * @param {string[]} dictionaryFilePaths - Array of paths to dictionary files to be merged (optional).
   */
  public constructor(
    markdownInput: string,
    isFilePath: boolean = true,
    dictionaryFilePaths: string[] = []
  ) {
    this.content = isFilePath
      ? this.readMarkdownFile(markdownInput)
      : this.validateMarkdownContent(markdownInput)

    this.parsedSections = this.extractSections(this.content)

    if (dictionaryFilePaths.length > 0) {
      this.dictionaryInstance = new HeadingDictionary(
        this.mergeDictionaries(dictionaryFilePaths)
      )
    } else {
      this.dictionaryInstance = new HeadingDictionary({})
    }
  }

  /**
   * Validates the provided file path.
   *
   * @param {string} filePath - The path to the markdown file to validate.
   * @throws Will throw an error if the file path is empty or exceeds the maximum length.
   */
  private validateFilePath(filePath: string): void {
    if (!filePath) {
      throw new Error('File path is not provided or is empty.')
    }

    const maxPathLength = 255
    if (filePath.length > maxPathLength) {
      throw new Error(
        `File path is too long. Maximum allowed length is ${maxPathLength} characters.`
      )
    }
  }

  /**
   * Validates the provided markdown content.
   * Ensures that the content is not malformed as a string.
   *
   * @param {string} content - Markdown content string.
   * @returns {string} - Returns valid markdown content.
   * @throws {Error} - If content is invalid.
   */
  private validateMarkdownContent(content: string): string {
    if (typeof content !== 'string' || content.trim() === '') {
      throw new Error(
        'Invalid markdown content provided. It must be a non-empty string.'
      )
    }
    return content
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
  private mergeDictionaries(
    dictionaryFilePaths: (string | Dictionary)[]
  ): Dictionary {
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
   * @param {string} filePath - The path to the markdown file to read.
   * @returns {string} The content of the markdown file as a string.
   * @throws Will throw an error if the file path is invalid or the file cannot be read.
   */
  private readMarkdownFile(filePath: string): string {
    this.validateFilePath(filePath)

    try {
      return readFileSync(filePath, 'utf-8')
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error reading file: ${err.message}`)
      } else {
        console.error('Unknown error occurred during file read')
      }
      throw err
    }
  }

  /**
   * Extracts markdown sections based on headings and body text,
   * including all sub-headings and their content under each section.
   *
   * @param {string} content - The markdown file content.
   * @returns {Section[]} Array of extracted sections with heading level, text, and body.
   */
  private extractSections(content: string): Section[] {
    const headings = this.extractHeadings(content)
    const sections: Section[] = []

    headings.forEach((heading, index) => {
      const currentLevel = heading.level
      const nextHeadingIndex = headings[index + 1]?.startIndex || content.length

      // Collect content for the current heading, including any sub-headings.
      let bodyText = this.extractBody(
        content,
        heading.endIndex,
        nextHeadingIndex
      )

      // Scan for sub-headings under the current one.
      for (let i = index + 1; i < headings.length; i++) {
        if (headings[i].level > currentLevel) {
          // If the sub-heading level is greater (a sub-section), include its content.
          const subHeading = headings[i]
          const subHeadingEndIndex =
            headings[i + 1]?.startIndex || content.length
          const subBodyText = this.extractBody(
            content,
            subHeading.endIndex,
            subHeadingEndIndex
          )

          // Append sub-heading and its content to the current section.
          bodyText += `\n\n## ${subHeading.text}\n\n${subBodyText}`
        } else {
          // If the next heading is of the same or higher level, stop collecting sub-sections.
          break
        }
      }
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
  private extractHeadings(
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
      const level = this.determineHeadingLevelFromMatch(match)
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
  private determineHeadingLevelFromMatch(match: RegExpExecArray): number {
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
  private extractBody(
    content: string,
    startIndex: number,
    endIndex: number
  ): string {
    return content.slice(startIndex, endIndex)
  }

  /**
   * Validates the input keyword as string.
   *
   * @param {string} keyword - The keyword to search for in the headings.
   * @throws Will throw an error if the keyword is not a valid non-empty string.
   */
  private validateKeywordInput(keyword: string): void {
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
  protected getSectionsWithTemplate(
    sectionType: string,
    errorMessage: string
  ): { title: string; body: string }[] {
    const sections = this.getSectionsByKeywordsInDictionary(sectionType)
    if (sections.length === 0) throw new Error(errorMessage)

    // Format each matching section.
    return sections.map((section) => ({
      title: section.heading,
      body: this.formatText(section.body),
    }))
  }

  // DICTIONARY PUBLIC METHODS

  /**
   * Retrieves the full dictionary object.
   *
   * @returns {Dictionary | null} - The full dictionary or null if none is initialized.
   */
  public get dictionary(): Dictionary | null {
    return this.dictionaryInstance ? this.dictionaryInstance.dictionary : null
  }

  /**
   * Retrieves all keywords associated with a specific section type.
   * Proxy method that uses delegation from HeadingsDictionary.
   *
   * @param {string} section - The section type for which to retrieve keywords.
   * @returns {string[]} - Array of keywords associated with the section type.
   */
  public getKeywordsForSection(section: string): string[] {
    if (!this.dictionaryInstance) {
      throw new Error('Dictionary is not initialized.')
    }
    return this.dictionaryInstance.getKeywordsForSection(section)
  }

  /**
   * Adds a keyword to the specified section type.
   * Proxy method that uses delegation from HeadingsDictionary.
   *
   * @param {string} section - The section type to which the keyword will be added.
   * @param {string} keyword - The keyword to add.
   */
  public addKeywordForSection(section: string, keyword: string): void {
    if (!this.dictionaryInstance) {
      throw new Error('Dictionary is not initialized.')
    }
    this.dictionaryInstance.addKeywordForSection(section, keyword)
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
      .replace(/\n{3,}/g, '\n\n') // Replace 3 or more newlines with two (preserving paragraph breaks).
      .trim()
  }

  /**
   * Retrieves a section based on keywords from the dictionary.
   *
   * @param {string} sectionType - Type of section to look for (based on the dictionary).
   * @returns {Section | undefined} The matched section or undefined if not found.
   * @throws {Error} If no dictionary is provided.
   */
  public getSectionsByKeywordsInDictionary(sectionType: string): Section[] {
    if (!this.dictionary)
      throw new Error('No dictionary provided for keyword search.')

    const keywords = this.dictionary[sectionType] || []
    const matchingSections: Section[] = []

    let currentSection: Section | null = null

    for (const section of this.parsedSections) {
      const isMatch = keywords.some((keyword) =>
        section.heading.toLowerCase().includes(keyword)
      )

      // Match a section type.
      if (isMatch) {
        if (currentSection) {
          matchingSections.push(currentSection)
        }
        currentSection = { ...section }
      } else if (currentSection && section.level > currentSection.level) {
        // If it's a subheading of the current section, append its body to the current section's body.
        currentSection.body += `\n\n## ${section.heading}\n\n${section.body}`
      } else {
        // If it's not a match and not a subheading, push the current section and reset.
        if (currentSection) {
          matchingSections.push(currentSection)
          currentSection = null
        }
      }
    }

    if (currentSection) {
      matchingSections.push(currentSection)
    }

    return matchingSections
  }

  /**
   * Counts the number of headings for each level.
   *
   * @returns {Record<number, number>} A record with heading levels as keys and counts as values.
   */
  public countHeadingsByLevel(): Record<number, number> {
    const headingCounts: Record<number, number> = {}

    this.parsedSections.forEach((section) => {
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
  public get sections(): Section[] {
    return this.parsedSections
  }

  /**
   * Returns the title of the README (the first h1 heading).
   *
   * @returns {string} The title of the README.
   * @throws {Error} If no h1 heading is found.
   */
  public get title(): string {
    const titleSection = this.parsedSections.find(
      (section) => section.level === 1
    )

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
  public getHeadingLevels(
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
   * @param {string} keyword - The keyword to search for in section headings.
   * @returns {Section[]} An array of sections that contain the keyword in their headings.
   * @throws Will throw an error if no sections with the provided keyword are found.
   */
  public getSectionsByHeading(keyword: string): Section[] {
    this.validateKeywordInput(keyword)
    const matchingSections = this.parsedSections.filter((section) =>
      section.heading.toLowerCase().includes(keyword.toLowerCase())
    )

    if (matchingSections.length === 0) {
      throw new Error(`No heading found with provided keyword: '${keyword}'`)
    }
    return matchingSections
  }

  /**
   * Extracts the first heading (h1) and its corresponding body, stopping at the next heading (regardless of level).
   *
   * @returns {Section} The first section containing the h1 heading and its body until the next heading.
   * @throws {Error} If no h1 heading is found.
   */
  public extractFirstSection(): Section {
    const headings = this.extractHeadings(this.content)

    // Find the first heading (h1).
    const firstHeading = headings.find((heading) => heading.level === 1)

    if (!firstHeading) {
      throw new Error('Title (h1) not found in the markdown.')
    }

    // Find the start of the next heading, regardless of level.
    const nextHeadingIndex =
      headings.find((heading) => heading.startIndex > firstHeading.startIndex)
        ?.startIndex || this.content.length

    // Extract the body between the first heading and the next heading.
    const body = this.extractBody(
      this.content,
      firstHeading.endIndex,
      nextHeadingIndex
    )

    // Return only the first section (first heading and its body).
    return {
      level: firstHeading.level,
      heading: firstHeading.text,
      body: this.formatText(body),
    }
  }
}

export default MarkdownParser
