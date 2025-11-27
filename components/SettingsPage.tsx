import React, { useState } from 'react';
import { 
  User, 
  Palette, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  Search, 
  ChevronRight,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react';

interface SettingsPageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [search, setSearch] = useState('');

  const menuItems = [
    { id: 'profile', label: 'You and Kala Verse', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy and security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'languages', label: 'Languages', icon: Globe },
  ];

  return (
    <div className="flex h-full bg-light-bg dark:bg-dark-bg text-slate-900 dark:text-white pb-20 overflow-hidden">
      {/* Sidebar - Chrome Style */}
      <div className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-surface/50 h-full overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-purple">Settings</h2>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-r-full transition-colors ${
                activeTab === item.id 
                  ? 'bg-accent-purple/10 text-accent-purple border-l-4 border-accent-purple' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-full p-4 md:p-12 max-w-4xl">
        {/* Search Bar */}
        <div className="mb-8 relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search settings" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 rounded-full shadow-sm focus:ring-2 focus:ring-accent-purple outline-none transition-all"
          />
        </div>

        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Profile Section */}
          {activeTab === 'profile' && (
             <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
                   <img src="https://i.pravatar.cc/300?u=alex" alt="Avatar" className="w-16 h-16 rounded-full" />
                   <div className="flex-1">
                      <h3 className="text-lg font-bold">Alex Designer</h3>
                      <p className="text-sm text-gray-500">alex.designer@kalaverse.com</p>
                   </div>
                   <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                      Manage Account
                   </button>
                </div>
                <div className="p-2">
                   <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                      <span className="text-sm font-medium">Sync and Kala Verse services</span>
                      <ChevronRight size={18} className="text-gray-400" />
                   </button>
                   <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                      <span className="text-sm font-medium">Manage other people</span>
                      <ChevronRight size={18} className="text-gray-400" />
                   </button>
                   <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                      <span className="text-sm font-medium">Import bookmarks and settings</span>
                      <ChevronRight size={18} className="text-gray-400" />
                   </button>
                </div>
             </div>
          )}

          {/* Appearance Section */}
          {(activeTab === 'appearance' || activeTab === 'profile') && (
            <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5">
                <h3 className="font-bold text-gray-700 dark:text-gray-200">Appearance</h3>
              </div>
              <div className="p-2">
                <div className="flex items-center justify-between p-4">
                   <div className="flex items-center gap-3">
                      {theme === 'dark' ? <Moon size={20} className="text-accent-purple" /> : <Sun size={20} className="text-accent-yellow" />}
                      <span className="text-sm font-medium">Theme Mode</span>
                   </div>
                   <div className="flex bg-gray-100 dark:bg-black/40 p-1 rounded-full">
                      <button 
                        onClick={() => theme === 'dark' && toggleTheme()}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${theme === 'light' ? 'bg-white shadow text-accent-purple' : 'text-gray-500'}`}
                      >
                        Light
                      </button>
                      <button 
                         onClick={() => theme === 'light' && toggleTheme()}
                         className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${theme === 'dark' ? 'bg-dark-surface shadow text-accent-purple' : 'text-gray-500'}`}
                      >
                        Dark
                      </button>
                   </div>
                </div>
                <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4" />
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <span className="text-sm font-medium">Device Toolbar</span>
                    <Smartphone size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
          )}
          
          {/* Privacy Section (Mock) */}
          {(activeTab === 'privacy' || activeTab === 'profile') && (
            <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5">
                <h3 className="font-bold text-gray-700 dark:text-gray-200">Privacy and security</h3>
              </div>
              <div className="p-2">
                 <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Clear browsing data</span>
                        <span className="text-xs text-gray-500">Clear history, cookies, cache, and more</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                 </button>
                 <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Third-party cookies</span>
                        <span className="text-xs text-gray-500">Third-party cookies are blocked in Incognito mode</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                 </button>
                 <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <span className="text-sm font-medium">Security</span>
                    <ChevronRight size={18} className="text-gray-400" />
                 </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};