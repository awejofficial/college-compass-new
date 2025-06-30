
import React, { useState, useEffect } from 'react';

const rotatingContent = [
  {
    title: "Find Your Perfect Engineering College",
    subtitle: "Smart Search for Smarter Choices"
  },
  {
    title: "DSE College Finder 2024",
    subtitle: "Your Admission Buddy"
  },
  {
    title: "Engineering Admission Guide",
    subtitle: "Decode CAP Rounds Easily"
  },
  {
    title: "College Search Platform",
    subtitle: "College Search Simplified"
  }
];

export const Header: React.FC = () => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo(false);
      
      setTimeout(() => {
        setCurrentContentIndex((prevIndex) => (prevIndex + 1) % rotatingContent.length);
        setShowLogo(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-premium-secondary/20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-12 bg-white rounded-lg border border-premium-secondary/30 overflow-hidden shadow-sm">
              <img 
                src="/lovable-uploads/214526ee-d1c4-40fc-b3b1-0b58d7e80662.png" 
                alt="FindMyCLG Logo" 
                className={`h-full w-auto object-contain transition-all duration-1000 ${
                  showLogo ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
                }`}
              />
            </div>
            <div className="flex flex-col">
              <div className="h-6 flex items-center">
                <span 
                  className={`text-lg font-semibold text-premium-deep transition-all duration-1000 ${
                    showLogo ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
                  }`}
                >
                  {rotatingContent[currentContentIndex].title}
                </span>
              </div>
              <p className={`text-xs text-premium-secondary hidden sm:block transition-all duration-1000 ${
                showLogo ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
              }`}>
                {rotatingContent[currentContentIndex].subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
