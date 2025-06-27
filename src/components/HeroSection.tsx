
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, TrendingUp, Users } from 'lucide-react';

interface HeroSectionProps {
  onStartClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartClick }) => {
  return (
    <section className="hero-section py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Hero Content */}
          <div className="mb-16 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-card border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
              <Target className="h-4 w-4" />
              <span>Precision Engineering Guidance</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight text-center">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mt-2">Engineering College</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-center">
              Discover engineering colleges in Maharashtra with real-time cutoff data, 
              intelligent matching, and personalized recommendations.
            </p>

            <div className="flex justify-center w-full">
              <Button
                onClick={onStartClick}
                className="text-lg px-8 py-4 group bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl text-primary-foreground"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up justify-items-center">
            {[
              { 
                icon: Users,
                number: '10K+', 
                label: 'Students Guided', 
                desc: 'Successful placements' 
              },
              { 
                icon: Target,
                number: '500+', 
                label: 'Colleges Listed', 
                desc: 'Comprehensive database' 
              },
              { 
                icon: TrendingUp,
                number: '99%', 
                label: 'Accuracy Rate', 
                desc: 'Real-time data' 
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-card rounded-lg border border-border p-6 text-center group hover:border-primary/30 hover:shadow-md transition-all duration-200 w-full max-w-sm">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                  <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
