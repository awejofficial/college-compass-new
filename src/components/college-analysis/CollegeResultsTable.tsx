
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, ChevronDown, ChevronRight, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PaginationControls } from "@/components/PaginationControls";
import { CollegeMatch } from "./FormDataTypes";
import jsPDF from 'jspdf';

interface CollegeResultsTableProps {
  results: CollegeMatch[];
  studentName: string;
  studentAggregate: number;
  onRefillForm: () => void;
}

interface GroupedCollege {
  collegeName: string;
  city: string;
  collegeType: string;
  branches: CollegeMatch[];
  hasEligibleBranches: boolean;
}

export const CollegeResultsTable: React.FC<CollegeResultsTableProps> = ({ 
  results, 
  studentName,
  studentAggregate,
  onRefillForm 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'city' | 'eligible' | 'cutoff'>('eligible');
  const [filterType, setFilterType] = useState<'all' | 'eligible' | 'government' | 'private'>('all');
  const [cityFilter, setCityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const resultsPerPage = 15;

  // Group colleges by name and city
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
  }, [results, filterType, cityFilter, searchTerm, sortBy]);

  // Filter and sort results
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
      switch (sortBy) {
        case 'name':
          return a.collegeName.localeCompare(b.collegeName);
        case 'city':
          return a.city.localeCompare(b.city);
        case 'cutoff':
          const getLowestCutoff = (group: GroupedCollege) => {
            const allCutoffs = group.branches.flatMap(branch => 
              [branch.cap1Cutoff, branch.cap2Cutoff, branch.cap3Cutoff]
                .filter(c => c !== null) as number[]
            );
            return allCutoffs.length > 0 ? Math.min(...allCutoffs) : 100;
          };
          return getLowestCutoff(a) - getLowestCutoff(b);
        case 'eligible':
        default:
          if (a.hasEligibleBranches && !b.hasEligibleBranches) return -1;
          if (!a.hasEligibleBranches && b.hasEligibleBranches) return 1;
          return a.collegeName.localeCompare(b.collegeName);
      }
    });

  const totalPages = Math.ceil(filteredGroups.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  const exportToPDF = async () => {
    const doc = new jsPDF();
    
    // Add logo and header
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/lovable-uploads/214526ee-d1c4-40fc-b3b1-0b58d7e80662.png';
      
      logoImg.onload = () => {
        doc.addImage(logoImg, 'PNG', 20, 10, 25, 12);
        
        doc.setFontSize(16);
        doc.text(`College Results for ${studentName}`, 55, 18);
        
        doc.setFontSize(12);
        doc.text(`Diploma Aggregate: ${studentAggregate}%`, 20, 35);
        doc.text(`Total Colleges: ${filteredGroups.length}`, 20, 45);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
        
        // Table content
        let yPosition = 70;
        
        filteredGroups.forEach((group) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text(`${group.collegeName} - ${group.city}`, 20, yPosition);
          yPosition += 6;
          
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(`Type: ${group.collegeType}`, 20, yPosition);
          yPosition += 8;
          
          group.branches.forEach(branch => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.text(`• ${branch.branch} (${branch.category})`, 25, yPosition);
            doc.text(`CAP1: ${branch.cap1Cutoff || 'N/A'}%`, 120, yPosition);
            doc.text(`CAP2: ${branch.cap2Cutoff || 'N/A'}%`, 150, yPosition);
            doc.text(`CAP3: ${branch.cap3Cutoff || 'N/A'}%`, 180, yPosition);
            yPosition += 5;
          });
          
          yPosition += 5;
        });
        
        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text('Generated by FindMyClg - DSE College Finder', 20, 290);
          doc.text(`Page ${i} of ${pageCount}`, 180, 290);
        }
        
        doc.save(`${studentName}-colleges-2024.pdf`);
      };
    } catch (error) {
      console.error('Error loading logo for PDF:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eligibleCount = results.filter(college => college.eligible).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-card rounded-lg border">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            College Results for {studentName}
          </h2>
          <p className="text-muted-foreground">
            {filteredGroups.length} colleges found • {eligibleCount} eligible branches
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onRefillForm}>
            <RefreshCw className="w-4 h-4 mr-2" />
            New Search
          </Button>
          <Button onClick={exportToPDF} className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-card rounded-lg border">
        <div>
          <input
            type="text"
            placeholder="Search colleges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
          />
        </div>
        
        <select 
          value={cityFilter} 
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="">All Cities</option>
          {uniqueCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="all">All Types</option>
          <option value="eligible">Eligible Only</option>
          <option value="government">Government</option>
          <option value="private">Private</option>
        </select>

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="eligible">Sort by Eligibility</option>
          <option value="name">Sort by Name</option>
          <option value="city">Sort by City</option>
          <option value="cutoff">Sort by Cutoff</option>
        </select>

        <Button 
          variant="outline" 
          onClick={() => {
            setCityFilter('');
            setFilterType('all');
            setSearchTerm('');
            setSortBy('eligible');
          }}
        >
          <Filter className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Results Table */}
      {currentGroups.length > 0 ? (
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50 z-10">
                <TableRow>
                  <TableHead className="w-[300px]">College Name</TableHead>
                  <TableHead className="w-[100px]">City</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[200px]">Branches</TableHead>
                  <TableHead className="w-[80px] text-center">CAP1</TableHead>
                  <TableHead className="w-[80px] text-center">CAP2</TableHead>
                  <TableHead className="w-[80px] text-center">CAP3</TableHead>
                  <TableHead className="w-[100px] text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentGroups.map((group, index) => (
                  <React.Fragment key={`${group.collegeName}-${group.city}-${index}`}>
                    {group.branches.length === 1 ? (
                      // Single branch - display in one row
                      <TableRow 
                        className={`
                          ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                          ${group.hasEligibleBranches ? 'border-l-4 border-l-green-500 bg-green-50/50' : ''}
                        `}
                      >
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold text-foreground">{group.collegeName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {group.city}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {group.collegeType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-sm">{group.branches[0].branch}</div>
                            <Badge variant="outline" className="text-xs">
                              {group.branches[0].category}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-sm font-medium ${
                            group.branches[0].cap1Cutoff && studentAggregate >= group.branches[0].cap1Cutoff 
                              ? 'text-green-600' : 'text-muted-foreground'
                          }`}>
                            {group.branches[0].cap1Cutoff ? `${group.branches[0].cap1Cutoff}%` : '—'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-sm font-medium ${
                            group.branches[0].cap2Cutoff && studentAggregate >= group.branches[0].cap2Cutoff 
                              ? 'text-green-600' : 'text-muted-foreground'
                          }`}>
                            {group.branches[0].cap2Cutoff ? `${group.branches[0].cap2Cutoff}%` : '—'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-sm font-medium ${
                            group.branches[0].cap3Cutoff && studentAggregate >= group.branches[0].cap3Cutoff 
                              ? 'text-green-600' : 'text-muted-foreground'
                          }`}>
                            {group.branches[0].cap3Cutoff ? `${group.branches[0].cap3Cutoff}%` : '—'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={group.branches[0].eligible ? "default" : "secondary"} className="text-xs">
                            {group.branches[0].eligible ? 'Eligible' : 'Not Eligible'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ) : (
                      // Multiple branches - use accordion
                      <TableRow 
                        className={`
                          ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                          ${group.hasEligibleBranches ? 'border-l-4 border-l-green-500 bg-green-50/50' : ''}
                        `}
                      >
                        <TableCell colSpan={8} className="p-0">
                          <Accordion type="single" collapsible>
                            <AccordionItem value={`college-${index}`} className="border-none">
                              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <div className="font-semibold text-foreground text-left">{group.collegeName}</div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {group.city}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {group.collegeType}
                                    </Badge>
                                    <Badge className="text-xs">
                                      {group.branches.length} Branches
                                    </Badge>
                                    {group.hasEligibleBranches && (
                                      <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                        Has Eligible Branches
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Branch</TableHead>
                                      <TableHead>Category</TableHead>
                                      <TableHead className="text-center">CAP1</TableHead>
                                      <TableHead className="text-center">CAP2</TableHead>
                                      <TableHead className="text-center">CAP3</TableHead>
                                      <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {group.branches.map((branch, branchIndex) => (
                                      <TableRow 
                                        key={`${branch.branch}-${branch.category}-${branchIndex}`}
                                        className={branch.eligible ? 'bg-green-50/50' : ''}
                                      >
                                        <TableCell className="font-medium">{branch.branch}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline" className="text-xs">
                                            {branch.category}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <span className={`text-sm font-medium ${
                                            branch.cap1Cutoff && studentAggregate >= branch.cap1Cutoff 
                                              ? 'text-green-600' : 'text-muted-foreground'
                                          }`}>
                                            {branch.cap1Cutoff ? `${branch.cap1Cutoff}%` : '—'}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <span className={`text-sm font-medium ${
                                            branch.cap2Cutoff && studentAggregate >= branch.cap2Cutoff 
                                              ? 'text-green-600' : 'text-muted-foreground'
                                          }`}>
                                            {branch.cap2Cutoff ? `${branch.cap2Cutoff}%` : '—'}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <span className={`text-sm font-medium ${
                                            branch.cap3Cutoff && studentAggregate >= branch.cap3Cutoff 
                                              ? 'text-green-600' : 'text-muted-foreground'
                                          }`}>
                                            {branch.cap3Cutoff ? `${branch.cap3Cutoff}%` : '—'}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <Badge variant={branch.eligible ? "default" : "secondary"} className="text-xs">
                                            {branch.eligible ? 'Eligible' : 'Not Eligible'}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalResults={filteredGroups.length}
                resultsPerPage={resultsPerPage}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-2">No Results Found</h3>
          <p className="text-muted-foreground mb-4">
            No colleges match your current criteria. Try adjusting your filters.
          </p>
          <Button onClick={onRefillForm}>
            Start New Search
          </Button>
        </div>
      )}

      {/* Summary */}
      {eligibleCount > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800 mb-1">Great News!</h3>
              <p className="text-green-700 text-sm">
                You're eligible for {eligibleCount} branches across {filteredGroups.length} colleges. 
                Focus on these options for your applications.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
