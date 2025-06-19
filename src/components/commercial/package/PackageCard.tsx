'use client';

import { Package } from '@/types/commercial';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Eye and Pencil imports removed as they're unused
// Tooltip imports removed as they're unused
// Separator import removed as it's unused

interface PackageCardProps {
  package: Package;
  onEdit: () => void;
  onView: () => void;
  getStatusColor: (status: Package['status']) => string;
  getCategoryColor: (category: string) => string;
}

export function PackageCard({ 
  package: pkg, 
  onView, 
  onEdit,
  getStatusColor,
  getCategoryColor
}: PackageCardProps) {
  return (
    <Card className="bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl border-2 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {pkg.name}
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              {pkg.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className={getStatusColor(pkg.status)}>
            {pkg.status === 'Available' ? 'Disponible' : 'Indisponible'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Prix</p>
            <p className="text-lg font-bold">{pkg.price.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm text-muted-foreground">Durée</p>
            <p className="text-lg font-bold">{pkg.duration}</p>
          </div>
        </div>

        <Badge variant="outline" className={getCategoryColor(pkg.category)}>
          {pkg.category}
        </Badge>

        <div className="space-y-2">
          <p className="text-sm font-medium">Services inclus</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {pkg.services.slice(0, 3).map((service, index) => (
              <li key={index}>{service}</li>
            ))}
            {pkg.services.length > 3 && (
              <li className="list-none text-sm text-muted-foreground">
                +{pkg.services.length - 3} autres services...
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => onView(pkg)}
          className="hover:bg-white/20 dark:hover:bg-gray-800/50"
        >
          Voir détails
        </Button>
        <Button
          onClick={() => onEdit(pkg)}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
        >
          Modifier
        </Button>
      </CardFooter>
    </Card>
  );
}
