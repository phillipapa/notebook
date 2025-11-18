import type { FC } from 'react'
import { createAlert } from '@/utils/createAlert'

export const SaveButton: FC<{ token: string, noteContent: string }> = ({ token, noteContent }) => {
    const saveNotes = async () => {
        const res = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ content: noteContent }),
        });
        const data = await res.json();
        createAlert('Information', `Note saved with file ID: ${data.fileId}`, 'info')
    }

    return ( <button onClick={saveNotes} className="px-3 py-1 bg-green-400 text-black rounded font-semibold">Save to Drive</button> );
}
