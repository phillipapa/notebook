import { useState, useEffect, type FC } from 'react'
import { parseMarkdown } from '@/utils/markdown'

export const Preview: FC<{ markdown: string }> = ({ markdown }) => {
  const [previewHtml, setPreviewHtml] = useState<string>('')

  useEffect(() => {
    const empty = markdown.trim() === ''
    if (empty) {
      setPreviewHtml(
        `<div class="text-gray-600 italic text-center mt-8">Preview will be shown here...</div>`
      )
    } else {
      parseMarkdown(markdown).then(setPreviewHtml)
    }
    
  }, [markdown])

  return (
    <div
      className="prose max-w-none p-4 h-full overflow-auto"
      dangerouslySetInnerHTML={{ __html: previewHtml }}
    />
  )
}
