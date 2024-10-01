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
    // Determine if the dictionary is custom or default.
    const isCustomDict =
      dirname(dictionaryFilePath) !== dirname(DEFAULT_DICTIONARY_PATH)

    const finalDictionaryPaths = isCustomDict
      ? [dictionaryFilePath] // Custom dictionary, just pass it along.
      : [dictionaryFilePath, DEFAULT_DICTIONARY_PATH] // Add to default dictionary(-ies) already in array.

    super(filePath, finalDictionaryPaths)
  }

  // PUBLIC METHODS UTILIZING TEMPLATE IN MARKDOWN PARSER

  // Extract CLI usage information.
  get cli() {
    return this.getSectionWithTemplate(
      'cli',
      'CLI usage information not found.'
    )
  }


  // Extract versioning details
  get versioningInfo() {
    return this.getSectionWithTemplate(
      'versioning',
      'Versioning information not found.'
    )
  }

  // Extract the scripts information.
  get scripts() {
    return this.getSectionWithTemplate(
      'scripts',
      'Scripts information not found.'
    )
  }

  // CUSTOM PUBLIC METHODS
}
