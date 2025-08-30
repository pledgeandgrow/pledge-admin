import React from "react";
import { Metadata } from "next";
import { ProjectList } from "@/components/informatique/projets/ProjectList";
import { PageHeader } from "../../../components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Projets | Pledge&Grow Admin",
  description: "Gestion des projets",
};

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        heading="Gestion des projets"
        description="Gérez tous les projets de l'entreprise"
      />

      <Tabs defaultValue="client" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="client">Clients</TabsTrigger>
          <TabsTrigger value="internal">Internes</TabsTrigger>
          <TabsTrigger value="external">Externes</TabsTrigger>
          <TabsTrigger value="partner">Partenaires</TabsTrigger>
        </TabsList>
        
        <TabsContent value="client" className="space-y-4">
          <ProjectList projectType="Client" />
        </TabsContent>
        
        <TabsContent value="internal" className="space-y-4">
          <ProjectList projectType="Internal" />
        </TabsContent>
        
        <TabsContent value="external" className="space-y-4">
          <ProjectList projectType="External" />
        </TabsContent>
        
        <TabsContent value="partner" className="space-y-4">
          <ProjectList projectType="Partner" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
