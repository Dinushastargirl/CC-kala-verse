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
  Wrench,
  Instagram,
  Youtube,
  FileText,
  Image as ImageIcon,
  Monitor,
  Layout
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
  const [editorTemplate, setEditorTemplate] = useState<string | null>(null);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0 && view !== 'tools') setView('tools');
  };

  const handleCreateNew = (type: string = 'Custom Size') => {
    setEditorTemplate(type);
    setView('editor');
  };

  const filteredTools = TOOLS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      className={`group flex flex-col items-center justify-center gap-1 p-2 md:px-4 md:py-2 rounded-2xl transition-all min-w-[50px] md:min-w-[64px]
        ${active 
          ? 'text-accent-pink bg-accent-pink/10 scale-105' 
          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'
        }`}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} className={`transition-transform duration-300 ${active ? '-translate-y-0.5' : 'group-hover:-translate-y-0.5'}`} />
      <span className={`text-[9px] md:text-[10px] font-bold tracking-wide ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>
      {active && <div className="w-1 h-1 rounded-full bg-accent-pink mt-0.5 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />}
    </button>
  );

  const renderToolsDirectory = () => (
    <div className="p-4 md:p-8 pb-32 min-h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-0 z-30 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-xl py-4 -mx-4 px-4 md:-mx-8 md:px-8 mb-8 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-all">
        <div className="max-w-4xl mx-auto space-y-4">
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
    if (view === 'editor') return <DesignEditor template={editorTemplate} onBack={() => setView('dashboard')} />;
    if (view === 'tools') return activeTool ? <ToolRunner tool={activeTool} onBack={() => setActiveTool(null)} /> : renderToolsDirectory();
    if (view === 'chat') return <div className="h-full pb-24 p-4 max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300"><AIChat /></div>;
    if (view === 'community') return <div className="h-full pb-24 overflow-y-auto"><CommunityFeed /></div>;
    if (view === 'settings') return <SettingsPage theme={theme} toggleTheme={toggleTheme} />;
    if (view === 'profile') return <ProfilePage />;

    // Dashboard
    return (
      <div className="p-4 md:p-8 space-y-10 pb-32 animate-in fade-in duration-500">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/20 group h-[400px] flex items-center">
          <div className="absolute inset-0 bg-gray-900">
            <img 
              src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop" 
              alt="Abstract Fluid" 
              className="w-full h-full object-cover opacity-80 mix-blend-overlay transition-transform duration-[20s] ease-linear group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
          </div>
          <div className="relative z-10 p-8 md:p-16 flex flex-col items-start justify-center w-full max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-accent-cyan uppercase tracking-wider text-white mb-6">
              <Zap size={12} className="text-accent-yellow" fill="currentColor" />
              <span>Verse 2.0 Live</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight mb-6">
              Unleash Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-purple">Creative Intelligence</span>
            </h1>
            <div className="relative max-w-lg w-full group/search">
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

        {/* Start Creating Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-accent-pink" />
            <h2 className="text-xl font-heading font-bold text-gray-800 dark:text-gray-100">Start Creating</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Custom Size', icon: Plus, color: 'bg-gray-100 dark:bg-white/5' },
              { label: 'Instagram Post', icon: Instagram, color: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' },
              { label: 'YouTube Thumb', icon: Youtube, color: 'bg-red-500 text-white' },
              { label: 'Presentation', icon: Monitor, color: 'bg-orange-400 text-white' },
              { label: 'Poster', icon: ImageIcon, color: 'bg-blue-500 text-white' },
              { label: 'Document', icon: FileText, color: 'bg-emerald-500 text-white' },
            ].map((item) => (
              <button 
                key={item.label}
                onClick={() => handleCreateNew(item.label)}
                className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all ${item.color} ${item.label === 'Custom Size' ? 'text-gray-600 dark:text-gray-300' : ''}`}
              >
                <item.icon size={24} />
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Designs */}
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-gray-800 dark:text-gray-100">Recent Designs</h2>
            <button className="text-accent-purple hover:underline text-sm font-semibold">See all</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <button 
              onClick={() => handleCreateNew()}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                    <p className="font-bold text-lg">{project.title}</p>
                    <p className="text-xs opacity-80">{project.type} • {project.lastEdited}</p>
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white text-sm mt-2">{project.title}</h3>
                <p className="text-xs text-gray-500">{project.lastEdited}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-light-bg dark:bg-dark-bg text-slate-900 dark:text-white font-sans overflow-hidden transition-colors duration-300">
      
      {/* Header - Always visible in main app */}
      {view !== 'editor' && (
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md z-20 sticky top-0">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white font-bold text-xl">
                 K
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">Kala Verse</span>
           </div>

           <div className="flex items-center gap-4">
               <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
               >
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
               </button>
               <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm cursor-pointer hover:ring-2 hover:ring-accent-purple transition-all" onClick={() => setView('profile')}>
                  <img src={MOCK_USER.avatar} alt="Profile" className="w-full h-full object-cover" />
               </div>
           </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
         <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
            {renderContent()}
         </div>
      </div>

      {/* Floating Bottom Taskbar */}
      {view !== 'editor' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 shadow-2xl shadow-black/20 rounded-full px-4 py-2 flex items-center gap-1 md:gap-2 z-50 transition-all hover:scale-[1.01] hover:bg-white/90 dark:hover:bg-dark-surface/90 max-w-[95vw] overflow-x-auto scrollbar-hide">
            <NavItem icon={LayoutGrid} label="Home" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
            <NavItem icon={Wrench} label="Tools" active={view === 'tools'} onClick={() => setView('tools')} />
            <NavItem icon={MessageSquare} label="Chat" active={view === 'chat'} onClick={() => setView('chat')} />
            
            {/* Create Button - Floating within the dock */}
            <div className="mx-2 relative group flex-shrink-0">
                <button 
                  onClick={() => handleCreateNew()} 
                  className="bg-gradient-to-tr from-accent-pink to-accent-purple text-white p-3 md:p-4 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-110 transition-all active:scale-95"
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl translate-y-2 group-hover:translate-y-0">
                  Create New
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
            </div>

            <NavItem icon={Users} label="Community" active={view === 'community'} onClick={() => setView('community')} />
            <NavItem icon={Layout} label="Templates" active={view === 'templates'} onClick={() => {}} />
            <NavItem icon={Settings} label="Settings" active={view === 'settings'} onClick={() => setView('settings')} />
        </div>
      )}

    </div>
  );
};

export default App;