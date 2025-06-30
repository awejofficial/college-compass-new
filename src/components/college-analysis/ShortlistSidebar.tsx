
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CollegeMatch } from "./FormDataTypes";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShortlistSidebarProps {
  shortlistedColleges: Set<string>;
  filteredResults: CollegeMatch[];
  onClose: () => void;
}

export const ShortlistSidebar: React.FC<ShortlistSidebarProps> = ({
  shortlistedColleges,
  filteredResults,
  onClose
}) => {
  const isMobile = useIsMobile();

  if (shortlistedColleges.size === 0) return null;

  return (
    <div className={`fixed ${isMobile ? 'right-2 top-20 w-72' : 'right-4 top-24 w-80'} bg-white border rounded-lg shadow-lg p-3 md:p-4 z-20 max-h-96 overflow-y-auto`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>My Shortlist ({shortlistedColleges.size})</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
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
  );
};
