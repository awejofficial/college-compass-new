
import { useState, useEffect } from 'react';
import { CollegeMatch } from "./FormDataTypes";

export interface FilterState {
  cities: string[];
  branches: string[];
  categories: string[];
  eligibleOnly: boolean;
  searchTerm: string;
}

export const useFilterLogic = (results: CollegeMatch[]) => {
  const [filters, setFilters] = useState<FilterState>({
    cities: [],
    branches: [],
    categories: [],
    eligibleOnly: false,
    searchTerm: ''
  });

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

  const eligibleCount = filteredResults.filter(c => c.eligible).length;

  return {
    filters,
    filteredResults,
    uniqueCities,
    uniqueBranches,
    uniqueCategories,
    eligibleCount,
    toggleFilter,
    handleSearchChange,
    clearFilters
  };
};
