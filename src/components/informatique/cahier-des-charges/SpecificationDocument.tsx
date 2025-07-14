"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileDown, Pencil, Calendar, User, Briefcase } from "lucide-react";
import { Document } from "@/types/documents";
import { SpecificationType, documentToSpecification, SpecificationMetadata } from "./types";

interface SpecificationDocumentProps {
  // Accept either a Document or legacy SpecificationType
  document?: Document;
  specification?: SpecificationType;
  onEdit?: () => void;
  readOnly?: boolean;
}

export function SpecificationDocument({ document, specification: legacySpec, onEdit, readOnly = false }: SpecificationDocumentProps) {
  // Convert Document to SpecificationType if needed for backward compatibility
  const specification = document ? documentToSpecification(document) : legacySpec;
  
  if (!specification) {
    return <div>No specification data available</div>;
  }
  
  // Access metadata for additional fields if available
  const metadata = document?.metadata as unknown as SpecificationMetadata | undefined;
  
  const handleExportPDF = async () => {
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      // Use window.document instead of document to avoid TypeScript error
      const pdfContent = window.document.createElement("div");
      pdfContent.className = "pdf-content";

      // Add project and client info if available
      const projectInfo = metadata?.project_name ? 
        `<p><strong>Projet:</strong> ${metadata.project_name}</p>` : '';
      const clientInfo = metadata?.client_name ? 
        `<p><strong>Client:</strong> ${metadata.client_name}</p>` : '';
      
      pdfContent.innerHTML = `
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 2rem; color: #1a56db; margin-bottom: 1rem;">${specification.title}</h1>
          <div style="color: #666; margin-bottom: 1rem;">
            <p><strong>Dernière mise à jour:</strong> ${new Date(specification.updatedAt).toLocaleDateString()}</p>
            <p><strong>Statut:</strong> ${specification.status.toUpperCase()}</p>
            ${projectInfo}
            ${clientInfo}
          </div>
        </div>

        <div style="margin-bottom: 2rem;">
          ${specification.content || ''}
        </div>
      `;

      const options = {
        margin: 10,
        filename: `${specification.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' | 'landscape' }
      };

      await html2pdf().from(pdfContent).set(options).save();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  // Determine badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return 'secondary' as const;
      case 'review': return 'default' as const; // Changed from 'warning' to 'default' to match Badge variants
      case 'approved': return 'default' as const; // Changed from 'success' to 'default'
      case 'archived': return 'outline' as const;
      default: return 'secondary' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{specification.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={getBadgeVariant(specification.status)}>
              {specification.status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Mis à jour le {new Date(specification.updatedAt).toLocaleDateString()}
            </span>
          </div>
          
          {/* Display additional metadata if available */}
          {metadata && (
            <div className="flex flex-wrap gap-4 mt-3">
              {metadata.project_name && (
                <div className="flex items-center gap-1 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{metadata.project_name}</span>
                </div>
              )}
              {metadata.client_name && (
                <div className="flex items-center gap-1 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{metadata.client_name}</span>
                </div>
              )}
              {metadata.target_completion_date && (
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Échéance: {new Date(metadata.target_completion_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
          {onEdit && !readOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: specification.content || '' }} />
      </Card>
    </div>
  );
}
