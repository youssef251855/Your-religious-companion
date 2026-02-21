import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Sun, Moon, Settings, Calculator, HeartHandshake, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const navItems = [
    { name: 'الرئيسية', icon: Home, path: '/' },
    { name: 'القرآن الكريم', icon: BookOpen, path: '/quran' },
    { name: 'الأذكار', icon: Sun, path: '/athkar' },
    { name: 'السبحة', icon: Calculator, path: '/tasbih' },
    { name: 'ختمة القرآن', icon: HeartHandshake, path: '/khatam' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* Header (Mobile) */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
        <h1 className="text-xl font-bold text-primary-700 dark:text-primary-400 font-amiri">رفيق رمضان</h1>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-yellow-400"
            >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar / Mobile Drawer */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:static md:block md:h-screen md:sticky md:top-0 border-l dark:border-slate-700`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-400 font-amiri hidden md:block">رفيق رمضان</h1>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="hidden md:block p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
           {/* Close button for mobile inside drawer */}
           <button onClick={() => setMobileMenuOpen(false)} className="md:hidden p-2 text-red-500">
             <X size={24} />
           </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 w-full px-6 text-center text-xs text-gray-400">
           تطوير بواسطة الذكاء الاصطناعي
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen md:h-auto pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto w-full">
            {children}
        </div>
      </main>
      
    </div>
  );
};

export default Layout;
