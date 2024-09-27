import { CodeRepoReadmeParser } from './lib/CodeRepoReadmeParser.js'

const context = new CodeRepoReadmeParser('./aux/test-readmes/README_airbnb.md')

const titleAndDescription = context.getTitleAndDescription()
const installation = context.getInstallationInstructions()
const usageExamples = context.getUsageExamples()
const contributionGuidelines = context.getContributionGuidelines()
const licenseInfo = context.getLicenseInfo()

console.log(titleAndDescription, installation, usageExamples, contributionGuidelines, licenseInfo)
