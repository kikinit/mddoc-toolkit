// import fs from 'node:fs'
import { CodeRepoReadmeParser } from './dist/lib/CodeRepoReadmeParser.js'
// import { parseMarkdown } from './index.js'

// const allSections = parseMarkdown('./aux/test-readmes/README_bics.md')


// const installation = context.getInstallationInstructions()
// const usageExamples = context.getUsageExamples()
// const contributionGuidelines = context.getContributionGuidelines()
// const licenseInfo = context.getLicenseInfo()

// installation, usageExamples, contributionGuidelines, licenseInfo
// fs.writeFileSync('./aux/logs/CRRP-bics_title.log', titleAndDescription.title)
// fs.writeFileSync('./aux/logs/CRRP-bics_Description.log', titleAndDescription.description)
try {
  // const context = new CodeRepoReadmeParser('./aux/test-readmes/README_airbnb.md')
  const context = new CodeRepoReadmeParser('./README.md')
  // console.log('Test get sections:', context.sections)
  // console.log('Test get titleAndDescription:', context.titleAndDescription)
  // console.log('Test get title:', context.title)
  // console.log('Test getHeadingLevels(1):', context.getHeadingLevels(1))
  console.log('Test findSectionByKeywords:', context.getSectionsWithHeading('install'))
  // console.log('Test get usageExamples:', context.usageExamples)
} catch (err) {
  console.error('Error:', err.message)
}
