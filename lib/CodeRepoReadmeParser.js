import { MarkdownParser } from './MarkdownParser.js'

export class CodeRepoReadmeParser extends MarkdownParser {
  constructor (filePath) {
    super(filePath)
  }


  // Extract the project title and description.
  getTitleAndDescription () {
    const sections = this.getSections()
    const titleSection = sections.find(section => section.level === 1)
    return titleSection
      ? {
        title: titleSection.heading,
        description: this.formatText(titleSection.body)
      }
      : null
  }

  // Extract the installation instructions.
  getInstallationInstructions () {
    const sections = this.getSections()
    const installSection = sections.find(section => section.heading.toLowerCase().includes('installation'))
    return installSection ? this.formatText(installSection.body) : null
  }

  // Extract usage examples.
  getUsageExamples () {
    const sections = this.getSections()
    const usageSection = sections.find(section => section.heading.toLowerCase().includes('usage'))
    return usageSection ? this.formatText(usageSection.body) : null
  }

  // Extract contribution guidelines.
  getContributionGuidelines () {
    const sections = this.getSections()
    const contributionSection = sections.find(section => section.heading.toLowerCase().includes('contribution'))
    return contributionSection ? this.formatText(contributionSection.body) : null
  }

  // Extract license information.
  getLicenseInfo () {
    const sections = this.getSections()
    const licenseSection = sections.find(section => section.heading.toLowerCase().includes('license'))
    return licenseSection ? this.formatText(licenseSection.body) : null
  }
}
