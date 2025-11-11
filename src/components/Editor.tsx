import { type FC, useRef, useCallback } from 'react'

export const Editor: FC<{ value: string, onChange: (v: string) => void }> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertAtCurrentPosition = useCallback((text: string) => {
      const textArea = textareaRef.current
      if (!textArea) {
        return
      }

      const { selectionStart, selectionEnd, value: current } = textArea
      const before = current.slice(0, selectionStart)
      const after = current.slice(selectionEnd)
      const newValue = before + text + after

      onChange(newValue)

      const newPosition = selectionStart + text.length
      textArea.setSelectionRange(newPosition, newPosition)
      textArea.focus()
    }, [onChange]
  )

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        const altName = file.name
        insertAtCurrentPosition(`![${altName}](${dataUrl})`)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDoubleClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) {
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        const altName = file.name
        insertAtCurrentPosition(`![${altName}](${dataUrl})`)
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  return (
    <textarea
      ref={textareaRef}
      className="w-full h-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDoubleClick={handleDoubleClick}
      placeholder="TIP: Double click or drag to add image..."
    />
  )
}
