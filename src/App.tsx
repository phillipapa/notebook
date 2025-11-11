import { useRef } from 'react'
import { useNotes } from '@/hooks/useNotes'
import { Editor, Preview, Toolbar } from '@/components/index'

export default function App() {
    const { text, setText } = useNotes()
    const previewRef = useRef<HTMLDivElement>(null)

    return (
        <div className="h-screen flex flex-col">
            <header className="p-4 bg-indigo-700 text-white flex justify-between items-center">
                <h1 className="text-xl font-semibold">Markdown Notebook</h1>
                <Toolbar
                    onReset={() => setText('')}
                    previewRef={previewRef}
                />
            </header>

            <main className="flex flex-1 overflow-hidden">
                <div className="w-1/2 h-full border-r">
                    <Editor value={text} onChange={setText} />
                </div>
                <div className="w-1/2 h-full" ref={previewRef}>
                    <Preview markdown={text} />
                </div>
            </main>
        </div>
    )
}
