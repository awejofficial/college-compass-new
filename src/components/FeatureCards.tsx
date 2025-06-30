
import React from 'react';
import { Search, TrendingUp, FileText, Target, Users, BookOpen } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Built for DSE Students',
    description: 'Laser-focused on Direct Second Year (DSE) B.Tech lateral entry admissions — not generalised for all students.',
  },
  {
    icon: TrendingUp,
    title: 'Real Data. Real Guidance.',
    description: 'Authentic government-published CAP cutoff data from Rounds I, II, and III across hundreds of colleges.',
  },
  {
    icon: Search,
    title: 'Smarter Search System',
    description: 'You don\'t search colleges; we match you with them based on your diploma aggregate marks and preferences.',
  },
  {
    icon: FileText,
    title: 'City-Wise Filters',
    description: 'Want only Pune, Mumbai, Nagpur colleges? Filter by your preferred cities and get targeted results.',
  },
  {
    icon: Users,
    title: 'Category Based Suggestions',
    description: 'Complete support for all categories — GOPEN, EWS, OBC, SC, ST with accurate cutoff predictions.',
  },
  {
    icon: BookOpen,
    title: 'Built by Students, for Students',
    description: 'Designed with real problems diploma students face in mind — no more scrolling through government PDFs.',
  }
];

export const FeatureCards: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-black mb-4">
            🎯 What Makes FindMyClg Different?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A student-first platform designed specifically for diploma students pursuing DSE admissions in Maharashtra
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-up">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card-professional group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-center w-14 h-14 bg-white border border-gray-200 rounded-xl mb-6 group-hover:border-black transition-all duration-200">
                  <Icon className="h-7 w-7 text-black" />
                </div>
                
                <h3 className="text-xl font-semibold text-black mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
