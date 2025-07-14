import { Data } from "@/types/data";

// Define a specific type for expense metadata
export interface ExpenseMetadata {
  description?: string;
  montant?: number | string;
  date?: string;
  categorie?: string;
  statut?: string;
  fournisseur?: string;
  beneficiaire?: string;
  methode_paiement?: string;
  projet_nom?: string;
  mission_nom?: string;
  notes?: string;
  justificatif_url?: string;
}
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BanknoteIcon,
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
// import { PdfViewer } from "@/components/shared/PdfViewer";

interface DepenseDetailsProps {
  depense: Data & { metadata?: ExpenseMetadata };
  onEdit?: () => void;
  onDelete?: () => void;
}

// We'll use direct string interpolation with nullish coalescing instead of a helper function

export function DepenseDetails({ depense, onEdit, onDelete }: DepenseDetailsProps): React.ReactElement {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "approuve":
        return {
          label: "Approuvé",
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-500/5",
          borderColor: "border-green-500/20",
        };
      case "refuse":
        return {
          label: "Refusé",
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/5",
          borderColor: "border-red-500/20",
        };
      case "en_attente":
        return {
          label: "En attente",
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/5",
          borderColor: "border-yellow-500/20",
        };
      case "rembourse":
        return {
          label: "Remboursé",
          icon: BanknoteIcon,
          color: "text-blue-500",
          bgColor: "bg-blue-500/5",
          borderColor: "border-blue-500/20",
        };
      default:
        return {
          label: status || "En attente",
          icon: Clock,
          color: "text-gray-500",
          bgColor: "bg-gray-500/5",
          borderColor: "border-gray-500/20",
        };
    }
  };

  const statusDetails = getStatusDetails(depense.metadata?.statut || "en_attente");
  const StatusIcon = statusDetails.icon;
  const justificatifUrl = depense.metadata?.justificatif_url || '';

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non spécifié";
    return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
  };

  return (
    <div className="space-y-6">
      <Card className={`${statusDetails.bgColor} ${statusDetails.borderColor}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {depense.metadata?.description || depense.title || ''}
              </CardTitle>
              <CardDescription>
                Dépense créée le{" "}
                {formatDate(depense.created_at)}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`flex items-center gap-1 font-medium px-3 py-1 ${statusDetails.color} ${statusDetails.borderColor}`}
            >
              <StatusIcon className="h-4 w-4" />
              {statusDetails.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Montant
                </h3>
                <p className="text-2xl font-bold">
                  {formatCurrency(typeof depense.metadata?.montant === 'number' ? depense.metadata.montant : typeof depense.metadata?.montant === 'string' ? parseFloat(depense.metadata.montant) : 0)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Date de la dépense
                </h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatDate(depense.metadata?.date)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Fournisseur
                </h3>
                <p className="mt-1">{depense.metadata?.fournisseur || "Non spécifié"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Méthode de paiement
                </h3>
                <p className="mt-1">{depense.metadata?.methode_paiement || "Non spécifiée"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Catégorie
                </h3>
                <p className="mt-1">{depense.metadata?.categorie || "Non spécifiée"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Montant
                </h3>
                <div className="flex items-center gap-2">
                  <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {typeof depense.metadata?.montant === 'number' 
                      ? `${depense.metadata.montant} €` 
                      : `${depense.metadata?.montant || '0'} €`}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Bénéficiaire
                </h3>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {depense.metadata?.beneficiaire || 'Non spécifié'}
                  </span>
                </div>
              </div>

              {depense.metadata?.projet_nom && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Projet associé
                  </h3>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {depense.metadata?.projet_nom || 'Non spécifié'}
                    </span>
                  </div>
                </div>
              )}

              {depense.metadata?.mission_nom && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Mission associée
                  </h3>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {depense.metadata?.mission_nom || 'Non spécifiée'}
                    </span>
                  </div>
                </div>
              )}

              {depense.metadata?.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </h3>
                  <p className="mt-1">{depense.metadata?.description || "Aucune description"}</p>
                </div>
              )}
            </div>
          </div>

          {justificatifUrl && (
            <>
              <Separator />
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Justificatif</h3>
                <iframe 
                  src={justificatifUrl} 
                  className="w-full h-[400px] border-0" 
                  title="Justificatif PDF"
                />
              </div>
              <div className="mt-2 flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <a href={justificatifUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Télécharger le justificatif
                  </a>
                </Button>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cette dépense sera
                  définitivement supprimée de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
