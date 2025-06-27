
import React from 'react';
import { GraduationCap } from "lucide-react";
import { MinimalResultsTable } from "@/components/MinimalResultsTable";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CollegeMatch, FormData } from "./FormDataTypes";

interface ResultsDisplayProps {
  results: CollegeMatch[];
  formData: FormData;
  onRefillForm: () => void;
  onLoginClick: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  formData,
  onRefillForm
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                DSE College Finder 2024
              </h1>
              <div className="text-muted-foreground space-y-1">
                <p>College Eligibility Results for <strong className="text-foreground">{formData.fullName}</strong></p>
                <div className="text-sm bg-muted rounded p-3 inline-block mt-2">
                  <p><strong>Aggregate:</strong> {formData.aggregate}% | <strong>Category:</strong> {formData.category}</p>
                  <p><strong>Branches:</strong> {formData.preferredBranches.length} | <strong>Colleges:</strong> {formData.selectedColleges.length || 'All'}</p>
                </div>
              </div>
            </div>
          </div>

          <MinimalResultsTable 
            results={results} 
            studentName={formData.fullName}
            onRefillForm={onRefillForm}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};
