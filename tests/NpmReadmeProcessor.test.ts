// Import built-in node modules for handling files and paths.
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Import the class module to test.
import { NpmReadmeProcessor } from '../lib/NpmReadmeProcessor.js'

// Declare markdown mock files.
const npmMockFile = 'mock-npm-readme.md'

// Resolve file paths using import.meta.url.
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const testFilesDir = join(__dirname, './mock-files')

// Helper function to load test files.
function loadMarkdownFile (fileName: string): string {
  return join(testFilesDir, fileName)
}

describe('NpmReadmeProcessor', () => {
  let processor: NpmReadmeProcessor

  beforeEach(() => {
    const filePath = loadMarkdownFile(npmMockFile)
    processor = new NpmReadmeProcessor(filePath, true)
  })

  test('should extract CLI usage information', () => {
    const result = processor.cliUsage
    expect(result[0].title).toEqual('CLI')
    expect(result[0].body).toContain('You can interact with the package through the CLI')
  })

  test('should extract versioning details', () => {
    const result = processor.versioningDetails
    expect(result[0].title).toEqual('Versioning')
    expect(result[0].body).toContain('This package follows Semantic Versioning guidelines')
  })

  test('should extract scripts information', () => {
    const result = processor.scriptsDetails
    expect(result[0].title).toEqual('Scripts')
    expect(result[0].body).toContain('npm run build')
  })
})
