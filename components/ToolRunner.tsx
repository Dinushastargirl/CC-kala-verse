import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Sparkles, Copy, Check, Loader2, MousePointer2 } from 'lucide-react';
import { ToolDefinition, ToolInput } from '../types';
import { generateToolResponse } from '../services/geminiService';
import { WinnerWheel } from './WinnerWheel';
import { Flipbook } from './Flipbook';

interface ToolRunnerProps {
  tool: ToolDefinition;
  onBack: () => void;
}

export const ToolRunner: React.FC<ToolRunnerProps> = ({ tool, onBack }) => {
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  // Color Wheel State
  const [colorState, setColorState] = useState({ hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)' });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle Input Changes
  const handleInputChange = (name: string, value: any) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  // Initialize Color Wheel
  useEffect(() => {
    if (tool.toolType === 'utility-color' && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Set dimensions (high DPI support)
        const size = 300;
        const scale = window.devicePixelRatio || 1;
        canvas.width = size * scale;
        canvas.height = size * scale;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        ctx.scale(scale, scale);

        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2;

        // 1. Draw Conic Gradient (Hue)
        const conicGradient = ctx.createConicGradient(0, centerX, centerY);
        conicGradient.addColorStop(0, "red");
        conicGradient.addColorStop(1/6, "yellow");
        conicGradient.addColorStop(2/6, "lime");
        conicGradient.addColorStop(3/6, "cyan");
        conicGradient.addColorStop(4/6, "blue");
        conicGradient.addColorStop(5/6, "magenta");
        conicGradient.addColorStop(1, "red");

        ctx.fillStyle = conicGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();

        // 2. Draw Radial Gradient (Saturation: White -> Transparent)
        const radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        radialGradient.addColorStop(0, "white");
        radialGradient.addColorStop(1, "transparent");

        ctx.fillStyle = radialGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
  }, [tool.toolType]);

  const handleColorPick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left);
      const y = (e.clientY - rect.top);
      
      // Handle high DPI for pixel picking
      const scale = window.devicePixelRatio || 1;
      const pixel = ctx.getImageData(x * scale, y * scale, 1, 1).data;
      
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      
      const toHex = (n: number) => {
          const hex = n.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
      };

      const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
      const rgb = `rgb(${r}, ${g}, ${b})`;

      setColorState({ hex, rgb });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Only pick if mouse is pressed (buttons === 1 is left click)
      if (e.buttons === 1) {
          handleColorPick(e);
      }
  };

  // Run AI Tool
  const handleRun = async () => {
    if (tool.toolType === 'utility-wheel' || tool.toolType === 'utility-flipbook' || tool.toolType === 'utility-color') return; 
    
    setLoading(true);
    setResult(null);
    
    try {
        const response = await generateToolResponse(
            tool.model || 'gemini-2.5-flash',
            tool.systemPrompt || '',
            inputValues
        );
        setResult(response);
    } catch (e) {
        setResult("Error executing tool.");
    } finally {
        setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderInput = (input: ToolInput) => {
    switch (input.type) {
        case 'textarea':
            return (
                <textarea
                    className="w-full p-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent-purple outline-none transition-all min-h-[100px]"
                    placeholder={input.placeholder}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                />
            );
        case 'select':
            return (
                <div className="relative">
                    <select 
                        className="w-full p-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent-purple outline-none transition-all appearance-none"
                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                    >
                        <option value="">Select an option</option>
                        {input.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            );
        default:
            return (
                <input
                    type="text"
                    className="w-full p-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent-purple outline-none transition-all"
                    placeholder={input.placeholder}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                />
            );
    }
  };

  // Special full-width render for Flipbook
  if (tool.toolType === 'utility-flipbook') {
      return (
          <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <button 
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 hover:text-accent-pink mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Hub</span>
              </button>
              <div className="mb-8 text-center">
                   <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h1>
                   <p className="text-gray-500 dark:text-gray-400">{tool.description}</p>
              </div>
              <Flipbook />
          </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-accent-pink mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Hub</span>
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-accent-purple/10 rounded-xl text-accent-purple">
            <tool.icon size={32} />
        </div>
        <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{tool.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{tool.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 h-full">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="text-accent-yellow" size={20} />
                    Configuration
                </h3>
                
                {/* Winner Wheel Special Input */}
                {tool.toolType === 'utility-wheel' && (
                     <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Participants
                        </label>
                        <textarea
                            className="w-full p-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent-purple outline-none min-h-[120px]"
                            placeholder="Enter names separated by commas (e.g. Alice, Bob, Charlie)"
                            onChange={(e) => handleInputChange('names', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                        />
                     </div>
                )}

                {/* Color Wheel Special Input */}
                {tool.toolType === 'utility-color' && (
                    <div className="flex flex-col items-center">
                        <div className="relative group cursor-crosshair rounded-full shadow-lg border-4 border-white dark:border-gray-700 overflow-hidden">
                             <canvas 
                                ref={canvasRef}
                                onClick={handleColorPick}
                                onMouseMove={handleMouseMove}
                                className="touch-none"
                             />
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                             <MousePointer2 size={16} />
                             <span>Click or drag on the wheel to pick</span>
                        </div>
                    </div>
                )}

                {/* Standard Inputs */}
                {tool.toolType !== 'utility-wheel' && tool.toolType !== 'utility-color' && (
                    <div className="space-y-4">
                        {tool.inputs.map(input => (
                            <div key={input.name}>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {input.label}
                                </label>
                                {renderInput(input)}
                            </div>
                        ))}
                        <button
                            onClick={handleRun}
                            disabled={loading}
                            className="w-full mt-6 py-3 bg-accent-pink text-white font-bold rounded-lg shadow-lg hover:bg-pink-600 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                            {loading ? 'Generating...' : 'Generate Magic'}
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
             <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 h-full min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Result</h3>
                    {result && tool.toolType !== 'utility-color' && (
                        <button onClick={() => copyToClipboard(result, 'result')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            {copied === 'result' ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-500" />}
                        </button>
                    )}
                </div>

                {tool.toolType === 'utility-wheel' ? (
                     <WinnerWheel names={inputValues['names'] || []} />
                ) : tool.toolType === 'utility-color' ? (
                     <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in duration-500">
                          {/* Color Preview */}
                          <div className="relative">
                            <div 
                                className="w-32 h-32 rounded-full shadow-xl border-8 border-white dark:border-gray-700 transition-colors duration-200"
                                style={{ backgroundColor: colorState.hex }} 
                            />
                            <div className="absolute inset-0 rounded-full ring-1 ring-black/5 dark:ring-white/10" />
                          </div>

                          {/* Values */}
                          <div className="w-full space-y-4 max-w-sm">
                              {/* Hex */}
                              <div className="bg-gray-50 dark:bg-[#252525] p-4 rounded-xl flex items-center justify-between border border-gray-200 dark:border-gray-700 group">
                                  <div className="flex flex-col">
                                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">HEX</span>
                                      <span className="text-xl font-mono font-bold text-gray-800 dark:text-gray-100">{colorState.hex}</span>
                                  </div>
                                  <button 
                                    onClick={() => copyToClipboard(colorState.hex, 'hex')}
                                    className="p-2 text-gray-400 hover:text-accent-purple hover:bg-accent-purple/10 rounded-lg transition-colors"
                                  >
                                      {copied === 'hex' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                  </button>
                              </div>

                              {/* RGB */}
                              <div className="bg-gray-50 dark:bg-[#252525] p-4 rounded-xl flex items-center justify-between border border-gray-200 dark:border-gray-700 group">
                                  <div className="flex flex-col">
                                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">RGB</span>
                                      <span className="text-lg font-mono font-bold text-gray-800 dark:text-gray-100">{colorState.rgb}</span>
                                  </div>
                                  <button 
                                    onClick={() => copyToClipboard(colorState.rgb, 'rgb')}
                                    className="p-2 text-gray-400 hover:text-accent-purple hover:bg-accent-purple/10 rounded-lg transition-colors"
                                  >
                                      {copied === 'rgb' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                  </button>
                              </div>
                          </div>
                     </div>
                ) : (
                    <div className="flex-1 bg-gray-50 dark:bg-[#252525] rounded-xl p-4 overflow-y-auto font-sans leading-relaxed whitespace-pre-wrap">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                                <Loader2 className="animate-spin w-8 h-8 text-accent-purple" />
                                <p className="animate-pulse">Consulting the creative universe...</p>
                            </div>
                        ) : result ? (
                            <div className="text-gray-800 dark:text-gray-200">{result}</div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 italic text-center px-8">
                                Configure the inputs and hit Generate to see magic happen.
                            </div>
                        )}
                    </div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};