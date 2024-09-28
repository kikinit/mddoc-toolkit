// Class imports
import { MarkdownParser } from './MarkdownParser.js'

// Library imports
import { writeFileSync, unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Get the current directory using import.meta.url.
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('MarkdownParser', () => {
  const tempFilePath = join(__dirname, 'temp-test-file.md')

  beforeEach(() => {
    // Write the markdown content to a temporary file.
    const markdownContent = '# Heading 1\n\nSome body text.\n\n## Heading 2\n\nMore text here.'
    writeFileSync(tempFilePath, markdownContent)
  })

  afterEach(() => {
    // Clean up by removing the temporary file after each test.
    unlinkSync(tempFilePath)
  })

  test('should read and parse markdown sections', () => {
    const parser = new MarkdownParser(tempFilePath)  // Read from the temp file
    const sections = parser.sections

    const expectedSections = [
      { level: 1, heading: 'Heading 1', body: 'Some body text.' },
      { level: 2, heading: 'Heading 2', body: 'More text here.' }
    ]

    expect(sections).toEqual(expectedSections)
  })
})
