// Import built-in node modules for handling files and paths.
import { writeFileSync, unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Import the class module to test.
import { MarkdownParser } from './MarkdownParser.js'

// Get the current directory using import.meta.url.
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('MarkdownParser', () => {
  const tempFilePath = join(__dirname, 'temp-test-file.md')

  beforeEach(() => {
    // Write the markdown content to a temporary file.
    const markdownContent =
`# Heading 1

Some body text.
    
## Heading 2
    
More text here.`
    writeFileSync(tempFilePath, markdownContent)
  })

  afterEach(() => {
    // Clean up by removing the temporary file after each test.
    unlinkSync(tempFilePath)
  })

  // Test case for #readMarkdownFile.
  test('should read and parse markdown content', () => {
    const parser = new MarkdownParser(tempFilePath)
    const sections = parser.sections

    const expectedSections = [
      { level: 1, heading: 'Heading 1', body: 'Some body text.' },
      { level: 2, heading: 'Heading 2', body: 'More text here.' }
    ]

    expect(sections).toEqual(expectedSections)
  })

  // Test case for get title.
  test('should return the correct title', () => {
    const parser = new MarkdownParser(tempFilePath)
    const title = parser.title

    expect(title).toBe('Heading 1')
  })

  // Test case for formatText.
  test('should format text by removing unnecessary characters', () => {
    const parser = new MarkdownParser(tempFilePath)
    const formattedText = parser.formatText('Some text\n\n\n\nMore text')

    expect(formattedText).toBe('Some text\n\nMore text')
  })

  // Test case for countHeadingsByLevel.
  test('should count headings by level', () => {
    const parser = new MarkdownParser(tempFilePath)
    const counts = parser.countHeadingsByLevel()

    const expectedCounts = {
      1: 1, // One h1 heading
      2: 1  // One h2 heading
    }

    expect(counts).toEqual(expectedCounts)
  })

  // Test case for getHeadingLevels.
  test('should return the count of headings for a specific level', () => {
    const parser = new MarkdownParser(tempFilePath)

    expect(parser.getHeadingLevels(1)).toBe(1)  // One h1 heading
    expect(parser.getHeadingLevels(2)).toBe(1)  // One h2 heading
    expect(parser.getHeadingLevels(3)).toBe(0)  // No h3 heading
  })

  // Test case for getSectionsWithHeading.
  test('should return sections with matching heading keyword', () => {
    const parser = new MarkdownParser(tempFilePath)
    const sections = parser.getSectionsWithHeading('heading 1')

    const expectedSection = [
      { level: 1, heading: 'Heading 1', body: 'Some body text.' }
    ]

    expect(sections).toEqual(expectedSection)
  })

  // Test case for throwing error in getSectionsWithHeading.
  test('should throw an error if no sections match the keyword', () => {
    const parser = new MarkdownParser(tempFilePath)

    expect(() => {
      parser.getSectionsWithHeading('non-existent heading')
    }).toThrowError('No heading found with provided keyword: \'non-existent heading\'')
  })
})
