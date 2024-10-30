// Imports of parser and contexts
import { Section } from './lib/types/types.js'
import { MarkdownParser } from './lib/MarkdownParser.js'
import { RepoReadmeProcessor} from './lib/RepoReadmeProcessor.js'
import { NpmReadmeProcessor} from './lib/NpmReadmeProcessor.js'
import { ChangelogProcessor } from './lib/ChangelogProcessor.js'

// Export the core classes.
export {
  MarkdownParser,
  RepoReadmeProcessor,
  NpmReadmeProcessor,
  ChangelogProcessor
}


// Export a convenience function for quick parsing.
export function parseMarkdown(filePath: string): Section[] {
  const parser = new MarkdownParser(filePath)
  return parser.sections
}
