// Imports
import { MarkdownParser } from './lib/MarkdownParser.js'

// Export the core classes.
export { MarkdownParser }

// Export a convenience function for quick parsing.
export function parseMarkdown(filePath) {
  const parser = new MarkdownParser(filePath)
  return parser.getSections()
}
