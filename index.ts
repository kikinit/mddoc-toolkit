// Imports of parser and contexts
import { MarkdownParser, Section } from './lib/MarkdownParser'
import { RepoReadmeProcessor} from './lib/RepoReadmeProcessor'
import { NpmReadmeProcessor} from './lib/NpmReadmeProcessor'
import { ChangelogProcessor } from './lib/ChangelogProcessor'

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
