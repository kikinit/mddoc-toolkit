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
function loadMarkdownFile(fileName: string): string {
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

  test('should extract added features', () => {
    const result = processor.addedFeatures
    expect(result.title).toEqual('Added')
    expect(result.body).toContain('- Implemented new logging system.')
  })

  test('should extract changed features', () => {
    const result = processor.changedFeatures
    expect(result.title).toEqual('Changed')
    expect(result.body).toContain('- Minor update to UI layout.')
  })

  test('should extract deprecated features', () => {
    const result = processor.deprecatedFeatures
    expect(result.title).toEqual('Deprecated')
    expect(result.body).toContain(
      'Legacy OAuth integration has been deprecated'
    )
  })

  test('should extract removed features', () => {
    const result = processor.removedFeatures
    expect(result.title).toEqual('Removed')
    expect(result.body).toContain(
      'Support for Node.js version 12 has been removed'
    )
  })

  test('should extract bug fixes', () => {
    const result = processor.bugFixes
    expect(result.title).toEqual('Fixed')
    expect(result.body).toContain(
      '- Resolved issue with session timeout handling.'
    )
  })

  test('should extract security updates', () => {
    const result = processor.securityUpdates
    expect(result.title).toEqual('Security')
    expect(result.body).toContain(
      'Security vulnerability patched in token generation'
    )
  })

  test('should get updates between two close versions 2.2.1 and 2.2.0', () => {
    const filePath = loadMarkdownFile(changelogMockFile)
    const processor = new ChangelogProcessor(filePath)

    const updates = processor.getUpdatesBetweenVersions('2.2.1', '2.2.0')

    const expectedUpdates = [
      {
        level: 2,
        heading: '[2.2.1] - 2024-08-25',
        body: '',
      },
      {
        level: 3,
        heading: 'Changed',
        body: '- Minor update to UI layout.',
      },
      {
        level: 2,
        heading: '[2.2.0] - 2024-08-20',
        body: '',
      },
    ]

    expect(updates).toEqual(expectedUpdates)
  })

  test('should throw error if no updates found between two versions', () => {
    expect(() => processor.getUpdatesBetweenVersions('3.0.0', '2.1.0')).toThrow(
      'No updates found between versions 3.0.0 and 2.1.0'
    )
  })
})
