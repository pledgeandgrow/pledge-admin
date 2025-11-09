'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Share2, AlertTriangle } from 'lucide-react';
import { Document } from '@/types/documents';

interface DocumentActionsProps {
  isShareDialogOpen: boolean;
  onShareDialogClose: () => void;
  isDeleteDialogOpen: boolean;
  onDeleteDialogClose: () => void;
  selectedDocument: Document | null;
  onShare: (documentId: string, shareData: ShareFormData) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
}

export interface ShareFormData {
  email: string;
  permission: string;
}

export function DocumentActions({
  isShareDialogOpen,
  onShareDialogClose,
  isDeleteDialogOpen,
  onDeleteDialogClose,
  selectedDocument,
  onShare,
  onDelete,
}: DocumentActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [shareFormData, setShareFormData] = useState<ShareFormData>({
    email: '',
    permission: 'view',
  });

  const handleShareInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShareFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShareSelectChange = (name: string, value: string) => {
    setShareFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetShareForm = () => {
    setShareFormData({
      email: '',
      permission: 'view',
    });
  };

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDocument) {
      return;
    }
    
    try {
      setIsProcessing(true);
      await onShare(selectedDocument.id, shareFormData);
      onShareDialogClose();
      resetShareForm();
    } catch (error) {
      console.error('Error sharing document:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedDocument) {
      return;
    }
    
    try {
      setIsProcessing(true);
      await onDelete(selectedDocument.id);
      onDeleteDialogClose();
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Share Document Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={(open) => {
        if (!open) {
          onShareDialogClose();
          resetShareForm();
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Partager le document</DialogTitle>
            <DialogDescription>
              {selectedDocument && `Partagez "${selectedDocument.title}" avec d'autres utilisateurs.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleShareSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={shareFormData.email}
                  onChange={handleShareInputChange}
                  className="col-span-3"
                  placeholder="utilisateur@example.com"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="permission" className="text-right">
                  Permission
                </Label>
                <Select 
                  value={shareFormData.permission} 
                  onValueChange={(value) => handleShareSelectChange('permission', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une permission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">Lecture seule</SelectItem>
                    <SelectItem value="edit">Modification</SelectItem>
                    <SelectItem value="admin">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                onShareDialogClose();
                resetShareForm();
              }}>
                Annuler
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full" />
                    Partage en cours...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        if (!open) {
          onDeleteDialogClose();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedDocument && (
              <p className="font-medium">
                "{selectedDocument.title}"
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onDeleteDialogClose}>
              Annuler
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DocumentActions;
