
import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface LoadingDisplayProps {
  onLoginClick: () => void;
}

export const LoadingDisplay: React.FC<LoadingDisplayProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center minimal-card">
          <LoadingSpinner />
          <p className="mt-4 text-foreground">Loading form options...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};
