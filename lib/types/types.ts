/**
 * Represents a parsed section of a Markdown document.
 *
 * @interface Section
 * @property {number} level - The level of the heading (e.g., 1 for h1, 2 for h2).
 * @property {string} heading - The text of the heading.
 * @property {string} body - The content/body text that follows the heading.
 */
export interface Section {
  level: number
  heading: string
  body: string
}
