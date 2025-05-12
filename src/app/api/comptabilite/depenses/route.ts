import { createSupabaseServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  
  const id = searchParams.get("id");
  const projet_id = searchParams.get("projet_id");
  const mission_id = searchParams.get("mission_id");
  const statut = searchParams.get("statut");
  const categorie = searchParams.get("categorie");
  const from_date = searchParams.get("from_date");
  const to_date = searchParams.get("to_date");
  
  try {
    let query = supabase.from("depenses").select("*");
    
    if (id) {
      query = query.eq("id", id);
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
    
    // Default sort by date descending
    query = query.order("date", { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const body = await request.json();
  
  if (!body.date || !body.description || !body.montant || !body.categorie || !body.beneficiaire) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("depenses")
      .insert([{
        ...body,
        created_at: now,
        updated_at: now,
        statut: body.statut || "en_attente"
      }])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const supabase = createSupabaseServerClient();
  const body = await request.json();
  
  if (!body.id) {
    return NextResponse.json(
      { error: "ID is required for updating records" },
      { status: 400 }
    );
  }
  
  try {
    const { data, error } = await supabase
      .from("depenses")
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq("id", body.id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = createSupabaseServerClient();
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
      .from("depenses")
      .delete()
      .eq("id", id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
