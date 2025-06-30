
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Heart, Check, X } from "lucide-react";
import { CollegeMatch } from "./FormDataTypes";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultsTableRowProps {
  college: CollegeMatch;
  index: number;
  studentAggregate: number;
  isShortlisted: boolean;
  onToggleShortlist: (collegeKey: string) => void;
}

export const ResultsTableRow: React.FC<ResultsTableRowProps> = ({
  college,
  index,
  studentAggregate,
  isShortlisted,
  onToggleShortlist
}) => {
  const isMobile = useIsMobile();
  const collegeKey = `${college.collegeName}-${college.branch}-${college.category}`;
  const isEligible = college.eligible;

  return (
    <TableRow 
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
          onClick={() => onToggleShortlist(collegeKey)}
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
};
