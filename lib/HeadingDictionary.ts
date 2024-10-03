import { readFileSync } from 'node:fs'

/**
 * A Dictionary that maps section types to an array of keywords.
 *
 * @interface Dictionary
 * @property {string[]} [sectionType] - An array of keywords corresponding to each section type.
 */
export interface Dictionary {
  [sectionType: string]: string[]
}

/**
 * A class for loading and managing a dictionary of keywords for context-based searches in Markdown files.
 *
 * The `HeadingDictionary` class loads a dictionary from a JSON file or accepts an object containing
 * keyword mappings. It is used by the `MarkdownParser` and its context-specific subclasses to facilitate
 * keyword-based searches within parsed sections.
 *
 * @class HeadingDictionary
 * @property {Dictionary} #dictionary - The dictionary of keywords, either loaded from a file or passed as an object.
 *
 * @throws Will throw an error if the dictionary file cannot be loaded or is malformed.
 */

export class HeadingDictionary {
  #dictionary: Dictionary

  /**
   * Constructs a new `HeadingDictionary` instance.
   *
   * If a file path is passed, the constructor loads the dictionary from the file.
   * If a dictionary object is passed, it uses that directly.
   *
   * @param {string | Dictionary} data - Either a file path to a JSON dictionary or a `Dictionary` object.
   * @throws Will throw an error if the dictionary file cannot be loaded.
   */
  constructor(data: string | Dictionary) {
    // If the data is a string, assume it's a file path and load JSON.
    if (typeof data === 'string') {
      this.#dictionary = this.#loadDictionaryFromFile(data)
    } else {
      // Otherwise, assume it's an object with dictionary data.
      this.#dictionary = data
    }
  }

  /**
   * Loads a dictionary from a JSON file.
   *
   * Reads the file from the provided path and parses its content as a `Dictionary`.
   *
   * @param {string} filePath - The file path of the dictionary JSON file.
   * @returns {Dictionary} The parsed dictionary object.
   * @throws Will throw an error if the file cannot be read or parsed.
   */
  #loadDictionaryFromFile(filePath: string): Dictionary {
    try {
      const fileContent = readFileSync(filePath, 'utf-8')
      return JSON.parse(fileContent)
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(`Error loading dictionary from file: ${err.message}`)
      } else {
        throw new Error('Unknown error occurred while loading the dictionary')
      }
    }
  }

  /**
   * Retrieves the entire dictionary object.
   *
   * @returns {Dictionary} The full dictionary object containing all section types and their associated keywords.
   */
  get dictionary(): Dictionary {
    return this.#dictionary
  }

  /**
   * Retrieves all keywords associated with a specific section type.
   *
   * @param {string} section - The section type for which to retrieve keywords.
   * @returns {string[]} An array of keywords associated with the provided section type.
   */
  getKeywordsForSection(section: string): string[] {
    return this.#dictionary[section] || []
  }
  /**
   * Adds a new keyword to the specified section type.
   *
   * If the section type does not exist, a new entry is created. If it already exists, the keyword is added to the existing array.
   *
   * @param {string} section - The section type to which the keyword should be added.
   * @param {string} keyword - The keyword to add to the section.
   */
  addKeywordForSection(section: string, keyword: string): void {
    if (!this.#dictionary[section]) {
      this.#dictionary[section] = []
    }
    this.#dictionary[section].push(keyword)
  }
}
