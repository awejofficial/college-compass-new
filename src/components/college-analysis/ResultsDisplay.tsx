
import React from 'react';
import { GraduationCap } from "lucide-react";
import { TNEAStyleResultsTable } from "./TNEAStyleResultsTable";
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
    <div className="min-h-screen flex flex-col bg-premium-light">
      <Header />
      <div className="flex-1">
        <div className="bg-white border-b border-premium-secondary/20 shadow-sm mb-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-premium-deep mb-2 flex items-center justify-center gap-2">
                <GraduationCap className="h-8 w-8 text-premium-primary" />
                FindMyClg - DSE College Finder 2024
              </h1>
              <div className="text-premium-deep/80 space-y-1">
                <p>DSE College Eligibility Results for <strong className="text-premium-deep">{formData.fullName}</strong></p>
                <div className="text-sm bg-premium-secondary/10 border border-premium-secondary/20 rounded p-2 inline-block mt-2">
                  <span><strong>Diploma Aggregate:</strong> {formData.aggregate}% | </span>
                  <span><strong>Category:</strong> {formData.category} | </span>
                  <span><strong>Branches:</strong> {formData.preferredBranches.length} selected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TNEAStyleResultsTable 
          results={results} 
          studentName={formData.fullName}
          studentAggregate={parseFloat(formData.aggregate)}
          onRefillForm={onRefillForm}
        />
      </div>
      <Footer />
    </div>
  );
};
