// Import built-in node modules for handling files and paths.
import { dirname } from 'path'

// Import internal dependencies.
import { RepoReadmeProcessor } from './RepoReadmeProcessor.js'

// Path to default dictionary file for this context.
const DEFAULT_DICTIONARY_PATH = './dictionaries/npm-readme-dictionary.json'

export class NpmReadmeProcessor extends RepoReadmeProcessor {
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
