import MarkdownParser from './lib/MarkdownParser.js'

const parser = new MarkdownParser('./README.md')
const sections = parser.getSections()
console.log(sections)
