
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CollegeMatch } from "./FormDataTypes";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterBar } from "./FilterBar";
import { ResultsTableRow } from "./ResultsTableRow";
import { GoToTopButton } from "./GoToTopButton";
import { SummaryCard } from "./SummaryCard";
import { PaginationControls } from "@/components/PaginationControls";
import { exportToPDF } from "./PDFExporter";

interface TNEAStyleResultsTableProps {
  results: CollegeMatch[];
  studentName: string;
  studentAggregate: number;
  onRefillForm: () => void;
}

interface FilterState {
  cities: string[];
  branches: string[];
  categories: string[];
  eligibleOnly: boolean;
  searchTerm: string;
}

export const TNEAStyleResultsTable: React.FC<TNEAStyleResultsTableProps> = ({ 
  results, 
  studentName,
  studentAggregate,
  onRefillForm 
}) => {
  const [filters, setFilters] = useState<FilterState>({
    cities: [],
    branches: [],
    categories: [],
    eligibleOnly: false,
    searchTerm: ''
  });
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 50;
  const isMobile = useIsMobile();

  // Scroll detection for go-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowGoToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Get unique filter options
  const uniqueCities = [...new Set(results.map(r => r.city))].sort();
  const uniqueBranches = [...new Set(results.map(r => r.branch))].sort();
  const uniqueCategories = [...new Set(results.map(r => r.category))].sort();

  // Filter and sort results
  const filteredResults = results
    .filter(college => {
      if (filters.eligibleOnly && !college.eligible) return false;
      if (filters.cities.length > 0 && !filters.cities.includes(college.city)) return false;
      if (filters.branches.length > 0 && !filters.branches.includes(college.branch)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(college.category)) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          college.collegeName.toLowerCase().includes(searchLower) ||
          college.branch.toLowerCase().includes(searchLower) ||
          college.city.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by eligibility first, then by best cutoff
      if (a.eligible && !b.eligible) return -1;
      if (!a.eligible && b.eligible) return 1;
      
      const getCutoff = (college: CollegeMatch) => {
        const cutoffs = [college.cap1Cutoff, college.cap2Cutoff, college.cap3Cutoff]
          .filter(c => c !== null) as number[];
        return cutoffs.length > 0 ? Math.min(...cutoffs) : 100;
      };
      
      return getCutoff(a) - getCutoff(b);
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const toggleFilter = (type: keyof FilterState, value: string | boolean) => {
    setFilters(prev => {
      if (type === 'eligibleOnly') {
        return { ...prev, [type]: value as boolean };
      }
      
      // Handle "all" value to clear filters
      if (value === 'all' || value === '') {
        return { ...prev, [type]: [] };
      }
      
      const currentArray = prev[type as keyof Omit<FilterState, 'eligibleOnly' | 'searchTerm'>] as string[];
      const newArray = currentArray.includes(value as string)
        ? [] // Clear the filter if it's already selected
        : [value as string]; // Set single value
      
      return { ...prev, [type]: newArray };
    });
  };

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const clearFilters = () => {
    setFilters({ cities: [], branches: [], categories: [], eligibleOnly: false, searchTerm: '' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportToPDF = () => {
    exportToPDF(studentName, studentAggregate, filteredResults);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eligibleCount = filteredResults.filter(c => c.eligible).length;

  return (
    <div className="space-y-4">
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
      />

      {/* Results Table */}
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <div className="bg-white rounded-lg border overflow-hidden">
          {/* Mobile: Horizontal scroll container */}
          <div className="overflow-x-auto">
            <div className={isMobile ? "min-w-[800px]" : ""}>
              <Table>
                <TableHeader className="bg-gray-50 sticky top-0">
                  <TableRow>
                    <TableHead className={`font-medium ${isMobile ? 'min-w-[200px]' : ''} p-1 md:p-2`}>College</TableHead>
                    <TableHead className={`font-medium ${isMobile ? 'w-16' : 'w-24'} p-1 md:p-2`}>City</TableHead>
                    <TableHead className={`font-medium ${isMobile ? 'w-16' : 'w-20'} p-1 md:p-2`}>Type</TableHead>
                    <TableHead className={`font-medium ${isMobile ? 'min-w-[120px]' : ''} p-1 md:p-2`}>Branch</TableHead>
                    <TableHead className={`font-medium ${isMobile ? 'w-16' : 'w-20'} p-1 md:p-2`}>Category</TableHead>
                    <TableHead className={`text-center font-medium ${isMobile ? 'w-12' : 'w-16'} p-1 md:p-2`}>CAP1</TableHead>
                    <TableHead className={`text-center font-medium ${isMobile ? 'w-12' : 'w-16'} p-1 md:p-2`}>CAP2</TableHead>
                    <TableHead className={`text-center font-medium ${isMobile ? 'w-12' : 'w-16'} p-1 md:p-2`}>CAP3</TableHead>
                    <TableHead className={`text-center font-medium ${isMobile ? 'w-16' : 'w-20'} p-1 md:p-2`}>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentResults.map((college, index) => {
                    const collegeKey = `${college.collegeName}-${college.branch}-${college.category}`;
                    
                    return (
                      <ResultsTableRow
                        key={collegeKey}
                        college={college}
                        index={index}
                        studentAggregate={studentAggregate}
                        isShortlisted={false}
                        onToggleShortlist={() => {}} // Disabled
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t bg-gray-50">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalResults={filteredResults.length}
                resultsPerPage={resultsPerPage}
              />
            </div>
          )}
        </div>

        <SummaryCard eligibleCount={eligibleCount} studentAggregate={studentAggregate} />
      </div>

      <GoToTopButton show={showGoToTop} onClick={scrollToTop} />
    </div>
  );
};
