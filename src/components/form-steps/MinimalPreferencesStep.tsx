
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import {
  fetchAllCollegeNames,
  fetchCollegeTypesForColleges,
  fetchBranchesForColleges,
  fetchAvailableCategories,
  fetchAvailableBranches,
  fetchAvailableCities,
  type CollegeTypeInfo,
  type CollegeBranchInfo
} from "@/services/databaseService";

interface CollegeSelection {
  collegeName: string;
  collegeType: string;
  selectedBranches: string[];
  availableBranches: string[];
  expanded: boolean;
}

interface MinimalPreferencesStepProps {
  preferredBranches: string[];
  collegeTypes: string[];
  selectedColleges: string[];
  collegeSelections: CollegeSelection[];
  category: string;
  selectedCities: string[];
  onBranchChange: (branch: string, checked: boolean) => void;
  onCollegeTypeChange: (collegeType: string, checked: boolean) => void;
  onCollegeSelectionChange: (colleges: string[]) => void;
  onCollegeSelectionsChange: (selections: CollegeSelection[]) => void;
  onCategoryChange: (category: string) => void;
  onCityChange: (cities: string[]) => void;
}

export const MinimalPreferencesStep: React.FC<MinimalPreferencesStepProps> = ({
  preferredBranches,
  collegeTypes,
  selectedColleges,
  collegeSelections,
  category,
  selectedCities = [],
  onBranchChange,
  onCollegeTypeChange,
  onCollegeSelectionChange,
  onCollegeSelectionsChange,
  onCategoryChange,
  onCityChange
}) => {
  const [availableColleges, setAvailableColleges] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useAllColleges, setUseAllColleges] = useState(false);
  const [showBranches, setShowBranches] = useState(false);
  const [showCities, setShowCities] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (useAllColleges || selectedColleges.length > 0) {
      const collegesToLoad = useAllColleges ? availableColleges : selectedColleges;
      if (collegesToLoad.length > 0) {
        loadCollegeData(collegesToLoad);
      }
    } else {
      onCollegeSelectionsChange([]);
    }
  }, [selectedColleges, useAllColleges, availableColleges]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [colleges, categories, branches, cities] = await Promise.all([
        fetchAllCollegeNames(),
        fetchAvailableCategories(),
        fetchAvailableBranches(),
        fetchAvailableCities()
      ]);
      
      setAvailableColleges(colleges);
      setAvailableCategories(categories);
      setAvailableBranches(branches);
      setAvailableCities(cities);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCollegeData = async (colleges: string[]) => {
    if (colleges.length === 0) return;

    setIsLoading(true);
    try {
      const [collegeTypeData, branchData] = await Promise.all([
        fetchCollegeTypesForColleges(colleges),
        fetchBranchesForColleges(colleges)
      ]);

      const newSelections: CollegeSelection[] = colleges.map(collegeName => {
        const existingSelection = collegeSelections.find(s => s.collegeName === collegeName);
        const typeInfo = collegeTypeData.find(ct => ct.college_name === collegeName);
        const branches = branchData
          .filter(b => b.college_name === collegeName)
          .map(b => b.branch_name);

        return {
          collegeName,
          collegeType: typeInfo?.college_type || 'Unknown',
          selectedBranches: existingSelection?.selectedBranches || [],
          availableBranches: branches,
          expanded: existingSelection?.expanded ?? false
        };
      });

      onCollegeSelectionsChange(newSelections);
    } catch (error) {
      console.error('Failed to load college data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseAllColleges = () => {
    setUseAllColleges(!useAllColleges);
    if (!useAllColleges) {
      onCollegeSelectionChange([]);
    }
  };

  const handleCollegeToggle = (collegeName: string, checked: boolean) => {
    const newSelectedColleges = checked
      ? [...selectedColleges, collegeName]
      : selectedColleges.filter(c => c !== collegeName);
    
    onCollegeSelectionChange(newSelectedColleges);
  };

  const handleBranchToggle = (branchName: string, checked: boolean) => {
    onBranchChange(branchName, checked);
  };

  const handleCityToggle = (cityName: string, checked: boolean) => {
    const newSelectedCities = checked
      ? [...selectedCities, cityName]
      : selectedCities.filter(c => c !== cityName);
    
    onCityChange(newSelectedCities);
  };

  const getTotalSelectedBranches = () => {
    return preferredBranches.length;
  };

  const getTotalSelectedCities = () => {
    return selectedCities.length;
  };

  const getCollegeTypeOptions = () => {
    const types = [...new Set(collegeSelections.map(s => s.collegeType).filter(t => t !== 'Unknown'))];
    return types.map(type => ({ value: type, label: type }));
  };

  return (
    <Card className="bg-card border-border shadow-sm text-card-foreground">
      <CardHeader>
        <CardTitle className="text-card-foreground">Course & College Selection</CardTitle>
        <CardDescription className="text-muted-foreground">
          Select your preferences for finding the right colleges.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Category and City Selection - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Selection */}
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-card-foreground">Category *</Label>
              <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 mt-2"
              >
                <option value="">Select your category</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {!category && (
                <p className="text-sm text-destructive mt-2">Please select your category</p>
              )}
            </CardContent>
          </Card>

          {/* City Selection */}
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-card-foreground">
                  Cities ({selectedCities.length} selected)
                </Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCities(!showCities)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showCities ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
              
              {showCities && (
                <div className="border border-border rounded-lg p-3 max-h-48 overflow-y-auto bg-background">
                  <div className="grid grid-cols-1 gap-2">
                    {availableCities.map((city) => (
                      <label key={city} className="flex items-center space-x-3 p-2 hover:bg-muted rounded cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedCities.includes(city)}
                          onChange={(e) => {
                            const newSelectedCities = e.target.checked
                              ? [...selectedCities, city]
                              : selectedCities.filter(c => c !== city);
                            onCityChange(newSelectedCities);
                          }}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-foreground flex-1">{city}</span>
                        {selectedCities.includes(city) && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedCities.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-3">
                  {selectedCities.slice(0, 3).map((city) => (
                    <Badge key={city} variant="secondary" className="text-xs">
                      {city}
                    </Badge>
                  ))}
                  {selectedCities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedCities.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
              
              {selectedCities.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">No cities selected - all cities will be included</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Branch Selection */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-card-foreground">
                Branches * ({preferredBranches.length} selected)
              </Label>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowBranches(!showBranches)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showBranches ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
            
            {showBranches && (
              <div className="border border-border rounded-lg p-3 max-h-64 overflow-y-auto bg-background">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableBranches.map((branch) => (
                    <label key={branch} className="flex items-center space-x-3 p-2 hover:bg-muted rounded cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={preferredBranches.includes(branch)}
                        onChange={(e) => onBranchChange(branch, e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-foreground flex-1">{branch}</span>
                      {preferredBranches.includes(branch) && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {preferredBranches.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {preferredBranches.slice(0, 3).map((branch) => (
                  <Badge key={branch} variant="secondary" className="text-xs">
                    {branch}
                  </Badge>
                ))}
                {preferredBranches.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{preferredBranches.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            {preferredBranches.length === 0 && (
              <p className="text-sm text-destructive mt-2">Please select at least one branch</p>
            )}
          </CardContent>
        </Card>

        {/* College Selection */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <Label className="text-sm font-medium text-card-foreground">College Selection (Optional)</Label>
            
            <div className="border border-border rounded-lg p-3 mt-3 bg-background">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAllColleges}
                  onChange={() => {
                    setUseAllColleges(!useAllColleges);
                    if (!useAllColleges) {
                      onCollegeSelectionChange([]);
                    }
                  }}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-foreground">Include all available colleges (recommended)</span>
              </label>
              
              {!useAllColleges && (
                <div className="mt-4 space-y-2">
                  <Label className="text-xs text-muted-foreground">Or select specific colleges:</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {isLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground mx-auto"></div>
                        <p className="text-xs text-muted-foreground mt-2">Loading...</p>
                      </div>
                    ) : (
                      availableColleges.map((college) => (
                        <label key={college} className="flex items-center space-x-2 p-1 hover:bg-muted rounded cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedColleges.includes(college)}
                            onChange={(e) => {
                              const newSelectedColleges = e.target.checked
                                ? [...selectedColleges, college]
                                : selectedColleges.filter(c => c !== college);
                              onCollegeSelectionChange(newSelectedColleges);
                            }}
                            className="w-3 h-3 accent-primary"
                          />
                          <span className="text-xs text-foreground">{college}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* College Type Filter */}
        {collegeSelections.length > 0 && (
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-card-foreground">College Type Filter (Optional)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                {['Government', 'Government Autonomous', 'Private'].map((type) => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={collegeTypes.includes(type)}
                      onChange={(e) => onCollegeTypeChange(type, e.target.checked)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground">{type}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selection Summary */}
        <Card className="bg-muted border-border">
          <CardContent className="p-4">
            <div className="text-sm text-foreground">
              <strong>Selection Summary:</strong>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>Category: {category || 'Not selected'}</li>
                <li>Cities: {selectedCities.length > 0 ? `${selectedCities.length} selected` : 'All cities included'}</li>
                <li>Branches: {preferredBranches.length} selected</li>
                <li>Colleges: {useAllColleges ? 'All included' : `${selectedColleges.length} selected`}</li>
              </ul>
            </div>
            
            {(!category || preferredBranches.length === 0) && (
              <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                Please complete category and branch selections to proceed.
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
