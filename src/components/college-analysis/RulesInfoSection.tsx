
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
            How to Use FindMyClg for DSE Admissions
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Simple steps to find your perfect DSE engineering college in Maharashtra
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                <span className="text-primary font-semibold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Enter Your Details</h4>
                <p className="text-sm text-muted-foreground">Fill in your diploma aggregate marks and select your category (GOPEN, EWS, OBC, SC, ST)</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                <span className="text-primary font-semibold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Set Preferences</h4>
                <p className="text-sm text-muted-foreground">Choose preferred branches, cities (Pune, Mumbai, Nagpur, etc.), and college types</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                <span className="text-primary font-semibold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Get Matched</h4>
                <p className="text-sm text-muted-foreground">Get instant results with colleges where you have the best admission chances</p>
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
            DSE Admission Guidelines & Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                DSE Eligibility Requirements
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Must have completed diploma in engineering from Maharashtra</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Aggregate marks determine CAP cutoff eligibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Category certificates must be valid for reserved seats</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Smart Selection Strategy
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Apply for multiple branches to increase chances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Consider both government and private colleges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Don't limit by city — explore all Maharashtra options</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Important for DSE Students</h4>
                <p className="text-sm text-yellow-700">
                  Our cutoff data is based on previous CAP rounds. Actual cutoffs may vary each year based on seat availability and competition. Always verify with official CAP website for final admissions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About FindMyClg */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            About FindMyClg
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            FindMyClg is a student-first platform built especially for Diploma students aiming for Direct Second Year (DSE) B.Tech Engineering admissions in Maharashtra. Our mission is simple: to help you discover the best colleges you can get into — based on your actual diploma aggregate marks — using real, previous-year CAP cutoff data.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Engineering Colleges</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">50+</div>
              <div className="text-sm text-muted-foreground">DSE Branches</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">Real-time</div>
              <div className="text-sm text-muted-foreground">CAP Cutoff Data</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="text-xs">DSE Admissions</Badge>
            <Badge variant="secondary" className="text-xs">Maharashtra Engineering</Badge>
            <Badge variant="secondary" className="text-xs">CAP Cutoff Analysis</Badge>
            <Badge variant="secondary" className="text-xs">Diploma Students</Badge>
            <Badge variant="secondary" className="text-xs">Free Platform</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
        <CardContent className="p-6 text-center">
          <h4 className="font-medium text-foreground mb-2">Need Help with DSE Admissions?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            If you have questions about using FindMyClg or need assistance with DSE college selection, 
            feel free to reach out to our support team.
          </p>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Built by Students, for Students</span> — FindMyClg Team
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
