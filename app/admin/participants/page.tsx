// app/participants/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AddParticipantButton } from "./add-participant-button";
import { ParticipantList } from "./participant-list";
import { UploadParticipants } from "./upload-participants";
import { getParticipantLogins } from "./actions/participant-actions";

export interface ParticipantLogin {
  id: string;
  email: string;
  loginCount: number;
}

export default function ParticipantLoginsPage() {
  const [participants, setParticipants] = useState<ParticipantLogin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const data = await getParticipantLogins();
        setParticipants(data);
      } catch (error) {
        console.error("Failed to fetch participant logins:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Participant Logins</h1>
        <div className="flex gap-2">
          <UploadParticipants />
          <AddParticipantButton />
        </div>
      </div>

      <ParticipantList initialParticipants={participants} />
    </div>
  );
}
