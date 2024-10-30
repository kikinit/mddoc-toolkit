# Markdown Documents Toolkit (mddoc-toolkit)

A Typescript library for extracting key sections from Markdown-based files. It works as a general-purpose parser, with customizable extensions (contexts) for specific types of markdown files, such as READMEs in code repositories. The toolkit helps retrieve important information like installation instructions, usage examples, and more, while being adaptable to different README formats.

## Features

- General-purpose Markdown processor with support for multiple heading styles (`#`, `##`, etc.) and underline notation (`===`, `---`).
- Context-based functionality: Extend the processor for specific document types, such as repository README files or changelogs.
- Extracts key sections such as:
  - Project title and description
  - Installation instructions
  - Usage examples
  - Contribution guidelines
  - License information
- Easily customizable for specialized data extraction tasks and additional metadata processing.
- Supports both file-based and direct markdown content processing.

### Planned Features

- Detects and parses links to external resources (e.g., GitHub repositories, websites).
- Detects and parses badges and shields from README files.
- Additional context-specific processors for diverse documentation types (e.g., API docs, blogs, Open Source Project Readmes).
- Better support for npm-specific README formats, including package metadata extraction.
- Better support for changelog files, including version comparison and release notes extraction.

## Installation

To import the toolkit as a module in your project, you can use npm:

```bash
npm install @kikinit/mddoc-toolkit
```

To install the Readme Toolkit manually, you can clone this repository or include it as part of your project.

```bash
git clone https://github.com/kikinit/mddoc-toolkit.git
```

### Compile the Typescript Code

```bash
npm run build
```

## Quick Start

A quick start guide to get an idea of how the library works and how you could use it in your project.

### Example Usage with `RepoReadmeProcessor`

```typescript
import { RepoReadmeProcessor } from 'mddoc-toolkit'

// Example input: The file path of a README.md file
const readmePath = './readme.md'

// Initialize the RepoReadmeProcessor using file path
const repoProcessor = new RepoReadmeProcessor(readmePath, true) // 'true' indicates it's a file path; 'false' for direct markdown content.

// Extract installation instructions
const installationSections = repoProcessor.installationInstructions
console.log('Installation Instructions:', installationSections)

// Extract usage examples
const usageSections = repoProcessor.usageExamples
console.log('Usage Examples:', usageSections)
```

### Example Output:

````json
{
  "installationInstructions": [
    {
      "level": 2,
      "heading": "Installation",
      "body": "To install, run the following commands:\n```bash\nnpm install\n```"
    }
  ],
  "usageExamples": [
    {
      "level": 2,
      "heading": "Usage",
      "body": "To use the project, run:\n```bash\nnpm start\n```"
    }
  ]
}
````

## Extended Usage Examples

### Using the Markdown Parser without Contexts for Basic Markdown Parsing

#### Using the Markdown Parser using filepath

```typescript
import { MarkdownParser } from 'mddoc-toolkit'

// Example markdown file path
const markdownFilePath = './README.md'

// Initialize the parser using a file path
const parser = new MarkdownParser(markdownFilePath, true) // 'true' indicates it is a file path

// Get all sections
const sections = parser.sections
console.log('Parsed sections:', sections)

// Get the title of the markdown (first h1)
const title = parser.title
console.log('Title of the markdown:', title)
```

#### Using MarkdownParser for Direct Markdown Content

```typescript
import { MarkdownParser } from 'mddoc-toolkit'

// Example markdown content
const markdownContent = `
# My Project
## Installation
Run npm install
`

// Initialize the parser with direct markdown content
const parser = new MarkdownParser(markdownContent, false) // 'false' indicates it's direct content

// Get all sections
const sections = parser.sections
console.log('Parsed sections:', sections)

// Get the title of the markdown (first h1)
const title = parser.title
console.log('Title of the markdown:', title)
```

### Using the Markdown Parser with Contexts

By instantiating the parser with a specific context, you can extract additional information from the markdown file. The toolkit includes several built-in contexts, such as `RepoReadmeProcessor`, `NpmReadmeProcessor` and `ChangelogProcessor`, which provide specialized functionality for README and changelog files.

#### Using the Repo Readme Processor Context for README Files

```typescript
import { RepoReadmeProcessor } from 'mddoc-toolkit'

// Example repo README file path
const repoReadmePath = './mock-repo-readme.md'

// Initialize the RepoReadmeProcessor using file path
const repoProcessor = new RepoReadmeProcessor(repoReadmePath, true) // 'true' indicates it is a file path

// Get installation instructions
const installation = repoProcessor.installationInstructions
console.log('Installation Instructions:', installation)

// Get usage examples
const usage = repoProcessor.usageExamples
console.log('Usage Examples:', usage)
```

#### Using the Changelog Processor Context for Changelog Files

```typescript
import { ChangelogProcessor } from 'mddoc-toolkit'

// Example Changelog file path
const changelogPath = './CHANGELOG.md'

// Initialize the ChangelogProcessor using file path
const changelogProcessor = new ChangelogProcessor(changelogPath, true) // 'true' indicates it is a file path

// Get unreleased changes
const unreleasedChanges = changelogProcessor.unreleasedChanges
console.log('Unreleased Changes:', unreleasedChanges)

// Get added features
const addedFeatures = changelogProcessor.addedFeatures
console.log('Added Features:', addedFeatures)

// Get changes between versions
const updates = changelogProcessor.getUpdatesBetweenVersions('1.2.0', '1.4.0')
console.log('Updates between versions:', updates)
```

### Using a Custom Dictionary

