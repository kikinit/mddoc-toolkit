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
   * @param {string} markdownFilePath - The path to the README markdown file.
   * @param dictionaryFilePaths - An array of paths to the dictionaries for keyword matching.
   */
  constructor(
    markdownFilePath: string,
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

    super(markdownFilePath, finalDictionaryPaths)
  }

  // PUBLIC METHODS UTILIZING TEMPLATE IN MARKDOWN PARSER

  /**
   * Extracts the installation instructions from the README file.
   */
  get installationInstructions(): { title: string; body: string } {
    return this.getSectionWithTemplate(
      'installation',
      'Installation instructions not found.'
    )
  }

  /**
   * Extracts usage examples from the README file.
   */
  get usageExamples(): { title: string; body: string } {
    return this.getSectionWithTemplate('usage', 'Usage examples not found.')
  }

  /**
   * Extracts the API documentation from the README file.
   */
  get api() {
    return this.getSectionWithTemplate('api', 'API documentation not found.')
  }

  /**
   * Extracts the configuration options from the README file.
   */
  get configuration() {
    return this.getSectionWithTemplate(
      'configuration',
      'Configuration information not found.'
    )
  }

  /**
   *Extract the dependencies list from the README file.
   */
  get dependencies() {
    return this.getSectionWithTemplate(
      'dependencies',
      'Dependencies not found.'
    )
  }

  /**
   *Extract the contribution guidelines from the README file.
   */
  get contributionGuidelines(): { title: string; body: string } {
    return this.getSectionWithTemplate(
      'contribution',
      'Contribution guidelines not found.'
    )
  }

  /**
   *Extract the icense information from the README file.
   */
  get licenseInfo(): { title: string; body: string } {
    return this.getSectionWithTemplate(
      'license',
      'License information not found.'
    )
  }

  // CUSTOM PUBLIC METHODS

  /**
   *Extract the project title and description from the README file.
   */
  get titleAndDescription(): { title: string; description: string } {
    const titleSection = this.sections.find((section) => section.level === 1)

    if (!titleSection) {
      throw new Error('Title (h1) not found in the README.')
    }

    return {
      title: titleSection.heading,
      description: this.formatText(titleSection.body),
    }
  }
}
