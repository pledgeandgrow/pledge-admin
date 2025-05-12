import { createSupabaseServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  
  const from_date = searchParams.get("from_date");
  const to_date = searchParams.get("to_date");
  
  try {
    // Base query to filter by date range if provided
    let queryCondition = '';
    const queryParams: any[] = [];
    
    if (from_date && to_date) {
      queryCondition = 'WHERE date >= $1 AND date <= $2';
      queryParams.push(from_date, to_date);
    } else if (from_date) {
      queryCondition = 'WHERE date >= $1';
      queryParams.push(from_date);
    } else if (to_date) {
      queryCondition = 'WHERE date <= $1';
      queryParams.push(to_date);
    }
    
    // Get total counts and amounts
    const { data: statsData, error: statsError } = await supabase.rpc(
      'get_depense_stats',
      from_date && to_date 
        ? { from_date, to_date } 
        : from_date 
        ? { from_date, to_date: new Date().toISOString() } 
        : to_date 
        ? { from_date: '1900-01-01', to_date } 
        : { from_date: '1900-01-01', to_date: new Date().toISOString() }
    );
    
    if (statsError) {
      // If the stored procedure doesn't exist, fall back to SQL queries
      const { data, error } = await supabase.from('depenses')
        .select('statut, montant');
        
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      // Manually calculate stats
      const stats = {
        total_count: data.length,
        pending_count: data.filter(d => d.statut === 'en_attente').length,
        approved_count: data.filter(d => d.statut === 'approuve').length,
        refused_count: data.filter(d => d.statut === 'refuse').length,
        reimbursed_count: data.filter(d => d.statut === 'rembourse').length,
        total_amount: data.reduce((sum, item) => sum + (item.montant || 0), 0),
        pending_amount: data.filter(d => d.statut === 'en_attente')
          .reduce((sum, item) => sum + (item.montant || 0), 0),
        approved_amount: data.filter(d => d.statut === 'approuve')
          .reduce((sum, item) => sum + (item.montant || 0), 0),
        reimbursed_amount: data.filter(d => d.statut === 'rembourse')
          .reduce((sum, item) => sum + (item.montant || 0), 0)
      };
      
      return NextResponse.json(stats);
    }
    
    return NextResponse.json(statsData);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
