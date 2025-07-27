
import React from 'react';
import { GraduationCap } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SinglePageForm } from "./SinglePageForm";
import { RulesInfoSection } from "./RulesInfoSection";
import { FormData } from "./FormDataTypes";

interface FormDisplayProps {
  currentStep: number;
  isGuest: boolean;
  isAnalyzing: boolean;
  showSaveDataAlert: boolean;
  formData: FormData;
  availableCategories: string[];
  onFormDataChange: (updates: Partial<FormData>) => void;
  onGuestAccess: () => void;
  onEmailLogin: () => void;
  onAlertClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  onBranchChange: (branch: string, checked: boolean) => void;
  onCollegeTypeChange: (collegeType: string, checked: boolean) => void;
  onCityChange: (cities: string[]) => void;
  onLoginClick: () => void;
}

export const FormDisplay: React.FC<FormDisplayProps> = ({
  currentStep,
  isGuest,
  isAnalyzing,
  formData,
  availableCategories,
  onFormDataChange,
  onGuestAccess,
  onNext,
  onPrev,
  onSubmit,
  onBranchChange,
  onCollegeTypeChange,
  onCityChange
}) => {
  // Auto-trigger guest access if not already set
  React.useEffect(() => {
    if (!isGuest) {
      onGuestAccess();
    }
  }, [isGuest, onGuestAccess]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SinglePageForm
        formData={formData}
        availableCategories={availableCategories}
        isAnalyzing={isAnalyzing}
        isGuest={isGuest}
        onFormDataChange={onFormDataChange}
        onBranchChange={onBranchChange}
        onCollegeTypeChange={onCollegeTypeChange}
        onCityChange={onCityChange}
        onGuestAccess={onGuestAccess}
        onSubmit={onSubmit}
      />
      
      {/* Rules and Information Section */}
      <RulesInfoSection />
      <Footer />
    </div>
  );
};
