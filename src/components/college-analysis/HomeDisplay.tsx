
import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { FeatureCards } from "@/components/FeatureCards";

interface HomeDisplayProps {
  onStartJourney: () => void;
  onLoginClick: () => void;
}

export const HomeDisplay: React.FC<HomeDisplayProps> = ({ onStartJourney, onLoginClick }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLoginClick={onLoginClick} />
      <div className="flex-1">
        <HeroSection onStartClick={onStartJourney} />
        <FeatureCards />
      </div>
      <Footer />
    </div>
  );
};
