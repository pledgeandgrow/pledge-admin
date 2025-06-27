import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Database } from "@/types/database.types";

type ExpenseInsert = Database['public']['Tables']['depenses']['Insert'];
type ExpenseUpdate = Database['public']['Tables']['depenses']['Update'];

// This file contains API routes for managing expenses
// We're using @ts-nocheck because the Supabase query builder has complex typing issues
// that are difficult to resolve without compromising code readability

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  
  const id = searchParams.get("id");
  const projet_id = searchParams.get("projet_id");
  const mission_id = searchParams.get("mission_id");
  const statut = searchParams.get("statut");
  const categorie = searchParams.get("categorie");
  const from_date = searchParams.get("from_date");
  const to_date = searchParams.get("to_date");
  const montant_min = searchParams.get("montant_min");
  const montant_max = searchParams.get("montant_max");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  
  try {
    // Create a base query
    let query = supabase
      .from('depenses')
      .select('*');
    
    // Apply filters conditionally
    if (id) {
      query = query.eq('id', id);
    }
    
    if (projet_id) {
      query = query.eq("projet_id", projet_id);
    }
    
    if (mission_id) {
      query = query.eq("mission_id", mission_id);
    }
    
    if (statut) {
      query = query.eq("statut", statut);
    }
    
    if (categorie) {
      query = query.eq("categorie", categorie);
    }
    
    if (from_date) {
      query = query.gte("date", from_date);
    }
    
    if (to_date) {
      query = query.lte("date", to_date);
    }
    
    if (montant_min) {
      query = query.gte("montant", montant_min);
    }
    
    if (montant_max) {
      query = query.lte("montant", montant_max);
    }
    
    if (sort && order) {
      query = query.order(sort, { ascending: order === "asc" });
    } else {
      // Default sort by date descending
      query = query.order("date", { ascending: false });
    }
    
    // Execute the query with any type assertion to bypass TypeScript limitations
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching expenses:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();
  
  if (!body.date || !body.description || !body.montant || !body.categorie || !body.beneficiaire) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  
  try {
    const now = new Date().toISOString();
    const insertData: ExpenseInsert = {
      ...body,
      created_at: now,
      updated_at: now,
      statut: body.statut || "en_attente"
    };

    const { data, error } = await supabase
      .from('depenses')
      .insert(insertData)
      .select()
      .single();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();
  
  if (!body.id) {
    return NextResponse.json(
      { error: "ID is required for updating records" },
      { status: 400 }
    );
  }
  
  try {
    const updateData: ExpenseUpdate = {
      ...body,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('depenses')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return NextResponse.json(
      { error: "ID is required for deleting records" },
      { status: 400 }
    );
  }
  
  try {
    const { error } = await supabase
      .from('depenses')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
