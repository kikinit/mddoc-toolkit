// Import built-in node modules for handling files and paths.
import { dirname } from 'path'

// Import internal dependencies.
import { MarkdownParser, Section } from './MarkdownParser.js'

const DEFAULT_DICTIONARY_PATH = './dictionaries/changelog-dictionary.json'

export class ChangelogProcessor extends MarkdownParser {
  constructor(
    filePath: string,
    dictionaryFilePath: string = DEFAULT_DICTIONARY_PATH
  ) {
    // Determine if the dictionary is custom or default.
    const isCustomDict =
      dirname(dictionaryFilePath) !== dirname(DEFAULT_DICTIONARY_PATH)

    const finalDictionaryPaths = isCustomDict
      ? [dictionaryFilePath] // Custom dictionary, just pass it along.
      : [dictionaryFilePath, DEFAULT_DICTIONARY_PATH] // Add to default dictionary(-ies) already in array.

    super(filePath, finalDictionaryPaths)
  }

  // Extract "unreleased changes"
  get unreleased() {
    return this.getSectionWithTemplate(
      'unreleased',
      'Unreleased section not found.'
    )
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
    return this.getSectionWithTemplate(
      'deprecated',
      'No deprecated features found.'
    )
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

  // CUSTOM PUBLIC METHODS

  // Extract all changes between two specified versions in the changelog,
  getUpdatesBetweenVersions(
    startVersion: string,
    endVersion: string
  ): Section[] {
    const sections = this.sections
    const updates: Section[] = []

    let isInRange = false

    for (const section of sections) {
      if (section.heading.includes(startVersion)) {
        isInRange = true // Start collecting sections after finding the start version.
      }

      if (isInRange) {
        updates.push(section)
      }

      if (section.heading.includes(endVersion)) {
        break // Stop collecting sections once the end version is found.
      }
    }

    if (updates.length === 0) {
      throw new Error(
        `No updates found between versions ${startVersion} and ${endVersion}`
      )
    }

    return updates
  }
}
