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

- Detects and parses badges and shields from README files.
- Additional context-specific processors for diverse documentation types (e.g., API docs, changelogs).
- Better support for npm-specific README formats, including package metadata extraction.

### Headings parsing regex

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
git clone https://github.com/legitmattias/readme-toolkit.git
```
