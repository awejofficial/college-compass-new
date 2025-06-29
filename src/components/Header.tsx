
import React, { useState, useEffect } from 'react';

const rotatingTexts = [
  "Smart Search for Smarter Choices.",
  "Your Admission Buddy",
  "Decode CAP Rounds Easily",
  "College Search Simplified"
];

export const Header: React.FC = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo(true);
      
      setTimeout(() => {
        setShowLogo(false);
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length);
      }, 5000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border border-border overflow-hidden">
              <img 
                src="/lovable-uploads/214526ee-d1c4-40fc-b3b1-0b58d7e80662.png" 
                alt="FindMyCLG Logo" 
                className={`w-full h-full object-contain transition-all duration-1000 ${
                  showLogo ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
                }`}
              />
            </div>
            <div className="flex flex-col">
              <div className="h-6 flex items-center">
                <span 
                  className={`text-lg font-semibold text-foreground transition-all duration-1000 ${
                    showLogo ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
                  }`}
                >
                  {rotatingTexts[currentTextIndex]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">Engineering Guidance</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
