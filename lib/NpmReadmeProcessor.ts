// Import built-in node modules for handling files and paths.
import { dirname } from 'path'

// Import internal dependencies.
import { RepoReadmeProcessor } from './RepoReadmeProcessor.js'

// Path to default dictionary file for this context.
const DEFAULT_DICTIONARY_PATH = './dictionaries/npm-readme-dictionary.json'

/**
 * A class for parsing and extracting structured sections from an NPM-specific README file.
 *
 * The `NpmReadmeProcessor` context is a class that extends the `RepoReadmeProcessor` to
 * provide NPM-specific functionality, such as extracting CLI usage, versioning details, and
 * scripts information.
 *
 * @class NpmReadmeProcessor
 * @extends RepoReadmeProcessor
 * @property {string} #content - The raw Markdown content of the NPM README file.
 * @property {Section[]} #sections - An array of parsed sections from the README file, each containing a heading and body content.
 * @property {Dictionary | null} #dictionary - The merged dictionary for keyword-based searches, containing NPM-specific terms.
 *
 * @throws Will throw an error if the file cannot be read, or if any NPM-specific sections are not found.
 */

export class NpmReadmeProcessor extends RepoReadmeProcessor {
  /**
   * Constructs a `NpmReadmeProcessor` instance.
   *
   * @param {string} markdownInput - Path to the markdown file or raw markdown content.
   * @param {boolean} isFilePath - Whether the first argument is a file path (default: true).
   * @param {string[]} dictionaryFilePaths - An array of paths to the dictionaries for keyword matching.
   */
  public constructor(
    markdownInput: string,
    isFilePath: boolean = true,
    dictionaryFilePaths: string[] = [DEFAULT_DICTIONARY_PATH]
  ) {
    // Determine if the dictionary is custom or default
    const isCustomDict =
      dictionaryFilePaths.length === 1 &&
      dirname(dictionaryFilePaths[0]) !== dirname(DEFAULT_DICTIONARY_PATH)

    // If it's custom, use the custom dictionary alone, otherwise merge with default.
    const finalDictionaryPaths = isCustomDict
      ? dictionaryFilePaths // Custom dictionary, just pass it along.
      : [...dictionaryFilePaths, DEFAULT_DICTIONARY_PATH] // Merge with the default dictionary.

    super(markdownInput, isFilePath, finalDictionaryPaths)
  }

  // PUBLIC METHODS UTILIZING TEMPLATE IN MARKDOWN PARSER

  /**
   *Extract the CLI usage information from the README file.
   */
  public get cliUsage() {
    return this.getSectionWithTemplate(
      'cli',
      'CLI usage information not found.'
    )
  }

  /**
   *Extract the versioning details from the README file.
   */
  public get versioningDetails() {
    return this.getSectionWithTemplate(
      'versioning',
      'Versioning information not found.'
    )
  }

  /**
   *Extract the scripts informations from the README file.
   */
  public get scriptsDetails() {
    return this.getSectionWithTemplate(
      'scripts',
      'Scripts information not found.'
    )
  }

  // CUSTOM PUBLIC METHODS
  // Add custom methods below and remove this line.
}
