import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClientProjectType } from "./types";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ClientProjectFormProps {
  project?: ClientProjectType;
  onSubmit: (project: Omit<ClientProjectType, 'id'> | ClientProjectType) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ClientProjectForm({ project, onSubmit, onCancel, onDelete }: ClientProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    client: project?.client || '',
    equipe: project?.equipe.join(', ') || '',
    technologies: project?.technologies.join(', ') || '',
    dateDebut: project?.dateDebut || '',
    dateFin: project?.dateFin || '',
    statut: project?.statut || 'En cours'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      ...(project && { id: project.id }),
      title: formData.title,
      description: formData.description,
      client: formData.client,
      equipe: formData.equipe.split(',').map(item => item.trim()),
      technologies: formData.technologies.split(',').map(item => item.trim()),
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin,
      statut: formData.statut
    };
    onSubmit(projectData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>{project ? 'Modifier le projet' : 'Nouveau projet'}</DialogTitle>
        <DialogDescription>
          {project ? 'Modifiez les détails du projet' : 'Créez un nouveau projet client'}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="equipe">Équipe (séparée par des virgules)</Label>
          <Input
            id="equipe"
            value={formData.equipe}
            onChange={(e) => setFormData({ ...formData, equipe: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="technologies">Technologies (séparées par des virgules)</Label>
          <Input
            id="technologies"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateDebut">Date de début</Label>
            <Input
              id="dateDebut"
              value={formData.dateDebut}
              onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="dateFin">Date de fin</Label>
            <Input
              id="dateFin"
              value={formData.dateFin}
              onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select
            value={formData.statut}
            onValueChange={(value) => setFormData({ ...formData, statut: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Terminé">Terminé</SelectItem>
              <SelectItem value="En retard">En retard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {project && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">Supprimer</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Le projet sera définitivement supprimé.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {project ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
