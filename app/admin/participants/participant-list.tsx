"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ParticipantLogin } from "./page";

interface ParticipantListProps {
  initialParticipants: ParticipantLogin[];
}

export function ParticipantList({ initialParticipants }: ParticipantListProps) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left py-3 px-4">Email</th>
            <th className="text-left py-3 px-4">Login Count</th>
            <th className="text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {initialParticipants.map((participant) => (
            <tr key={participant.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{participant.email}</td>
              <td className="py-3 px-4">{participant.loginCount}</td>
              <td className="py-3 px-4 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => alert(`Delete ${participant.email}`)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
