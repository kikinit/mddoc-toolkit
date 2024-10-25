// Import built-in node modules for handling files and paths.
import { dirname } from 'path'

// Import internal dependencies.
import { MarkdownParser } from './MarkdownParser.js'

// Path to default dictionary file for this context.
const DEFAULT_DICTIONARY_PATH = './dictionaries/repo-readme-dictionary.json'

/**
 * A class for parsing and extracting structured sections from a code repository's README file.
 *
 * The `RepoReadmeProcessor` context is a class that extends the `MarkdownParser` to provide functionality
 * for extracting common sections in code repository README files, such as installation instructions,
 * usage examples, API documentation, and contribution guidelines.
 *
 * @class RepoReadmeProcessor
 * @extends MarkdownParser
 * @property {string} #content - The raw Markdown content of the README file.
 * @property {Section[]} #sections - An array of parsed sections from the README file, each containing a heading and body content.
 * @property {Dictionary | null} #dictionary - The merged dictionary for keyword-based searches in the README file.
 *
 * @throws Will throw an error if the file cannot be read, or if any standard sections are not found.
 */

export class RepoReadmeProcessor extends MarkdownParser {
  /**
   * Constructs a new `RepoReadmeProcessor` instance.
   *
   * @param {string} markdownInput - Path to the markdown file or raw markdown content.
   * @param {boolean} isFilePath - Whether the first argument is a file path (default: true).
   * @param dictionaryFilePaths - An array of paths to the dictionaries for keyword matching.
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
   * Extracts the installation instructions from the README file.
   */
  public get installationInstructions(): { title: string; body: string }[] {
    return this.getSectionsWithTemplate(
      'installation',
      'Installation instructions not found.'
    )
  }

  /**
   * Extracts usage examples from the README file.
   */
  public get usageExamples(): { title: string; body: string }[] {
    return this.getSectionsWithTemplate('usage', 'Usage examples not found.')
  }

  /**
   * Extracts the API documentation from the README file.
   */
  public get api() {
    return this.getSectionsWithTemplate('api', 'API documentation not found.')
  }

  /**
   * Extracts the configuration options from the README file.
   */
  public get configuration() {
    return this.getSectionsWithTemplate(
      'configuration',
      'Configuration information not found.'
    )
  }

  /**
   *Extract the dependencies list from the README file.
   */
  public get dependencies() {
    return this.getSectionsWithTemplate(
      'dependencies',
      'Dependencies not found.'
    )
  }

  /**
   *Extract the contribution guidelines from the README file.
   */
  public get contributionGuidelines(): { title: string; body: string }[] {
    return this.getSectionsWithTemplate(
      'contribution',
      'Contribution guidelines not found.'
    )
  }

  /**
   *Extract the icense information from the README file.
   */
  public get licenseInfo(): { title: string; body: string }[] {
    return this.getSectionsWithTemplate(
      'license',
      'License information not found.'
    )
  }

  // CUSTOM PUBLIC METHODS

  /**
   * Extract the project title and description from the README file.
   */
  public get titleAndDescription(): { title: string; description: string } {
    const firstSection = this.extractFirstSection()

    return {
      title: firstSection.heading,
      description: firstSection.body,
    }
  }
}
