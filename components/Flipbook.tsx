
import React, { useState, useRef } from 'react';
import { Upload, X, Share2, ChevronLeft, ChevronRight, BookOpen, Layers } from 'lucide-react';

export const Flipbook: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (currentPage >= images.length - 1) {
      setCurrentPage(Math.max(0, images.length - 2));
    }
  };

  const generateLink = () => {
    // Mock link generation
    const uniqueId = Math.random().toString(36).substring(7);
    setShareLink(`https://kalaverse.app/flipbook/${uniqueId}`);
    setIsShareModalOpen(true);
  };

  const nextPage = () => {
    if (currentPage < images.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8">
      
      {/* 1. Upload Section */}
      <div className="w-full bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Layers className="text-accent-purple" size={20} />
          Upload Flipbook Pages
        </h3>
        
        <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
        >
            <div className="w-16 h-16 rounded-full bg-accent-purple/10 flex items-center justify-center text-accent-purple mb-4 group-hover:scale-110 transition-transform">
                <Upload size={32} />
            </div>
            <p className="font-bold text-gray-700 dark:text-gray-300">Click to upload images</p>
            <p className="text-sm text-gray-500">JPG, PNG supported</p>
            <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload} 
            />
        </div>

        {images.length > 0 && (
            <div className="flex gap-4 overflow-x-auto py-4 mt-4 scrollbar-hide">
                {images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 flex-shrink-0 group">
                        <img src={img} alt={`Page ${idx + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                        <button 
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={12} />
                        </button>
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 rounded">
                            {idx + 1}
                        </span>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* 2. Interactive Preview */}
      {images.length > 0 && (
          <div className="w-full bg-gray-100 dark:bg-[#1a1a1a] rounded-3xl p-8 md:p-12 flex flex-col items-center relative overflow-hidden min-h-[500px] justify-center shadow-inner">
             
             {/* Flipbook Container */}
             <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] perspective-[1500px]">
                {images.map((img, idx) => {
                    // Simple stack logic for visual clarity without complex 3D library
                    // Pages before current are rotated left (-180deg)
                    // Pages after current are stacked right (0deg)
                    const isFlipped = idx < currentPage;
                    const zIndex = isFlipped ? idx : images.length - idx;
                    
                    return (
                        <div 
                            key={idx}
                            className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-3d origin-left cursor-pointer bg-white dark:bg-gray-800 rounded-r-lg shadow-2xl border-l border-gray-300 dark:border-gray-700 overflow-hidden
                            ${isFlipped ? '-rotate-y-180' : 'rotate-y-0'}`}
                            style={{ zIndex }}
                            onClick={() => isFlipped ? prevPage() : nextPage()}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            
                            {/* Page Shadow Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none opacity-0 ${!isFlipped ? 'opacity-100' : ''}`} />
                            
                            <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/60 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
                                {idx + 1} / {images.length}
                            </div>
                        </div>
                    );
                })}
                
                {/* Back Cover / Empty State if flipped all */}
                <div 
                    className={`absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-900 rounded-r-lg border border-gray-300 dark:border-gray-700 flex items-center justify-center -z-10`}
                >
                    <p className="text-gray-400 font-bold">End of Book</p>
                </div>
             </div>

             {/* Controls */}
             <div className="flex items-center gap-8 mt-10 z-10">
                 <button 
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="p-4 rounded-full bg-white dark:bg-dark-surface shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                 >
                     <ChevronLeft size={24} />
                 </button>
                 <span className="font-bold text-gray-500">
                    {currentPage} / {images.length}
                 </span>
                 <button 
                    onClick={nextPage}
                    disabled={currentPage === images.length}
                    className="p-4 rounded-full bg-white dark:bg-dark-surface shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                 >
                     <ChevronRight size={24} />
                 </button>
             </div>

             {/* Share Button */}
             <button 
                onClick={generateLink}
                className="absolute top-6 right-6 flex items-center gap-2 px-6 py-3 bg-accent-pink text-white font-bold rounded-full shadow-lg hover:bg-pink-600 transition-colors"
             >
                 <Share2 size={20} />
                 Share Flipbook
             </button>

          </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">Share Your Flipbook</h3>
                      <button onClick={() => setIsShareModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-300">Anyone with this link can view your interactive flipbook.</p>
                      
                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={shareLink} 
                            readOnly 
                            className="flex-1 p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 outline-none"
                          />
                          <button 
                            onClick={() => { navigator.clipboard.writeText(shareLink); setIsShareModalOpen(false); }}
                            className="px-4 py-2 bg-accent-purple text-white font-bold rounded-lg hover:bg-purple-600 transition-colors whitespace-nowrap"
                          >
                              Copy
                          </button>
                      </div>

                      <div className="flex justify-center gap-4 pt-4">
                          <button className="p-3 bg-blue-500 text-white rounded-full hover:scale-110 transition-transform"><Share2 size={18} /></button>
                          <button className="p-3 bg-sky-500 text-white rounded-full hover:scale-110 transition-transform"><BookOpen size={18} /></button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* CSS Helper for 3D Transform - usually provided by Tailwind utility or external css, ensuring here for inline support */}
      <style>{`
        .perspective-[1500px] { perspective: 1500px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-y-0 { transform: rotateY(0deg); }
        .-rotate-y-180 { transform: rotateY(-180deg); }
        .origin-left { transform-origin: left; }
      `}</style>
    </div>
  );
};
