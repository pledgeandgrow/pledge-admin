'use client';

import { FC, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Label removed - unused import
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
  const [sections, setSections] = useState<GuidelineSection[]>(initialSections || []);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newSection, setNewSection] = useState<Partial<GuidelineSection>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const supabase = createClient();
  
  useEffect(() => {
    // Only fetch from Supabase if no initial sections were provided
    if (initialSections?.length === 0 || initialSections === undefined) {
      fetchBrandGuidelines();
    }
  }, []);

  const fetchBrandGuidelines = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('brand_guidelines')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        // Transform Supabase data to match GuidelineSection type
        const formattedSections: GuidelineSection[] = data.map(section => ({
          id: section.id,
          title: section.title,
          content: section.content,
          lastUpdated: formatDate(section.updated_at)
        }));
        
        setSections(formattedSections);
      }
    } catch (err) {
      console.error('Error fetching brand guidelines:', err);
      toast({
        title: 'Error',
        description: 'Failed to load brand guidelines. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = (id: string) => {
    setEditingSection(id);
  };

  const handleSave = async (section: GuidelineSection) => {
    try {
      setIsSaving(true);
      
      // Check if this is an existing section in the database
      const isExistingSection = !section.id.includes('temp-');
      
      if (isExistingSection) {
        // Update existing section
        const { error } = await supabase
          .from('brand_guidelines')
          .update({
            title: section.title,
            content: section.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', section.id);
          
        if (error) throw new Error(error.message);
      } else {
        // Create new section (if it was a temporary one being edited)
        const { data, error } = await supabase
          .from('brand_guidelines')
          .insert([
            {
              title: section.title,
              content: section.content
            }
          ])
          .select();
          
        if (error) throw new Error(error.message);
        
        // Update the section ID with the database ID
        if (data && data[0]) {
          setSections(prevSections => 
            prevSections.map(s => 
              s.id === section.id ? { ...s, id: data[0].id } : s
            )
          );
        }
      }
      
      toast({
        title: 'Succès',
        description: 'Section sauvegardée avec succès',
      });
      
      setEditingSection(null);
    } catch (err) {
      console.error('Error saving section:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la section',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Check if this is a temporary section (not yet in database)
      const isTemporarySection = id.includes('temp-');
      
      if (!isTemporarySection) {
        // Delete from database if it's a real section
        const { error } = await supabase
          .from('brand_guidelines')
          .delete()
          .eq('id', id);
          
        if (error) throw new Error(error.message);
      }
      
      // Remove from UI state
      setSections(sections.filter(section => section.id !== id));
      
      toast({
        title: 'Succès',
        description: 'Section supprimée avec succès',
      });
    } catch (err) {
      console.error('Error deleting section:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la section',
        variant: 'destructive'
      });
    }
  };

  const handleAdd = async () => {
    try {
      const tempId = `temp-${Date.now()}`;
      const newSectionData = {
        id: tempId,
        title: newSection.title || 'Nouvelle Section',
        content: newSection.content || '',
        lastUpdated: new Date().toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      // Add to UI immediately with temporary ID
      setSections([...sections, newSectionData]);
      setNewSection({});
      
      // Set to editing mode for the new section
      setEditingSection(tempId);
      
    } catch (err) {
      console.error('Error adding section:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la section',
        variant: 'destructive'
      });
    }
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
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin mr-2">⏳</div>
                  <span>Chargement des sections...</span>
                </div>
              ) : sections.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">Aucune section trouvée</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Commencez par ajouter une section à votre guide de marque
                  </p>
                </div>
              ) : (
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
                          <Button onClick={() => handleSave(section)}>
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
                      {editingSection === section.id && (
                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSection(null)}
                            disabled={isSaving}
                          >
                            Annuler
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              )}
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
