export interface Depense {
  id?: string;
  date: string;
  description: string;
  montant: number;
  categorie: string;
  mode_paiement: string;
  beneficiaire: string;
  projet_id?: string;
  projet_nom?: string;
  mission_id?: string;
  mission_nom?: string;
  justificatif_url?: string;
  notes?: string;
  statut: "en_attente" | "approuve" | "refuse" | "rembourse";
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface DepenseStats {
  total_count: number;
  pending_count: number;
  approved_count: number;
  refused_count: number;
  reimbursed_count: number;
  total_amount: number;
  pending_amount: number;
  approved_amount: number;
  reimbursed_amount: number;
}
