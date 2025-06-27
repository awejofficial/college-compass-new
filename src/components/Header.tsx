
import React from 'react';
import { GraduationCap, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onLoginClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container-nvidia">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                College Finder by Awej
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Engineering Guidance</p>
            </div>
          </div>
          
          {onLoginClick && (
            <Button 
              onClick={onLoginClick}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
