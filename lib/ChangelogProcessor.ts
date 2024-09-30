// Import internal dependencies.
import { MarkdownParser } from './MarkdownParser.js'

const DEFAULT_CHANGELOG_DICTIONARY_PATH = './dictionaries/changelog-dictionary.json'

export class ChangelogProcessor extends MarkdownParser {
  constructor(filePath: string, dictionaryFilePath: string = DEFAULT_CHANGELOG_DICTIONARY_PATH) {
    super(filePath, dictionaryFilePath)
  }

  // Extract "unreleased changes"
  get unreleased() {
    return this.getSectionWithTemplate('unreleased', 'Unreleased section not found.')
  }

  // Extract "added features".
  get added() {
    return this.getSectionWithTemplate('added', 'No added features found.')
  }

  // Extract "changed features".
  get changed() {
    return this.getSectionWithTemplate('changed', 'No changes found.')
  }

  // Extract "deprecated features".
  get deprecated() {
    return this.getSectionWithTemplate('deprecated', 'No deprecated features found.')
  }

  // Extract "removed features".
  get removed() {
    return this.getSectionWithTemplate('removed', 'No removed features found.')
  }

  // Extract "fixes".
  get fixed() {
    return this.getSectionWithTemplate('fixed', 'No fixes found.')
  }

  // Extract "security updates".
  get security() {
    return this.getSectionWithTemplate('security', 'No security updates found.')
  }
}
