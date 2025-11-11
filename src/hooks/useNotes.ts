import { useState, useEffect } from 'react'

const STORAGE_KEY = 'notebook'

export function useNotes() {
  const [text, setText] = useState<string>('')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
        setText(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, text)
  }, [text])

  return { text, setText }
}
