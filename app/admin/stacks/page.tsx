'use client'

import { useEffect, useState } from "react";
import { getStacks } from "./stacks-action";
import { AddStackButton } from "./add-stack-button";
import { StackList } from "./stack-list";

export default function StacksPage() {
  const [stacks, setStacks] = useState<{
    icon: string;
    id: string;
    name: string;
    createdAt: Date | null;
    discordUrl: string | null;
}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStacks = async () => {
      try {
        const data = await getStacks();
        setStacks(data);
      } catch (error) {
        console.error('Failed to fetch stacks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStacks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tech Stacks</h1>
        <AddStackButton />
      </div>

      <StackList initialStacks={stacks} />
    </div>
  );
}