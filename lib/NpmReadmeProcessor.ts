// Import built-in node modules for handling files and paths.
import { dirname } from 'path'

// Import internal dependencies.
import { MarkdownParser } from './MarkdownParser.js'

// Path to default dictionary file for this context.
const DEFAULT_DICTIONARY_PATH = './dictionaries/repo-readme-dictionary.json'

export class NpmReadmeProcessor extends MarkdownParser {
  constructor(
    filePath: string,
    dictionaryFilePath: string = DEFAULT_DICTIONARY_PATH
  ) {
    // Determine if the dictionary is custom or default,
    const isCustomDict =
      dirname(dictionaryFilePath) !== dirname(DEFAULT_DICTIONARY_PATH)

    const finalDictionaryPaths = isCustomDict
      ? [dictionaryFilePath] // Custom dictionary, just pass it along.
      : [dictionaryFilePath, DEFAULT_DICTIONARY_PATH] // Add to default dictionary(-ies) already in array.

    super(filePath, finalDictionaryPaths)
  }

  // PUBLIC METHODS UTILIZING TEMPLATE IN MARKDOWN PARSER

  // Extract the package name.
  get name() {
    return this.getSectionWithTemplate('name', 'Package name not found.')
  }

  // Extract the description of the package.
  get description() {
    return this.getSectionWithTemplate('description', 'Description not found.')
  }

  // Extract the installation instructions.
  get installation() {
    return this.getSectionWithTemplate(
      'installation',
      'Installation instructions not found.'
    )
  }

  // Extract the usage examples.
  get usage() {
    return this.getSectionWithTemplate('usage', 'Usage examples not found.')
  }

  // Extract the API documentation.
  get api() {
    return this.getSectionWithTemplate('api', 'API documentation not found.')
  }

  // Extract CLI usage information.
  get cli() {
    return this.getSectionWithTemplate(
      'cli',
      'CLI usage information not found.'
    )
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

  // Extract the devDependencies list.
  get devDependencies() {
    return this.getSectionWithTemplate(
      'devDependencies',
      'Development dependencies not found.'
    )
  }

  // Extract the scripts information.
  get scripts() {
    return this.getSectionWithTemplate(
      'scripts',
      'Scripts information not found.'
    )
  }

  // Extract contribution guidelines.
  get contributionGuidelines() {
    return this.getSectionWithTemplate(
      'contribution',
      'Contribution guidelines not found.'
    )
  }

  // Extract license information.
  get licenseInfo() {
    return this.getSectionWithTemplate(
      'license',
      'License information not found.'
    )
  }

  // CUSTOM PUBLIC METHODS
}
