
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Search, X } from "lucide-react";

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
  // Filter out empty values and ensure all values are valid strings
  const validCities = uniqueCities.filter(city => city && city.trim() !== '');
  const validBranches = uniqueBranches.filter(branch => branch && branch.trim() !== '');
  const validCategories = uniqueCategories.filter(category => category && category.trim() !== '');

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm mb-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            College Analysis Results for {studentName}
          </h2>
          <p className="text-sm text-gray-600">
            {filteredResultsLength} total results • {eligibleCount} eligible colleges
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefillForm} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            New Search
          </Button>
          <Button onClick={onExportToPDF} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search colleges, branches, or cities..."
          value={filters.searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {/* City Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
          <Select 
            value={filters.cities.length > 0 ? filters.cities[0] : ""} 
            onValueChange={(value) => onToggleFilter('cities', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {validCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Branch Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Branch</label>
          <Select 
            value={filters.branches.length > 0 ? filters.branches[0] : ""} 
            onValueChange={(value) => onToggleFilter('branches', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {validBranches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
          <Select 
            value={filters.categories.length > 0 ? filters.categories[0] : ""} 
            onValueChange={(value) => onToggleFilter('categories', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {validCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Eligible Only Toggle */}
        <div className="flex items-end">
          <Button
            variant={filters.eligibleOnly ? "default" : "outline"}
            onClick={() => onToggleFilter('eligibleOnly', !filters.eligibleOnly)}
            className="w-full"
          >
            {filters.eligibleOnly ? 'Eligible Only ✓' : 'Show All'}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.cities.length > 0 || filters.branches.length > 0 || filters.categories.length > 0 || filters.eligibleOnly || filters.searchTerm) && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          
          {filters.searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{filters.searchTerm}"
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onSearchChange('')}
              />
            </Badge>
          )}
          
          {filters.cities.map(city => (
            <Badge key={city} variant="secondary" className="flex items-center gap-1">
              City: {city}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onToggleFilter('cities', city)}
              />
            </Badge>
          ))}
          
          {filters.branches.map(branch => (
            <Badge key={branch} variant="secondary" className="flex items-center gap-1">
              Branch: {branch}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onToggleFilter('branches', branch)}
              />
            </Badge>
          ))}
          
          {filters.categories.map(category => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              Category: {category}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onToggleFilter('categories', category)}
              />
            </Badge>
          ))}
          
          {filters.eligibleOnly && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Eligible Only
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onToggleFilter('eligibleOnly', false)}
              />
            </Badge>
          )}
          
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};
