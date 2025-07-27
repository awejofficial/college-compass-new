
import React, { useState, useEffect } from 'react';
import { CollegeMatch } from "./FormDataTypes";
import { FilterBar } from "./FilterBar";
import { ResultsTableCore } from "./ResultsTableCore";
import { GoToTopButton } from "./GoToTopButton";
import { SummaryCard } from "./SummaryCard";
import { exportToPDF } from "./PDFExporter";
import { useFilterLogic } from "./FilterLogic";
import { usePaginationLogic } from "./PaginationLogic";
import { SmartStrategy } from "./SmartStrategy";
import { Button } from "@/components/ui/button";
import { Target, Star } from "lucide-react";
import { PreferenceList } from "./PreferenceList";

interface TNEAStyleResultsTableProps {
  results: CollegeMatch[];
  studentName: string;
  studentAggregate: number;
  onRefillForm: () => void;
}

export const TNEAStyleResultsTable: React.FC<TNEAStyleResultsTableProps> = ({ 
  results, 
  studentName,
  studentAggregate,
  onRefillForm 
}) => {
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [showSmartStrategy, setShowSmartStrategy] = useState(false);
  const [showPreferenceList, setShowPreferenceList] = useState(false);
  const resultsPerPage = 35; // Updated to 35 results per page

  // Use the filter logic hook
  const {
    filters,
    filteredResults,
    uniqueCities,
    uniqueBranches,
    uniqueCategories,
    eligibleCount,
    sortBy,
    toggleFilter,
    handleSearchChange,
    handleSortChange,
    clearFilters
  } = useFilterLogic(results);

  // Use the pagination logic hook
  const {
    currentPage,
    totalPages,
    currentResults,
    handlePageChange,
    totalResults,
    startIndex,
    endIndex
  } = usePaginationLogic(filteredResults, resultsPerPage);

  // Scroll detection for go-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowGoToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportToPDF = () => {
    exportToPDF(studentName, studentAggregate, filteredResults);
  };

  // Debug log to check pagination
  console.log('Pagination Debug:', {
    totalResults: filteredResults.length,
    currentPage,
    totalPages,
    currentResultsLength: currentResults.length,
    startIndex,
    endIndex,
    resultsPerPage
  });

  return (
    <div className="space-y-4">
      {/* Smart Strategy Button */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 mb-4">
        <div className="bg-gradient-to-r from-[#002C3E] to-[#78BCC4] rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">🎯 Smart Tools for College Selection</h3>
              <p className="text-white/90 text-sm">
                Use our smart strategy tool and create your preference list for informed college choices.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowPreferenceList(true)}
                className="bg-white text-[#002C3E] hover:bg-white/90 font-semibold px-6 py-2"
              >
                <Star className="w-4 h-4 mr-2" />
                My Preference List
              </Button>
              <Button 
                onClick={() => setShowSmartStrategy(true)}
                className="bg-white text-[#002C3E] hover:bg-white/90 font-semibold px-6 py-2"
              >
                <Target className="w-4 h-4 mr-2" />
                Smart Strategy
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FilterBar
        studentName={studentName}
        filteredResultsLength={filteredResults.length}
        eligibleCount={eligibleCount}
        filters={filters}
        uniqueCities={uniqueCities}
        uniqueBranches={uniqueBranches}
        uniqueCategories={uniqueCategories}
        onRefillForm={onRefillForm}
        onExportToPDF={handleExportToPDF}
        onToggleFilter={toggleFilter}
        onClearFilters={clearFilters}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        currentSort={sortBy}
      />

      {/* Results Table */}
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <ResultsTableCore
          currentResults={currentResults}
          studentAggregate={studentAggregate}
          currentPage={currentPage}
          totalPages={totalPages}
          filteredResultsLength={filteredResults.length}
          resultsPerPage={resultsPerPage}
          onPageChange={handlePageChange}
        />

        <SummaryCard eligibleCount={eligibleCount} studentAggregate={studentAggregate} />
      </div>

      <GoToTopButton show={showGoToTop} onClick={scrollToTop} />
      
      {/* Smart Strategy Modal */}
      {showSmartStrategy && (
        <SmartStrategy
          results={results}
          studentName={studentName}
          studentAggregate={studentAggregate}
          onClose={() => setShowSmartStrategy(false)}
        />
      )}
      
      {/* Preference List Modal */}
      {showPreferenceList && (
        <PreferenceList
          results={results}
          studentName={studentName}
          isVisible={showPreferenceList}
          onClose={() => setShowPreferenceList(false)}
        />
      )}
    </div>
  );
};
