import { useState } from "react";
import { DomainName } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, MinusIcon } from "lucide-react";

interface DomainFormProps {
  onSubmit: (data: Partial<DomainName>) => void;
  onCancel: () => void;
  projects: { id: string; name: string }[];
  initialData?: DomainName;
}

export function DomainForm({
  onSubmit,
  onCancel,
  projects,
  initialData,
}: DomainFormProps) {
  const [formData, setFormData] = useState<Partial<DomainName>>(
    initialData || {
      name: "",
      registrar: "",
      status: "active",
      expiration_date: "",
      auto_renew: true,
      dns_provider: "",
      nameservers: ["", ""],
      notes: "",
      contacts: {
        technical: "",
        administrative: "",
        billing: "",
      },
      services: {
        email: false,
        web_hosting: false,
        ssl: false,
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addNameserver = () => {
    setFormData((prev) => ({
      ...prev,
      nameservers: [...(prev.nameservers || []), ""],
    }));
  };

  const removeNameserver = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      nameservers: prev.nameservers?.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de domaine</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registrar">Registrar</Label>
          <Input
            id="registrar"
            value={formData.registrar}
            onChange={(e) =>
              setFormData({ ...formData, registrar: e.target.value })
            }
            placeholder="OVH, Gandi, etc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value: any) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="expired">Expiré</SelectItem>
              <SelectItem value="expiring_soon">Expiration proche</SelectItem>
              <SelectItem value="transferred">Transféré</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiration_date">Date d'expiration</Label>
          <Input
            id="expiration_date"
            type="date"
            value={formData.expiration_date?.split("T")[0]}
            onChange={(e) =>
              setFormData({
                ...formData,
                expiration_date: new Date(e.target.value).toISOString(),
              })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dns_provider">Fournisseur DNS</Label>
          <Input
            id="dns_provider"
            value={formData.dns_provider}
            onChange={(e) =>
              setFormData({ ...formData, dns_provider: e.target.value })
            }
            placeholder="Cloudflare, OVH, etc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project">Projet associé</Label>
          <Select
            value={formData.project_id}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                project_id: value,
                project_name: projects.find((p) => p.id === value)?.name,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un projet" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Nameservers</Label>
        {formData.nameservers?.map((ns, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={ns}
              onChange={(e) => {
                const newNameservers = [...(formData.nameservers || [])];
                newNameservers[index] = e.target.value;
                setFormData({ ...formData, nameservers: newNameservers });
              }}
              placeholder={`ns${index + 1}.example.com`}
            />
            {index > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeNameserver(index)}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addNameserver}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter un nameserver
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Contacts</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="technical">Contact technique</Label>
            <Input
              id="technical"
              value={formData.contacts?.technical}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contacts: {
                    ...formData.contacts,
                    technical: e.target.value,
                  },
                })
              }
              placeholder="Email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="administrative">Contact administratif</Label>
            <Input
              id="administrative"
              value={formData.contacts?.administrative}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contacts: {
                    ...formData.contacts,
                    administrative: e.target.value,
                  },
                })
              }
              placeholder="Email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billing">Contact facturation</Label>
            <Input
              id="billing"
              value={formData.contacts?.billing}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contacts: {
                    ...formData.contacts,
                    billing: e.target.value,
                  },
                })
              }
              placeholder="Email"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Services</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email">Service Email</Label>
            <Switch
              id="email"
              checked={formData.services?.email}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  services: { ...formData.services, email: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="web_hosting">Hébergement Web</Label>
            <Switch
              id="web_hosting"
              checked={formData.services?.web_hosting}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  services: { ...formData.services, web_hosting: checked },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="ssl">SSL</Label>
            <Switch
              id="ssl"
              checked={formData.services?.ssl}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  services: { ...formData.services, ssl: checked },
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          placeholder="Notes additionnelles..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex items-center justify-between pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <div className="flex items-center gap-2">
          <Switch
            id="auto_renew"
            checked={formData.auto_renew}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, auto_renew: checked })
            }
          />
          <Label htmlFor="auto_renew">Renouvellement automatique</Label>
        </div>
        <Button type="submit">
          {initialData ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
