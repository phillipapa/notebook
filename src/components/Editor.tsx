import type { FC } from 'react';

export const Editor: FC<{ value: string; onChange: (v: string) => void }> = ({
  value, onChange,
}) => (
  <textarea
    className="w-full h-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Write here..."
  />
)
