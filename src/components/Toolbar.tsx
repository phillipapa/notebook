import { type FC, useState } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { SaveButton, SignInMenu } from './index';

export const Toolbar: FC<{ onReset: () => void, previewRef: React.RefObject<HTMLDivElement>, noteContent: string }> = ({ onReset, previewRef, noteContent }) => {
    const [token, setToken] = useState<string | null>(null);
    const exportPDF = async () => {

        if (!previewRef || !previewRef.current) {
            return
        }

        const canvas = await html2canvas(previewRef.current)
        const imgData = canvas.toDataURL('image/png')
        let document: jsPDF;

        if (canvas.width > canvas.height) {
            document = new jsPDF('l', 'mm', [canvas.width, canvas.height]);
        }
        else {
            document = new jsPDF('p', 'mm', [canvas.height, canvas.width]);
        }

        document.addImage(imgData, 'png', 10, 10, canvas.width, canvas.height)
        document.save('notes.pdf')
    }

    return (
        <div className="flex space-x-2">
            <SignInMenu onLogin={(t) => setToken(t)} onLogout={() => setToken(null)} />
            <button className="px-3 py-1 bg-blue-400 text-black rounded font-semibold" onClick={exportPDF}> Export as PDF </button>
            <button className="px-3 py-1 bg-red-400 text-black rounded font-semibold" onClick={onReset}> Reset </button>
            {token && <SaveButton token={token} noteContent={noteContent} />}
        </div>
    )
}
