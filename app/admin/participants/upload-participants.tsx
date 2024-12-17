'use client'

import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function UploadParticipants() {
  return (
    <Button 
      variant="default" 
      className="bg-blue-500 hover:bg-blue-600 text-white"
      onClick={() => alert('Upload participants')}
    >
      <Upload className="w-4 h-4 mr-2" />
      Bulk Upload
    </Button>
  );
}