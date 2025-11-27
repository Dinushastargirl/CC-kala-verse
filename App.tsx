import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  MessageSquare, 
  Settings, 
  User, 
  Search,
  Moon,
  Sun,
  Palette as PaletteIcon,
  LogOut,
  Users,
  Plus,
  MoreVertical,
  Briefcase,
  Sparkles,
  X,
  Zap,
  ArrowRight,
  Grid as GridIcon,
  Wrench
} from 'lucide-react';
import { TOOLS, LOGO_DESKTOP, LOGO_MOBILE, MOCK_PROJECTS, MOCK_USER } from './constants';
import { ToolDefinition, View, Theme, ToolCategory } from './types';
import { ToolRunner } from './components/ToolRunner';
import { AIChat } from './components/AIChat';
import { CommunityFeed } from './components/CommunityFeed';
import { SettingsPage } from './components/SettingsPage';
import { ProfilePage } from './components/ProfilePage';
import { DesignEditor } from './components/DesignEditor';

const CATEGORIES: ToolCategory[] = ['Creator', 'Designer', 'Strategist', 'Utility'];

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [view, setView] = useState<View>('dashboard');
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);

  // Handle Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Handle Search Redirect from Dashboard
  const handleHeroSearch = (query: string) => {
      setSearchQuery(query);
      if (query.trim().length > 0 && view !== 'tools') {
          setView('tools');
      }
  };

  // Tools filtering logic
  const filteredTools = TOOLS.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory ? t.category === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  const handleToolSelect = (tool: ToolDefinition) => {
    setActiveTool(tool);
    setView('tools');
  };

  const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center justify-center gap-1 p-2 md:px-6 md:py-3 rounded-2xl transition-all min-w-[64px]
        ${active 
          ? 'text-accent-pink bg-accent-pink/10 scale-105' 
          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'
        }`}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} className={`transition-transform duration-300 ${active ? '-translate-y-1' : ''}`} />
      <span className="text-[10px] md:text-xs font-bold tracking-wide">{label}</span>
      {active && <div className="w-1 h-1 rounded-full bg-accent-pink mt-1 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />}
    </button>
  );

  const renderToolsDirectory = () => (
     <div className="p-4 md:p-8 pb-32 min-h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
         {/* Sticky Header with Search & Filter */}
         <div className="sticky top-0 z-30 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-xl py-4 -mx-4 px-4 md:-mx-8 md:px-8 mb-8 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-all">
             <div className="max-w-4xl mx-auto space-y-4">
                 {/* Search Bar */}
                 <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-pink/20 to-accent-purple/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-accent-purple/50 focus-within:border-accent-purple transition-all overflow-hidden">
                        <Search className="ml-4 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search tools, templates, or AI models..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none outline-none py-3 px-4 text-gray-800 dark:text-white placeholder:text-gray-400"
                            autoFocus={view === 'tools' && !searchQuery}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="mr-4 text-gray-400 hover:text-accent-pink">
                                <X size={18} />
                            </button>
                        )}
                    </div>
                 </div>

                 {/* Categories */}
                 <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-start md:justify-center">
                    <button 
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                            selectedCategory === null 
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-md scale-105' 
                            : 'bg-white dark:bg-dark-surface text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                    >
                        All Tools
                    </button>
                    {CATEGORIES.map(cat => {
                        const icons = {
                            'Creator': Sparkles,
                            'Designer': PaletteIcon,
                            'Strategist': Briefcase,
                            'Utility': Wrench
                        };
                        const Icon = (icons as any)[cat] || Sparkles;
                        const isActive = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(isActive ? null : cat)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                                    isActive
                                    ? 'bg-accent-purple text-white border-accent-purple shadow-md shadow-purple-500/20 scale-105'
                                    : 'bg-white dark:bg-dark-surface text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-accent-purple/50'
                                }`}
                            >
                                <Icon size={14} />
                                {cat}
                            </button>
                        )
                    })}
                 </div>
             </div>
         </div>

         {/* Tools Grid */}
         <div className="max-w-6xl mx-auto">
             {filteredTools.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTools.map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => handleToolSelect(tool)}
                          className="group relative bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-left border border-transparent hover:border-accent-purple/30 hover:-translate-y-1 overflow-hidden h-full flex flex-col"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-accent-purple/5 rounded-bl-full transition-all group-hover:to-accent-purple/10" />
                          
                          <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-[#252525] flex items-center justify-center text-gray-700 dark:text-white group-hover:bg-accent-purple group-hover:text-white transition-colors shadow-sm">
                                <tool.icon size={24} />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md">
                                  {tool.category}
                              </span>
                          </div>
                          
                          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-accent-purple transition-colors">{tool.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1 leading-relaxed mb-4">{tool.description}</p>
                          
                          <div className="flex items-center text-xs font-bold text-accent-pink opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                              Launch Tool <ArrowRight size={12} className="ml-1" />
                          </div>
                        </button>
                    ))}
                 </div>
             ) : (
                 <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                     <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-300">
                         <Search size={40} />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white">No tools found</h3>
                     <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        We couldn't find any tools matching "{searchQuery}". Try adjusting your filters or search terms.
                     </p>
                     <button 
                        onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                        className="px-6 py-2 bg-accent-purple text-white rounded-full font-bold hover:bg-purple-600 transition-colors"
                     >
                         Clear Filters
                     </button>
                 </div>
             )}
         </div>
     </div>
  );

  const renderContent = () => {
    if (view === 'editor') {
      return (
        <DesignEditor onBack={() => setView('dashboard')} />
      );
    }
    
    // Tools View Handling
    if (view === 'tools') {
        // If a specific tool is active, run it
        if (activeTool) {
            return (
                <div className="pb-24">
                  <ToolRunner tool={activeTool} onBack={() => { setActiveTool(null); /* Stay in tools view */ }} />
                </div>
            );
        }
        // Otherwise show the Tools Directory
        return renderToolsDirectory();
    }

    if (view === 'chat') {
      return (
        <div className="h-full pb-24 p-4 max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300">
           <AIChat />
        </div>
      );
    }
    if (view === 'community') {
        return (
            <div className="h-full pb-24 overflow-y-auto">
                <CommunityFeed />
            </div>
        );
    }
    if (view === 'settings') {
        return (
            <SettingsPage theme={theme} toggleTheme={toggleTheme} />
        )
    }
    if (view === 'profile') {
        return (
            <ProfilePage />
        )
    }

    // Dashboard View (Redesigned for Kala Verse Identity)
    return (
      <div className="p-4 md:p-8 space-y-12 pb-32 animate-in fade-in duration-500">
        
        {/* Hero Section: Creative Universe Portal */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/20 group h-[400px] flex items-center">
             {/* Abstract Fluid Background */}
             <div className="absolute inset-0 bg-gray-900">
                <img 
                    src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop" 
                    alt="Abstract Fluid" 
                    className="w-full h-full object-cover opacity-80 mix-blend-overlay transition-transform duration-[20s] ease-linear group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"></div>
             </div>

             <div className="relative z-10 p-8 md:p-16 flex flex-col items-start justify-center w-full max-w-4xl">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-accent-cyan uppercase tracking-wider text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <Zap size={12} className="text-accent-yellow" fill="currentColor" />
                    <span>Verse 2.0 Live</span>
                 </div>
                 
                 <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                     Unleash Your <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-purple">Creative Intelligence</span>
                 </h1>
                 
                 {/* Glassmorphic Search Bar in Hero - redirects to tools */}
                 <div className="relative max-w-lg w-full group/search animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-pink to-accent-purple rounded-xl blur opacity-25 group-hover/search:opacity-50 transition-opacity"></div>
                    <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden transition-all focus-within:bg-white/20 focus-within:border-white/40">
                        <Search className="ml-4 text-gray-400 group-focus-within/search:text-white transition-colors" size={20} />
                        <input 
                          type="text" 
                          placeholder="Search tools, templates, or ideas..." 
                          value={searchQuery}
                          onChange={(e) => handleHeroSearch(e.target.value)}
                          className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-400 py-4 px-4 font-medium"
                        />
                    </div>
                 </div>
             </div>
        </div>

        {/* Dashboard Content - Recent Designs & Quick Access */}
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Quick Stats / Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-accent-pink to-red-500 rounded-2xl p-6 text-white shadow-lg shadow-pink-500/20 transform hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><Users size={20} /></div>
                        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">HOT</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Community</h3>
                    <p className="text-white/80 text-sm">3 new challenges available today.</p>
                </div>
                <div className="bg-gradient-to-br from-accent-purple to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/20 transform hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><GridIcon size={20} /></div>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Tools Library</h3>
                    <p className="text-white/80 text-sm">{TOOLS.length} AI-powered tools ready.</p>
                </div>
                <div className="bg-gradient-to-br from-accent-blue to-cyan-500 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 transform hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-4">
                         <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><Briefcase size={20} /></div>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Projects</h3>
                    <p className="text-white/80 text-sm">Continue working on "Summer Campaign".</p>
                </div>
            </div>

            {/* Recent Designs */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-heading font-bold text-gray-800 dark:text-gray-100">Recent Designs</h2>
                    <button className="text-accent-purple hover:underline text-sm font-semibold">See all</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <button 
                        onClick={() => setView('editor')}
                        className="group flex flex-col items-center justify-center aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-accent-pink hover:bg-accent-pink/5 transition-all bg-white/50 dark:bg-white/5"
                    >
                        <div className="w-14 h-14 rounded-full bg-accent-pink text-white flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform shadow-pink-500/30">
                            <Plus size={28} />
                        </div>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Create New Project</span>
                    </button>

                    {MOCK_PROJECTS.map(project => (
                        <div key={project.id} className="group cursor-pointer">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 shadow-sm group-hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all p-2 bg-white/90 dark:bg-black/80 rounded-lg shadow-sm hover:scale-110 cursor-pointer backdrop-blur-sm">
                                    <MoreVertical size={16} className="text-gray-600 dark:text-gray-300" />
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 truncate px-1">{project.title}</h3>
                            <p className="text-xs text-gray-500 px-1">{project.type} • {project.lastEdited}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trending/Suggested Tools Teaser */}
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-heading font-bold text-gray-800 dark:text-gray-100">Suggested For You</h2>
                    <button onClick={() => setView('tools')} className="text-accent-purple hover:underline text-sm font-semibold">Browse all</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {TOOLS.slice(0,3).map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => handleToolSelect(tool)}
                          className="flex items-center gap-4 p-4 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-accent-purple/50 transition-all hover:shadow-md text-left group"
                        >
                             <div className="p-3 bg-accent-purple/10 text-accent-purple rounded-xl group-hover:bg-accent-purple group-hover:text-white transition-colors">
                                 <tool.icon size={20} />
                             </div>
                             <div>
                                 <h4 className="font-bold text-gray-900 dark:text-white">{tool.name}</h4>
                                 <p className="text-xs text-gray-500 dark:text-gray-400">{tool.category}</p>
                             </div>
                        </button>
                     ))}
                </div>
            </div>

        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-light-bg dark:bg-dark-bg text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-accent-pink selection:text-white overflow-hidden">
      
      {/* Top Header - Only show if not in Editor view */}
      {view !== 'editor' && (
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-40 sticky top-0">
           <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setView('dashboard'); setSearchQuery(''); }}>
               <img src={LOGO_DESKTOP} alt="Kala Verse" className="h-10 w-auto hidden md:block" />
               <img src={LOGO_MOBILE} alt="Kala Verse" className="h-8 w-auto md:hidden" />
           </div>
           
           <div className="flex items-center gap-4">
               <button className="md:hidden p-2 text-gray-500" onClick={() => setView('tools')}>
                  <Search size={24} />
               </button>
               <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                   <div className="text-right hidden md:block">
                       <p className="text-sm font-bold text-gray-900 dark:text-white">{MOCK_USER.name}</p>
                       <p className="text-xs text-accent-pink font-semibold">{MOCK_USER.role}</p>
                   </div>
                   <button 
                    onClick={() => setView('profile')}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple p-0.5 hover:scale-105 transition-transform"
                   >
                       <div className="w-full h-full rounded-full bg-white dark:bg-dark-surface flex items-center justify-center overflow-hidden">
                           <img src={MOCK_USER.avatar} alt="Profile" className="w-full h-full object-cover" />
                       </div>
                   </button>
                   {/* Small Settings Gear near profile for quick access */}
                   <button onClick={() => setView('settings')} className="p-2 text-gray-400 hover:text-accent-purple transition-colors">
                      <Settings size={20} />
                   </button>
               </div>
           </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scroll-smooth relative">
        {renderContent()}
      </main>

      {/* Bottom Taskbar Navigation - Only show if not in Editor view */}
      {view !== 'editor' && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl px-2 py-2 md:px-6 md:py-3 flex items-center justify-between gap-1 md:gap-6 min-w-[320px] max-w-[90vw] md:max-w-3xl mx-auto transition-all hover:scale-[1.01]">
                  <NavItem 
                      icon={LayoutGrid} 
                      label="Home" 
                      active={view === 'dashboard'} 
                      onClick={() => { setView('dashboard'); setSearchQuery(''); setSelectedCategory(null); }} 
                  />
                  <NavItem 
                      icon={GridIcon} 
                      label="Tools" 
                      active={view === 'tools' && !activeTool} 
                      onClick={() => { setView('tools'); setActiveTool(null); }} 
                  />
                  
                   {/* Center Action Button - Create New Project */}
                   <div className="relative -mt-12 group mx-2 md:mx-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-pink to-accent-purple rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
                        <button 
                            onClick={() => setView('editor')}
                            className="relative w-16 h-16 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple shadow-lg shadow-pink-500/30 text-white flex items-center justify-center hover:scale-110 transition-transform z-10"
                        >
                            <Plus size={32} />
                        </button>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Create
                        </span>
                   </div>

                  <NavItem 
                      icon={Users} 
                      label="Community" 
                      active={view === 'community'} 
                      onClick={() => setView('community')} 
                  />
                  <NavItem 
                      icon={MessageSquare} 
                      label="AI Chat" 
                      active={view === 'chat'} 
                      onClick={() => setView('chat')} 
                  />
            </div>
        </div>
      )}

    </div>
  );
};

export default App;