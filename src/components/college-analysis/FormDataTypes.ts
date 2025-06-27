
export interface CollegeSelection {
  collegeName: string;
  collegeType: string;
  selectedBranches: string[];
  availableBranches: string[];
  expanded: boolean;
}

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

export interface FormData {
  fullName: string;
  aggregate: string;
  category: string;
  preferredBranches: string[];
  collegeTypes: string[];
  selectedColleges: string[];
  collegeSelections: CollegeSelection[];
  selectedCities: string[];
}

export interface CollegeType {
  value: string;
  label: string;
}
