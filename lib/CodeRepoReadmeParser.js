// Import internal dependencies.
import { MarkdownParser } from './MarkdownParser.js'

const DEFAULT_DICTIONARY_PATH = './dictionaries/code-repo-dictionary.json'

export class CodeRepoReadmeParser extends MarkdownParser {
  constructor (filePath, dictionaryFilePath = DEFAULT_DICTIONARY_PATH) {
    super(filePath, dictionaryFilePath)
  }

  // PUBLIC METHODS UTILIZING TEMPLATE IN MARKDOWN PARSER

  // Extract the installation instructions.
  get installationInstructions () {
    return this.getSectionWithTemplate('installation', 'Installation instructions not found.')
  }

  // Extract usage examples.
  get usageExamples () {
    return this.getSectionWithTemplate('usage', 'Usage examples not found.')
  }

  // Extract contribution guidelines.
  get contributionGuidelines () {
    return this.getSectionWithTemplate('contribution', 'Contribution guidelines not found.')
  }

  // Extract license information.
  get licenseInfo () {
    return this.getSectionWithTemplate('license', 'License information not found.')
  }

  // CUSTOM PUBLIC METHODS

  // Extract the project title and description.
  get titleAndDescription () {
    const titleSection = this.sections.find(section => section.level === 1)

    if (!titleSection) {
      throw new Error('Title (h1) not found in the README.')
    }

    return {
      title: titleSection.heading,
      description: this.formatText(titleSection.body)
    }
  }

}
