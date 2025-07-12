'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Calendar } from 'lucide-react';
import { WaitlistContact } from '@/types/contact';

interface ViewWaitlistDialogProps {
  entry: WaitlistContact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export function ViewWaitlistDialog({
  entry,
  open,
  onOpenChange,
  getStatusColor,
  getStatusText,
}: ViewWaitlistDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/10 dark:bg-gray-950/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {`${entry.first_name} ${entry.last_name}`}
            </span>
            <Badge variant="outline" className={getStatusColor(entry.status)}>
              {getStatusText(entry.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Informations de contact</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{entry.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{entry.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Service demandé</h3>
            <p className="text-sm">{entry.service}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Date souhaitée</h3>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{entry.joined_at ? new Date(entry.joined_at).toLocaleDateString('fr-FR') : 'Non spécifiée'}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Notes</h3>
            <p className="text-sm whitespace-pre-wrap">{entry.notes}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
