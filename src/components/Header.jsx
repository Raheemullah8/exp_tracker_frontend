import React from 'react';
import { Menu, X } from 'lucide-react';
import { useAppContext } from '../context/context';

const Header = () => {
    const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useAppContext();

    return (
        <header className="border-b sticky top-0 z-50 w-full border-gray-200 h-16 px-5 flex items-center justify-between bg-white">
            <h1 className="text-black font-sans text-xl font-semibold">
                Expense Tracker
            </h1>
            
            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
                {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </header>
    );
};

export default Header;