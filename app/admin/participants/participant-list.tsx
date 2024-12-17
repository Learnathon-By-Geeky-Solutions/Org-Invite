"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ParticipantLogin } from "./page";
import { deleteParticipant } from "./actions/participant-actions";

interface ParticipantListProps {
  initialParticipants: ParticipantLogin[];
}

export function ParticipantList({ initialParticipants }: ParticipantListProps) {
  const [participants, setParticipants] = useState(initialParticipants);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    participant?: ParticipantLogin;
  }>({
    open: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (participant: ParticipantLogin) => {
    setIsDeleting(true);
    try {
      const result = await deleteParticipant(participant.id);
      if (result.success) {
        setParticipants((prev) => prev.filter((p) => p.id !== participant.id));
        setDeleteDialog({ open: false });
      } else {
        // Optionally handle error (could add a toast notification here)
        console.error("Failed to delete participant");
      }
    } catch (error) {
      console.error("Error deleting participant:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
            {participants.map((participant) => (
              <tr key={participant.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{participant.email}</td>
                <td className="py-3 px-4">{participant.loginCount}</td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => setDeleteDialog({ open: true, participant })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the participant login record for{" "}
              <span className="font-medium">
                {deleteDialog.participant?.email}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
              onClick={() =>
                deleteDialog.participant &&
                handleDelete(deleteDialog.participant)
              }
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
