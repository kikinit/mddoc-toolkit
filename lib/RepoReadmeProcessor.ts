// Import built-in node modules for handling files and paths.
import { dirname } from 'path'

// Import internal dependencies.
import { MarkdownParser } from './MarkdownParser.js'

// Path to default dictionary file for this context.
const DEFAULT_DICTIONARY_PATH = './dictionaries/repo-readme-dictionary.json'

export class RepoReadmeProcessor extends MarkdownParser {
  constructor(
    filePath: string,
    dictionaryFilePaths: string[] = [DEFAULT_DICTIONARY_PATH]
  ) {

    // Determine if the dictionary is custom or default
    const isCustomDict = dictionaryFilePaths.length === 1
      && dirname(dictionaryFilePaths[0]) !== dirname(DEFAULT_DICTIONARY_PATH)

    // If it's custom, use the custom dictionary alone, otherwise merge with default.
    const finalDictionaryPaths = isCustomDict
      ? dictionaryFilePaths // Custom dictionary, just pass it along.
      : [...dictionaryFilePaths, DEFAULT_DICTIONARY_PATH] // Merge with the default dictionary.

    super(filePath, finalDictionaryPaths)
  }


  // PUBLIC METHODS UTILIZING TEMPLATE IN MARKDOWN PARSER

  // Extract "installation instructions".
  get installationInstructions(): { title: string; body: string } {
    return this.getSectionWithTemplate(
      'installation',
      'Installation instructions not found.'
    )
  }

  // Extract "usage examples".
  get usageExamples(): { title: string; body: string } {
    return this.getSectionWithTemplate('usage', 'Usage examples not found.')
  }

  // Extract the API documentation.
  get api() {
    return this.getSectionWithTemplate('api', 'API documentation not found.')
  }

  // Extract the configuration options.
  get configuration() {
    return this.getSectionWithTemplate(
      'configuration',
      'Configuration information not found.'
    )
  }

  // Extract the dependencies list.
  get dependencies() {
    return this.getSectionWithTemplate(
      'dependencies',
      'Dependencies not found.'
    )
  }

  // Extract "contribution guidelines".
  get contributionGuidelines(): { title: string; body: string } {
    return this.getSectionWithTemplate(
      'contribution',
      'Contribution guidelines not found.'
    )
  }

  // Extract "license information".
  get licenseInfo(): { title: string; body: string } {
    return this.getSectionWithTemplate(
      'license',
      'License information not found.'
    )
  }

  // CUSTOM PUBLIC METHODS

  // Extract "project title and description".
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
