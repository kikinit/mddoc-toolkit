// Import built-in node modules for handling files and paths.
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Import the class module to test.
import { RepoReadmeProcessor } from '../lib/RepoReadmeProcessor.js'

// Declare markdown mock files.
const repoMockFile = 'mock-repo-readme.md'

// Resolve file paths using import.meta.url.
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const testFilesDir = join(__dirname, './mock-files')

// Helper function to load test files.
function loadMarkdownFile(fileName: string): string {
  return join(testFilesDir, fileName)
}

describe('RepoReadmeProcessor', () => {
  let processor: RepoReadmeProcessor

  beforeEach(() => {
    const filePath = loadMarkdownFile(repoMockFile)
    processor = new RepoReadmeProcessor(filePath, true)
  })

  test('should extract installation instructions', () => {
    const result = processor.installationInstructions
    expect(result[0].title).toEqual('Installation')
    expect(result[0].body).toContain('npm install')
  })

  test('should extract usage examples', () => {
    const result = processor.usageExamples
    expect(result[0].title).toEqual('Usage')
    expect(result[0].body).toContain('npm start')
  })

  test('should extract API documentation', () => {
    const result = processor.api
    expect(result[0].title).toEqual('API')
    expect(result[0].body).toContain('/api/v1/auth')
  })

  test('should extract configuration information', () => {
    const result = processor.configuration
    expect(result[0].title).toEqual('Configuration')
    expect(result[0].body).toContain('JWT_SECRET')
  })

  test('should extract dependencies list', () => {
    const result = processor.dependencies
    expect(result[0].title).toEqual('Dependencies')
    expect(result[0].body).toContain('express')
  })

  test('should extract contribution guidelines', () => {
    const result = processor.contributionGuidelines
    expect(result[0].title).toEqual('Contribution')
    expect(result[0].body).toContain('Contribute by creating a pull request')
  })

  test('should extract license information', () => {
    const result = processor.licenseInfo
    expect(result[0].title).toEqual('License')
    expect(result[0].body).toContain('MIT License')
  })

  test('should extract the project title and description', () => {
    const result = processor.titleAndDescription
    expect(result.heading).toEqual('Project Title')
    expect(result.body).toContain('This repository contains the source code for the project.')
  })
})
