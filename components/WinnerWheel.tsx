import React, { useState, useRef, useEffect } from 'react';

interface WinnerWheelProps {
  names: string[];
}

export const WinnerWheel: React.FC<WinnerWheelProps> = ({ names }) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  
  const validNames = names.filter(n => n.trim().length > 0);

  const spin = () => {
    if (spinning || validNames.length < 2) return;
    
    setSpinning(true);
    setWinner(null);
    
    const spinDuration = 3000 + Math.random() * 2000; // 3-5s
    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5-10 full rotations
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + (extraSpins * 360) + randomAngle;
    
    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      // Calculate winner based on final angle
      // Normalized angle (0-360)
      const normalizedAngle = totalRotation % 360;
      // In CSS rotation, pointer is usually at top (0deg) or right (90deg).
      // Assuming 0deg is top. The wheel rotates clockwise.
      // The slice at the TOP is the one that "wins".
      // If we rotate X degrees, the slice at (360 - (X % 360)) is at the top.
      const winningAngle = (360 - normalizedAngle) % 360;
      const sliceSize = 360 / validNames.length;
      const winningIndex = Math.floor(winningAngle / sliceSize);
      
      setWinner(validNames[winningIndex]);
    }, spinDuration);
  };

  if (validNames.length === 0) return <div className="text-center p-4">Please enter names to spin.</div>;

  const colors = ['#FF6F61', '#4ECDC4', '#FFE66D', '#FF9F1C', '#2EC4B6', '#E71D36'];

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-accent-coral z-20 drop-shadow-lg"></div>
        
        {/* Wheel */}
        <div 
          className="w-full h-full rounded-full border-4 border-white shadow-2xl overflow-hidden relative transition-transform cubic-bezier(0.25, 0.1, 0.25, 1)"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? '4s' : '0s'
          }}
        >
          {validNames.map((name, i) => {
            const sliceSize = 360 / validNames.length;
            const rotate = i * sliceSize;
            const skew = 90 - sliceSize;
            const bgColor = colors[i % colors.length];

            // If only 1 item, full circle
            if (validNames.length === 1) return (
              <div key={i} className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                 <span className="text-white font-bold text-lg">{name}</span>
              </div>
            );

            // Using conic-gradient is easier for dynamic slices than skew transforms for arbitrary numbers
            return null; 
          })}
          
          {/* Fallback rendering using conic gradient for perfect slices */}
           <div 
             className="absolute inset-0 rounded-full"
             style={{
               background: `conic-gradient(${validNames.map((_, i) => 
                 `${colors[i % colors.length]} ${i * (100/validNames.length)}% ${(i+1) * (100/validNames.length)}%`
               ).join(', ')})`
             }}
           />
           
           {/* Text Labels Overlay */}
           {validNames.map((name, i) => {
             const sliceSize = 360 / validNames.length;
             const rotate = i * sliceSize + (sliceSize / 2); // Center of slice
             return (
               <div 
                key={i}
                className="absolute top-1/2 left-1/2 h-1/2 w-8 origin-top -translate-x-1/2"
                style={{ transform: `rotate(${rotate}deg)` }}
               >
                 <span className="block mt-4 text-white font-bold text-sm md:text-base drop-shadow-md truncate w-24 -rotate-90 origin-center text-center mx-auto">
                    {name}
                 </span>
               </div>
             )
           })}

        </div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="px-8 py-3 bg-accent-teal text-white font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
      >
        {spinning ? 'Spinning...' : 'SPIN THE WHEEL'}
      </button>

      {winner && !spinning && (
        <div className="mt-6 p-6 bg-white dark:bg-dark-surface rounded-xl shadow-xl animate-bounce-slight text-center border-2 border-accent-yellow">
          <h3 className="text-lg text-gray-500 dark:text-gray-400">Winner</h3>
          <p className="text-3xl font-heading font-bold text-accent-coral">{winner}</p>
        </div>
      )}
    </div>
  );
};
