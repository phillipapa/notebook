import { Link } from 'react-router-dom';
import { useState } from 'react';
import { type FC } from 'react'

export const Header: FC<{}> = ({}) => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-gray-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    Simple Notebook
                    <div className="flex-shrink-0">
                        <Link to="/notebook" className="text-xl text-black font-bold">Notebook</Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/home" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-500">Home</Link>
                            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-500">About</Link>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setOpen(!open)} type="button" className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none" aria-controls="mobile-menu" aria-expanded={open}>
                            <span className="sr-only">Main menu</span>
                            <svg
                                className={`${open ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg
                                className={`${open ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className={`${open ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-500">Home</Link>
                    <Link to="/about" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-500">About</Link>
                </div>
            </div>
        </nav>
    );
}
