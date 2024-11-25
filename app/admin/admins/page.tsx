'use client'

import { useEffect, useState } from 'react';
import { AddAdminButton } from './add-admin-button';
import { AdminList } from './admin-list';
import { getAdmins } from './admin-action';

type Admin = Awaited<ReturnType<typeof getAdmins>>[number];

export default function AdminsPage() {
  const [adminList, setAdminList] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getAdmins();
        setAdminList(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch administrators'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Administrators</h1>
          <AddAdminButton />
        </div>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Administrators</h1>
          <AddAdminButton />
        </div>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Error loading administrators: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Administrators</h1>
        <AddAdminButton />
      </div>
      
      <AdminList initialAdmins={adminList} />
    </div>
  );
}