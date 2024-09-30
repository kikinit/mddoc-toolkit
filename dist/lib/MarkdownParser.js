var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _MarkdownParser_instances, _MarkdownParser_content, _MarkdownParser_sections, _MarkdownParser_dictionary, _MarkdownParser_readMarkdownFile, _MarkdownParser_extractSections, _MarkdownParser_extractHeadings, _MarkdownParser_determineHeadingLevelFromMatch, _MarkdownParser_extractBody;
// Import built-in node modules for handling files.
import { readFileSync } from 'node:fs';
// Import internal dependencies.
import { HeadingDictionary } from './HeadingDictionary.js';
export class MarkdownParser {
    constructor(filePath, dictionaryFilePath) {
        _MarkdownParser_instances.add(this);
        _MarkdownParser_content.set(this, void 0);
        _MarkdownParser_sections.set(this, void 0);
        _MarkdownParser_dictionary.set(this, void 0);
        __classPrivateFieldSet(this, _MarkdownParser_content, __classPrivateFieldGet(this, _MarkdownParser_instances, "m", _MarkdownParser_readMarkdownFile).call(this, filePath), "f");
        __classPrivateFieldSet(this, _MarkdownParser_sections, __classPrivateFieldGet(this, _MarkdownParser_instances, "m", _MarkdownParser_extractSections).call(this, __classPrivateFieldGet(this, _MarkdownParser_content, "f")), "f");
        __classPrivateFieldSet(this, _MarkdownParser_dictionary, dictionaryFilePath ? new HeadingDictionary(dictionaryFilePath).dictionary : null, "f");
    }
    // CONTEXT RELATED METHODS
    // Dictionary-based search for context-specific sections.
    findSectionByKeywords(sectionType) {
        if (!__classPrivateFieldGet(this, _MarkdownParser_dictionary, "f"))
            throw new Error('No dictionary provided for keyword search.');
        const keywords = __classPrivateFieldGet(this, _MarkdownParser_dictionary, "f")[sectionType] || [];
        return __classPrivateFieldGet(this, _MarkdownParser_sections, "f").find(section => keywords.some(keyword => section.heading.toLowerCase().includes(keyword)));
    }
    // General template method for extracting sections.
    getSectionWithTemplate(sectionType, errorMessage) {
        const section = this.findSectionByKeywords(sectionType);
        if (!section)
            throw new Error(errorMessage);
        return {
            title: section.heading,
            body: this.formatText(section.body)
        };
    }
    // GENERAL PUBLIC METHODS
    // Format a section of text, removing unnecessary characters.
    formatText(text) {
        return text
            .replace(/\n{3,}/g, '\n\n') // Replace 3 or more newlines with two (preserving paragraph breaks)
            .trim(); // Trim any leading or trailing spaces
    }
    // Count number of headings of each level.
    countHeadingsByLevel() {
        const headingCounts = {};
        __classPrivateFieldGet(this, _MarkdownParser_sections, "f").forEach(section => {
            const level = section.level;
            headingCounts[level] = (headingCounts[level] || 0) + 1;
        });
        return headingCounts;
    }
    // Get all section objects with level, heading and body.
    get sections() {
        return __classPrivateFieldGet(this, _MarkdownParser_sections, "f");
    }
    // Get title of README, that is, the h1 (first h1 if multiple).
    get title() {
        const titleSection = __classPrivateFieldGet(this, _MarkdownParser_sections, "f").find(section => section.level === 1);
        if (!titleSection) {
            throw new Error('Title (h1) not found in the README.');
        }
        return titleSection.heading;
    }
    // Get number of headings for the level provided (all levels if no level provided).
    getHeadingLevels(level = null) {
        // Create the heading counts object
        const headingCounts = this.countHeadingsByLevel();
        // If a specific level is provided, return the count for that level.
        if (level) {
            return headingCounts[level] || 0; // Return 0 if the level doesn't exist.
        }
        return headingCounts;
    }
    // Get an array of the section(s) for the provided heading keyword.
    getSectionsWithHeading(keyword) {
        // TODO: Validate input
        const matchingSections = __classPrivateFieldGet(this, _MarkdownParser_sections, "f").filter(section => section.heading.toLowerCase().includes(keyword.toLowerCase()));
        if (matchingSections.length === 0) {
            throw new Error(`No heading found with provided keyword: '${keyword}'`);
        }
        return matchingSections;
    }
}
_MarkdownParser_content = new WeakMap(), _MarkdownParser_sections = new WeakMap(), _MarkdownParser_dictionary = new WeakMap(), _MarkdownParser_instances = new WeakSet(), _MarkdownParser_readMarkdownFile = function _MarkdownParser_readMarkdownFile(filePath) {
    if (!filePath) {
        throw new Error('File path is not provided or is empty.');
    }
    try {
        return readFileSync(filePath, 'utf-8');
    }
    catch (err) {
        console.error(`Error reading file: ${err.message}`);
        throw err; // Re-throwing the error after logging it.
    }
}, _MarkdownParser_extractSections = function _MarkdownParser_extractSections(content) {
    const headings = __classPrivateFieldGet(this, _MarkdownParser_instances, "m", _MarkdownParser_extractHeadings).call(this, content);
    const sections = [];
    headings.forEach((heading, index) => {
        var _a;
        // Find where the next heading starts, or the end of the content.
        const nextHeadingIndex = ((_a = headings[index + 1]) === null || _a === void 0 ? void 0 : _a.startIndex) || content.length;
        // Extract the body text between the current heading and the next one.
        const bodyText = __classPrivateFieldGet(this, _MarkdownParser_instances, "m", _MarkdownParser_extractBody).call(this, content, heading.endIndex, nextHeadingIndex);
        sections.push({
            level: heading.level,
            heading: heading.text,
            body: bodyText.trim() // Trim to remove excess whitespace.
        });
    });
    return sections;
}, _MarkdownParser_extractHeadings = function _MarkdownParser_extractHeadings(content) {
    // Regex to match headings: both # style and underline style.
    const headingRegex = /^(#+)\s*(.*)|^(.+)\n(=+|-+)\s*$/gm;
    const headings = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
        const level = __classPrivateFieldGet(this, _MarkdownParser_instances, "m", _MarkdownParser_determineHeadingLevelFromMatch).call(this, match);
        const text = match[1] ? match[2].trim() : match[3].trim();
        // Capture both start and end indices for the heading.
        headings.push({
            level: level,
            text: text,
            startIndex: match.index,
            endIndex: headingRegex.lastIndex
        });
    }
    return headings;
}, _MarkdownParser_determineHeadingLevelFromMatch = function _MarkdownParser_determineHeadingLevelFromMatch(match) {
    if (match[1]) {
        return match[1].length; // Number of `#` determines heading level.
    }
    else if (match[3] && match[4]) {
        const underline = match[4].trim();
        return underline[0] === '=' ? 1 : 2; // '=' for h1, '-' for h2.
    }
    return 0;
}, _MarkdownParser_extractBody = function _MarkdownParser_extractBody(content, startIndex, endIndex) {
    return content.slice(startIndex, endIndex);
};
export default MarkdownParser;
