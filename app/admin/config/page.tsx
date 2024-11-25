'use client'

import { useEffect, useState } from 'react';
import ConfigForm from "./config-form";
import { getConfig } from './config-action';

export default function ConfigPage() {
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfig();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch config'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Error loading configuration: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
      <div className="max-w-2xl">
        {config && <ConfigForm initialConfig={config} />}
      </div>
    </div>
  );
}