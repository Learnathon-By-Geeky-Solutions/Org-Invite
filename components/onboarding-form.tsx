'use client'

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { StepContent } from './onboarding/step-content';
import { Confetti } from './onboarding/confetti';

type Stack = {
  id: string;
  name: string;
  icon: string;
  discordUrl: string | null;
};

const steps = [
  {
    title: 'Select Tech Stack',
    description: 'Choose your preferred technology stack',
  },
  {
    title: 'Join Learnathon Github Organization',
    description: 'Connect with our GitHub organization',
  },
  {
    title: 'Team Access',
    description: 'Get access to the GitHub team',
  },
  {
    title: 'Discord Community',
    description: 'Join your tech stack\'s Discord server',
  },
  {
    title: 'JetBrains License',
    description: 'Get your JetBrains IDE license',
  },
  {
    title: 'Documentation',
    description: 'Read the important documentation',
  },
];

let intialLoading = true;

export default function OnboardingForm({ initialStacks }: { initialStacks: Stack[] }) {
  const [currentStep, setCurrentStep] = useState(1); 
  const [selectedStack, setSelectedStack] = useState<Stack | null>(null);
  const [githubUsername, setGithubUsername] = useState('');
  const [licenseKey, setLicenseKey] = useState('NO License Available');
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const handleStackSelect = (stack: Stack) => {
    setSelectedStack(stack);
  };

  useEffect(() => {
    if(intialLoading){
      intialLoading = false;
      return;
    }else{
      handleGetLicense();
    }
  },[githubUsername]);

  const checkGithubInvitationStatus = async () => {
    try {
      const res = await fetch('/api/onboarding/github-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUsername }),
      });

      if (!res.ok) throw new Error('Failed to check invitation status');

      const { status } = await res.json();

      return status === 'accepted';
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check GitHub invitation status',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleGithubSubmit = async (username: string) => {
    try {
      const res = await fetch('/api/onboarding/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubUsername: username,
          stackId: selectedStack?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send GitHub invitation');
      }

      setGithubUsername(username);
      toast({
        title: 'Invitation Sent',
        description: 'Please check your email for the GitHub organization invitation.',
      });
      setCurrentStep(3);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send GitHub invitation',
        variant: 'destructive',
      });
    }
  };

  const handleTeamAccess = async () => {
    const isAccepted = await checkGithubInvitationStatus();
    
    if (!isAccepted) {
      toast({
        title: 'Warning',
        description: 'Please accept the GitHub organization invitation before proceeding.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await fetch('/api/onboarding/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUsername }),
      });

      if (!res.ok) throw new Error('Failed to add to team');

      toast({
        title: 'Success',
        description: 'You have been added to the team.',
      });
      setCurrentStep(4);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add you to the team',
        variant: 'destructive',
      });
    }
  };

  const handleGetLicense = async () => {
    try {
      const res = await fetch('/api/onboarding/license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUsername }),
      });

      if (!res.ok) throw new Error('Failed to get license');

      const { licenseKey: key } = await res.json();
      setLicenseKey(key);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get JetBrains license',
        variant: 'destructive',
      });
    }
  };

  const handleComplete = () => {
    if (currentStep === steps.length) {
      setShowConfetti(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-8">
        <Image
          src="https://cdn.baseline.is/static/content/logos/CmpiZrcBVWQnEYx5qnwpwz-Learnathon_logo_Blue.png"
          alt="Learnathon Logo"
          width={200}
          height={60}
          priority
        />
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <Card key={index} className={`transition-all duration-200 ${
            currentStep === index + 1 ? 'ring-2 ring-primary' : ''
          }`}>
            <CardContent className="pt-6">
              <StepContent
                step={index + 1}
                title={step.title}
                description={step.description}
                isCompleted={currentStep > index + 1}
                isActive={currentStep === index + 1}
                onComplete={index + 1 === 3 ? handleTeamAccess : handleComplete}
                stacks={initialStacks}
                selectedStack={selectedStack}
                onStackSelect={handleStackSelect}
                githubUsername={githubUsername}
                onGithubSubmit={handleGithubSubmit}
                discordUrl={selectedStack?.discordUrl || ''}
                licenseKey={licenseKey}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {showConfetti && <Confetti />}
    </div>
  );
}