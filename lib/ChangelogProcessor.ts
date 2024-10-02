// Import built-in node modules for handling files and paths.
import { dirname } from 'path'

// Import third-party library.
import semver from 'semver'

// Import internal dependencies.
import { MarkdownParser, Section } from './MarkdownParser.js'

const DEFAULT_DICTIONARY_PATH = './dictionaries/changelog-dictionary.json'

export class ChangelogProcessor extends MarkdownParser {
  constructor(
    filePath: string,
    dictionaryFilePaths: string[] = [DEFAULT_DICTIONARY_PATH]
  ) {
    // Determine if the dictionary is custom or default
    const isCustomDict =
      dictionaryFilePaths.length === 1 &&
      dirname(dictionaryFilePaths[0]) !== dirname(DEFAULT_DICTIONARY_PATH)

    // If it's custom, use the custom dictionary alone, otherwise merge with default.
    const finalDictionaryPaths = isCustomDict
      ? dictionaryFilePaths // Custom dictionary, just pass it along.
      : [...dictionaryFilePaths, DEFAULT_DICTIONARY_PATH] // Merge with the default dictionary.

    super(filePath, finalDictionaryPaths)
  }

  // Extract unreleased changes
  get unreleasedChanges() {
    return this.getSectionWithTemplate(
      'unreleased',
      'Unreleased section not found.'
    )
  }

  // Extract added features.
  get addedFeatures() {
    return this.getSectionWithTemplate('added', 'No added features found.')
  }

  // Extract changed features.
  get changedFeatures() {
    return this.getSectionWithTemplate('changed', 'No changes found.')
  }

  // Extract deprecated features.
  get deprecatedFeatures() {
    return this.getSectionWithTemplate(
      'deprecated',
      'No deprecated features found.'
    )
  }

  // Extract removed features.
  get removedFeatures() {
    return this.getSectionWithTemplate('removed', 'No removed features found.')
  }

  // Extract fixes and corrections.
  get bugFixes() {
    return this.getSectionWithTemplate('fixed', 'No bug fixes found.')
  }

  // Extract security updates.
  get securityUpdates() {
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

    // Ensure the versions are in the correct order.
    if (semver.lt(startVersion, endVersion)) {
      ;[startVersion, endVersion] = [endVersion, startVersion]
    }

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
