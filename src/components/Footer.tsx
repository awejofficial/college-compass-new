
import React from 'react';
import { Github, Instagram, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-premium-deep text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <p className="text-lg font-medium flex items-center justify-center gap-2">
              Made with 
              <Heart className="h-5 w-5 text-premium-primary fill-current" />
              by 
              <span className="font-bold text-premium-primary">Awej</span>
            </p>
          </div>
          
          <div className="flex items-center bg-premium-deep/50 border border-premium-secondary/30 rounded-lg p-2">
            <a
              href="https://instagram.com/awej04/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-premium-secondary hover:text-premium-primary transition-colors duration-200 p-2 rounded-lg hover:bg-premium-secondary/10"
              aria-label="Follow on Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
            
            <a
              href="https://github.com/awejofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-premium-secondary hover:text-premium-primary transition-colors duration-200 p-2 rounded-lg hover:bg-premium-secondary/10"
              aria-label="Visit GitHub profile"
            >
              <Github className="h-6 w-6" />
            </a>
            
            <a
              href="https://www.linkedin.com/in/awejpathan/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-premium-secondary hover:text-premium-primary transition-colors duration-200 p-2 rounded-lg hover:bg-premium-secondary/10"
              aria-label="Connect on LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
          <div className="text-center">
            <p className="text-sm text-premium-secondary/80">
              © 2025 FindMyClg - Awej. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
