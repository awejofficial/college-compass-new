
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Search, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterState {
  cities: string[];
  branches: string[];
  categories: string[];
  eligibleOnly: boolean;
  searchTerm: string;
}

interface FilterBarProps {
  studentName: string;
  filteredResultsLength: number;
  eligibleCount: number;
  filters: FilterState;
  uniqueCities: string[];
  uniqueBranches: string[];
  uniqueCategories: string[];
  onRefillForm: () => void;
  onExportToPDF: () => void;
  onToggleFilter: (type: keyof FilterState, value: string | boolean) => void;
  onClearFilters: () => void;
  onSearchChange: (searchTerm: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  studentName,
  filteredResultsLength,
  eligibleCount,
  filters,
  uniqueCities,
  uniqueBranches,
  uniqueCategories,
  onRefillForm,
  onExportToPDF,
  onToggleFilter,
  onClearFilters,
  onSearchChange
}) => {
  const isMobile = useIsMobile();
  const isGuestUser = studentName === "Guest User" || !studentName;
  const hasActiveFilters = filters.cities.length > 0 || filters.branches.length > 0 || 
                          filters.categories.length > 0 || filters.eligibleOnly || filters.searchTerm;

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-2 md:space-y-0">
          <div>
            <h2 className={`font-bold text-foreground ${isMobile ? 'text-lg' : 'text-xl'}`}>
              🎓 College Results for {isGuestUser ? "Guest User" : studentName}
            </h2>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {filteredResultsLength} colleges • {eligibleCount} eligible
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size={isMobile ? "sm" : "sm"} onClick={onRefillForm} className="text-xs md:text-sm">
              <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              New Search
            </Button>
            <Button size={isMobile ? "sm" : "sm"} onClick={onExportToPDF} className="text-xs md:text-sm">
              <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search colleges or branches..."
              value={filters.searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* City Filter */}
          <Select 
            value={filters.cities.length > 0 ? filters.cities[0] : ""} 
            onValueChange={(value) => {
              if (value) {
                onToggleFilter('cities', value);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
              <SelectItem value="">All Cities</SelectItem>
              {uniqueCities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Branch Filter */}
          <Select 
            value={filters.branches.length > 0 ? filters.branches[0] : ""} 
            onValueChange={(value) => {
              if (value) {
                onToggleFilter('branches', value);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
              <SelectItem value="">All Branches</SelectItem>
              {uniqueBranches.map(branch => (
                <SelectItem key={branch} value={branch}>
                  {branch.length > 25 ? `${branch.substring(0, 25)}...` : branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select 
            value={filters.categories.length > 0 ? filters.categories[0] : ""} 
            onValueChange={(value) => {
              if (value) {
                onToggleFilter('categories', value);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
              <SelectItem value="">All Categories</SelectItem>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Additional Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Eligible Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.eligibleOnly}
              onChange={(e) => onToggleFilter('eligibleOnly', e.target.checked)}
              className="rounded"
            />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Eligible Only</span>
          </label>

          {/* Active Filters Display */}
          {filters.cities.length > 0 && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
              <span>City: {filters.cities[0]}</span>
              <button 
                onClick={() => onToggleFilter('cities', filters.cities[0])}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {filters.branches.length > 0 && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
              <span>Branch: {filters.branches[0].substring(0, 15)}...</span>
              <button 
                onClick={() => onToggleFilter('branches', filters.branches[0])}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {filters.categories.length > 0 && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
              <span>Category: {filters.categories[0]}</span>
              <button 
                onClick={() => onToggleFilter('categories', filters.categories[0])}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className={`h-6 px-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>
              <X className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
