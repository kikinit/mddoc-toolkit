import MarkdownParser from './lib/MarkdownParser.js'

const parser = new MarkdownParser()
const sections = parser.parseMarkdown('./README.md')
console.log(sections)