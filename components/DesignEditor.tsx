import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Image as ImageIcon, 
  Type, 
  Square, 
  Upload, 
  Wand2, 
  X, 
  Loader2,
  Trash2,
  Triangle,
  Hexagon,
  Star,
  Heart,
  MessageCircle,
  Video,
  Music,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Plus
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
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
}

interface DesignEditorProps {
  template?: string | null;
  onBack: () => void;
}

const FONTS = [
  'Inter', 'Roboto', 'Poppins', 'Montserrat', 'Playfair Display', 
  'Lato', 'Oswald', 'Raleway', 'Merriweather', 'Courier New'
];

export const DesignEditor: React.FC<DesignEditorProps> = ({ template, onBack }) => {
  const [activeTab, setActiveTab] = useState<string | null>('elements');
  const [elements, setElements] = useState<DesignElement[]>([
    { 
      id: '1', 
      type: 'text', 
      content: template ? `${template} Project` : 'Double click to edit', 
      x: 100, 
      y: 100, 
      color: '#1e293b', 
      fontSize: 32, 
      fontFamily: 'Inter',
      fontWeight: 'bold',
      textAlign: 'left',
      opacity: 1
    }
  ]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [uploadCategory, setUploadCategory] = useState<'all'|'images'|'videos'|'audio'>('all');
  const [toolInputs, setToolInputs] = useState<Record<string, any>>({});
  const [toolResult, setToolResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const selectedElement = elements.find(el => el.id === selectedElementId);

  const addElement = (type: 'text' | 'image' | 'shape', content: string, extra: Partial<DesignElement> = {}) => {
    const newEl: DesignElement = {
      id: Date.now().toString(),
      type,
      content,
      x: 200 + (Math.random() * 50),
      y: 200 + (Math.random() * 50),
      color: type === 'text' ? '#1e293b' : undefined,
      fontSize: 24,
      fontFamily: 'Inter',
      opacity: 1,
      ...extra
    };
    setElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

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
          <div className="space-y-6">
            <div>
              <h4 className="font-bold mb-3 text-sm text-gray-500">Shapes</h4>
              <div className="grid grid-cols-3 gap-3">
                {[{ label: 'Square', icon: Square, extra: {} },
                  { label: 'Circle', icon: undefined, render: <div className="w-6 h-6 rounded-full border-2 border-current"/>, extra: { borderRadius: '50%' } },
                  { label: 'Triangle', icon: Triangle, extra: {} },
                  { label: 'Hexagon', icon: Hexagon, extra: {} },
                  { label: 'Star', icon: Star, extra: {} },
                  { label: 'Heart', icon: Heart, extra: {} },
                  { label: 'Bubble', icon: MessageCircle, extra: {} }].map((shape, i) => (
                  <button 
                    key={i}
                    onClick={() => addElement('shape', shape.label, { width: 100, height: 100, backgroundColor: '#cbd5e1', ...shape.extra })}
                    className="aspect-square bg-gray-50 dark:bg-white/5 rounded-xl flex flex-col items-center justify-center hover:bg-accent-purple/10 hover:text-accent-purple transition-colors text-gray-600 dark:text-gray-300"
                  >
                    {shape.icon ? <shape.icon size={24} /> : shape.render}
                    <span className="text-[10px] mt-1 font-medium">{shape.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-sm text-gray-500">Lines & Arrows</h4>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => addElement('shape', 'Line', { width: 200, height: 4, backgroundColor: '#000' })} className="h-10 px-4 bg-gray-50 dark:bg-white/5 rounded-lg flex items-center justify-center hover:bg-gray-100">
                  <div className="w-12 h-1 bg-current"></div>
                </button>
              </div>
            </div>
          </div>
        );
      case 'photos':
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-500">Stock Photos</h4>
            <div className="grid grid-cols-2 gap-2">
              {[1015, 1039, 1045, 1058, 106, 1074, 1080, 1084, 109, 110].map(i => (
                <div key={i} className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                  <img 
                    src={`https://picsum.photos/id/${i}/300/300`} 
                    alt="Stock" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    onClick={() => addElement('image', `https://picsum.photos/id/${i}/600/600`)}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Plus className="text-white drop-shadow-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <button onClick={() => addElement('text', 'Add a Heading', { fontSize: 48, fontWeight: '800' })} className="w-full text-left p-4 bg-gray-100 dark:bg-white/5 rounded-xl font-extrabold text-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Add a Heading</button>
              <button onClick={() => addElement('text', 'Add a Subheading', { fontSize: 28, fontWeight: '600' })} className="w-full text-left p-3 bg-gray-100 dark:bg-white/5 rounded-xl font-semibold text-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Add a Subheading</button>
              <button onClick={() => addElement('text', 'Add body text', { fontSize: 16, fontWeight: '400' })} className="w-full text-left p-3 bg-gray-100 dark:bg-white/5 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Add body text</button>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-sm text-gray-500">Font Combinations</h4>
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => addElement('text', 'Glow Up', { fontSize: 40, fontFamily: 'Pacifico', color: '#ec4899' })} className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-pink-500 font-bold font-serif text-xl">Glow Up</button>
                <button onClick={() => addElement('text', 'SALE', { fontSize: 50, fontFamily: 'Oswald', fontWeight: 'bold', color: '#ef4444' })} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 font-black text-2xl tracking-tighter">SALE</button>
              </div>
            </div>
          </div>
        );
      case 'uploads':
        return (
          <div className="h-full flex flex-col">
            <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-lg mb-4">
              {['all','images','videos','audio'].map(cat => (
                <button key={cat} onClick={() => setUploadCategory(cat as any)} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${uploadCategory === cat ? 'bg-white dark:bg-gray-700 shadow-sm text-accent-purple' : 'text-gray-500'}`}>{cat}</button>
              ))}
            </div>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-8 mb-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer text-gray-400 hover:text-accent-purple">
              <Upload size={32} className="mb-2" />
              <span className="text-xs font-bold">Upload Media</span>
            </div>

            <div className="text-center text-gray-400 text-sm italic">No uploads yet.</div>
          </div>
        );
      case 'tools':
        if (activeTool) {
          return (
            <div className="space-y-4">
              <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent-purple"><ArrowLeft size={14} /> Back to tools</button>
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

                <button onClick={handleRunTool} disabled={isGenerating} className="w-full py-2 bg-accent-purple text-white rounded-lg text-sm font-bold hover:bg-purple-600 disabled:opacity-50 flex justify-center gap-2">
                  {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                  Generate
                </button>
              </div>

              {toolResult && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-bold text-green-500">Result Generated</span>
                     <button onClick={() => addElement('text', toolResult)} className="text-xs bg-white dark:bg-black/30 px-2 py-1 rounded hover:text-accent-purple shadow-sm">Add to Canvas</button>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto">{toolResult}</p>
                </div>
              )}
            </div>
          )
        }
        return (
          <div className="space-y-2">
            <h3 className="font-bold mb-2">Magic AI Tools</h3>
            {TOOLS.filter(t => t.toolType === 'ai-gen').map(tool => (
              <button key={tool.id} onClick={() => setActiveTool(tool)} className="w-full flex items-center gap-3 p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-accent-purple transition-all text-left hover:shadow-md">
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
      {/* Header */}
      <header className="h-14 bg-white dark:bg-[#151515] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-50 shadow-sm">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500"><ArrowLeft size={20} /></button>
            <div className="flex flex-col">
               <span className="font-bold text-sm">{template ? template : 'Untitled Design'}</span>
               <span className="text-[10px] text-gray-500">Saving...</span>
            </div>
         </div>

         {/* Top Property Bar */}
         <div className="flex-1 flex justify-center">
             {selectedElement ? (
                 <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
                     {/* Color */}
                     <div className="flex items-center gap-2 border-r border-gray-300 dark:border-gray-600 pr-3 mr-1">
                         <div className="w-5 h-5 rounded-full border border-gray-300 cursor-pointer" style={{ backgroundColor: selectedElement.color || selectedElement.backgroundColor || '#000' }}></div>
                     </div>

                     {/* Text Controls */}
                     {selectedElement.type === 'text' && (
                        <>
                          <select value={selectedElement.fontFamily} onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })} className="bg-transparent text-xs font-medium w-24 truncate outline-none">{FONTS.map(f => <option key={f} value={f}>{f}</option>)}</select>
                          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                          <input type="number" value={selectedElement.fontSize} onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })} className="w-12 bg-transparent text-xs font-medium outline-none" />
                          <button onClick={() => updateElement(selectedElement.id, { fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' })} className={`p-1 rounded ${selectedElement.fontWeight === 'bold' ? 'bg-gray-200 dark:bg-white/20' : ''}`}><Bold size={14} /></button>
                          <button onClick={() => updateElement(selectedElement.id, { fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' })} className={`p-1 rounded ${selectedElement.fontStyle === 'italic' ? 'bg-gray-200 dark:bg-white/20' : ''}`}><Italic size={14} /></button>
                          <button onClick={() => updateElement(selectedElement.id, { textAlign: 'left' })} className={`p-1 rounded ${selectedElement.textAlign === 'left' ? 'bg-gray-200 dark:bg-white/20' : ''}`}><AlignLeft size={14} /></button>
                          <button onClick={() => updateElement(selectedElement.id, { textAlign: 'center' })} className={`p-1 rounded ${selectedElement.textAlign === 'center' ? 'bg-gray-200 dark:bg-white/20' : ''}`}><AlignCenter size={14} /></button>
                          <button onClick={() => updateElement(selectedElement.id, { textAlign: 'right' })} className={`p-1 rounded ${selectedElement.textAlign === 'right' ? 'bg-gray-200 dark:bg-white/20' : ''}`}><AlignRight size={14} /></button>
                          <button onClick={() => selectedElementId && deleteElement(selectedElementId)} className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-700"><Trash2 size={14} /></button>
                        </>
                     )}
                 </div>
             ) : <span className="text-sm text-gray-500">Select an element to edit</span>}
         </div>

         <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><Download size={20} /></button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-[#151515] border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
           <nav className="flex flex-col p-3 space-y-2">
              {navItems.map(nav => (
                <button key={nav.id} onClick={() => setActiveTab(nav.id)} className={`flex items-center gap-2 p-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 ${activeTab === nav.id ? 'bg-gray-100 dark:bg-white/5' : ''}`}>
                   <nav.icon size={18} />
                   {nav.label}
                </button>
              ))}
           </nav>
           <div className="p-4">{renderSidebarContent()}</div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden flex justify-center items-center">
           <div ref={canvasRef} className="relative w-[800px] h-[600px] bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700">
             {elements.map(el => (
                <div key={el.id} style={{position:'absolute', left:el.x, top:el.y, cursor:'move', opacity:el.opacity}} 
                    onMouseDown={(e) => { isDragging.current = true; setSelectedElementId(el.id); dragOffset.current = { x: e.clientX - el.x, y: e.clientY - el.y }; }}
                    onMouseUp={() => isDragging.current = false}
                    onDoubleClick={() => el.type==='text' && setIsEditingText(true)}
                >
                  {el.type === 'text' ? (
                    isEditingText && selectedElementId === el.id ? (
                      <textarea 
                        autoFocus
                        value={el.content}
                        onChange={(e) => updateElement(el.id, { content: e.target.value })}
                        onBlur={() => setIsEditingText(false)}
                        className="bg-transparent outline-none resize-none overflow-hidden"
                        style={{
                          color: el.color,
                          fontSize: el.fontSize,
                          fontFamily: el.fontFamily,
                          fontWeight: el.fontWeight,
                          fontStyle: el.fontStyle,
                          textAlign: el.textAlign,
                          minWidth: '100px',
                          maxWidth: '600px',
                          whiteSpace: 'pre-wrap'
                        }}
                        onInput={(e) => (e.target as HTMLTextAreaElement).style.height = 'auto'}
                      />
                    ) : (
                      <div style={{
                        color: el.color,
                        fontSize: el.fontSize,
                        fontFamily: el.fontFamily,
                        fontWeight: el.fontWeight,
                        fontStyle: el.fontStyle,
                        textAlign: el.textAlign,
                        whiteSpace: 'pre-wrap',
                        padding: '4px'
                      }}>
                        {el.content}
                      </div>
                    )
                  ) : el.type === 'image' ? (
                    <img src={el.content} alt="canvas" style={{width: el.width || 200, height: el.height || 200}} />
                  ) : el.type === 'shape' ? (
                    <div style={{
                      width: el.width || 100,
                      height: el.height || 100,
                      backgroundColor: el.backgroundColor || '#cbd5e1',
                      borderRadius: el.borderRadius || 0
                    }}></div>
                  ) : null}
                </div>
             ))}
           </div>
        </main>
      </div>
    </div>
  );
};
