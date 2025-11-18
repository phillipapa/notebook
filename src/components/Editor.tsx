import { type FC, useRef, useCallback, useState, useEffect } from 'react'
import type { PreviewImage } from '@/configs/interfaces'
import { createAlert } from '@/utils/createAlert'

export const Editor: FC<{ value: string, onChange: (v: string) => void }> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [previewList, setPreviewList] = useState<PreviewImage[]>([])
  const BYTES_SIZE: number = 1024
  const MAX_FILE_SIZE: number = 3.5 * BYTES_SIZE * BYTES_SIZE
  const maxSizeInString = (MAX_FILE_SIZE / 1024 / 1024).toFixed(1)
  const i = Math.floor(Math.log(MAX_FILE_SIZE) / Math.log(BYTES_SIZE))
  const sizeMegabytes: number | string = parseFloat((MAX_FILE_SIZE / Math.pow(BYTES_SIZE, i)).toFixed(2))
  const placeholderText: string = `Tip: Write or drag image here (max ${maxSizeInString} MB)`
  const minRows: number = 5

  const autoResizeTextarea = () => {
    const textArea = textareaRef.current;
    if (!textArea) {
      return
    };
    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
  };

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
    const files = Array.from(e.dataTransfer.files ?? [])
    if (files.length) {
      processImage(files)
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

  const processImage = (files: File[]) => {
    const previews: PreviewImage[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
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

  useEffect(() => {
    autoResizeTextarea();
  }, [value]);

  return (
    <div className="relative h-full">
      <textarea
        ref={textareaRef}
        className="w-full h-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDoubleClick={handleDoubleClick}
        placeholder={placeholderText}
        aria-label="Double click to insert image"
        rows={minRows}
        style={{ maxHeight: "calc(100vh - 12rem)" }}
      />

      {previewList.length > 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Image preview">
          <div className="bg-white rounded p-4 max-w-xs w-full">
            <img src={previewList[0].url} alt={previewList[0].file.name} className="w-full h-auto mb-4 rounded"/>
            <div className="flex justify-end space-x-2">
              <button onClick={cancelInsert} className="px-3 py-1 bg-yellow-300 rounded">Cancel</button>
              <button onClick={() => confirmInsert(previewList[0])} className="px-3 py-1 bg-green-300 rounded"> Insert</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
