'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types/commercial';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Mail, Phone, Globe, MapPin, Building2, User, FileText, Hash, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ClientModalProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export function ClientModal({ client, open, onOpenChange, onEdit, onDelete }: ClientModalProps) {
  if (!client) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Non spécifié';
    try {
      return format(new Date(dateString), 'PPpp', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  const copyToClipboard = (text: string | null | undefined, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copié',
      description: `${label} a été copié dans le presse-papier`,
    });
  };

  const InfoRow: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | null | undefined;
    isCopyable?: boolean;
  }> = ({ icon: Icon, label, value, isCopyable = false }) => {
    return (
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {value ? (
            <p 
              className={`mt-0.5 ${isCopyable ? 'cursor-pointer hover:underline' : ''}`}
              onClick={isCopyable ? () => copyToClipboard(value, label) : undefined}
            >
              {value}
            </p>
          ) : (
            <p className="text-muted-foreground/70 italic text-sm mt-0.5">Non spécifié</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                {client.is_company ? (
                  <Building2 className="h-6 w-6 text-primary" />
                ) : (
                  <User className="h-6 w-6 text-primary" />
                )}
                {client.is_company ? client.company_name : client.name}
              </DialogTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
                  {client.status || 'Actif'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {client.is_company ? 'Entreprise' : 'Particulier'}
                </span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                onOpenChange(false);
                onEdit();
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </div>
        </DialogHeader>

        <div className="grid gap-6 mt-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informations {client.is_company ? 'de l\'entreprise' : 'personnelles'}
              </h3>
              
              <div className="space-y-4">
                {client.is_company && (
                  <InfoRow icon={User} label="Contact" value={client.contact_person} />
                )}
                <InfoRow 
                  icon={Mail} 
                  label="Email" 
                  value={client.email} 
                  isCopyable={!!client.email}
                />
                <InfoRow 
                  icon={Phone} 
                  label="Téléphone" 
                  value={client.phone} 
                  isCopyable={!!client.phone}
                />
                {client.website && (
                  <InfoRow 
                    icon={Globe} 
                    label="Site web" 
                    value={client.website} 
                    isCopyable
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Adresse
              </h3>
              <div className="space-y-4">
                <InfoRow 
                  icon={MapPin} 
                  label="Adresse" 
                  value={client.address} 
                />
                <InfoRow 
                  icon={MapPin} 
                  label="Pays" 
                  value={client.country} 
                />
              </div>
            </CardContent>
          </Card>

          {client.is_company && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Informations légales
                </h3>
                <div className="space-y-4">
                  <InfoRow 
                    icon={Hash} 
                    label="Numéro de TVA" 
                    value={client.vat_number} 
                    isCopyable={!!client.vat_number}
                  />
                  <InfoRow 
                    icon={FileText} 
                    label="Numéro d'entreprise" 
                    value={client.registration_number} 
                    isCopyable={!!client.registration_number}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Autres informations
              </h3>
              <div className="space-y-4">
                <InfoRow 
                  icon={Calendar} 
                  label="Date de création" 
                  value={formatDate(client.created_at)} 
                />
                <InfoRow 
                  icon={Calendar} 
                  label="Dernière mise à jour" 
                  value={formatDate(client.updated_at)} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
          <Button 
            variant="destructive"
            onClick={() => {
              if (confirm('Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.')) {
                onDelete(client.id!);
                onOpenChange(false);
              }
            }}
          >
            Supprimer le client
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
