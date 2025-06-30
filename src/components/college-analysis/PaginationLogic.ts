
import { useState, useEffect } from 'react';
import { CollegeMatch } from "./FormDataTypes";

export const usePaginationLogic = (
  filteredResults: CollegeMatch[], 
  resultsPerPage: number = 50
) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when filtered results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredResults]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    currentPage,
    totalPages,
    currentResults,
    handlePageChange
  };
};
