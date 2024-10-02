// Import built-in node modules for handling files and paths.
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Import the class module to test.
import { MarkdownParser } from '../lib/MarkdownParser.js'

// Declare markdown mock files.
const hashMockFile = 'mock-heading-hash.md'
const underlineMockFile = 'mock-heading-underline.md'
const comboMockFile = 'mock-heading-combo.md'

// Declare dictionary mock files.
const mockDictionaryFile = 'mock-dictionary.json'

// Resolve file paths using import.meta.url.
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const testFilesDir = join(__dirname, './mock-files')

// Helper function to load test files.
function loadMockFile(fileName: string): string {
  return join(testFilesDir, fileName)
}

describe('MarkdownParser', () => {
  // TESTS FOR HASH NOTATION

  // Test case for reading and parsing hash-style headings.
  test('should read and parse hash-style markdown content', () => {
    const filePath = loadMockFile(hashMockFile)
    const parser = new MarkdownParser(filePath)
    const sections = parser.sections

    const expectedSections = [
      { level: 1, heading: 'Heading 1', body: 'Some body text.' },
      { level: 2, heading: 'Heading 2', body: 'More text here.' },
      { level: 3, heading: 'Heading 3', body: '' },
    ]

    expect(sections).toEqual(expectedSections)
  })

  // Test case for getting the correct title from hash-style markdown.
  test('should return the correct title from hash-style markdown', () => {
    const filePath = loadMockFile(hashMockFile)
    const parser = new MarkdownParser(filePath)
    const title = parser.title

    expect(title).toBe('Heading 1')
  })

  // TESTS FOR UNDERLINE NOTATION

  // Test case for reading and parsing underline-style markdown content.
  test('should read and parse underline-style markdown content', () => {
    const filePath = loadMockFile(underlineMockFile)
    const parser = new MarkdownParser(filePath)
    const sections = parser.sections

    const expectedSections = [
      { level: 1, heading: 'Heading 1', body: 'Some body text.' },
      { level: 2, heading: 'Heading 2', body: 'More text here.' },
    ]

    expect(sections).toEqual(expectedSections)
  })

  // Test case for counting headings by level in underline-style markdown.
  test('should count headings by level in underline-style markdown', () => {
    const filePath = loadMockFile(underlineMockFile)
    const parser = new MarkdownParser(filePath)
    const counts = parser.countHeadingsByLevel()

    const expectedCounts = {
      1: 1, // One h1 (Heading 1)
      2: 1, // One h2 (Heading 2)
    }

    expect(counts).toEqual(expectedCounts)
  })

  // TESTS FOR COMBINATED NOTATION

  // Test case for reading and parsing markdown content.
  test('should read and parse markdown content (combination of notations)', () => {
    const filePath = loadMockFile(comboMockFile)
    const parser = new MarkdownParser(filePath)
    const sections = parser.sections

    const expectedSections = [
      { level: 1, heading: 'Heading 1', body: 'Some body text.' },
      { level: 2, heading: 'Heading 2', body: 'More text here.' },
      { level: 3, heading: 'Heading 3', body: '' },
      { level: 2, heading: 'Heading 4', body: 'Some more text here.' },
      { level: 1, heading: 'Heading 5', body: 'Even more text here.' },
    ]

    expect(sections).toEqual(expectedSections)
  })

  // Test case for getting the title.
  test('should return the correct title from combination markdown', () => {
    const filePath = loadMockFile(comboMockFile)
    const parser = new MarkdownParser(filePath)
    const title = parser.title

    expect(title).toBe('Heading 1')
  })

  // Test case for counting headings by level.
  test('should count headings by level from combination markdown', () => {
    const filePath = loadMockFile(comboMockFile)
    const parser = new MarkdownParser(filePath)
    const counts = parser.countHeadingsByLevel()

    const expectedCounts = {
      1: 2, // Two h1 headings
      2: 2, // Two h2 headings
      3: 1, // One h3 heading
    }

    expect(counts).toEqual(expectedCounts)
  })

  // Test case for getting heading levels.
  test('should return the count of headings for a specific level from combination markdown', () => {
    const filePath = loadMockFile(comboMockFile)
    const parser = new MarkdownParser(filePath)

    expect(parser.getHeadingLevels(1)).toBe(2) // Two h1 headings
    expect(parser.getHeadingLevels(2)).toBe(2) // Two h2 headings
    expect(parser.getHeadingLevels(3)).toBe(1) // One h3 heading
    expect(parser.getHeadingLevels(4)).toBe(0) // No h4 heading
  })

  // Test case for getting sections with a matching heading keyword.
  test('should return sections with matching heading keyword from combination markdown', () => {
    const filePath = loadMockFile(comboMockFile)
    const parser = new MarkdownParser(filePath)
    const sections = parser.getSectionsByHeading('heading 2')

    const expectedSection = [
      { level: 2, heading: 'Heading 2', body: 'More text here.' },
    ]

    expect(sections).toEqual(expectedSection)
  })

  // Test case for throwing an error when no sections match the keyword.
  test('should throw an error if no sections match the keyword from combination markdown', () => {
    const filePath = loadMockFile(comboMockFile)
    const parser = new MarkdownParser(filePath)

    expect(() => {
      parser.getSectionsByHeading('non-existent heading')
    }).toThrow('No heading found with provided keyword: \'non-existent heading\'')
  })
})

describe('MarkdownParser - Dictionary Methods', () => {
  let parser: MarkdownParser

  beforeEach(() => {
    const filePath = loadMockFile(comboMockFile)
    const dictionaryFilePath = loadMockFile(mockDictionaryFile)
    parser = new MarkdownParser(filePath, [dictionaryFilePath])
  })

  // Test case for retrieving the entire dictionary.
  test('should return the dictionary object', () => {
    const dictionary = parser.dictionary
    expect(dictionary).toBeTruthy()
    expect(dictionary).toBeInstanceOf(Object)
  })

  // Test case for getting keywords for a specific section type.
  test('should return keywords for a specific section type', () => {
    const keywords = parser.getKeywordsForSection('api')
    expect(keywords).toBeInstanceOf(Array)
    expect(keywords).toContain('api')
  })

  // Test case for adding a keyword to a specific section type.
  test('should add a keyword to a section type', () => {
    const sectionType = 'api'
    const newKeyword = 'newApiKeyword'

    // Add the new keyword to the dictionary.
    parser.addKeywordForSection(sectionType, newKeyword)

    // Retrieve the updated keywords for the section.
    const updatedKeywords = parser.getKeywordsForSection(sectionType)

    // Ensure the newly added keyword is in the dictionary.
    expect(updatedKeywords).toContain(newKeyword)
  })
})
