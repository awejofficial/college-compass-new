
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, ChevronUp, Heart, Filter, X, Check } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CollegeMatch } from "./FormDataTypes";
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

  return (
    <div className="space-y-4">
      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                College Results for {studentName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredResults.length} colleges • {eligibleCount} eligible
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowShortlist(!showShortlist)}
                className="relative"
              >
                <Heart className="w-4 h-4 mr-1" />
                My List ({shortlistedColleges.size})
              </Button>
              <Button variant="outline" size="sm" onClick={onRefillForm}>
                <RefreshCw className="w-4 h-4 mr-1" />
                New Search
              </Button>
              <Button size="sm" onClick={exportToPDF}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
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
                {uniqueCities.slice(0, 5).map(city => (
                  <Button 
                    key={city}
                    variant={filters.cities.includes(city) ? "default" : "outline"}
                    size="sm"
                    className="h-6 px-2 text-xs"
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
                {uniqueBranches.slice(0, 4).map(branch => (
                  <Button 
                    key={branch}
                    variant={filters.branches.includes(branch) ? "default" : "outline"}
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => toggleFilter('branches', branch)}
                  >
                    {branch.length > 8 ? `${branch.substring(0, 8)}...` : branch}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(filters.cities.length > 0 || filters.branches.length > 0 || filters.eligibleOnly) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="font-medium">College</TableHead>
                  <TableHead className="w-24 font-medium">City</TableHead>
                  <TableHead className="w-20 font-medium">Type</TableHead>
                  <TableHead className="font-medium">Branch</TableHead>
                  <TableHead className="w-16 text-center font-medium">CAP1</TableHead>
                  <TableHead className="w-16 text-center font-medium">CAP2</TableHead>
                  <TableHead className="w-16 text-center font-medium">CAP3</TableHead>
                  <TableHead className="w-20 text-center font-medium">Status</TableHead>
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
                        text-sm hover:bg-gray-50 
                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}
                        ${isEligible ? 'border-l-4 border-l-green-500 bg-green-50/30' : ''}
                      `}
                    >
                      <TableCell className="py-1 px-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleShortlist(collegeKey)}
                        >
                          <Heart 
                            className={`h-3 w-3 ${
                              isShortlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
                            }`} 
                          />
                        </Button>
                      </TableCell>
                      <TableCell className="py-1 px-2 font-medium max-w-64">
                        <div className="truncate" title={college.collegeName}>
                          {college.collegeName}
                        </div>
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <Badge variant="outline" className="text-xs">
                          {college.city}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <Badge variant="secondary" className="text-xs">
                          {college.collegeType?.includes('Government') ? 'Govt' : 'Private'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-1 px-2 max-w-32">
                        <div className="truncate" title={college.branch}>
                          {college.branch}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {college.category}
                        </div>
                      </TableCell>
                      <TableCell className="py-1 px-2 text-center text-xs">
                        <span className={
                          college.cap1Cutoff && studentAggregate >= college.cap1Cutoff 
                            ? 'text-green-600 font-medium' 
                            : 'text-muted-foreground'
                        }>
                          {college.cap1Cutoff ? `${college.cap1Cutoff}%` : '—'}
                        </span>
                      </TableCell>
                      <TableCell className="py-1 px-2 text-center text-xs">
                        <span className={
                          college.cap2Cutoff && studentAggregate >= college.cap2Cutoff 
                            ? 'text-green-600 font-medium' 
                            : 'text-muted-foreground'
                        }>
                          {college.cap2Cutoff ? `${college.cap2Cutoff}%` : '—'}
                        </span>
                      </TableCell>
                      <TableCell className="py-1 px-2 text-center text-xs">
                        <span className={
                          college.cap3Cutoff && studentAggregate >= college.cap3Cutoff 
                            ? 'text-green-600 font-medium' 
                            : 'text-muted-foreground'
                        }>
                          {college.cap3Cutoff ? `${college.cap3Cutoff}%` : '—'}
                        </span>
                      </TableCell>
                      <TableCell className="py-1 px-2 text-center">
                        {isEligible ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Summary Card */}
        {eligibleCount > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Excellent! You have {eligibleCount} eligible options</h3>
                <p className="text-green-700 text-sm">
                  Based on your {studentAggregate}% aggregate, you can apply to these colleges with confidence.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shortlist Sidebar */}
      {showShortlist && shortlistedColleges.size > 0 && (
        <div className="fixed right-4 top-24 w-80 bg-white border rounded-lg shadow-lg p-4 z-20 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">My Shortlist ({shortlistedColleges.size})</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowShortlist(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            {Array.from(shortlistedColleges).map(collegeKey => {
              const college = filteredResults.find(c => 
                `${c.collegeName}-${c.branch}-${c.category}` === collegeKey
              );
              if (!college) return null;
              
              return (
                <div key={collegeKey} className="p-2 bg-gray-50 rounded border-l-2 border-l-blue-500">
                  <div className="font-medium truncate">{college.collegeName}</div>
                  <div className="text-xs text-muted-foreground">{college.branch} • {college.city}</div>
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
          className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-20"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
