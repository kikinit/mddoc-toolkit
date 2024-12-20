import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

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
 * @property {Dictionary} private dictionary - The dictionary of keywords, either loaded from a file or passed as an object.
 *
 * @throws Will throw an error if the dictionary file cannot be loaded or is malformed.
 */
export class HeadingDictionary {
  private keywordDictionary: Dictionary

  /**
   * Constructs a new `HeadingDictionary` instance.
   *
   * If a file path is passed, the constructor loads the dictionary from the file.
   * If a dictionary object is passed, it uses that directly.
   *
   * @param {string | Dictionary} data - Either a file path to a JSON dictionary or a `Dictionary` object.
   * @throws Will throw an error if the dictionary file cannot be loaded.
   */
  public constructor(data: string | Dictionary) {
    // If the data is a string, assume it's a file path and load JSON.
    if (typeof data === 'string') {
      const dictionaryPath = this.resolvePath(`../${data}`)
      this.keywordDictionary = this.loadDictionaryFromFile(dictionaryPath)
    } else {
      this.keywordDictionary = data
    }
  }

  /**
   * Resolves the absolute path to a file in ESM-compatible environments.
   *
   * @param relativePath - The relative path to the target file from the calling file's directory.
   * @returns The resolved absolute path to the target file.
   */
  private resolvePath(relativePath: string): string {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    return join(__dirname, relativePath)
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
  private loadDictionaryFromFile(filePath: string): Dictionary {
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
  public get dictionary(): Dictionary {
    return this.keywordDictionary
  }

  /**
   * Retrieves all keywords associated with a specific section type.
   *
   * @param {string} section - The section type for which to retrieve keywords.
   * @returns {string[]} An array of keywords associated with the provided section type.
   */
  public getKeywordsForSection(section: string): string[] {
    return this.keywordDictionary[section] || []
  }

  /**
   * Adds a new keyword to the specified section type.
   *
   * If the section type does not exist, a new entry is created. If it already exists, the keyword is added to the existing array.
   *
   * @param {string} section - The section type to which the keyword should be added.
   * @param {string} keyword - The keyword to add to the section.
   */
  public addKeywordForSection(section: string, keyword: string): void {
    if (!this.keywordDictionary[section]) {
      this.keywordDictionary[section] = []
    }
    this.keywordDictionary[section].push(keyword)
  }
}
