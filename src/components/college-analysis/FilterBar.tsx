
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Heart, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterState {
  cities: string[];
  branches: string[];
  capRounds: string[];
  eligibleOnly: boolean;
}

interface FilterBarProps {
  studentName: string;
  filteredResultsLength: number;
  eligibleCount: number;
  shortlistedCollegesSize: number;
  filters: FilterState;
  uniqueCities: string[];
  uniqueBranches: string[];
  onRefillForm: () => void;
  onExportToPDF: () => void;
  onToggleShortlist: () => void;
  onToggleFilter: (type: keyof FilterState, value: string | boolean) => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  studentName,
  filteredResultsLength,
  eligibleCount,
  shortlistedCollegesSize,
  filters,
  uniqueCities,
  uniqueBranches,
  onRefillForm,
  onExportToPDF,
  onToggleShortlist,
  onToggleFilter,
  onClearFilters
}) => {
  const isMobile = useIsMobile();
  const isGuestUser = studentName === "Guest User" || !studentName;

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
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "sm"}
              onClick={onToggleShortlist}
              className="relative text-xs md:text-sm"
            >
              <Heart className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              My List ({shortlistedCollegesSize})
            </Button>
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
        <div className={`flex flex-wrap items-center gap-2 md:gap-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {/* Eligible Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.eligibleOnly}
              onChange={(e) => onToggleFilter('eligibleOnly', e.target.checked)}
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
                  onClick={() => onToggleFilter('cities', city)}
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
                  onClick={() => onToggleFilter('branches', branch)}
                >
                  {branch.length > (isMobile ? 6 : 8) ? `${branch.substring(0, isMobile ? 6 : 8)}...` : branch}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.cities.length > 0 || filters.branches.length > 0 || filters.eligibleOnly) && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className={`h-5 md:h-6 px-1 md:px-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
