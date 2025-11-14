import { useRef } from 'react'
import { useNotes } from '@/hooks/useNotes'
import { Editor, Preview, Toolbar, StorageLimitProgress, HamburgerMenu } from '@/components/index'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { About, Home } from '@/pages/index'

export default function App() {
    const { text, setText } = useNotes()
    const previewRef = useRef<HTMLDivElement>(null)

    return (
        <BrowserRouter>
            <HamburgerMenu />
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
            <div className="h-screen flex flex-col">
                <header className="p-4 bg-gray-400  flex justify-between items-center">
                    <h1 className="text-xl font-bold"></h1>
                    <Toolbar onReset={() => setText('')} previewRef={previewRef as React.RefObject<HTMLDivElement>} />
                </header>
                <main className="flex flex-1 overflow-hidden">
                    <div className="w-1/2 h-full border-r p-4 justify-center items-center overflow-scroll">
                        <Editor value={text} onChange={setText} />
                        <StorageLimitProgress current={text} />
                    </div>
                    <div className="w-1/2 h-full p-4 flex justify-center items-center">
                        <div ref={previewRef} className="w-full h-full max-w-2xl bg-white rounded-lg shadow-md overflow-hidden" >
                            <Preview markdown={text} />
                        </div>
                    </div>
                </main>
            </div>
        </BrowserRouter>
    )
}
