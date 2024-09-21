# Readme Parser

A JavaScript library for parsing and extracting key information from code repository README files written in Markdown. This parser focuses on retrieving important sections such as the project description, installation instructions, usage examples, and more.

## Features (Work in Progress)

- Extracts project title and description
- Retrieves installation instructions
- Parses usage examples and code snippets
- Identifies contribution guidelines
- Extracts license information

### Future implementation

- Detects badges and shields from README files
- Supports multiple Markdown header levels

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

To install the Readme Parser module, you can clone this repository or include it as part of your project manually.

```bash
git clone https://github.com/legitmattias/readme-parser.git
```
