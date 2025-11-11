import { useState, useEffect, type FC } from 'react'
import { parseMarkdown } from '@/utils/markdown'

export const Preview: FC<{ markdown: string }> = ({ markdown }) => {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    parseMarkdown(markdown).then(setHtml)
  }, [markdown])

  return (
    <div
      className="prose max-w-none p-4 h-full overflow-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
