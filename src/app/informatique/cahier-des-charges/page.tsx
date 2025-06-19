// app/informatique/cahier-des-charges/page.tsx

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { PlusCircle, Search, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import {
  SpecificationType,
  SpecificationStatisticsType,
} from "@/components/informatique/cahier-des-charges/types";
import { SpecificationForm } from "@/components/informatique/cahier-des-charges/SpecificationForm";
import { SpecificationDocument } from "@/components/informatique/cahier-des-charges/SpecificationDocument";
import { SpecificationCard } from "@/components/informatique/cahier-des-charges/SpecificationCard";
import { SpecificationStatistics } from "@/components/informatique/cahier-des-charges/SpecificationStatistics";

import { supabase } from "@/lib/supabaseClient";

// Type pour les fichiers stockés
interface StoredFile {
  name: string;
  updated_at: string;
  url: string;
}

// Formatage de date
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function CahierDesChargesPage() {
  const [specs, setSpecs] = useState<SpecificationType[]>([]);
  const [filteredSpecs, setFilteredSpecs] = useState<SpecificationType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState<SpecificationStatisticsType>({ total: 0, draft: 0, review: 0, approved: 0, archived: 0 });
  const [selectedSpec, setSelectedSpec] = useState<SpecificationType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<StoredFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  useEffect(() => { fetchSpecs(); fetchStats(); loadFiles(); }, [fetchSpecs, fetchStats, loadFiles]);
  useEffect(() => { filterSpecs(); }, [searchQuery, statusFilter, specs, filterSpecs]);

  const fetchSpecs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cahier-des-charges"); if (!res.ok) throw new Error();
      setSpecs(await res.json());
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les cahiers", variant: "destructive" });
    } finally { setIsLoading(false); }
  }, [toast, setIsLoading, setSpecs]);
  const fetchStats = useCallback(async () => {
    try { const res = await fetch("/api/cahier-des-charges/statistics"); if (res.ok) setStats(await res.json()); } catch {}
  }, [setStats]);
  const filterSpecs = useCallback(() => {
    let out = specs;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      out = out.filter(s => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") out = out.filter(s => s.status === statusFilter);
    setFilteredSpecs(out);
  }, [specs, searchQuery, statusFilter, setFilteredSpecs]);
  const handleCreate = useCallback(async (spec: Partial<SpecificationType>) => {
    try { const res = await fetch("/api/cahier-des-charges", {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(spec)}); if (!res.ok) throw new Error();
      toast({ title: "Succès", description: "Cahier créé" }); setIsCreating(false); fetchSpecs(); fetchStats();
    } catch {
      toast({ title: "Erreur", description: "Création impossible", variant: "destructive" });
    }
  }, [toast, setIsCreating, fetchSpecs, fetchStats]);
  const handleUpdate = useCallback(async (id: string, spec: Partial<SpecificationType>) => {
    try { const res = await fetch(`/api/cahier-des-charges/${id}`, {method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(spec)}); if (!res.ok) throw new Error();
      toast({ title: "Succès", description: "Cahier mis à jour" }); setIsEditing(false); setSelectedSpec(null); fetchSpecs(); fetchStats();
    } catch {
      toast({ title: "Erreur", description: "Mise à jour impossible", variant: "destructive" });
    }
  }, [toast, setIsEditing, setSelectedSpec, fetchSpecs, fetchStats]);
  const handleDeleteSpec = useCallback(async (id: string) => {
    if (!confirm("Supprimer ce cahier ?")) return;
    try { const res = await fetch(`/api/cahier-des-charges/${id}`, {method: "DELETE"}); if (!res.ok) throw new Error();
      toast({ title: "Succès", description: "Cahier supprimé" }); setSelectedSpec(null); fetchSpecs(); fetchStats();
    } catch {
      toast({ title: "Erreur", description: "Suppression impossible", variant: "destructive" });
    }
  }, [toast, setSelectedSpec, fetchSpecs, fetchStats]);
  const loadFiles = useCallback(async () => {
    const { data, error } = await supabase.storage.from("cahiers").list("", {limit:1000, sortBy:{column:"updated_at",order:"desc"}});
    if (error) return toast({ title: "Erreur", description: error.message, variant: "destructive" });
    setFiles(data.filter(o => !o.name.endsWith("/")).map(o => {
      const { data:{publicUrl} } = supabase.storage.from("cahiers").getPublicUrl(o.name);
      return { name:o.name, updated_at:o.updated_at, url:publicUrl };
    }));
  }, [toast, setFiles]);
  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const filename = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("cahiers").upload(filename, file, {contentType:file.type});
    if (error) return toast({ title: "Erreur", description: error.message, variant: "destructive" });
    const { data:{publicUrl}} = supabase.storage.from("cahiers").getPublicUrl(filename);
    setFiles(prev => [{ name:filename, updated_at:new Date().toISOString(), url:publicUrl }, ...prev]);
    toast({ title: "Téléversé", description: "Fichier ajouté" }); e.target.value = "";
  }, [toast, setFiles]);
  const handleDeleteFile = useCallback(async (file: StoredFile) => {
    if (!confirm(`Supprimer « ${file.name} » ?`)) return;
    const { error } = await supabase.storage.from("cahiers").remove([file.name]);
    if (error) return toast({ title: "Erreur", description: error.message, variant: "destructive" });
    setFiles(prev => prev.filter(f => f.name !== file.name));
    toast({ title: "Supprimé", description: "Fichier supprimé" });
  }, [toast, setFiles]);

  return (
    <div className="ml-64 p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <main className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">Cahiers des Charges</h1>
            <p className="text-muted-foreground">Gérez vos spécifications projets</p>
          </div>
          <div className="flex gap-2">
            <input ref={fileInputRef} type="file" hidden onChange={handleUpload} />
            <Button variant="secondary" onClick={()=>fileInputRef.current?.click()}><PlusCircle className="mr-2 h-4 w-4"/>Téléverser</Button>
            <Button onClick={()=>setIsCreating(true)}><PlusCircle className="mr-2 h-4 w-4"/>Nouveau Cahier</Button>
          </div>
        </div>

        <SpecificationStatistics statistics={stats} />

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
            <Input placeholder="Rechercher..." className="pl-8" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tous statuts"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="review">En revue</SelectItem>
              <SelectItem value="approved">Approuvé</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">Chargement...</div>
        ) : filteredSpecs.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpecs.map(spec=>(<SpecificationCard key={spec.id} specification={spec} onClick={()=>setSelectedSpec(spec)}/>))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 text-muted-foreground"/>
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Aucun cahier trouvé</h3>
            <p className="text-gray-600 dark:text-gray-300">{searchQuery||statusFilter!=='all'?'Pas de résultat':'Téléversez ou créez un cahier'}</p>
          </div>
        )}

        <div className="space-y-2 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Fichiers Cahiers</h2>
          {files.length ? (
            <ScrollArea className="h-72 rounded-lg border overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-800 text-white text-xs uppercase">
                  <tr><th className="px-4 py-3">Nom</th><th className="px-4 py-3">Ajouté le</th><th className="w-12"></th></tr>
                </thead><tbody>
                  {files.map((f,i)=>(<tr key={f.name} className={`${i%2?'bg-gray-700':'bg-gray-800'} hover:bg-gray-600 text-white`}><td className="px-4 py-2 flex items-center gap-2 truncate"><FileText className="h-4 w-4"/><a href={f.url} target="_blank" className="truncate underline-offset-2 hover:underline">{f.name}</a></td><td className="px-4 py-2 whitespace-nowrap">{fmtDate(f.updated_at)}</td><td className="px-4 py-2 text-right"><button onClick={()=>handleDeleteFile(f)} className="p-1 rounded hover:bg-red-600 hover:text-white" title="Supprimer"><Trash2 className="h-4 w-4"/></button></td></tr>))}
                </tbody>
              </table>
            </ScrollArea>
          ) : (<p className="text-gray-700 dark:text-gray-300">Aucun fichier téléversé.</p>)}
        </div>

        {/* Dialog Create */}
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white text-black dark:bg-gray-800 dark:text-white">
            <SpecificationForm onSubmit={handleCreate} onCancel={()=>setIsCreating(false)}/>
          </DialogContent>
        </Dialog>

        {/* Dialog View/Edit */}
        <Dialog open={!!selectedSpec} onOpenChange={open=>{if(!open){setSelectedSpec(null);setIsEditing(false);}}}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white text-black dark:bg-gray-800 dark:text-white">
            {selectedSpec&&(isEditing?
              <SpecificationForm specification={selectedSpec} onSubmit={data=>handleUpdate(selectedSpec.id,data)} onCancel={()=>setIsEditing(false)}/>
            :
              <SpecificationDocument specification={selectedSpec} onEdit={()=>setIsEditing(true)} onBack={()=>setSelectedSpec(null)} onDelete={()=>handleDeleteSpec(selectedSpec.id)} onStatusChange={status=>handleUpdate(selectedSpec.id,{status})}/>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
