import { type FC } from 'react'
import { getLocalStorageSize } from '@/utils/storage'

export const StorageLimitProgress: FC<{ current: string }> = ({ current }) => {
    const size = getLocalStorageSize('notebook', current)
    const percent = Math.min((size / (5 * 1024 * 1024)) * 100, 100)

    return (
        <div className="w-full bg-gray-200 rounded h-2 mt-2">
            <div className={`h-full rounded transition-all duration-200 ${percent < 80 ? 'bg-green-500' : percent < 95 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percent}%` }} />
        </div>
    )
}
