export function getLocalStorageSize(key: string, value: string): number {
    const currentKey = localStorage.getItem(key)
    const currentSize = currentKey ? new Blob([currentKey]).size : 0
    const newSize = new Blob([value]).size
    return currentSize + newSize
}
