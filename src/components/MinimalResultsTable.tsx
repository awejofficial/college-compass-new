
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, Check, X, Search } from "lucide-react";
import { PaginationControls } from "@/components/PaginationControls";
import jsPDF from 'jspdf';

export interface CollegeMatch {
  collegeName: string;
  city: string;
  branch: string;
  category: string;
  collegeType: string;
  cap1Cutoff: number | null;
  cap2Cutoff: number | null;
  cap3Cutoff: number | null;
  eligible: boolean;
}

interface MinimalResultsTableProps {
  results: CollegeMatch[];
  studentName: string;
  onRefillForm: () => void;
}

interface GroupedCollege {
  collegeName: string;
  city: string;
  collegeType: string;
  branches: CollegeMatch[];
  hasEligibleBranches: boolean;
}

export const MinimalResultsTable: React.FC<MinimalResultsTableProps> = ({ 
  results, 
  studentName, 
  onRefillForm 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<'all' | 'eligible' | 'government' | 'private'>('all');
  const [cityFilter, setCityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const resultsPerPage = 10; // Reduced since we're showing grouped results

  // Group colleges by name
  const groupedColleges = React.useMemo(() => {
    const grouped = new Map<string, GroupedCollege>();
    
    results.forEach(college => {
      const key = `${college.collegeName}-${college.city}`;
      
      if (!grouped.has(key)) {
        grouped.set(key, {
          collegeName: college.collegeName,
          city: college.city,
          collegeType: college.collegeType,
          branches: [],
          hasEligibleBranches: false
        });
      }
      
      const group = grouped.get(key)!;
      group.branches.push(college);
      
      if (college.eligible) {
        group.hasEligibleBranches = true;
      }
    });
    
    return Array.from(grouped.values());
  }, [results]);

  // Get unique cities for filter
  const uniqueCities = [...new Set(results.map(college => college.city))].sort();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [results, filterType, cityFilter, searchTerm]);

  // Filter and search results
  const filteredGroups = groupedColleges
    .filter(group => {
      // Type filter
      let typeMatch = true;
      switch (filterType) {
        case 'eligible':
          typeMatch = group.hasEligibleBranches;
          break;
        case 'government':
          typeMatch = group.collegeType?.toLowerCase().includes('government');
          break;
        case 'private':
          typeMatch = group.collegeType?.toLowerCase().includes('private');
          break;
      }

      // City filter
      const cityMatch = cityFilter === '' || group.city === cityFilter;

      // Search filter
      const searchMatch = searchTerm === '' || 
        group.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.branches.some(branch => branch.branch.toLowerCase().includes(searchTerm.toLowerCase()));

      return typeMatch && cityMatch && searchMatch;
    })
    .sort((a, b) => {
      // Sort colleges with eligible branches first
      if (a.hasEligibleBranches && !b.hasEligibleBranches) return -1;
      if (!a.hasEligibleBranches && b.hasEligibleBranches) return 1;
      return a.collegeName.localeCompare(b.collegeName);
    });

  const totalPages = Math.ceil(filteredGroups.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  const exportToPDF = async () => {
    const doc = new jsPDF();
    
    // Add logo
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/lovable-uploads/214526ee-d1c4-40fc-b3b1-0b58d7e80662.png';
      
      logoImg.onload = () => {
        // Add logo at top
        doc.addImage(logoImg, 'PNG', 20, 10, 30, 15);
        
        // Set title
        doc.setFontSize(16);
        doc.text(`College Results for ${studentName}`, 60, 20);
        
        // Add summary
        doc.setFontSize(12);
        doc.text(`Total Colleges: ${filteredGroups.length}`, 20, 35);
        doc.text(`Eligible Colleges: ${eligibleCount}`, 20, 45);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);
        
        // Add content
        let yPosition = 70;
        
        filteredGroups.forEach((group) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          // College header
          doc.setFontSize(14);
          doc.setFont(undefined, 'bold');
          doc.text(`${group.collegeName} - ${group.city}`, 20, yPosition);
          yPosition += 8;
          
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(`Type: ${group.collegeType}`, 20, yPosition);
          yPosition += 8;
          
          // Branches
          group.branches.forEach(branch => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.text(`• ${branch.branch} (${branch.category})`, 25, yPosition);
            doc.text(`CAP1: ${branch.cap1Cutoff || 'N/A'}%`, 120, yPosition);
            doc.text(`CAP2: ${branch.cap2Cutoff || 'N/A'}%`, 150, yPosition);
            doc.text(`CAP3: ${branch.cap3Cutoff || 'N/A'}%`, 180, yPosition);
            
            yPosition += 6;
          });
          
          yPosition += 5; // Extra space between colleges
        });
        
        // Add footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text('Generated by FindMyCLG - Your College Search Platform', 20, 290);
          doc.text(`Page ${i} of ${pageCount}`, 180, 290);
        }
        
        // Save the PDF
        doc.save(`${studentName}-colleges-2024.pdf`);
      };
    } catch (error) {
      console.error('Error loading logo for PDF:', error);
      // Fallback without logo
      doc.setFontSize(16);
      doc.text(`College Results for ${studentName}`, 20, 20);
      // ... rest of PDF generation without logo
      doc.save(`${studentName}-colleges-2024.pdf`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eligibleCount = results.filter(college => college.eligible).length;
  const totalColleges = groupedColleges.length;

  return (
    <div className="container-minimal py-8">
      {/* Header */}
      <div className="minimal-card mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              College Results for {studentName}
            </h1>
            <p className="text-muted-foreground">
              {totalColleges} colleges found ({eligibleCount} eligible branches)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onRefillForm} className="btn-minimal">
              <RefreshCw className="w-4 h-4 mr-2" />
              New Search
            </Button>
            {results.length > 0 && (
              <Button onClick={exportToPDF} className="btn-nvidia">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      {results.length > 0 && (
        <div className="minimal-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search colleges or branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-minimal pl-10 w-full"
              />
            </div>

            {/* City Filter */}
            <select 
              value={cityFilter} 
              onChange={(e) => setCityFilter(e.target.value)}
              className="input-minimal"
            >
              <option value="">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            
            {/* Type Filter */}
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as any)}
              className="input-minimal"
            >
              <option value="all">All Types</option>
              <option value="eligible">Eligible Only</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
            </select>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={() => {
                setCityFilter('');
                setFilterType('all');
                setSearchTerm('');
              }}
              className="btn-minimal"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Results - Grouped by College */}
      {currentGroups.length > 0 ? (
        <>
          <div className="space-y-4">
            {currentGroups.map((group, groupIndex) => (
              <div 
                key={`${group.collegeName}-${group.city}-${groupIndex}`}
                className={`minimal-card ${
                  group.hasEligibleBranches ? 'border-nvidia-green/30 bg-nvidia-green/5' : ''
                }`}
              >
                {/* College Header */}
                <div className="border-b border-border pb-4 mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {group.collegeName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {group.city}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {group.collegeType || 'N/A'}
                        </Badge>
                        {group.hasEligibleBranches && (
                          <Badge className="text-xs bg-nvidia-green/20 text-nvidia-green border-nvidia-green/30">
                            Has Eligible Branches
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branches */}
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground mb-3">Available Branches:</h4>
                  {group.branches.map((branch, branchIndex) => (
                    <div 
                      key={`${branch.branch}-${branch.category}-${branchIndex}`}
                      className={`p-3 rounded-lg border ${
                        branch.eligible 
                          ? 'border-nvidia-green/30 bg-nvidia-green/10' 
                          : 'border-border bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-foreground">{branch.branch}</span>
                            <Badge variant="outline" className="text-xs">
                              {branch.category}
                            </Badge>
                            {branch.eligible ? (
                              <Check className="w-4 h-4 text-nvidia-green" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">CAP1: </span>
                              <span className={branch.cap1Cutoff ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                                {branch.cap1Cutoff ? `${branch.cap1Cutoff}%` : '—'}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">CAP2: </span>
                              <span className={branch.cap2Cutoff ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                                {branch.cap2Cutoff ? `${branch.cap2Cutoff}%` : '—'}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">CAP3: </span>
                              <span className={branch.cap3Cutoff ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                                {branch.cap3Cutoff ? `${branch.cap3Cutoff}%` : '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalResults={filteredGroups.length}
                resultsPerPage={resultsPerPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="minimal-card max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-4">
              No colleges match your current criteria. Try adjusting your filters.
            </p>
            <Button onClick={onRefillForm} className="btn-nvidia">
              Start New Search
            </Button>
          </div>
        </div>
      )}

      {/* Success Summary */}
      {eligibleCount > 0 && (
        <div className="minimal-card mt-6 border-nvidia-green/30 bg-nvidia-green/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-nvidia-green/20 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-nvidia-green" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Eligible Branches Found</h3>
              <p className="text-muted-foreground text-sm">
                You're eligible for {eligibleCount} branches across {totalColleges} colleges. Focus on these options.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
