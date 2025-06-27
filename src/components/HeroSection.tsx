
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, TrendingUp, Users } from 'lucide-react';

interface HeroSectionProps {
  onStartClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartClick }) => {
  return (
    <section className="hero-section py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container-nvidia">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Hero Content */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
              <Target className="h-4 w-4" />
              <span>Precision Engineering Guidance</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mt-2">Engineering College</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover engineering colleges in Maharashtra with real-time cutoff data, 
              intelligent matching, and personalized recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onStartClick}
                className="text-lg px-8 py-4 group bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                className="text-lg px-8 py-4 border-slate-300 hover:border-blue-300 hover:bg-slate-50"
              >
                View Demo
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
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
                <div key={stat.label} className="bg-white rounded-lg border border-slate-200 p-6 text-center group hover:border-blue-300 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-200">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
                  <div className="font-semibold text-slate-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-slate-600">{stat.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
