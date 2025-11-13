'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Laptop, Smartphone, Printer, HardDrive, Plus } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  type: 'computer' | 'laptop' | 'mobile' | 'printer' | 'storage' | 'other';
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  assignedTo?: string;
  serialNumber?: string;
  purchaseDate?: string;
}

const equipmentIcons = {
  computer: Monitor,
  laptop: Laptop,
  mobile: Smartphone,
  printer: Printer,
  storage: HardDrive,
  other: HardDrive,
};

export default function EquipementPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Mock data - replace with actual API call
    const mockEquipment: Equipment[] = [
      {
        id: '1',
        name: 'MacBook Pro 16"',
        type: 'laptop',
        status: 'in-use',
        assignedTo: 'John Doe',
        serialNumber: 'MBP-2024-001',
        purchaseDate: '2024-01-15',
      },
      {
        id: '2',
        name: 'Dell Monitor 27"',
        type: 'computer',
        status: 'available',
        serialNumber: 'MON-2024-002',
        purchaseDate: '2024-02-20',
      },
      {
        id: '3',
        name: 'iPhone 15 Pro',
        type: 'mobile',
        status: 'in-use',
        assignedTo: 'Jane Smith',
        serialNumber: 'IPH-2024-003',
        purchaseDate: '2024-03-10',
      },
    ];

    setEquipment(mockEquipment);
    setIsLoading(false);
  }, [session, router]);

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'in-use':
        return 'bg-blue-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'retired':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Equipment['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'in-use':
        return 'In Use';
      case 'maintenance':
        return 'Maintenance';
      case 'retired':
        return 'Retired';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Equipment Management</h1>
          <p className="text-muted-foreground">
            Manage your organization&apos;s equipment and assets
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => {
          const Icon = equipmentIcons[item.type];
          return (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {item.serialNumber}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="secondary" className="gap-2">
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(item.status)}`} />
                      {getStatusLabel(item.status)}
                    </Badge>
                  </div>
                  {item.assignedTo && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Assigned to</span>
                      <span className="text-sm font-medium">{item.assignedTo}</span>
                    </div>
                  )}
                  {item.purchaseDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Purchase Date</span>
                      <span className="text-sm">
                        {new Date(item.purchaseDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {equipment.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HardDrive className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No equipment found</p>
            <Button className="mt-4" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Equipment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
