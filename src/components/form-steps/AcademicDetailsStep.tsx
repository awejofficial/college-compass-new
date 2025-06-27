
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AcademicDetailsStepProps {
  aggregate: string;
  category: string;
  availableCategories: string[];
  onAggregateChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export const AcademicDetailsStep: React.FC<AcademicDetailsStepProps> = ({
  aggregate,
  category,
  availableCategories,
  onAggregateChange,
  onCategoryChange
}) => {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-slate-900">Academic Details</CardTitle>
        <CardDescription className="text-slate-600">
          Enter your percentage and category.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="grid gap-2">
            <Label htmlFor="aggregate" className="text-slate-900">Aggregate Percentage</Label>
            <Input
              id="aggregate"
              type="number"
              step="0.01"
              placeholder="Enter your percentage (e.g., 82.02)"
              value={aggregate}
              onChange={(e) => onAggregateChange(e.target.value)}
              className="bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category" className="text-slate-900">Category</Label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="" disabled>Select your category</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {availableCategories.length === 0 && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                No categories available. Please contact admin to upload cutoff data.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
