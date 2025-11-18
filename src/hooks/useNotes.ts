import { useState, useEffect } from 'react'
import { getLocalStorageSize } from '@/utils/storage'
import { createAlert } from '@/utils/createAlert'

const STORAGE_KEY = 'notebook'
const BYTES_SIZE = 1024
const MAX_FILE_SIZE = 3.5 * BYTES_SIZE * BYTES_SIZE
const i = Math.floor(Math.log(MAX_FILE_SIZE) / Math.log(BYTES_SIZE))
const sizeMegabytes: number | string = parseFloat((MAX_FILE_SIZE / Math.pow(BYTES_SIZE, i)).toFixed(2))

export function useNotes() {
  const [text, setText] = useState<string>('')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
        setText(saved)
    }
  }, [])

  useEffect(() => {
    const newSize = getLocalStorageSize(STORAGE_KEY, text)
    if (newSize > MAX_FILE_SIZE) {
      createAlert('Warning', `Cannot save note, exceeded the limit of ${sizeMegabytes} MB. Currently used: ${(newSize / 1024 / 1024).toFixed(2)} MB`, 'warning')
      return
    }
    localStorage.setItem(STORAGE_KEY, text)
  }, [text])

  return { text, setText }
}