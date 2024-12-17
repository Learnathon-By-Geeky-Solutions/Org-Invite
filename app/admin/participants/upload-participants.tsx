"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { bulkAddParticipants } from "./actions/participant-actions";

export function UploadParticipants() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError("");

    try {
      // Read the file
      const text = await file.text();
      // Split by newlines and filter out empty lines
      const emails = text
        .split("\n")
        .map((email) => email.trim())
        .filter((email) => email !== "");

      // Validate emails
      const invalidEmails = emails.filter((email) => !email.includes("@"));
      if (invalidEmails.length > 0) {
        setError(`Invalid email format found: ${invalidEmails.join(", ")}`);
        return;
      }

      const result = await bulkAddParticipants(emails);
      if (result.success) {
        setIsOpen(false);
        // Optional: Add success notification
        // Optional: Trigger refresh of participant list
      } else {
        setError(result.error || "Failed to add participants");
      }
    } catch (error) {
      setError("Failed to process file");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Participant Emails</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Upload a text file with one email per line.
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
            </div>
          )}
          <p className="text-xs text-gray-500">
            Supported format: .txt file with one email per line
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
