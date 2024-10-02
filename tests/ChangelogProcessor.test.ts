// Import built-in node modules for handling files and paths.
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Import the class module to test.
import { ChangelogProcessor } from '../lib/ChangelogProcessor.js'

// Declare markdown mock files.
const changelogMockFile = 'mock-changelog.md'

// Resolve file paths using import.meta.url.
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const testFilesDir = join(__dirname, './mock-files')

// Helper function to load test files.
function loadMarkdownFile (fileName: string): string {
  return join(testFilesDir, fileName)
}

describe('ChangelogProcessor', () => {
  let processor: ChangelogProcessor

  beforeEach(() => {
    const filePath = loadMarkdownFile(changelogMockFile)
    processor = new ChangelogProcessor(filePath)
  })

  test('should extract unreleased changes', () => {
    const result = processor.unreleasedChanges
    expect(result.title).toEqual('Unreleased')
    expect(result.body).toContain('This feature is in development')
  })

  test('should extract added changes', () => {
    const result = processor.addedFeatures
    expect(result.title).toEqual('Added')
    expect(result.body).toContain('New authentication system')
  })

  test('should extract fixed changes', () => {
    const result = processor.bugFixes
    expect(result.title).toEqual('Fixed')
    expect(result.body).toContain('Fixed a bug')
  })
})
