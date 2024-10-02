# Markdown Documents Toolkit (mddoc-toolkit)

A Typescript library for extracting key sections from Markdown-based files. It works as a general-purpose parser, with customizable extensions (contexts) for specific types of markdown files, such as READMEs in code repositories. The toolkit helps retrieve important information like installation instructions, usage examples, and more, while being adaptable to different README formats.

## Features

- General-purpose Markdown processor with support for multiple heading styles (`#`, `##`, etc.) and underline notation (`===`, `---`).
- Extracts key sections such as:
  - Project title and description
  - Installation instructions
  - Usage examples
  - Contribution guidelines
  - License information
- Context-based functionality: Extend the processor for specific document types, such as repository README files or changelogs.
- Easily customizable for specialized data extraction tasks and additional metadata processing.

### Planned Features

- Detects and parses links to external resources (e.g., GitHub repositories, websites).
- Detects and parses badges and shields from README files.
- Additional context-specific processors for diverse documentation types (e.g., API docs, blogs, Open Source Project Readmes).
- Better support for npm-specific README formats, including package metadata extraction.
- Better support for changelog files, including version comparison and release notes extraction.

## Installation

To install the Readme Toolkit, you can clone this repository or include it as part of your project manually.

```bash
git clone https://github.com/kikinit/mddoc-toolkit.git
```

To import the toolkit as a module in your project, you can use npm:

```bash
npm install @kikinit/mddoc-toolkit
``` 

## Usage Examples

### Using the Markdown Parser without Contexts for Basic Markdown Parsing

```typescript
import { MarkdownParser } from 'mddoc-toolkit'

// Example markdown file path
const markdownFilePath = './README.md'

// Initialize the parser
const parser = new MarkdownParser(markdownFilePath)

// Get all sections
const sections = parser.sections
console.log('Parsed sections:', sections)

// Get the title of the markdown (first h1)
const title = parser.title
console.log('Title of the markdown:', title)

// Get sections with a specific heading keyword
const apiSections = parser.getSectionsByHeading('API')
console.log('API Sections:', apiSections)

```

### Using the Markdown Parser with Contexts

By instantiating the parser with a specific context, you can extract additional information from the markdown file. The toolkit includes several built-in contexts, such as `RepoReadmeProcessor`, `NpmReadmeProcessor` and `ChangelogProcessor`, which provide specialized functionality for README and changelog files.

#### Using the Repo Readme Processor Context for README Files

```typescript
import { RepoReadmeProcessor } from 'mddoc-toolkit'

// Example repo README file
const repoReadmePath = './mock-repo-readme.md'

// Initialize the RepoReadmeProcessor
const repoProcessor = new RepoReadmeProcessor(repoReadmePath)

// Get installation instructions
const installation = repoProcessor.installationInstructions
console.log('Installation Instructions:', installation)

// Get usage examples
const usage = repoProcessor.usageExamples
console.log('Usage Examples:', usage)

// Get API documentation
const api = repoProcessor.api
console.log('API Documentation:', api)

// Get configuration options
const config = repoProcessor.configuration
console.log('Configuration Options:', config)
```

#### Using the Changelog Processor Context for Changelog Files
```typescript
import { ChangelogProcessor } from 'mddoc-toolkit'

// Example Changelog file
const changelogPath = './CHANGELOG.md'

// Initialize the ChangelogProcessor
const changelogProcessor = new ChangelogProcessor(changelogPath)

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
const processorWithCustomDict = new RepoReadmeProcessor(repoReadmePath, [customDict])

// Extract installation instructions using the custom dictionary
const installation = processorWithCustomDict.installationInstructions
console.log('Installation Instructions with custom dictionary:', installation)
```
## API Documentation

Here is the API documentation for the public methods and getter properties in your library, formatted for inclusion in a README file.

---

## API Documentation

### `MarkdownParser`

This class provides the core functionality for parsing and extracting structured sections from a Markdown file. It can be extended by context-specific processors such as `RepoReadmeProcessor`, `NpmReadmeProcessor`, and `ChangelogProcessor`.

#### Public Methods

- #### `parseMarkdown(filePath: string): Section[]`
   - **Description:** Parses the specified Markdown file and returns the extracted sections.
   - **Parameters:**
     - `filePath`: The path to the Markdown file.
   - **Returns:** An array of `Section` objects representing the parsed sections from the file.

#### Getter Properties

- #### `sections`
   - **Type:** `Section[]`
   - **Description:** Retrieves an array of all parsed sections, each containing a heading and its associated body text.
   - **Usage:** Access it as a property: `parser.sections`.