With a custom dictionary, you can define additional keywords and phrases to extract specific sections from the markdown file. This is useful for README files with non-standard formats or specialized content that requires custom parsing logic. The custom dictionary should be a JSON file with key-value pairs mapping the section names to their corresponding keywords or phrases. Passing a custom dictionary to the processor will override the default dictionary.

```typescript
import { RepoReadmeProcessor } from 'mddoc-toolkit'

// Example repo README with custom dictionary
const repoReadmePath = './mock-repo-readme.md'
const customDict = './custom-dictionary.json'

// Initialize the processor with a custom dictionary
const processorWithCustomDict = new RepoReadmeProcessor(repoReadmePath, true, [
  // 'true' indicates it is a file path
  customDict,
])

// Extract installation instructions using the custom dictionary
const installation = processorWithCustomDict.installationInstructions
console.log('Installation Instructions with custom dictionary:', installation)
```

## API Documentation

This section provides an overview of the main public methods and properties of the `MarkdownParser`, `RepoReadmeProcessor`, `ChangelogProcessor`, and other key classes within the toolkit.

### `MarkdownParser`

The `MarkdownParser` class is responsible for parsing and extracting structured sections from a Markdown file. This can be extended by context-specific processors (e.g., `RepoReadmeProcessor`, `ChangelogProcessor`) to handle specialized data extraction tasks.

#### Public Methods

- ##### `sections`

  **Type:** `Section[]`

  **Description:** Returns all sections parsed from the markdown content. Each section contains the heading level, title (heading), and body.

- ##### `title`

  **Type:** `string`

  **Description:** Returns the first `h1` title from the markdown file.

  **Throws:** An error if no `h1` heading is found.

- ##### `getHeadingLevels(level: number | null)`

  **Type:** `number | Record<number, number>`

  **Description:** Returns the count of headings for a specific level. If no level is provided, it returns a count of all heading levels.

  **Parameters:**

  - `level`: The level of headings to count. If `null`, counts for all levels are returned.

- ##### `getSectionsByHeading(keyword: string)`

  **Type:** `Section[]`

  **Description:** Retrieves an array of sections whose headings contain the specified keyword (case-insensitive).

  **Parameters:**

  - `keyword`: The keyword to search for in section headings.

  **Throws:** An error if no sections with the provided keyword are found.

- ##### `getSectionsByKeywordsInDictionary(sectionType: string)`

  **Type:** `Section[]`

  **Description:** Retrieves all sections based on keywords from the dictionary provided during initialization. This method returns all sections that match any keyword associated with the given `sectionType`.

  **Parameters:**

  - `sectionType`: The type of section to look for (based on the dictionary).

  **Throws:** An error if no dictionary is provided.

### `RepoReadmeProcessor`

The `RepoReadmeProcessor` extends `MarkdownParser` and provides additional methods specifically for parsing repository README files. It can extract key sections like installation instructions, usage examples, and more.

#### Public Methods

- ##### `installationInstructions`

  **Type:** `Section[]`

  **Description:** Extracts all sections related to installation instructions.

- ##### `usageExamples`

  **Type:** `Section[]`

  **Description:** Extracts all sections related to usage examples, including subheadings.

- ##### `api`

  **Type:** `Section[]`

  **Description:** Extracts all sections related to API documentation.

- ##### `dependencies`

  **Type:** `Section[]`

  **Description:** Extracts all sections related to dependencies.

- ##### `contributionGuidelines`

  **Type:** `Section[]`

  **Description:** Extracts all sections related to contribution guidelines.

- ##### `licenseInfo`

  **Type:** `Section[]`

  **Description:** Extracts all sections related to the license information.

- ##### `titleAndDescription`

  **Type:** `Section`

  **Description:** Extracts the project title (first `h1`) and a brief description (text under the title) from the README file.

### `ChangelogProcessor`

The `ChangelogProcessor` extends `MarkdownParser` to handle changelog-specific sections like added features, changes, and fixes between version ranges.

#### Public Methods

- ##### `unreleasedChanges`

  **Type:** `Section[]`

  **Description:** Extracts the sections related to unreleased changes from the changelog.

- ##### `addedFeatures`

  **Type:** `Section[]`

  **Description:** Extracts sections related to added features.

- ##### `changedFeatures`

  **Type:** `Section[]`

  **Description:** Extracts sections related to changed features.

- ##### `getUpdatesBetweenVersions(startVersion: string, endVersion: string)`

  **Type:** `Section[]`

  **Description:** Extracts all changelog sections between two specified versions.

  **Parameters:**

  - `startVersion`: The version to start collecting updates from.
  - `endVersion`: The version to stop collecting updates at.

### Headings Parsing Regex

The following regex is used to capture different heading styles from markdown: `/^(#+)\s*(.*)|^(.+)\n(=+|-+)\s*$/gm`

Capture groups explained:

- Group 0: (.\*)\n(=+|-+)
  - `match[0]`: The full match for the underline-style heading (e.g., `Heading\n======`).
- Group 1: (#+)\s*(.*)
  - `match[1]`: The full match for the # heading line (e.g., `## Heading` or `#Heading`).
- Group 2: (#+)
  - `match[2]`: The `#` symbols, which determine the heading level (e.g., `#` is level 1, `##` is level 2).
- Group 3: (.\*)
  - `match[3]`: The heading text following the `#` symbols (e.g., `Heading`).
- Group 4: (.+)\n(=+|-+)
  - `match[4]`: The full match for the underline-style heading (e.g., `Heading\n======`).
- Group 5: (.+)
  - `match[5]`: The heading text in underline-style headings (e.g., `Heading`).
- Group 6: (=+|-+)
  - `match[6]`: The underline, which defines whether it is an h1 (`=`) or h2 (`-`) heading.
