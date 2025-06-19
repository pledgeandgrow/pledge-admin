"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileDown, Pencil } from "lucide-react";
import { SpecificationType } from "./types";


interface SpecificationDocumentProps {
  specification: SpecificationType;
  onEdit?: () => void;
  readOnly?: boolean;
}

export function SpecificationDocument({ specification, onEdit }: SpecificationDocumentProps) {
  const handleExportPDF = async () => {
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const pdfContent = document.createElement("div");
      pdfContent.className = "pdf-content";

      pdfContent.innerHTML = `
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 2rem; color: #1a56db; margin-bottom: 1rem;">${specification.title}</h1>
          <div style="color: #666; margin-bottom: 1rem;">
            <p><strong>Dernière mise à jour:</strong> ${new Date(specification.updatedAt).toLocaleDateString()}</p>
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
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().from(pdfContent).set(options).save();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{specification.title}</h1>
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
          {onEdit && (
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
