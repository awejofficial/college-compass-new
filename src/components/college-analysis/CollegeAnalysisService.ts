
import { CutoffRecord } from "@/services/databaseService";
import { CollegeMatch } from "./FormDataTypes";

export const processCollegeMatches = (cutoffData: CutoffRecord[], studentAggregate: number): CollegeMatch[] => {
  // Group by unique combination of college_name, branch_name, category
  const uniqueCombinations = new Map<string, CutoffRecord>();
  
  cutoffData.forEach(record => {
    const key = `${record.college_name}-${record.branch_name}-${record.category}`;
    if (!uniqueCombinations.has(key)) {
      uniqueCombinations.set(key, record);
    }
  });

  const matches: CollegeMatch[] = Array.from(uniqueCombinations.values()).map(record => {
    // Check eligibility against any available cutoff
    const eligibleForCap1 = record.cap1_cutoff ? studentAggregate >= record.cap1_cutoff : false;
    const eligibleForCap2 = record.cap2_cutoff ? studentAggregate >= record.cap2_cutoff : false;
    const eligibleForCap3 = record.cap3_cutoff ? studentAggregate >= record.cap3_cutoff : false;
    
    const eligible = eligibleForCap1 || eligibleForCap2 || eligibleForCap3;

    return {
      collegeName: record.college_name,
      city: record.city || 'Unknown',
      branch: record.branch_name,
      category: record.category,
      collegeType: record.college_type,
      cap1Cutoff: record.cap1_cutoff || null,
      cap2Cutoff: record.cap2_cutoff || null,
      cap3Cutoff: record.cap3_cutoff || null,
      eligible
    };
  });

  // Sort by eligible first, then by lowest cutoff available
  return matches.sort((a, b) => {
    if (a.eligible && !b.eligible) return -1;
    if (!a.eligible && b.eligible) return 1;
    
    // Get lowest cutoff for sorting
    const getLowestCutoff = (college: CollegeMatch) => {
      const cutoffs = [college.cap1Cutoff, college.cap2Cutoff, college.cap3Cutoff]
        .filter(c => c !== null) as number[];
      return cutoffs.length > 0 ? Math.min(...cutoffs) : 100;
    };
    
    return getLowestCutoff(a) - getLowestCutoff(b);
  });
};
