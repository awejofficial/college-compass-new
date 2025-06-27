
import React from 'react';
import { Github, Instagram, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border py-12 mt-auto">
      <div className="container-nvidia">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="text-lg font-medium text-card-foreground flex items-center justify-center md:justify-start gap-2">
              Made with 
              <Heart className="h-5 w-5 text-destructive fill-current" />
              by 
              <span className="font-bold text-primary">Awej</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Engineering your path to success
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="https://instagram.com/awej04"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-accent"
              aria-label="Follow on Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
            
            <a
              href="https://github.com/awejofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-accent"
              aria-label="Visit GitHub profile"
            >
              <Github className="h-6 w-6" />
            </a>
            
            <a
              href="https://linkedin.com/in/awej-pathan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-accent"
              aria-label="Connect on LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 College Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
