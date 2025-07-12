'use client';

import { FC, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  // SelectGroup removed - unused import
  SelectItem,
  // SelectLabel removed - unused import
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Palette,
  Type,
  Image as ImageIcon,
  Upload,
  Download,
  FileText,
  Eye
} from 'lucide-react';

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface Typography {
  headingFont: string;
  bodyFont: string;
  scale: string;
}

interface Logo {
  main: string;
  alternative: string;
  favicon: string;
}

interface BrandIdentityProps {
  colorScheme: ColorScheme;
  typography: Typography;
  logo: Logo;
}

export const BrandIdentity: FC<BrandIdentityProps> = ({
  colorScheme: initialColorScheme,
  typography: initialTypography,
  logo: initialLogo
}) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(initialColorScheme);
  const [typography, setTypography] = useState<Typography>(initialTypography);
  const [logo, setLogo] = useState<Logo>(initialLogo);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [brandSettingsId, setBrandSettingsId] = useState<string | null>(null);
  const supabase = createClient();
  
  useEffect(() => {
    // Fetch brand settings from Supabase
    fetchBrandSettings();
  }, []);
  
  const fetchBrandSettings = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.length > 0) {
        const settings = data[0];
        setBrandSettingsId(settings.id);
        
        // Only update state if we have values from the database
        if (settings.color_scheme) {
          setColorScheme(settings.color_scheme);
        }
        
        if (settings.typography) {
          setTypography(settings.typography);
        }
        
        if (settings.logo) {
          setLogo(settings.logo);
        }
      }
    } catch (err) {
      console.error('Error fetching brand settings:', err);
      // Don't show error toast here as we'll fallback to the default values
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    setColorScheme(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTypographyChange = (key: keyof Typography, value: string) => {
    setTypography(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLogoChange = (key: keyof Logo, value: string) => {
    setLogo(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const saveBrandSettings = async () => {
    try {
      setIsSaving(true);
      
      const brandData = {
        color_scheme: colorScheme,
        typography: typography,
        logo: logo,
        updated_at: new Date().toISOString()
      };
      
      let result;
      
      if (brandSettingsId) {
        // Update existing settings
        result = await supabase
          .from('brand_settings')
          .update(brandData)
          .eq('id', brandSettingsId);
      } else {
        // Create new settings
        result = await supabase
          .from('brand_settings')
          .insert([brandData])
          .select();
          
        // Store the new ID
        if (result.data && result.data[0]) {
          setBrandSettingsId(result.data[0].id);
        }
      }
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      toast({
        title: 'Succès',
        description: 'Paramètres de marque sauvegardés avec succès',
      });
    } catch (err) {
      console.error('Error saving brand settings:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres de marque',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Identité de Marque
          </h2>
          <p className="text-muted-foreground">
            Gérez votre identité visuelle et vos éléments de marque
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          onClick={saveBrandSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Sauvegarde...
            </>
          ) : (
            'Sauvegarder les modifications'
          )}
        </Button>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="typography">Typographie</TabsTrigger>
          <TabsTrigger value="logos">Logos</TabsTrigger>
          <TabsTrigger value="print">Imprimés</TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-pink-500" />
                Palette de Couleurs
              </CardTitle>
              <CardDescription>
                Définissez votre palette de couleurs principale et secondaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Couleurs Principales</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(colorScheme).slice(0, 3).map(([key, color]) => (
                      <div key={key} className="space-y-3">
                        <Label className="capitalize">{key}</Label>
                        <div className="flex gap-4 items-start">
                          <div 
                            className="w-32 h-32 rounded-lg shadow-lg transition-transform hover:scale-105 cursor-pointer"
                            style={{ backgroundColor: color }}
                          />
                          <div className="space-y-2 flex-1">
                            <Input
                              type="color"
                              value={colorScheme[key as keyof ColorScheme]}
                              className="h-10 w-full"
                              onChange={(e) =>
                                handleColorChange(key as keyof ColorScheme, e.target.value)
                              }
                            />
                            <Input
                              type="text"
                              value={colorScheme[key as keyof ColorScheme]}
                              className="font-mono"
                              onChange={(e) =>
                                handleColorChange(key as keyof ColorScheme, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Couleurs Secondaires</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(colorScheme).slice(3).map(([key, color]) => (
                      <div key={key} className="space-y-3">
                        <Label className="capitalize">{key}</Label>
                        <div className="flex gap-4 items-start">
                          <div 
                            className="w-32 h-32 rounded-lg shadow-lg transition-transform hover:scale-105 cursor-pointer"
                            style={{ backgroundColor: color }}
                          />
                          <div className="space-y-2 flex-1">
                            <Input
                              type="color"
                              value={colorScheme[key as keyof ColorScheme]}
                              className="h-10 w-full"
                              onChange={(e) =>
                                handleColorChange(key as keyof ColorScheme, e.target.value)
                              }
                            />
                            <Input
                              type="text"
                              value={colorScheme[key as keyof ColorScheme]}
                              className="font-mono"
                              onChange={(e) =>
                                handleColorChange(key as keyof ColorScheme, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Aperçu</h3>
                  <div className="grid gap-4 p-6 rounded-lg border bg-background">
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg" style={{ backgroundColor: colorScheme.primary }}>
                        <div className="h-full flex items-center justify-center text-white font-medium">
                          Couleur Principale
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-16 rounded-lg" style={{ backgroundColor: colorScheme.secondary }}>
                          <div className="h-full flex items-center justify-center text-white font-medium">
                            Secondaire
                          </div>
                        </div>
                        <div className="h-16 rounded-lg" style={{ backgroundColor: colorScheme.accent }}>
                          <div className="h-full flex items-center justify-center text-white font-medium">
                            Accent
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5 text-purple-500" />
                Typographie
              </CardTitle>
              <CardDescription>
                Configurez vos polices et leur hiérarchie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Police des Titres</Label>
                    <Select 
                      value={typography.headingFont}
                      onValueChange={(value) => handleTypographyChange('headingFont', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une police" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Police du Corps</Label>
                    <Select
                      value={typography.bodyFont}
                      onValueChange={(value) => handleTypographyChange('bodyFont', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une police" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Échelle Typographique</Label>
                    <Select
                      value={typography.scale}
                      onValueChange={(value) => handleTypographyChange('scale', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une échelle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.200">Minor Third (1.200)</SelectItem>
                        <SelectItem value="1.250">Major Third (1.250)</SelectItem>
                        <SelectItem value="1.333">Perfect Fourth (1.333)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Aperçu</Label>
                    <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-4xl font-bold">Titre Principal</p>
                      <p className="text-2xl">Sous-titre</p>
                      <p className="text-base">Texte normal du corps</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-500" />
                Logos
              </CardTitle>
              <CardDescription>
                Gérez vos différentes versions de logo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <Label>Logo Principal</Label>
                  <div className="aspect-video rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden">
                    {logo.main ? (
                      <Image
                        src={logo.main}
                        alt="Logo Principal"
                        className="object-contain"
                        width={300}
                        height={150}
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Glisser-déposer ou cliquer pour télécharger
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            handleLogoChange('main', reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Logo Alternatif</Label>
                  <div className="aspect-video rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden">
                    {logo.alternative ? (
                      <Image
                        src={logo.alternative}
                        alt="Logo Alternatif"
                        className="object-contain"
                        width={300}
                        height={150}
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Glisser-déposer ou cliquer pour télécharger
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            handleLogoChange('alternative', reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Favicon</Label>
                <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden">
                  {logo.favicon ? (
                    <Image
                      src={logo.favicon}
                      alt="Favicon"
                      className="object-contain"
                      width={64}
                      height={64}
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="h-4 w-4 mx-auto text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleLogoChange('favicon', reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="print">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                Supports Imprimés
              </CardTitle>
              <CardDescription>
                Gérez vos cartes de visite, flyers et plaquettes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cartes de Visite</CardTitle>
                    <CardDescription>Format standard 85x55mm</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-[1.618/1] rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950"></div>
                      <div className="relative p-4 text-center space-y-2">
                        <h3 className="font-semibold">Recto</h3>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-[1.618/1] rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900"></div>
                      <div className="relative p-4 text-center space-y-2">
                        <h3 className="font-semibold">Verso</h3>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Aperçu
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Flyers</CardTitle>
                    <CardDescription>Format A5/A4</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-[0.707/1] rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950"></div>
                      <div className="relative p-4 text-center space-y-2">
                        <h3 className="font-semibold">Recto</h3>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-[0.707/1] rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900"></div>
                      <div className="relative p-4 text-center space-y-2">
                        <h3 className="font-semibold">Verso</h3>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Aperçu
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Plaquette</CardTitle>
                    <CardDescription>Format A4 - 4 pages</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-[0.707/1] rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"></div>
                      <div className="relative p-4 text-center space-y-2">
                        <h3 className="font-semibold">Couverture</h3>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-[0.707/1] rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900"></div>
                      <div className="relative p-4 text-center space-y-2">
                        <h3 className="font-semibold">Pages Intérieures</h3>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Aperçu
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Options d&apos;Impression</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Type de Papier</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard 300g</SelectItem>
                            <SelectItem value="recycled">Recyclé 300g</SelectItem>
                            <SelectItem value="premium">Premium 350g</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Finition</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mat">Mat</SelectItem>
                            <SelectItem value="brillant">Brillant</SelectItem>
                            <SelectItem value="soft-touch">Soft Touch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Options</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucune</SelectItem>
                            <SelectItem value="spot-uv">Vernis Sélectif</SelectItem>
                            <SelectItem value="foil">Dorure à Chaud</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandIdentity;
