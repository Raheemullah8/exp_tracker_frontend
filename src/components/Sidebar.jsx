import React from "react";
import {
  LayoutDashboard,
  Wallet,
  TrendingDown,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAppContext } from '../context/context';
import { Auth } from '../api';

const Sidebar = () => {
  const { 
    internalActiveSection, 
    setInternalActiveSection, 
    user, 
    signOut, 
    isMobileSidebarOpen, 
    setIsMobileSidebarOpen 
  } = useAppContext();
  
  const navigate = useNavigate();

  const handleNavigation = (section) => {
    setInternalActiveSection(section);
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await Auth.logout();
    } catch {
      // ignore errors
    }
    signOut();
    navigate('/auth');
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden top-16"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static 
        top-16 lg:top-0 
        left-0 
        h-[calc(100vh-4rem)] lg:h-screen 
        w-64 
        bg-white 
        border-r 
        border-gray-200 
        p-6 
        z-50
        transform 
        transition-transform 
        duration-300 
        ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex 
        flex-col
      `}>
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center">
            <img
              src={user?.profileImage || user?.avatar || "https://i.pravatar.cc/150?img=12"}
              alt={user?.name || 'User avatar'}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="mt-4 text-gray-800 font-semibold text-lg">
            {user?.name || 'Guest User'}
          </h2>
          {user?.email && (
            <p className="text-sm text-gray-500">{user.email}</p>
          )}
        </div>

        <nav className="flex-1">
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => handleNavigation('Dashboard')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl ${
                  internalActiveSection === "Dashboard" 
                    ? "bg-purple-600 text-white" 
                    : "text-gray-700"
                } font-medium transition hover:text-white hover:bg-purple-700`}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('Income')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl ${
                  internalActiveSection === "Income" 
                    ? "bg-purple-600 text-white" 
                    : "text-gray-700"
                } font-medium transition hover:text-white hover:bg-purple-700`}
              >
                <Wallet size={20} />
                Income
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('Expenses')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl ${
                  internalActiveSection === "Expenses" 
                    ? "bg-purple-600 text-white" 
                    : "text-gray-700"
                } font-medium transition hover:text-white hover:bg-purple-700`}
              >
                <TrendingDown size={20} />
                Expense
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 font-medium transition hover:text-white hover:bg-purple-700"
              >
                <LogOut size={20} />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;