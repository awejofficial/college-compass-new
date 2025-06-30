import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, ChevronUp, Heart, Filter, X, Check } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CollegeMatch } from "./FormDataTypes";
import { useIsMobile } from "@/hooks/use-mobile";
import jsPDF from 'jspdf';

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

  const exportToPDF = async () => {
    const doc = new jsPDF();
    
    // Header with logo
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/lovable-uploads/214526ee-d1c4-40fc-b3b1-0b58d7e80662.png';
      
      logoImg.onload = () => {
        doc.addImage(logoImg, 'PNG', 20, 10, 25, 12);
        
        doc.setFontSize(16);
        doc.text(`FindMyClg - DSE College Results`, 55, 18);
        
        doc.setFontSize(12);
        doc.text(`Student: ${studentName}`, 20, 35);
        doc.text(`Diploma Aggregate: ${studentAggregate}%`, 20, 45);
        doc.text(`Total Results: ${filteredResults.length}`, 20, 55);
        doc.text(`Eligible Colleges: ${filteredResults.filter(c => c.eligible).length}`, 20, 65);
        
        // Table content
        let yPosition = 80;
        doc.setFontSize(10);
        
        // Table headers
        doc.setFont(undefined, 'bold');
        doc.text('College', 20, yPosition);
        doc.text('City', 80, yPosition);
        doc.text('Branch', 110, yPosition);
        doc.text('CAP1', 150, yPosition);
        doc.text('CAP2', 170, yPosition);
        doc.text('CAP3', 190, yPosition);
        yPosition += 8;
        
        doc.setFont(undefined, 'normal');
        filteredResults.forEach((college) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          
          const status = college.eligible ? '✓' : '✗';
          doc.text(`${status} ${college.collegeName.substring(0, 25)}`, 20, yPosition);
          doc.text(college.city, 80, yPosition);
          doc.text(college.branch.substring(0, 15), 110, yPosition);
          doc.text(college.cap1Cutoff ? `${college.cap1Cutoff}%` : '-', 150, yPosition);
          doc.text(college.cap2Cutoff ? `${college.cap2Cutoff}%` : '-', 170, yPosition);
          doc.text(college.cap3Cutoff ? `${college.cap3Cutoff}%` : '-', 190, yPosition);
          yPosition += 6;
        });
        
        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text('FindMyClg - Your DSE Admission Partner', 20, 290);
          doc.text(`Page ${i} of ${pageCount}`, 180, 290);
        }
        
        doc.save(`${studentName}-college-results.pdf`);
      };
    } catch (error) {
      console.error('Error loading logo for PDF:', error);
    }
  };

  const eligibleCount = filteredResults.filter(c => c.eligible).length;
  const isGuestUser = studentName === "Guest User" || !studentName;

  return (
    <div className="space-y-4">
      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-2 md:space-y-0">
            <div>
              <h2 className={`font-bold text-foreground ${isMobile ? 'text-lg' : 'text-xl'}`}>
                🎓 College Results for {isGuestUser ? "Guest User" : studentName}
              </h2>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {filteredResults.length} colleges • {eligibleCount} eligible
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "sm"}
                onClick={() => setShowShortlist(!showShortlist)}
                className="relative text-xs md:text-sm"
              >
                <Heart className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                My List ({shortlistedColleges.size})
              </Button>
              <Button variant="outline" size={isMobile ? "sm" : "sm"} onClick={onRefillForm} className="text-xs md:text-sm">
                <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                New Search
              </Button>
              <Button size={isMobile ? "sm" : "sm"} onClick={exportToPDF} className="text-xs md:text-sm">
                <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className={`flex flex-wrap items-center gap-2 md:gap-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {/* Eligible Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.eligibleOnly}
                onChange={(e) => toggleFilter('eligibleOnly', e.target.checked)}
                className="rounded"
              />
              <span>Eligible Only</span>
            </label>

            {/* City Filter */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">City:</span>
              <div className="flex flex-wrap gap-1">
                {uniqueCities.slice(0, isMobile ? 3 : 5).map(city => (
                  <Button 
                    key={city}
                    variant={filters.cities.includes(city) ? "default" : "outline"}
                    size="sm"
                    className={`h-5 md:h-6 px-1 md:px-2 ${isMobile ? 'text-xs' : 'text-xs'}`}
                    onClick={() => toggleFilter('cities', city)}
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </div>

            {/* Branch Filter */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Branch:</span>
              <div className="flex flex-wrap gap-1">
                {uniqueBranches.slice(0, isMobile ? 2 : 4).map(branch => (
                  <Button 
                    key={branch}
                    variant={filters.branches.includes(branch) ? "default" : "outline"}
                    size="sm"
                    className={`h-5 md:h-6 px-1 md:px-2 ${isMobile ? 'text-xs' : 'text-xs'}`}
                    onClick={() => toggleFilter('branches', branch)}
                  >
                    {branch.length > (isMobile ? 6 : 8) ? `${branch.substring(0, isMobile ? 6 : 8)}...` : branch}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(filters.cities.length > 0 || filters.branches.length > 0 || filters.eligibleOnly) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className={`h-5 md:h-6 px-1 md:px-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

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
                    const isEligible = college.eligible;
                    
                    return (
                      <TableRow 
                        key={collegeKey}
                        className={`
                          ${isMobile ? 'text-xs' : 'text-sm'} hover:bg-gray-50 
                          ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}
                          ${isEligible ? 'border-l-4 border-l-green-500 bg-green-50/30' : ''}
                        `}
                      >
                        <TableCell className="py-1 px-1 md:px-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} p-0`}
                            onClick={() => toggleShortlist(collegeKey)}
                          >
                            <Heart 
                              className={`${isMobile ? 'h-2 w-2' : 'h-3 w-3'} ${
                                isShortlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
                              }`} 
                            />
                          </Button>
                        </TableCell>
                        <TableCell className="py-1 px-1 md:px-2 font-medium">
                          <div 
                            className={`${isMobile ? 'text-xs leading-tight' : ''}`}
                            title={college.collegeName}
                          >
                            {college.collegeName}
                          </div>
                        </TableCell>
                        <TableCell className="py-1 px-1 md:px-2">
                          <Badge variant="outline" className={isMobile ? 'text-xs px-1 py-0' : 'text-xs'}>
                            {college.city}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-1 px-1 md:px-2">
                          <Badge variant="secondary" className={isMobile ? 'text-xs px-1 py-0' : 'text-xs'}>
                            {college.collegeType?.includes('Government') ? 'Govt' : 'Private'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-1 px-1 md:px-2">
                          <div 
                            className={`${isMobile ? 'text-xs leading-tight' : ''}`}
                            title={college.branch}
                          >
                            {college.branch}
                          </div>
                          <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
                            {college.category}
                          </div>
                        </TableCell>
                        <TableCell className={`py-1 px-1 md:px-2 text-center ${isMobile ? 'text-xs' : 'text-xs'}`}>
                          <span className={
                            college.cap1Cutoff && studentAggregate >= college.cap1Cutoff 
                              ? 'text-green-600 font-medium' 
                              : 'text-muted-foreground'
                          }>
                            {college.cap1Cutoff ? `${college.cap1Cutoff}%` : '—'}
                          </span>
                        </TableCell>
                        <TableCell className={`py-1 px-1 md:px-2 text-center ${isMobile ? 'text-xs' : 'text-xs'}`}>
                          <span className={
                            college.cap2Cutoff && studentAggregate >= college.cap2Cutoff 
                              ? 'text-green-600 font-medium' 
                              : 'text-muted-foreground'
                          }>
                            {college.cap2Cutoff ? `${college.cap2Cutoff}%` : '—'}
                          </span>
                        </TableCell>
                        <TableCell className={`py-1 px-1 md:px-2 text-center ${isMobile ? 'text-xs' : 'text-xs'}`}>
                          <span className={
                            college.cap3Cutoff && studentAggregate >= college.cap3Cutoff 
                              ? 'text-green-600 font-medium' 
                              : 'text-muted-foreground'
                          }>
                            {college.cap3Cutoff ? `${college.cap3Cutoff}%` : '—'}
                          </span>
                        </TableCell>
                        <TableCell className="py-1 px-1 md:px-2 text-center">
                          {isEligible ? (
                            <Check className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-green-600 mx-auto`} />
                          ) : (
                            <X className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-red-500 mx-auto`} />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        {eligibleCount > 0 && (
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
        )}
      </div>

      {/* Shortlist Sidebar */}
      {showShortlist && shortlistedColleges.size > 0 && (
        <div className={`fixed ${isMobile ? 'right-2 top-20 w-72' : 'right-4 top-24 w-80'} bg-white border rounded-lg shadow-lg p-3 md:p-4 z-20 max-h-96 overflow-y-auto`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>My Shortlist ({shortlistedColleges.size})</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowShortlist(false)}>
              <X className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            </Button>
          </div>
          <div className={`space-y-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {Array.from(shortlistedColleges).map(collegeKey => {
              const college = filteredResults.find(c => 
                `${c.collegeName}-${c.branch}-${c.category}` === collegeKey
              );
              if (!college) return null;
              
              return (
                <div key={collegeKey} className="p-2 bg-gray-50 rounded border-l-2 border-l-blue-500">
                  <div className={`font-medium ${isMobile ? 'text-xs' : ''}`}>{college.collegeName}</div>
                  <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
                    {college.branch} • {college.city}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Go to Top Button */}
      {showGoToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed ${isMobile ? 'bottom-4 right-4 w-10 h-10' : 'bottom-6 right-6 w-12 h-12'} bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-20`}
        >
          <ChevronUp className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
        </button>
      )}
    </div>
  );
};
