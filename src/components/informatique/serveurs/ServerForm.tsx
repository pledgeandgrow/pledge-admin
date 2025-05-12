import { Server } from "./types";
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
import { useState } from "react";

interface ServerFormProps {
  onSubmit: (server: Partial<Server>) => void;
  onCancel: () => void;
}

export function ServerForm({ onSubmit, onCancel }: ServerFormProps) {
  const [formData, setFormData] = useState<Partial<Server>>({
    name: "",
    description: "",
    ip_address: "",
    type: "production",
    os: "",
    status: "offline",
    services: [],
    location: "",
    last_maintenance: new Date().toISOString(),
    next_maintenance: new Date().toISOString(),
    metrics: {
      cpu_usage: 0,
      memory_usage: 0,
      disk_usage: 0,
      uptime: 0
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du serveur*</Label>
          <Input
            id="name"
            required
            placeholder="ex: SRV-PROD-01"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ip">Adresse IP*</Label>
          <Input
            id="ip"
            required
            placeholder="ex: 192.168.1.100"
            value={formData.ip_address}
            onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type de serveur*</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="development">Développement</SelectItem>
              <SelectItem value="backup">Backup</SelectItem>
              <SelectItem value="database">Base de données</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="os">Système d'exploitation*</Label>
          <Select
            value={formData.os}
            onValueChange={(value) => setFormData({ ...formData, os: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un OS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Windows Server 2022">Windows Server 2022</SelectItem>
              <SelectItem value="Windows Server 2019">Windows Server 2019</SelectItem>
              <SelectItem value="Ubuntu 22.04 LTS">Ubuntu 22.04 LTS</SelectItem>
              <SelectItem value="Ubuntu 20.04 LTS">Ubuntu 20.04 LTS</SelectItem>
              <SelectItem value="CentOS 9">CentOS 9</SelectItem>
              <SelectItem value="CentOS 8">CentOS 8</SelectItem>
              <SelectItem value="Debian 11">Debian 11</SelectItem>
              <SelectItem value="Debian 10">Debian 10</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du serveur..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Localisation*</Label>
          <Select
            value={formData.location}
            onValueChange={(value) => setFormData({ ...formData, location: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une localisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Datacenter Principal">Datacenter Principal</SelectItem>
              <SelectItem value="Datacenter Secondaire">Datacenter Secondaire</SelectItem>
              <SelectItem value="Bureau Principal">Bureau Principal</SelectItem>
              <SelectItem value="Site Distant">Site Distant</SelectItem>
              <SelectItem value="Cloud">Cloud</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Statut initial*</Label>
          <Select
            value={formData.status}
            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="offline">Hors ligne</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="online">En ligne</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="last_maintenance">Dernière maintenance</Label>
          <Input
            type="date"
            id="last_maintenance"
            value={formData.last_maintenance?.split('T')[0]}
            onChange={(e) => setFormData({ ...formData, last_maintenance: new Date(e.target.value).toISOString() })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="next_maintenance">Prochaine maintenance</Label>
          <Input
            type="date"
            id="next_maintenance"
            value={formData.next_maintenance?.split('T')[0]}
            onChange={(e) => setFormData({ ...formData, next_maintenance: new Date(e.target.value).toISOString() })}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">Ajouter</Button>
      </div>
    </form>
  );
}
