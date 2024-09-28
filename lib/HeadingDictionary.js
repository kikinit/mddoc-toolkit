import { readFileSync } from 'node:fs'

export class HeadingDictionary {
  #dictionary

  constructor(data) {
    // If the data is a string, assume it's a file path and load JSON.
    if (typeof data === 'string') {
      this.#dictionary = this.#loadDictionaryFromFile(data)
    } else {
      // Otherwise, assume it's an object with dictionary data.
      this.#dictionary = data
    }
  }

  // Load JSON dictionary data from a file.
  #loadDictionaryFromFile(filePath) {
    try {
      const fileContent = readFileSync(filePath, 'utf-8')
      return JSON.parse(fileContent)
    } catch (err) {
      throw new Error(`Error loading dictionary from file: ${err.message}`)
    }
  }

  // Get the entire dictionary.
  get dictionary() {
    return this.#dictionary
  }

  // Get all alternative keywords for a given section type.
  getKeywordsForSection(section) {
    return this.#dictionary[section] || []
  }

  // Add new keywords to a specific section type.
  addKeywordForSection(section, keyword) { // TODO: Consider changing keyword to array of keywords.
    if (!this.#dictionary[section]) {
      this.#dictionary[section] = []
    }
    this.#dictionary[section].push(keyword)
  }
}
