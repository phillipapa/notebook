import type { FC } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { createAlert } from '@/utils/createAlert'

export const Toolbar: FC<{ onReset: () => void, previewRef: React.RefObject<HTMLDivElement>, token: string, noteContent: string }> = ({ onReset, previewRef, token, noteContent }) => {
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

    const saveNotes = async () => {
        const res = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ content: noteContent }),
        });
        const data = await res.json();
        createAlert('Information', `Note saved with file ID: ${data.fileId}`, 'info')
    }

    return (
        <div className="flex space-x-2">
            <button className="px-3 py-1 bg-green-400 text-black rounded font-semibold" onClick={saveNotes}> Save to Drive </button>
            <button className="px-3 py-1 bg-blue-400 text-black rounded font-semibold" onClick={exportPDF}> Export as PDF </button>
            <button className="px-3 py-1 bg-red-400 text-black rounded font-semibold" onClick={onReset}> Reset </button>
        </div>
    )
}
