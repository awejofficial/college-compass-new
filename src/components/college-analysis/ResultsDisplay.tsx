
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1">
        <div className="bg-white border-b shadow-sm mb-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                FindMyClg - DSE College Finder 2024
              </h1>
              <div className="text-muted-foreground space-y-1">
                <p>DSE College Eligibility Results for <strong className="text-foreground">{formData.fullName}</strong></p>
                <div className="text-sm bg-muted rounded p-2 inline-block mt-2">
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
