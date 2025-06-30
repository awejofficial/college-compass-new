
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CollegeMatch } from "./FormDataTypes";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterBar } from "./FilterBar";
import { ResultsTableRow } from "./ResultsTableRow";
import { ShortlistSidebar } from "./ShortlistSidebar";
import { GoToTopButton } from "./GoToTopButton";
import { SummaryCard } from "./SummaryCard";
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
  capRounds: string[];
  eligibleOnly: boolean;
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
    capRounds: [],
    eligibleOnly: false
  });
  const [shortlistedColleges, setShortlistedColleges] = useState<Set<string>>(new Set());
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [showShortlist, setShowShortlist] = useState(false);
  const isMobile = useIsMobile();

  // Scroll detection for go-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowGoToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get unique filter options
  const uniqueCities = [...new Set(results.map(r => r.city))].sort();
  const uniqueBranches = [...new Set(results.map(r => r.branch))].sort();

  // Filter and sort results
  const filteredResults = results
    .filter(college => {
      if (filters.eligibleOnly && !college.eligible) return false;
      if (filters.cities.length > 0 && !filters.cities.includes(college.city)) return false;
      if (filters.branches.length > 0 && !filters.branches.includes(college.branch)) return false;
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

  const toggleFilter = (type: keyof FilterState, value: string | boolean) => {
    setFilters(prev => {
      if (type === 'eligibleOnly') {
        return { ...prev, [type]: value as boolean };
      }
      
      const currentArray = prev[type as keyof Omit<FilterState, 'eligibleOnly'>] as string[];
      const newArray = currentArray.includes(value as string)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value as string];
      
      return { ...prev, [type]: newArray };
    });
  };

  const clearFilters = () => {
    setFilters({ cities: [], branches: [], capRounds: [], eligibleOnly: false });
  };

  const toggleShortlist = (collegeKey: string) => {
    setShortlistedColleges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(collegeKey)) {
        newSet.delete(collegeKey);
      } else {
        newSet.add(collegeKey);
      }
      return newSet;
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportToPDF = () => {
    exportToPDF(studentName, studentAggregate, filteredResults);
  };

  const eligibleCount = filteredResults.filter(c => c.eligible).length;

  return (
    <div className="space-y-4">
      <FilterBar
        studentName={studentName}
        filteredResultsLength={filteredResults.length}
        eligibleCount={eligibleCount}
        shortlistedCollegesSize={shortlistedColleges.size}
        filters={filters}
        uniqueCities={uniqueCities}
        uniqueBranches={uniqueBranches}
        onRefillForm={onRefillForm}
        onExportToPDF={handleExportToPDF}
        onToggleShortlist={() => setShowShortlist(!showShortlist)}
        onToggleFilter={toggleFilter}
        onClearFilters={clearFilters}
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
                    <TableHead className="w-8 p-1 md:p-2"></TableHead>
                    <TableHead className={`font-medium ${isMobile ? 'min-w-[200px]' : ''} p-1 md:p-2`}>College</TableHead>
                    <TableHead className={`font-medium ${isMobile ? 'w-16' : 'w-24'} p-1 md:p-2`}>City</TableHead>
                    <TableHead className={`font-medium ${isMobile ? 'w-16' : 'w-20'} p-1 md:p-2`}>Type</TableHead>
                    <TableHead className={`font-medium ${isMobile ? 'min-w-[120px]' : ''} p-1 md:p-2`}>Branch</TableHead>
                    <TableHead className={`text-center font-medium ${isMobile ? 'w-12' : 'w-16'} p-1 md:p-2`}>CAP1</TableHead>
                    <TableHead className={`text-center font-medium ${isMobile ? 'w-12' : 'w-16'} p-1 md:p-2`}>CAP2</TableHead>
                    <TableHead className={`text-center font-medium ${isMobile ? 'w-12' : 'w-16'} p-1 md:p-2`}>CAP3</TableHead>
                    <TableHead className={`text-center font-medium ${isMobile ? 'w-16' : 'w-20'} p-1 md:p-2`}>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((college, index) => {
                    const collegeKey = `${college.collegeName}-${college.branch}-${college.category}`;
                    const isShortlisted = shortlistedColleges.has(collegeKey);
                    
                    return (
                      <ResultsTableRow
                        key={collegeKey}
                        college={college}
                        index={index}
                        studentAggregate={studentAggregate}
                        isShortlisted={isShortlisted}
                        onToggleShortlist={toggleShortlist}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <SummaryCard eligibleCount={eligibleCount} studentAggregate={studentAggregate} />
      </div>

      {showShortlist && (
        <ShortlistSidebar
          shortlistedColleges={shortlistedColleges}
          filteredResults={filteredResults}
          onClose={() => setShowShortlist(false)}
        />
      )}

      <GoToTopButton show={showGoToTop} onClick={scrollToTop} />
    </div>
  );
};
