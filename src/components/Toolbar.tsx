import type { FC } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export const Toolbar: FC<{ onReset: () => void, previewRef: React.RefObject<HTMLDivElement> | null }> = ({ onReset, previewRef }) => {
    const exportPDF = async () => {

        if (!previewRef) {
            return
        }

        const canvas = await html2canvas(previewRef.current)
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF()
        pdf.addImage(imgData, 'PNG', 0, 0, 1000, 1000)
        pdf.save('note.pdf')
    }

    return (
        <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-300 text-white rounded" onClick={exportPDF}> Export PDF </button>
            <button className="px-3 py-1 bg-gray-400 text-white rounded" onClick={onReset}> Reset </button>
        </div>
    )
}
