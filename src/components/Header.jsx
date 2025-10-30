import React from 'react'

const Header = () => {
    return (
        <header className="border-b sticky top-0 z-100 w-full border-gray-200 h-16 px-5 flex items-center justify-between bg-white">
            <h1 className="text-black font-sans text-xl font-semibold">
                Expense Tracker
            </h1>
        </header>
    )
}

export default Header
