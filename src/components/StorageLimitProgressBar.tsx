import { type FC, useEffect, useState } from 'react'
import { getLocalStorageSize } from '@/utils/storage'

export const StorageLimitProgressBar: FC<{ current: string }> = ({ current }) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024
    const size = getLocalStorageSize('notebook', current)
    const sizeInString = (size / 1024 / 1024).toFixed(2)
    const percent = Math.min((size / MAX_FILE_SIZE) * 100, 100)
    const total = (MAX_FILE_SIZE / 1024 / 1024).toFixed(2)
    const [usage, setUsage] = useState(0);
    const [used, setUsed] = useState('0.00')

    useEffect(() => {
        const update = () => { setUsage(size); setUsed(sizeInString) }
        update()
        window.addEventListener("storage", update);
        return () => window.removeEventListener("storage", update);
    }, []);

    return (
        <div className="w-full mt-2">
            <div className="text-sm text-gray-200 mb-1">Usage:</div>
            <div className="relative w-full bg-gray-200 rounded h-2">
                <div className={`h-full rounded transition-all duration-200 ${ percent < 80 ? 'bg-green-500' : percent < 95 ? 'bg-yellow-500' : 'bg-red-500' }`} style={{ width: `${percent}%` }}>
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-black font-mono">
                        {used} / {total} MB
                    </span>
                </div>
            </div>
        </div>
    )
}
