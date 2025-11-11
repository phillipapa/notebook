import { type FC, useRef, useCallback, useState } from 'react'
import Swal, { type SweetAlertIcon } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import type { PreviewImage } from '@/interfaces'

export const Editor: FC<{ value: string, onChange: (v: string) => void }> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const createAlert = (title: string, text: string, icon?: SweetAlertIcon): void => {
    withReactContent(Swal).fire({
      title,
      text,
      icon,
      theme: 'auto'
    })
  }

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
    input.multiple = true
    input.onchange = () => {
      const files = Array.from(input.files ?? [])
      if (files.length) {
        processImage(files)
      }
    }
    input.click()
  }

  const [previewList, setPreviewList] = useState<PreviewImage[]>([])
  const MAX_SIZE = 10 * 1024 * 1024
  const sizeMegabytes = Math.floor(Math.log(MAX_SIZE) / Math.log(1024));

  const processImage = (files: File[]) => {
    const previews: PreviewImage[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue
      }
      if (file.size > MAX_SIZE) {
        createAlert('Warning', `${file.name} exceeds maximum file limit of ${sizeMegabytes} MB`, 'warning')
        continue
      }

      const reader = new FileReader()
      reader.onload = () => {
        previews.push({ file, url: reader.result as string })
        if (previews.length === files.length) {
          setPreviewList(previews)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const confirmInsert = (preview: PreviewImage) => {
    const altName = preview.file.name
    insertAtCurrentPosition(`![${altName}](${preview.url})`)
    setPreviewList((queue) => queue.filter((p) => p !== preview))
  }

  const cancelInsert = () => setPreviewList([])

  return (
    <textarea
      ref={textareaRef}
      className="w-full h-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDoubleClick={handleDoubleClick}
      placeholder="Double click or drag to add image (max 10 MB)"
    />
  )
}
