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
    processor = new NpmReadmeProcessor(filePath)
  })

  test('should extract CLI usage information', () => {
    const result = processor.cli
    expect(result.title).toEqual('CLI')
    expect(result.body).toContain('You can interact with the package through the CLI')
  })

  test('should extract versioning details', () => {
    const result = processor.versioningInfo
    expect(result.title).toEqual('Versioning')
    expect(result.body).toContain('This package follows Semantic Versioning guidelines')
  })

  test('should extract scripts information', () => {
    const result = processor.scripts
    expect(result.title).toEqual('Scripts')
    expect(result.body).toContain('npm run build')
  })
})
