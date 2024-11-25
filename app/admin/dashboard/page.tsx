'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Layers, Key, LucideIcon } from 'lucide-react';
import { getParticipantsForAdmin } from './participant-action';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState<{ 
    name: string; 
    value: number; 
    icon: LucideIcon; 
    color: string; 
  }[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          participantsCount,
          stacksCount,
          licensesCount
        ] = await getParticipantsForAdmin();

        const newStats = [
          {
            name: 'Total Participants',
            value: participantsCount.length,
            icon: Users,
            color: 'text-blue-600',
          },
          {
            name: 'Tech Stacks',
            value: stacksCount.length,
            icon: Layers,
            color: 'text-green-600',
          },
          {
            name: 'Available Licenses',
            //@ts-ignore
            value: licensesCount.filter(l => !l.usedBy).length,
            icon: Key,
            color: 'text-purple-600',
          },
        ];
        
        setStats(newStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error loading dashboard: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}