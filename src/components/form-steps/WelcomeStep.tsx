
import React from 'react';

interface WelcomeStepProps {
  onGuestAccess: () => void;
  onEmailLogin: () => void;
  showAlert: boolean;
  onAlertClose: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onGuestAccess
}) => {
  // Auto-trigger guest access without showing any alert
  React.useEffect(() => {
    onGuestAccess();
  }, [onGuestAccess]);

  return null; // Component no longer renders anything
};
