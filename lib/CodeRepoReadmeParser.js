import { MarkdownParser } from './MarkdownParser.js'

export class CodeRepoReadmeParser extends MarkdownParser {
  constructor (filePath) {
    super(filePath)
  }


  // Extract the project title and description.
  get titleAndDescription () {
    const titleSection = this.sections.find(section => section.level === 1)
    return titleSection
      ? {
        title: titleSection.heading,
        description: this.formatText(titleSection.body)
      }
      : null
  }

  // Extract the installation instructions.
  get installationInstructions () {
    const installSection = this.sections.find(section => section.heading.toLowerCase().includes('installation'))
    return installSection ? this.formatText(installSection.body) : null
  }

  // Extract usage examples.
  get usageExamples () {
    const usageSection = this.sections.find(section => section.heading.toLowerCase().includes('usage'))
    return usageSection ? this.formatText(usageSection.body) : null
  }

  // Extract contribution guidelines.
  get contributionGuidelines () {
    const contributionSection = this.sections.find(section => section.heading.toLowerCase().includes('contribution'))
    return contributionSection ? this.formatText(contributionSection.body) : null
  }

  // Extract license information.
  get licenseInfo () {
    const licenseSection = this.sections.find(section => section.heading.toLowerCase().includes('license'))
    return licenseSection ? this.formatText(licenseSection.body) : null
  }
}
