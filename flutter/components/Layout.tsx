import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PieChart, 
  Archive, 
  User as UserIcon, 
  Menu, 
  X, 
  Box,
  LogOut,
  PlusCircle,
  Sun,
  Moon
} from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  user: User;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLogout, user, isDarkMode, onToggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const navItems = [
    { path: '/', icon: <PlusCircle size={20} />, label: 'Anı Oluştur' },
    { path: '/archives', icon: <Box size={20} />, label: 'Anı Kutusu' },
    { path: '/summaries', icon: <PieChart size={20} />, label: 'Özetler' },
    { path: '/profile', icon: <UserIcon size={20} />, label: 'Profil' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3 shadow-md">
              <Box size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Dijital Hafıza</span>
            <button onClick={toggleSidebar} className="ml-auto lg:hidden text-gray-500 dark:text-gray-400">
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 mb-1
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'}
                  `}
                >
                  <span className={`mr-3 ${isActive ? 'text-blue-600 dark:text-white' : ''}`}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions: Theme & User */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            
            {/* Theme Toggle */}
            <button 
              onClick={onToggleTheme}
              className="flex items-center w-full px-4 py-2 mb-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
            >
              {isDarkMode ? <Sun size={20} className="mr-3 text-amber-400" /> : <Moon size={20} className="mr-3 text-blue-500" />}
              {isDarkMode ? 'Açık Mod' : 'Koyu Mod'}
            </button>

            <div className="flex items-center mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white mr-3 shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-black transition-colors duration-200">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center justify-between px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <div className="flex items-center">
                 <button onClick={toggleSidebar} className="text-gray-600 dark:text-gray-300 mr-4">
                    <Menu size={24} />
                </button>
                <span className="text-lg font-bold text-gray-900 dark:text-white">Dijital Hafıza</span>
            </div>
        </header>

        {/* Page Content Wrapper - No padding or scroll here, delegated to pages */}
        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};