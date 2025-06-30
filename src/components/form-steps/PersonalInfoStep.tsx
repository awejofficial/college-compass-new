
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PersonalInfoStepProps {
  fullName: string;
  onFullNameChange: (value: string) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  fullName,
  onFullNameChange
}) => {
  return (
    <Card className="bg-card border-premium-secondary/30 text-card-foreground hover-lift">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-premium-deep">Personal Information</CardTitle>
        <CardDescription className="text-premium-deep/70">
          Tell us about yourself for personalized college recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-premium-deep">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              className="bg-input border-premium-secondary/30 text-premium-deep focus:border-premium-primary focus:ring-premium-primary/30"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
