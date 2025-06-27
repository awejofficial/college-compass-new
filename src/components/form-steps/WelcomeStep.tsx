
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Save, SkipForward } from "lucide-react";

interface WelcomeStepProps {
  onGuestAccess: () => void;
  onEmailLogin: () => void;
  showAlert: boolean;
  onAlertClose: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onGuestAccess,
  onEmailLogin,
  showAlert,
  onAlertClose
}) => {
  return (
    <AlertDialog open={showAlert} onOpenChange={onAlertClose}>
      <AlertDialogContent className="bg-card border-border text-card-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-card-foreground">Save Your Data?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Do you want to save your search results and preferences? 
            You can login to save your data or continue as a guest without saving.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onGuestAccess}
            className="flex items-center gap-2"
          >
            <SkipForward className="h-4 w-4" />
            Skip - Continue as Guest
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onEmailLogin}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Login to Save Data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
