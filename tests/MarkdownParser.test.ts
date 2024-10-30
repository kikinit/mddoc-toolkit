import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { readFileSync } from 'node:fs'
import { MarkdownParser } from '../lib/MarkdownParser.js'

const hashMockFile = 'mock-heading-hash.md'
const underlineMockFile = 'mock-heading-underline.md'
const comboMockFile = 'mock-heading-combo.md'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const testFilesDir = join(__dirname, './mock-files')

function loadMockFile(fileName: string): string {
  return join(testFilesDir, fileName)
}

function readMockFile(fileName: string): string {
  const filePath = loadMockFile(fileName)
  return readFileSync(filePath, 'utf-8')
}

describe('MarkdownParser', () => {
  const hashMockContent = readMockFile(hashMockFile)
  const underlineMockContent = readMockFile(underlineMockFile)
  const comboMockContent = readMockFile(comboMockFile)

  test('should read and parse hash-style markdown from file path', () => {
    const filePath = loadMockFile(hashMockFile)
    const parser = new MarkdownParser(filePath, true)
    const sections = parser.sections

    const expectedSections = [
      { level: 1, heading: 'Heading 1', body: 'Some body text.\n\n## Heading 2\n\nMore text here.\n\n## Heading 3\n\nAdditional text for Heading 3.' },
      { level: 2, heading: 'Heading 2', body: 'More text here.\n\n## Heading 3\n\nAdditional text for Heading 3.' },
      { level: 3, heading: 'Heading 3', body: 'Additional text for Heading 3.' },
    ]

    expect(sections).toEqual(expectedSections)
  })

  test('should read and parse hash-style markdown content directly', () => {
    const parser = new MarkdownParser(hashMockContent, false)
    const sections = parser.sections

    const expectedSections = [
      { level: 1, heading: 'Heading 1', body: 'Some body text.\n\n## Heading 2\n\nMore text here.\n\n## Heading 3\n\nAdditional text for Heading 3.' },
      { level: 2, heading: 'Heading 2', body: 'More text here.\n\n## Heading 3\n\nAdditional text for Heading 3.' },
      { level: 3, heading: 'Heading 3', body: 'Additional text for Heading 3.' },
    ]

    expect(sections).toEqual(expectedSections)
  })

  test('should count headings by level', () => {
    const parser = new MarkdownParser(comboMockContent, false)
    const headingCounts = parser.countHeadingsByLevel()

    const expectedCounts = {
      1: 2, // Two h1 headings
      2: 2, // Two h2 headings
      3: 1, // One h3 heading
    }

    expect(headingCounts).toEqual(expectedCounts)
  })

  test('should format text by trimming extra newlines', () => {
    const parser = new MarkdownParser(hashMockContent, false)
    const unformattedText = 'Some text.\n\n\n\nMore text here.'
    const formattedText = parser['formatText'](unformattedText)

    expect(formattedText).toBe('Some text.\n\nMore text here.')
  })

  test('should return sections with matching heading keyword', () => {
    const parser = new MarkdownParser(comboMockContent, false)
    const sections = parser.getSectionsByHeading('Heading 2')

    const expectedSections = [
      { level: 2, heading: 'Heading 2', body: 'More text here.\n\n## Heading 3\n\nAdditional text for Heading 3.' },
    ]

    expect(sections).toEqual(expectedSections)
  })

  test('should extract the first section', () => {
    const parser = new MarkdownParser(comboMockContent, false)
    const firstSection = parser.extractFirstSection()

    const expectedSection = {
      level: 1,
      heading: 'Heading 1',
      body: 'Some body text.',
    }

    expect(firstSection).toEqual(expectedSection)
  })

  test('should read and parse underline-style markdown from file path', () => {
    const filePath = loadMockFile(underlineMockFile)
    const parser = new MarkdownParser(filePath, true)
    const sections = parser.sections

    const expectedSections = [
      { level: 1, heading: 'Heading 1', body: 'Some body text.\n\n## Heading 2\n\nMore text here.' },
      { level: 2, heading: 'Heading 2', body: 'More text here.' },
      { level: 1, heading: 'Heading 3', body: 'Text under Heading 3.' }
    ]

    expect(sections).toEqual(expectedSections)
  })

  test('should read and parse underline-style markdown content directly', () => {
    const parser = new MarkdownParser(underlineMockContent, false)
    const sections = parser.sections

    const expectedSections = [
      { level: 1, heading: 'Heading 1', body: 'Some body text.\n\n## Heading 2\n\nMore text here.' },
      { level: 2, heading: 'Heading 2', body: 'More text here.' },
      { level: 1, heading: 'Heading 3', body: 'Text under Heading 3.' }
    ]

    expect(sections).toEqual(expectedSections)
  })

  test('should read and parse markdown with combined notations from file path', () => {
    const filePath = loadMockFile(comboMockFile)
    const parser = new MarkdownParser(filePath, true)
    const sections = parser.sections

    const expectedSections = [
      { level: 1, heading: 'Heading 1', body: 'Some body text.\n\n## Heading 2\n\nMore text here.\n\n## Heading 3\n\nAdditional text for Heading 3.\n\n## Heading 4\n\nSome more text here.' },
      { level: 2, heading: 'Heading 2', body: 'More text here.\n\n## Heading 3\n\nAdditional text for Heading 3.' },
      { level: 3, heading: 'Heading 3', body: 'Additional text for Heading 3.' },
      { level: 2, heading: 'Heading 4', body: 'Some more text here.' },
      { level: 1, heading: 'Heading 5', body: 'Even more text here.' },
    ]

    expect(sections).toEqual(expectedSections)
  })

  test('should read and parse markdown with combined notations directly', () => {
    const parser = new MarkdownParser(comboMockContent, false)
    const sections = parser.sections

    const expectedSections = [
      { level: 1, heading: 'Heading 1', body: 'Some body text.\n\n## Heading 2\n\nMore text here.\n\n## Heading 3\n\nAdditional text for Heading 3.\n\n## Heading 4\n\nSome more text here.' },
      { level: 2, heading: 'Heading 2', body: 'More text here.\n\n## Heading 3\n\nAdditional text for Heading 3.' },
      { level: 3, heading: 'Heading 3', body: 'Additional text for Heading 3.' },
      { level: 2, heading: 'Heading 4', body: 'Some more text here.' },
      { level: 1, heading: 'Heading 5', body: 'Even more text here.' },
    ]

    expect(sections).toEqual(expectedSections)
  })
})
