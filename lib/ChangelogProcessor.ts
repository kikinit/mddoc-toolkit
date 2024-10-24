// Import built-in node modules for handling files and paths.
import { dirname } from 'path'

// Import third-party library.
import semver from 'semver'

// Import internal dependencies.
import { MarkdownParser, Section } from './MarkdownParser.js'

// Path to default dictionary file for this context.
const DEFAULT_DICTIONARY_PATH = './dictionaries/changelog-dictionary.json'

/**
 * A class for parsing and extracting structured sections from a changelog file.
 *
 * The `ChangelogProcessor` context is a class that extends the `MarkdownParser`
 * to provide methods for extracting changelog-specific information.
 *
 * @class ChangelogProcessor
 * @extends MarkdownParser
 * @property {string} #content - The raw Markdown content of the changelog.
 * @property {Section[]} #sections - An array of parsed sections from the changelog, each containing a heading and body content.
 * @property {Dictionary | null} #dictionary - The merged dictionary for keyword-based searches in the changelog, or null if none.
 *
 * @throws Will throw an error if a section is not found, or if the file cannot be read.
 */

export class ChangelogProcessor extends MarkdownParser {
  /**
   * Constructs a new `ChangelogProcessor` instance.
   *
   * @param {string} markdownFilePath - The path to the README markdown file.
   * @param dictionaryFilePaths - An array of paths to the dictionaries for keyword matching.
   */
  constructor(
    markdownInput: string,
    isFilePath: boolean = true,
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

    super(markdownInput, isFilePath, finalDictionaryPaths)
  }

  /**
   *Extract information about unreleased changes from the changelog.
   */
  get unreleasedChanges() {
    return this.getSectionWithTemplate(
      'unreleased',
      'Unreleased section not found.'
    )
  }

  /**
   *Extract information about added features from the changelog.
   */
  get addedFeatures() {
    return this.getSectionWithTemplate('added', 'No added features found.')
  }

  /**
   *Extract information about changed features from the changelog.
   */
  get changedFeatures() {
    return this.getSectionWithTemplate('changed', 'No changes found.')
  }

  /**
   *Extract information about deprecated features from the changelog.
   */
  get deprecatedFeatures() {
    return this.getSectionWithTemplate(
      'deprecated',
      'No deprecated features found.'
    )
  }

  /**
   *Extract information about removed features from the changelog.
   */
  get removedFeatures() {
    return this.getSectionWithTemplate('removed', 'No removed features found.')
  }

  /**
   *Extract information about fixes and corrections from the changelog.
   */
  get bugFixes() {
    return this.getSectionWithTemplate('fixed', 'No bug fixes found.')
  }

  /**
   *Extract information about security updatesfrom the changelog.
   */
  get securityUpdates() {
    return this.getSectionWithTemplate('security', 'No security updates found.')
  }

  // CUSTOM PUBLIC METHODS

  /**
   * Extracts all changes between two specified versions in the changelog.
   *
   * The method compares the provided versions using semantic versioning (`semver`),
   * and ensures they are in the correct order. It returns all sections of the
   * changelog that fall between the start and end versions (inclusive).
   *
   * @param {string} startVersion - The version to start collecting updates from.
   * @param {string} endVersion - The version to stop collecting updates at.
   *
   * @returns {Section[]} An array of `Section` objects representing the changelog updates between the two versions.
   *
   * @throws {Error} If no updates are found between the specified versions.
   */
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
