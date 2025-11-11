import { marked } from 'marked'

export async function parseMarkdown(markdown: string): Promise<string> {
    return marked(markdown)
}
