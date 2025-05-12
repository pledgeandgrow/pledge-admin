'use client';

import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  Eye,
  Save
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface GuidelineSection {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}

interface BrandGuidelinesProps {
  sections: GuidelineSection[];
}

export const BrandGuidelines: FC<BrandGuidelinesProps> = ({ sections: initialSections }) => {
  const [sections, setSections] = useState<GuidelineSection[]>(initialSections);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newSection, setNewSection] = useState<Partial<GuidelineSection>>({});

  const handleEdit = (id: string) => {
    setEditingSection(id);
  };

  const handleSave = (id: string) => {
    setEditingSection(null);
  };

  const handleDelete = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    setSections([
      ...sections,
      {
        id: newId,
        title: newSection.title || 'Nouvelle Section',
        content: newSection.content || '',
        lastUpdated: new Date().toLocaleDateString('fr-FR')
      }
    ]);
    setNewSection({});
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Guide de Marque
          </CardTitle>
          <CardDescription>
            Documentation complète de votre identité de marque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Sections</h3>
              <Button variant="outline" onClick={() => setNewSection({})}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une Section
              </Button>
            </div>

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {sections.map((section) => (
                  <Card key={section.id} className="relative group">
                    <CardHeader>
                      {editingSection === section.id ? (
                        <Input
                          value={section.title}
                          onChange={(e) =>
                            setSections(sections.map(s =>
                              s.id === section.id ? { ...s, title: e.target.value } : s
                            ))
                          }
                          className="font-semibold text-lg"
                        />
                      ) : (
                        <CardTitle>{section.title}</CardTitle>
                      )}
                      <CardDescription>
                        Dernière mise à jour: {section.lastUpdated}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {editingSection === section.id ? (
                        <Textarea
                          value={section.content}
                          onChange={(e) =>
                            setSections(sections.map(s =>
                              s.id === section.id ? { ...s, content: e.target.value } : s
                            ))
                          }
                          className="min-h-[200px]"
                        />
                      ) : (
                        <div className="prose dark:prose-invert max-w-none"
                             dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      )}
                      <div className="flex justify-end gap-2">
                        {editingSection === section.id ? (
                          <Button onClick={() => handleSave(section.id)}>
                            <Save className="h-4 w-4 mr-2" />
                            Enregistrer
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={() => handleEdit(section.id)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {Object.keys(newSection).length > 0 && (
              <Card className="border-2 border-dashed">
                <CardHeader>
                  <Input
                    placeholder="Titre de la section"
                    value={newSection.title || ''}
                    onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                    className="font-semibold text-lg"
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Contenu de la section..."
                    value={newSection.content || ''}
                    onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                    className="min-h-[200px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setNewSection({})}>
                      Annuler
                    </Button>
                    <Button onClick={handleAdd}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="font-medium">Actions</h3>
            <div className="flex gap-2">
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Aperçu PDF
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exporter PDF
              </Button>
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
