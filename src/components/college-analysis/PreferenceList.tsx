import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragSortableList } from "./DragSortableList";
import { CollegeMatch } from "./FormDataTypes";
import { Download, Star, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface PreferenceListProps {
  results: CollegeMatch[];
  studentName: string;
  isVisible: boolean;
  onClose: () => void;
}

export interface PreferenceItem {
  id: string;
  collegeName: string;
  branch: string;
  category: string;
  city: string;
  collegeType: string;
  eligible: boolean;
  priority: number;
  notes?: string;
}

export const PreferenceList: React.FC<PreferenceListProps> = ({
  results,
  studentName,
  isVisible,
  onClose
}) => {
  const [preferences, setPreferences] = useState<PreferenceItem[]>([]);
  const [availableColleges, setAvailableColleges] = useState<CollegeMatch[]>(results);
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    setAvailableColleges(results.filter(college => 
      !preferences.some(pref => 
        pref.collegeName === college.collegeName && 
        pref.branch === college.branch && 
        pref.category === college.category
      )
    ));
  }, [results, preferences]);

  // Load preferences from database on component mount
  useEffect(() => {
    if (isVisible) {
      loadPreferences();
    }
  }, [isVisible]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preference_list')
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        return;
      }

      if (data?.preference_list && Array.isArray(data.preference_list)) {
        setPreferences(data.preference_list as unknown as PreferenceItem[]);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async (newPreferences: PreferenceItem[]) => {
    try {
      const sessionId = localStorage.getItem('session-id') || `guest-${Date.now()}`;
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          session_id: sessionId,
          preference_list: newPreferences as any,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving preferences:', error);
        toast.error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  const addToPreferences = (college: CollegeMatch) => {
    const newPreference: PreferenceItem = {
      id: `${college.collegeName}-${college.branch}-${college.category}`,
      collegeName: college.collegeName,
      branch: college.branch,
      category: college.category,
      city: college.city,
      collegeType: college.collegeType,
      eligible: college.eligible,
      priority: preferences.length + 1
    };

    const updatedPreferences = [...preferences, newPreference];
    setPreferences(updatedPreferences);
    savePreferences(updatedPreferences);
    setShowAddMenu(false);
    toast.success(`Added ${college.collegeName} to your preference list`);
  };

  const removeFromPreferences = (displayId: string) => {
    // Convert display ID back to preference ID
    const parts = displayId.split('-');
    const collegeName = parts[0];
    const branch = parts[1];
    const category = parts[2];
    
    const updatedPreferences = preferences
      .filter(pref => !(pref.collegeName === collegeName && pref.branch === branch && pref.category === category))
      .map((pref, index) => ({ ...pref, priority: index + 1 }));
    
    setPreferences(updatedPreferences);
    savePreferences(updatedPreferences);
    toast.success('Removed from preference list');
  };

  const reorderPreferences = (newOrder: string[]) => {
    const reorderedPreferences = newOrder.map((displayId, index) => {
      // Convert display ID back to find the preference
      const parts = displayId.split('-');
      const collegeName = parts[0];
      const branch = parts[1];
      const category = parts[2];
      
      const item = preferences.find(pref => 
        pref.collegeName === collegeName && 
        pref.branch === branch && 
        pref.category === category
      );
      return item ? { ...item, priority: index + 1 } : null;
    }).filter(Boolean) as PreferenceItem[];

    setPreferences(reorderedPreferences);
    savePreferences(reorderedPreferences);
    toast.success('Preference order updated');
  };

  const exportPreferences = () => {
    if (preferences.length === 0) {
      toast.error('No preferences to export');
      return;
    }

    const csvContent = [
      ['Priority', 'College Name', 'Branch', 'Category', 'City', 'College Type', 'Eligible', 'Notes'],
      ...preferences.map(pref => [
        pref.priority.toString(),
        pref.collegeName,
        pref.branch,
        pref.category,
        pref.city,
        pref.collegeType,
        pref.eligible ? 'Yes' : 'No',
        pref.notes || ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${studentName}_college_preferences.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Preference list exported successfully');
  };

  const getPreferenceItems = () => {
    return preferences.map(pref => `${pref.collegeName}-${pref.branch}-${pref.category}-${pref.city}`);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              My College Preference List
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Add College
              </Button>
              
              <Button
                onClick={exportPreferences}
                className="flex items-center gap-2"
                variant="outline"
                disabled={preferences.length === 0}
              >
                <Download className="h-4 w-4" />
                Export List
              </Button>
              
              <Badge variant="secondary" className="ml-auto">
                {preferences.length} colleges in list
              </Badge>
            </div>

            {/* Add College Menu */}
            {showAddMenu && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Available Colleges</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {availableColleges.slice(0, 20).map((college, index) => (
                    <div
                      key={`${college.collegeName}-${college.branch}-${college.category}-${index}`}
                      className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{college.collegeName}</div>
                        <div className="text-sm text-gray-500">
                          {college.branch} • {college.city}
                          {college.eligible && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Eligible
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToPreferences(college)}
                        className="ml-2"
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
                {availableColleges.length > 20 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing first 20 results. Use filters in the main table to find specific colleges.
                  </p>
                )}
              </div>
            )}

            {/* Preference List */}
            <div>
              <h4 className="font-medium mb-3">Your Preferences (Drag to reorder)</h4>
              {preferences.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No colleges added to your preference list yet.</p>
                  <p className="text-sm">Click "Add College" to start building your list.</p>
                </div>
              ) : (
                <DragSortableList
                  items={getPreferenceItems()}
                  onReorder={reorderPreferences}
                  onRemove={removeFromPreferences}
                  placeholder="No preferences selected"
                />
              )}
            </div>

            {/* Instructions */}
            {preferences.length > 0 && (
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium mb-1">How to use your preference list:</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Drag and drop to reorder colleges by preference</li>
                  <li>Higher position = higher preference</li>
                  <li>Export your list to CSV for counseling sessions</li>
                  <li>Remove colleges by clicking the X button</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};