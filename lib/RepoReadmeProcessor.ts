// Import internal dependencies.
import { MarkdownParser } from './MarkdownParser.js'

const DEFAULT_DICTIONARY_PATH = './dictionaries/repo-readme-dictionary.json'

export class RepoReadmeProcessor extends MarkdownParser {
  constructor(filePath: string, dictionaryFilePath: string = DEFAULT_DICTIONARY_PATH) {
    super(filePath, dictionaryFilePath)
  }

  // PUBLIC METHODS UTILIZING TEMPLATE IN MARKDOWN PARSER

  // Extract "installation instructions".
  get installationInstructions(): { title: string, body: string } {
    return this.getSectionWithTemplate('installation', 'Installation instructions not found.')
  }

  // Extract "usage examples".
  get usageExamples (): { title: string, body: string } {
    return this.getSectionWithTemplate('usage', 'Usage examples not found.')
  }

  // Extract "contribution guidelines".
  get contributionGuidelines (): { title: string, body: string } {
    return this.getSectionWithTemplate('contribution', 'Contribution guidelines not found.')
  }

  // Extract "license information".
  get licenseInfo (): { title: string, body: string } {
    return this.getSectionWithTemplate('license', 'License information not found.')
  }

  // CUSTOM PUBLIC METHODS

  // Extract "project title and description".
  get titleAndDescription (): { title: string, description: string } {
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
