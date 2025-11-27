import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import { ToolDefinition, ToolInput } from '../types';
import { generateToolResponse } from '../services/geminiService';
import { WinnerWheel } from './WinnerWheel';

interface ToolRunnerProps {
  tool: ToolDefinition;
  onBack: () => void;
}

export const ToolRunner: React.FC<ToolRunnerProps> = ({ tool, onBack }) => {
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle Input Changes
  const handleInputChange = (name: string, value: any) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  // Run AI Tool
  const handleRun = async () => {
    if (tool.toolType === 'utility-wheel') return; // Handled internally
    
    setLoading(true);
    setResult(null);
    
    // Simulate delay for realism if needed, but API is usually fast enough
    try {
        if (tool.toolType === 'utility-color') {
             // Mock RGB Logic
             const hex = '#'+Math.floor(Math.random()*16777215).toString(16);
             setResult(`Generated Color: ${hex}\n\nComplementary: #${Math.floor(Math.random()*16777215).toString(16)}`);
             setLoading(false);
             return;
        }

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

  const copyToClipboard = () => {
    if (result) {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
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
            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="text-accent-yellow" size={20} />
                    Configuration
                </h3>
                
                {/* Special Case: Winner Wheel Input is different */}
                {tool.toolType === 'utility-wheel' ? (
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
                ) : (
                    <div className="space-y-4">
                        {tool.inputs.map(input => (
                            <div key={input.name}>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {input.label}
                                </label>
                                {renderInput(input)}
                            </div>
                        ))}
                    </div>
                )}

                {tool.toolType !== 'utility-wheel' && (
                    <button
                        onClick={handleRun}
                        disabled={loading}
                        className="w-full mt-6 py-3 bg-accent-pink text-white font-bold rounded-lg shadow-lg hover:bg-pink-600 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                        {loading ? 'Generating...' : 'Generate Magic'}
                    </button>
                )}
            </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
             <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 h-full min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Result</h3>
                    {result && (
                        <button onClick={copyToClipboard} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-500" />}
                        </button>
                    )}
                </div>

                {tool.toolType === 'utility-wheel' ? (
                     <WinnerWheel names={inputValues['names'] || []} />
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