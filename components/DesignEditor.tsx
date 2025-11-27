
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Image as ImageIcon, 
  Type, 
  Square, 
  Video, 
  Upload, 
  Wand2, 
  X, 
  Plus, 
  Sparkles, 
  Loader2,
  Move,
  Trash2
} from 'lucide-react';
import { TOOLS } from '../constants';
import { generateToolResponse } from '../services/geminiService';
import { ToolDefinition } from '../types';

interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
}

interface DesignEditorProps {
  onBack: () => void;
}

export const DesignEditor: React.FC<DesignEditorProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [elements, setElements] = useState<DesignElement[]>([
    { id: '1', type: 'text', content: 'Double click to edit', x: 100, y: 100, color: '#333' }
  ]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  
  // Tool Runner State for Sidebar
  const [toolInputs, setToolInputs] = useState<Record<string, any>>({});
  const [toolResult, setToolResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Add Element Helper
  const addElement = (type: 'text' | 'image' | 'shape', content: string, extra = {}) => {
    const newEl: DesignElement = {
      id: Date.now().toString(),
      type,
      content,
      x: 150 + Math.random() * 50,
      y: 150 + Math.random() * 50,
      ...extra
    };
    setElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Run AI Tool in Sidebar
  const handleRunTool = async () => {
    if (!activeTool) return;
    setIsGenerating(true);
    setToolResult(null);
    try {
      const res = await generateToolResponse(
        activeTool.model || 'gemini-2.5-flash',
        activeTool.systemPrompt || '',
        toolInputs
      );
      setToolResult(res);
    } catch (e) {
      setToolResult("Failed to generate.");
    } finally {
      setIsGenerating(false);
    }
  };

  const navItems = [
    { id: 'elements', label: 'Elements', icon: Square },
    { id: 'photos', label: 'Photos', icon: ImageIcon },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'uploads', label: 'Uploads', icon: Upload },
    { id: 'tools', label: 'Tools', icon: Wand2 },
  ];

  const renderSidebarContent = () => {
    switch (activeTab) {
      case 'elements':
        return (
          <div className="grid grid-cols-3 gap-2 p-1">
            {['Box', 'Circle', 'Star', 'Arrow', 'Line', 'Hex'].map(shape => (
              <button 
                key={shape}
                onClick={() => addElement('shape', shape)}
                className="aspect-square bg-gray-100 dark:bg-white/5 rounded-lg flex flex-col items-center justify-center hover:bg-accent-purple/10 hover:text-accent-purple transition-colors"
              >
                <Square size={24} />
                <span className="text-xs mt-1">{shape}</span>
              </button>
            ))}
          </div>
        );
      case 'photos':
        return (
          <div className="grid grid-cols-2 gap-2 p-1">
            {[1,2,3,4,5,6].map(i => (
              <img 
                key={i}
                src={`https://picsum.photos/200/200?random=${i}`} 
                alt="Stock" 
                className="rounded-lg hover:opacity-80 cursor-pointer"
                onClick={() => addElement('image', `https://picsum.photos/400/400?random=${i}`)}
              />
            ))}
          </div>
        );
      case 'text':
        return (
          <div className="space-y-3">
            <button 
              onClick={() => addElement('text', 'Heading', { fontSize: 32, fontWeight: 'bold' })}
              className="w-full text-left p-4 bg-gray-100 dark:bg-white/5 rounded-lg font-bold text-2xl hover:bg-gray-200 dark:hover:bg-white/10"
            >
              Add a Heading
            </button>
            <button 
              onClick={() => addElement('text', 'Subheading', { fontSize: 24, fontWeight: 'medium' })}
              className="w-full text-left p-3 bg-gray-100 dark:bg-white/5 rounded-lg font-medium text-lg hover:bg-gray-200 dark:hover:bg-white/10"
            >
              Add a Subheading
            </button>
            <button 
              onClick={() => addElement('text', 'Body text', { fontSize: 16 })}
              className="w-full text-left p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-white/10"
            >
              Add body text
            </button>
          </div>
        );
      case 'tools':
        if (activeTool) {
          return (
            <div className="space-y-4">
              <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent-purple">
                <ArrowLeft size={14} /> Back to tools
              </button>
              <div className="flex items-center gap-2 mb-2">
                 <activeTool.icon size={20} className="text-accent-purple" />
                 <h3 className="font-bold">{activeTool.name}</h3>
              </div>
              
              <div className="space-y-3">
                {activeTool.inputs.map(input => (
                  <div key={input.name}>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{input.label}</label>
                    {input.type === 'textarea' ? (
                      <textarea 
                        className="w-full p-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-accent-purple outline-none"
                        placeholder={input.placeholder}
                        onChange={(e) => setToolInputs({...toolInputs, [input.name]: e.target.value})}
                      />
                    ) : (
                      <input 
                        type="text"
                        className="w-full p-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-accent-purple outline-none"
                        placeholder={input.placeholder}
                        onChange={(e) => setToolInputs({...toolInputs, [input.name]: e.target.value})}
                      />
                    )}
                  </div>
                ))}
                
                <button 
                  onClick={handleRunTool}
                  disabled={isGenerating}
                  className="w-full py-2 bg-accent-purple text-white rounded-lg text-sm font-bold hover:bg-purple-600 disabled:opacity-50 flex justify-center gap-2"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                  Generate
                </button>
              </div>

              {toolResult && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-bold text-green-500">Result Generated</span>
                     <button onClick={() => addElement('text', toolResult)} className="text-xs bg-white dark:bg-black/30 px-2 py-1 rounded hover:text-accent-purple">
                        Add to Canvas
                     </button>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {toolResult}
                  </p>
                </div>
              )}
            </div>
          )
        }
        return (
          <div className="space-y-2">
            <h3 className="font-bold mb-2">Power Tools</h3>
            {TOOLS.filter(t => t.toolType === 'ai-gen').map(tool => (
              <button 
                key={tool.id}
                onClick={() => setActiveTool(tool)}
                className="w-full flex items-center gap-3 p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-accent-purple transition-all text-left"
              >
                <div className="p-2 bg-accent-purple/10 rounded-lg text-accent-purple">
                  <tool.icon size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm">{tool.name}</div>
                  <div className="text-[10px] text-gray-500 line-clamp-1">{tool.description}</div>
                </div>
              </button>
            ))}
          </div>
        );
      default:
        return <div className="text-center text-gray-400 py-10">Select an item from the toolbar</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-[#0a0a0a] text-gray-900 dark:text-white overflow-hidden">
      
      {/* 1. Header */}
      <header className="h-16 bg-white dark:bg-[#151515] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-50">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
               <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col">
               <span className="font-bold text-sm">Untitled Project</span>
               <span className="text-xs text-gray-500">Last saved just now</span>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-accent-purple text-white text-sm font-bold rounded-full hover:bg-purple-600 transition-colors">
               <Download size={16} />
               Export
            </button>
         </div>
      </header>

      {/* 2. Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
         
         {/* Canvas Area */}
         <div className="flex-1 bg-gray-200 dark:bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center p-8">
            <div 
              className="bg-white relative shadow-2xl transition-transform duration-200"
              style={{ width: '800px', height: '600px', transform: 'scale(0.8)' }}
            >
               {elements.map(el => (
                  <div 
                    key={el.id}
                    className={`absolute cursor-move group border-2 ${selectedElementId === el.id ? 'border-accent-purple' : 'border-transparent hover:border-accent-purple/50'}`}
                    style={{ left: el.x, top: el.y }}
                    onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}
                  >
                     {selectedElementId === el.id && (
                        <button 
                           onClick={(e) => { e.stopPropagation(); setElements(elements.filter(e => e.id !== el.id)); }}
                           className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <Trash2 size={12} />
                        </button>
                     )}
                     
                     {el.type === 'text' && <p className="p-2 whitespace-pre-wrap font-sans text-gray-900">{el.content}</p>}
                     {el.type === 'image' && <img src={el.content} alt="Element" className="max-w-[200px] block pointer-events-none" />}
                     {el.type === 'shape' && (
                        <div className="w-24 h-24 bg-gray-300 flex items-center justify-center text-gray-500">
                           {el.content}
                        </div>
                     )}
                  </div>
               ))}
               
               {elements.length === 0 && (
                 <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
                    <span className="text-2xl font-bold">Start Creating</span>
                 </div>
               )}
            </div>
         </div>

         {/* Right Sidebar Panel */}
         <div 
            className={`bg-white dark:bg-[#151515] border-l border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out absolute right-0 top-0 bottom-0 z-40 shadow-xl
            ${activeTab ? 'w-80 translate-x-0' : 'w-80 translate-x-full opacity-0 pointer-events-none'}`}
         >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
               <h2 className="font-heading font-bold text-lg capitalize">{activeTab}</h2>
               <button onClick={() => setActiveTab(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                  <X size={18} />
               </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
               {renderSidebarContent()}
            </div>
         </div>

      </div>

      {/* 3. Bottom Toolbar (Taskbar) */}
      <div className="h-20 bg-white dark:bg-[#151515] border-t border-gray-200 dark:border-gray-800 flex items-center justify-center gap-2 md:gap-8 px-4 z-50">
         {navItems.map(item => (
            <button 
               key={item.id}
               onClick={() => {
                 setActiveTab(activeTab === item.id ? null : item.id);
                 if (item.id !== 'tools') setActiveTool(null);
               }}
               className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-20
               ${activeTab === item.id 
                  ? 'bg-accent-purple/10 text-accent-purple' 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
               }`}
            >
               <item.icon size={24} />
               <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
         ))}
      </div>

    </div>
  );
};
