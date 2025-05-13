// app/comptabilite/devis/page.tsx

"use client";

import { useState, useRef } from "react";
import { FileDown, Trash2, PlusIcon } from "lucide-react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DevisItem {
  description: string;
  quantite: number;
  prixUnitaire: number;
}

interface Devis {
  id: string;
  numero: string;
  client: string;
  date: string;
  items: DevisItem[];
  total: number;
}

export default function DevisPage() {
  const [devisList, setDevisList] = useState<Devis[]>([]);

  const [form, setForm] = useState<Omit<Devis, "id" | "total">>({
    numero: "",
    client: "",
    date: "",
    items: [{ description: "", quantite: 1, prixUnitaire: 0 }],
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { description: "", quantite: 1, prixUnitaire: 0 }],
    }));

  const updateItem = (
    idx: number,
    key: keyof DevisItem,
    value: string | number
  ) =>
    setForm((f) => {
      const items = f.items.map((it, i) =>
        i === idx ? { ...it, [key]: value } : it
      );
      return { ...f, items };
    });

  const total = form.items.reduce(
    (sum, it) => sum + it.quantite * it.prixUnitaire,
    0
  );

  const save = () => {
    if (!form.numero || !form.client || !form.date) return;
    const newDevis: Devis = { ...form, id: Date.now().toString(), total };
    setDevisList((l) => [newDevis, ...l]);
    setForm({
      numero: "",
      client: "",
      date: "",
      items: [{ description: "", quantite: 1, prixUnitaire: 0 }],
    });
  };

  const remove = (id: string) =>
    setDevisList((l) => l.filter((d) => d.id !== id));

  const exportPDF = async () => {
    const el = previewRef.current;
    if (!el) return;
    // Rendre visible
    el.style.visibility = "visible";
    el.style.position = "relative";

    await html2pdf()
      .from(el)
      .set({
        margin: 10,
        filename: `${form.numero || "devis"}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();

    // Re-cacher
    el.style.visibility = "hidden";
    el.style.position = "absolute";
  };

  const canSave = Boolean(form.numero && form.client && form.date);

  return (
    <div className="ml-64 p-8 bg-background min-h-screen space-y-12">
      {/* Formulaire inline */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-blue-800">Créer un devis</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Numéro *"
            value={form.numero}
            onChange={(e) =>
              setForm((f) => ({ ...f, numero: e.target.value }))
            }
          />
          <Input
            placeholder="Client *"
            value={form.client}
            onChange={(e) =>
              setForm((f) => ({ ...f, client: e.target.value }))
            }
          />
          <Input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm((f) => ({ ...f, date: e.target.value }))
            }
          />
        </div>

        <div className="space-y-4">
          <p className="font-medium text-blue-700">Lignes de devis</p>
          {form.items.map((it, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <Input
                placeholder="Description"
                value={it.description}
                onChange={(e) =>
                  updateItem(i, "description", e.target.value)
                }
                className="col-span-2"
              />
              <Input
                type="number"
                placeholder="Qté"
                value={it.quantite}
                onChange={(e) =>
                  updateItem(i, "quantite", parseInt(e.target.value) || 0)
                }
              />
              <Input
                type="number"
                placeholder="Prix Unitaire"
                value={it.prixUnitaire}
                onChange={(e) =>
                  updateItem(
                    i,
                    "prixUnitaire",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="text-blue-700 border-blue-300"
            onClick={addItem}
          >
            <PlusIcon className="mr-1 h-4 w-4" /> Ajouter une ligne
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-blue-800">
            Total : {total.toFixed(2)} €
          </p>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={exportPDF}
              disabled={!canSave}
            >
              <FileDown className="mr-2 h-4 w-4" /> Aperçu PDF
            </Button>
            <Button onClick={save} disabled={!canSave}>
              Enregistrer
            </Button>
          </div>
        </div>
      </div>

      {/* Aperçu stylé pour PDF (hors écran) */}
      <div
        ref={previewRef}
        className="absolute left-0 top-0 w-[800px] bg-white text-gray-900 p-8 rounded-lg shadow-lg space-y-6"
        style={{ visibility: "hidden", position: "absolute" }}
      >
        <header className="border-b-2 border-blue-600 pb-4">
          <h1 className="text-3xl font-bold text-blue-600">DEVIS</h1>
          <p className="mt-1 text-gray-900">N° {form.numero} — {form.date}</p>
          <p className="text-gray-900">Client : {form.client}</p>
        </header>

        <table className="w-full text-sm text-gray-900">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-2 py-1 text-left">Description</th>
              <th className="px-2 py-1 text-center">Qté</th>
              <th className="px-2 py-1 text-right">PU</th>
              <th className="px-2 py-1 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((it, i) => (
              <tr key={i} className={i % 2 ? "bg-blue-50" : ""}>
                <td className="px-2 py-1">{it.description}</td>
                <td className="px-2 py-1 text-center">{it.quantite}</td>
                <td className="px-2 py-1 text-right">{it.prixUnitaire.toFixed(2)} €</td>
                <td className="px-2 py-1 text-right">{(it.quantite * it.prixUnitaire).toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-blue-600">
              <td colSpan={3} className="px-2 py-1 font-bold text-right">Total TTC</td>
              <td className="px-2 py-1 font-bold text-right">{total.toFixed(2)} €</td>
            </tr>
          </tfoot>
        </table>

        <footer className="pt-4 border-t">
          <p className="text-xs text-gray-600">Merci pour votre confiance.</p>
        </footer>
      </div>

      {/* Liste des devis */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Devis enregistrés</h2>
        <ScrollArea className="h-64 border rounded bg-card p-4">
          {devisList.length === 0 ? (
            <p className="text-muted-foreground">Aucun devis.</p>
          ) : (
            <ul className="space-y-3">
              {devisList.map((d) => (
                <li
                  key={d.id}
                  className="flex justify-between items-center bg-white p-3 rounded shadow"
                >
                  <div>
                    <p className="font-medium text-gray-900">{d.numero} — {d.client}</p>
                    <p className="text-sm text-muted-foreground">{d.date}</p>
                  </div>
                  <button
                    onClick={() => remove(d.id)}
                    className="p-1 rounded hover:bg-red-100"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
