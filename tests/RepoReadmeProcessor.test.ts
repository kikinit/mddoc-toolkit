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
    processor = new RepoReadmeProcessor(filePath)
  })

  test('should extract installation instructions', () => {
    const result = processor.installationInstructions
    expect(result.title).toEqual('Installation')
    expect(result.body).toContain('npm install')
  })

  test('should extract usage examples', () => {
    const result = processor.usageExamples
    expect(result.title).toEqual('Usage')
    expect(result.body).toContain('npm start')
  })

  test('should extract license information', () => {
    const result = processor.licenseInfo
    expect(result.title).toEqual('License')
    expect(result.body).toContain('MIT License')
  })
})
