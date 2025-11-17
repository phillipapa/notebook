import { type FC, useEffect, useState } from 'react'
import { getLocalStorageSize } from '@/utils/storage'

export const StorageLimitProgressBar: FC<{ current: string }> = ({ current }) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024
    const [size, setSize] = useState(getLocalStorageSize('notebook', current));
    const percent = Math.min((size / (5 * 1024 * 1024)) * 100, 100)
    const used = (size / 1024 / 1024).toFixed(2)
    const total = (MAX_FILE_SIZE / 1024 / 1024).toFixed(2)

    useEffect(() => {
        const update = () => { setSize(size); }
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
