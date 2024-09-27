import { MarkdownParser } from './MarkdownParser.js'

export class CodeRepoReadmeParser extends MarkdownParser {
  constructor (filePath) {
    super(filePath)
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
    const installSection = this.sections.find(section => section.heading.toLowerCase().includes('installation'))

    if (!installSection) {
      throw new Error('Installation instruction not found in the README.')
    }

    return {
      title: installSection.heading,
      body: this.formatText(installSection.body)
    }
  }

  // Extract usage examples.
  get usageExamples () {
    const usageSection = this.sections.find(section => section.heading.toLowerCase().includes('usage'))

    if (!usageSection) {
      throw new Error('Usage examples not found in the README.')
    }

    return {
      title: usageSection.heading,
      body: this.formatText(usageSection.body)
    }
  }

  // Extract contribution guidelines.
  get contributionGuidelines () {
    const contributionSection = this.sections.find(section => section.heading.toLowerCase().includes('contribution'))
    return contributionSection ? this.formatText(contributionSection.body) : null
  }

  // Extract license information.
  get licenseInfo () {
    const licenseSection = this.sections.find(section => section.heading.toLowerCase().includes('license'))

    if (!licenseSection) {
      throw new Error('Usage examples not found in the README.')
    }

    return {
      title: licenseSection.heading,
      body: this.formatText(licenseSection.body)
    }
  }
}
