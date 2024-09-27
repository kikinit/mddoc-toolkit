import { MarkdownParser } from './MarkdownParser.js'
import { HeadingDictionary } from './HeadingDictionary.js'

export class CodeRepoReadmeParser extends MarkdownParser {
  constructor (filePath) {
    super(filePath)
    this.headingDictionary = new HeadingDictionary('./dictionaries/code-repo-dictionary.json')
  }

  // Helper method to find a section by keywords from the dictionary
  findSectionByKeywords (sectionType) {
    // TODO: Add error handler if dictionary is corrupt regarding default values.
    const keywords = this.headingDictionary.getKeywordsForSection(sectionType)
    return this.sections.find(section =>
      keywords.some(keyword => section.heading.toLowerCase().includes(keyword))
    )
  }


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

  // Extract the installation instructions.
  get installationInstructions () {
    const installSection = this.findSectionByKeywords('installation')
    if (!installSection) throw new Error('Installation instructions not found.')

    return {
      title: installSection.heading,
      body: this.formatText(installSection.body)
    }
  }

  // Extract usage examples.
  get usageExamples () {
    const usageSection = this.findSectionByKeywords('usage')
    if (!usageSection) throw new Error('Usage examples not found.')

    return {
      title: usageSection.heading,
      body: this.formatText(usageSection.body)
    }
  }

  // Extract contribution guidelines.
  get contributionGuidelines () {
    const contributionSection = this.findSectionByKeywords('contribution')
    if (!contributionSection) throw new Error('Contribution guidelines not found.')

    return {
      title: contributionSection.heading,
      body: this.formatText(contributionSection.body)
    }
  }

  // Extract license information.
  get licenseInfo () {
    const licenseSection = this.findSectionByKeywords('license')
    if (!licenseSection) throw new Error('License information not found.')

    return {
      title: licenseSection.heading,
      body: this.formatText(licenseSection.body)
    }
  }
}
