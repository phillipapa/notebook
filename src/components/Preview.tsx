import type { FC } from 'react'
import { parseMarkdown } from '@/utils/markdown'

export const Preview: FC<{ markdown: string }> = ({ markdown }) => (
  <div
    className="prose max-w-none p-4 h-full overflow-auto"
    dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
  />
)
