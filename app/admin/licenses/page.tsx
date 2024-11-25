'use client'

import { useEffect, useState } from 'react';
import { AddLicenseButton } from "./add-license-button";
import { LicenseList } from "./license-list";
import { UploadLicenses } from "./upload-licenses";
import type { License } from "./license-list";
import { getLicenses } from './licenses-action';

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const data = await getLicenses();
		//@ts-ignore
        setLicenses(data);
      } catch (error) {
        console.error('Failed to fetch licenses:', error);
        // You might want to add error state handling here
      } finally {
        setIsLoading(false);
      }
    };

    fetchLicenses();
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
        <h1 className="text-2xl font-bold text-gray-900">JetBrains Licenses</h1>
        <div className="flex gap-2">
          <UploadLicenses />
          <AddLicenseButton />
        </div>
      </div>

      <LicenseList initialLicenses={licenses} />
    </div>
  );
}