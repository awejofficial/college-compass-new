
import React from 'react';
import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SummaryCardProps {
  eligibleCount: number;
  studentAggregate: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ eligibleCount, studentAggregate }) => {
  const isMobile = useIsMobile();

  if (eligibleCount === 0) return null;

  return (
    <div className="mt-6 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-green-100 rounded-full flex items-center justify-center`}>
          <Check className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-green-600`} />
        </div>
        <div>
          <h3 className={`font-medium text-green-800 ${isMobile ? 'text-sm' : ''}`}>
            Excellent! You have {eligibleCount} eligible options
          </h3>
          <p className={`text-green-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Based on your {studentAggregate}% aggregate, you can apply to these colleges with confidence.
          </p>
        </div>
      </div>
    </div>
  );
};
