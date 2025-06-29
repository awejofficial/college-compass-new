
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, AlertCircle, CheckCircle, BookOpen, Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const RulesInfoSection: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-12 space-y-6">
      {/* How to Use Section */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            How to Use the College Finder
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Follow these simple steps to find your perfect engineering college
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                <span className="text-primary font-semibold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Enter Details</h4>
                <p className="text-sm text-muted-foreground">Fill in your aggregate marks and select your category</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                <span className="text-primary font-semibold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Choose Preferences</h4>
                <p className="text-sm text-muted-foreground">Select your preferred branches, cities, and college types</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                <span className="text-primary font-semibold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Get Results</h4>
                <p className="text-sm text-muted-foreground">View eligible colleges with cutoff analysis and export results</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules and Guidelines */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Important Rules & Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Eligibility Criteria
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Your aggregate marks must meet the college's cutoff requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Category selection affects cutoff calculations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Results are based on previous year's cutoff data</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Selection Tips
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Select multiple branches to increase your options</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Leave cities unselected to include all locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Use "All Colleges" option for comprehensive results</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Important Note</h4>
                <p className="text-sm text-yellow-700">
                  The cutoff data is based on previous years and may vary. Always verify with official college websites for the most current information.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About the Platform */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            About DSE College Finder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            DSE College Finder is a comprehensive platform designed to help engineering aspirants in Maharashtra 
            find suitable colleges based on their academic performance and preferences.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Colleges Listed</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">50+</div>
              <div className="text-sm text-muted-foreground">Engineering Branches</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">Real-time</div>
              <div className="text-sm text-muted-foreground">Cutoff Data</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="text-xs">Maharashtra Engineering</Badge>
            <Badge variant="secondary" className="text-xs">Cutoff Analysis</Badge>
            <Badge variant="secondary" className="text-xs">College Recommendations</Badge>
            <Badge variant="secondary" className="text-xs">Free Platform</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
        <CardContent className="p-6 text-center">
          <h4 className="font-medium text-foreground mb-2">Need Help?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            If you have questions about using the platform or need assistance with college selection, 
            feel free to reach out to our support team.
          </p>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Developed by:</span> Awej Engineering Guidance
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