- #### `title`
   - **Type:** `string`
   - **Description:** Retrieves the first h1 title from the markdown file.
   - **Usage:** Access it as a property: `parser.title`.
   - **Throws:** An error if no h1 title is found.

- #### `getHeadingLevels(level: number | null): number | Record<number, number>`
   - **Description:** Returns the count of headings for a specific level or all levels if no level is provided.
   - **Parameters:**
     - `level`: The level of headings to count. If `null`, counts for all levels are returned.
   - **Returns:** The count of headings for the specified level or a record of counts for all levels.

- #### `getSectionsByHeading(keyword: string): Section[]`
   - **Description:** Retrieves an array of sections whose headings contain the specified keyword.
   - **Parameters:**
     - `keyword`: The keyword to search for in section headings.
   - **Returns:** An array of sections that contain the keyword in their headings.
   - **Throws:** An error if no sections are found with the provided keyword.

### `RepoReadmeProcessor`

This class extends `MarkdownParser` and provides additional methods for extracting sections relevant to repository README files, such as installation instructions and usage examples.

#### Public Methods

- #### `installationInstructions`
   - **Type:** `{ title: string; body: string }`
   - **Description:** Extracts the installation instructions from the README file.
   - **Usage:** Access it as a property: `processor.installationInstructions`.
   - **Throws:** An error if the installation instructions section is not found.

- #### `usageExamples`
   - **Type:** `{ title: string; body: string }`
   - **Description:** Extracts usage examples from the README file.
   - **Usage:** Access it as a property: `processor.usageExamples`.
   - **Throws:** An error if the usage examples section is not found.

- #### `api`
   - **Type:** `{ title: string; body: string }`
   - **Description:** Extracts the API documentation from the README file.
   - **Usage:** Access it as a property: `processor.api`.
   - **Throws:** An error if the API section is not found.

- #### `dependencies`
   - **Type:** `{ title: string; body: string }`
   - **Description:** Extracts the dependencies list from the README file.
   - **Usage:** Access it as a property: `processor.dependencies`.
   - **Throws:** An error if the dependencies section is not found.

- #### `licenseInfo`
   - **Type:** `{ title: string; body: string }`
   - **Description:** Extracts the license information from the README file.
   - **Usage:** Access it as a property: `processor.licenseInfo`.
   - **Throws:** An error if the license section is not found.

### `NpmReadmeProcessor`

This class extends `RepoReadmeProcessor` and provides additional methods for extracting NPM-specific sections, such as CLI usage and scripts.

#### Public Methods

- #### `cliUsage`
   - **Type:** `{ title: string; body: string }`
   - **Description:** Extracts the CLI usage information from the README file.
   - **Usage:** Access it as a property: `processor.cliUsage`.
   - **Throws:** An error if the CLI section is not found.

- #### `versioningInfo`
   - **Type:** `{ title: string; body: string }`
   - **Description:** Extracts the versioning details from the README file.
   - **Usage:** Access it as a property: `processor.versioningInfo`.
   - **Throws:** An error if the versioning section is not found.

- #### `scriptsDetails`
   - **Type:** `{ title: string; body: string }`
   - **Description:** Extracts the scripts information from the README file.
   - **Usage:** Access it as a property: `processor.scriptsDetails`.
   - **Throws:** An error if the scripts section is not found.

### `ChangelogProcessor`

This class extends `MarkdownParser` to handle changelog-specific sections, such as added features, changes, and fixes.

#### Public Methods

- #### `unreleasedChanges`
   - **Type:** `{ title: string; body: string }`
   - **Description:** Extracts the unreleased changes from the changelog.
   - **Usage:** Access it as a property: `changelogProcessor.unreleasedChanges`.
   - **Throws:** An error if the unreleased section is not found.

- #### `addedFeatures`
   - **Type:** `{ title: string; body: string }`
   - **Description:** Extracts the added features from the changelog.
   - **Usage:** Access it as a property: `changelogProcessor.addedFeatures`.
   - **Throws:** An error if the added section is not found.

- #### `changedFeatures`
   - **Type:** `{ title: string; body: string }`
   - **Description:** Extracts the changed features from the changelog.
   - **Usage:** Access it as a property: `changelogProcessor.changedFeatures`.
   - **Throws:** An error if the changed section is not found.

- #### `getUpdatesBetweenVersions(startVersion: string, endVersion: string): Section[]`
   - **Description:** Extracts all changes between two specified versions in the changelog.
   - **Parameters:**
     - `startVersion`: The starting version to search for.
     - `endVersion`: The ending version to search for.
   - **Returns:** An array of sections representing the changes between the two versions.
   - **Throws:** An error if no updates are found between the versions.

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
