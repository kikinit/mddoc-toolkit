# Markdown Documents Toolkit

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

### Usage Examples

#### Using the Markdown Parser without Contexts for Basic Markdown parsing

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

#### Using the Markdown Parser with Contexts

By instantiating the parser with a specific context, you can extract additional information from the markdown file. The toolkit includes several built-in contexts, such as *RepoReadmeProcessor*, *NpmReadmeProcessor* and *ChangelogProcessor*, which provide specialized functionality for README and changelog files.

##### Using the Repo Readme Processor Context for README Files

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

##### Using the Changelog Processor Context for Changelog Files
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

#### Using a Custom Dictionary for Section Extraction

With a custom dictionary, you can define additional keywords and phrases to extract specific sections from the markdown file. This is useful for README files with non-standard formats or specialized content that requires custom parsing logic.

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

## Installation

To install the Readme Toolkit, you can clone this repository or include it as part of your project manually.

```bash
git clone https://github.com/kikinit/readme-toolkit.git
```

To import the toolkit as a module in your project, you can use npm:

```bash
npm install mddoc-toolkit
``` 

