"use client";

import { useState, useEffect } from "react";
import { Depense } from "@/types/depense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";
import PdfUploader from "@/components/functions/PdfUploader";

interface DepenseFormProps {
  onSubmit: (data: Depense) => Promise<void>;
  onCancel: () => void;
  initialData?: Depense;
  projets?: { id: string; nom: string }[];
  missions?: { id: string; nom: string }[];
}

const CATEGORIES = [
  "Transport",
  "Hébergement",
  "Repas",
  "Fournitures",
  "Équipements",
  "Logiciels",
  "Services",
  "Formation",
  "Marketing",
  "Frais bancaires",
  "Taxes",
  "Autre",
];

const MODES_PAIEMENT = [
  "Carte bancaire entreprise",
  "Carte bancaire personnelle",
  "Virement bancaire",
  "Espèces",
  "Chèque",
  "PayPal",
  "Autre",
];

const defaultDepense: Depense = {
  date: new Date().toISOString(),
  description: "",
  montant: 0,
  categorie: "",
  mode_paiement: "",
  beneficiaire: "",
  statut: "en_attente",
  notes: "",
};

export function DepenseForm({
  onSubmit,
  onCancel,
  initialData,
  projets = [],
  missions = [],
}: DepenseFormProps) {
  const [formData, setFormData] = useState<Depense>(initialData || defaultDepense);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : new Date()
  );

  // Update form data when date changes
  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate.toISOString() }));
    }
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une description",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.montant <= 0) {
      toast({
        title: "Erreur",
        description: "Le montant doit être supérieur à 0",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.categorie) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.mode_paiement) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un mode de paiement",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.beneficiaire) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un bénéficiaire",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      await onSubmit(formData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting expense:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la dépense",
        variant: "destructive",
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleProjetChange = (projetId: string) => {
    if (projetId === "none") {
      setFormData((prev) => ({
        ...prev,
        projet_id: undefined,
        projet_nom: undefined,
      }));
      return;
    }
    
    const selectedProjet = projets.find((p) => p.id === projetId);
    if (selectedProjet) {
      setFormData((prev) => ({
        ...prev,
        projet_id: selectedProjet.id,
        projet_nom: selectedProjet.nom,
      }));
    }
  };

  const handleMissionChange = (missionId: string) => {
    if (missionId === "none") {
      setFormData((prev) => ({
        ...prev,
        mission_id: undefined,
        mission_nom: undefined,
      }));
      return;
    }
    
    const selectedMission = missions.find((m) => m.id === missionId);
    if (selectedMission) {
      setFormData((prev) => ({
        ...prev,
        mission_id: selectedMission.id,
        mission_nom: selectedMission.nom,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: fr })
                ) : (
                  <span>Sélectionnez une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Description de la dépense"
            required
          />
        </div>

        <div>
          <Label htmlFor="montant">Montant</Label>
          <Input
            id="montant"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.montant || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, montant: parseFloat(e.target.value) || 0 }))
            }
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <Label htmlFor="categorie">Catégorie</Label>
          <Select
            value={formData.categorie}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, categorie: value }))
            }
          >
            <SelectTrigger id="categorie">
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mode_paiement">Mode de paiement</Label>
          <Select
            value={formData.mode_paiement}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, mode_paiement: value }))
            }
          >
            <SelectTrigger id="mode_paiement">
              <SelectValue placeholder="Sélectionnez un mode de paiement" />
            </SelectTrigger>
            <SelectContent>
              {MODES_PAIEMENT.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="beneficiaire">Bénéficiaire</Label>
          <Input
            id="beneficiaire"
            value={formData.beneficiaire}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, beneficiaire: e.target.value }))
            }
            placeholder="Nom du bénéficiaire"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="projet">Projet associé</Label>
            <Select
              value={formData.projet_id || "none"}
              onValueChange={handleProjetChange}
            >
              <SelectTrigger id="projet">
                <SelectValue placeholder="Sélectionnez un projet (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun projet</SelectItem>
                {projets.map((projet) => (
                  <SelectItem key={projet.id} value={projet.id}>
                    {projet.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mission">Mission associée</Label>
            <Select
              value={formData.mission_id || "none"}
              onValueChange={handleMissionChange}
            >
              <SelectTrigger id="mission">
                <SelectValue placeholder="Sélectionnez une mission (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune mission</SelectItem>
                {missions.map((mission) => (
                  <SelectItem key={mission.id} value={mission.id}>
                    {mission.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {initialData && (
          <div>
            <Label htmlFor="statut">Statut</Label>
            <Select
              value={formData.statut}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  statut: value as Depense["statut"],
                }))
              }
            >
              <SelectTrigger id="statut">
                <SelectValue placeholder="Statut de la dépense" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="approuve">Approuvé</SelectItem>
                <SelectItem value="refuse">Refusé</SelectItem>
                <SelectItem value="rembourse">Remboursé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label>Justificatif</Label>
          {initialData?.id ? (
            <PdfUploader
              documentId={initialData.id}
              documentType="expense"
              label="Justificatif de dépense"
              existingPdfUrl={formData.justificatif_url || undefined}
              existingPdfName={formData.justificatif_url ? 'Justificatif' : undefined}
              onUploadSuccess={(url) => {
                setFormData((prev) => ({ ...prev, justificatif_url: url }))
              }}
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              Vous pourrez ajouter un justificatif PDF après avoir créé la dépense
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Notes supplémentaires (optionnel)"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : initialData ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}
