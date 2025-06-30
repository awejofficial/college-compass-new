
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, GraduationCap } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface FormStepperProps {
  currentStep: number;
  isAnalyzing: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export const FormStepper: React.FC<FormStepperProps> = ({
  currentStep,
  isAnalyzing,
  onNext,
  onPrev,
  onSubmit
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mt-6 shadow-sm">
      <div className="flex justify-between items-center">
        {currentStep > 1 ? (
          <Button 
            variant="outline" 
            onClick={onPrev}
            className="border-slate-300 hover:border-blue-300 hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
        ) : (
          <div></div>
        )}

        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  step === currentStep
                    ? 'bg-blue-500'
                    : step < currentStep
                    ? 'bg-blue-500'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {currentStep < 3 ? (
          <Button 
            onClick={onNext}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={onSubmit} 
            disabled={isAnalyzing}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                Analyzing...
                <LoadingSpinner />
              </>
            ) : (
              <>
                Find Colleges
                <GraduationCap className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
