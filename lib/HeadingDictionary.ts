import { readFileSync } from 'node:fs'

export interface Dictionary {
  [sectionType: string]: string[]  // Maps section types to an array of keywords.
}

export class HeadingDictionary {
  #dictionary: Dictionary

  constructor(data: string | Dictionary){
    // If the data is a string, assume it's a file path and load JSON.
    if (typeof data === 'string') {
      this.#dictionary = this.#loadDictionaryFromFile(data)
    } else {
      // Otherwise, assume it's an object with dictionary data.
      this.#dictionary = data
    }
  }

  // Load JSON dictionary data from a file.
  #loadDictionaryFromFile(filePath: string): Dictionary {
    try {
      const fileContent = readFileSync(filePath, 'utf-8')
      return JSON.parse(fileContent)
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(`Error loading dictionary from file: ${err.message}`)
      } else {
        throw new Error('Unknown error occurred while loading the dictionary')
      }
    }
  }

  // Get the entire dictionary.
  get dictionary(): Dictionary {
    return this.#dictionary
  }

  // Get all alternative keywords for a given section type.
  getKeywordsForSection(section: string): string[] {
    return this.#dictionary[section] || []
  }

  // Add new keywords to a specific section type.
  addKeywordForSection(section: string, keyword: string): void { // TODO: Consider changing keyword to array of keywords.
    if (!this.#dictionary[section]) {
      this.#dictionary[section] = []
    }
    this.#dictionary[section].push(keyword)
  }
}
