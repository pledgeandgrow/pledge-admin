import { createSupabaseServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// This file contains API routes for managing quotes (devis)
// We're using specific @ts-expect-error comments to handle Supabase query builder typing issues

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();

    const body = await request.json();

    // @ts-expect-error - Supabase query builder typing issue with select() method
    const { data: devis, error } = await supabase
      .from("devis")
      .insert([
        {
          ...body,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(devis);
  } catch (error) {
    console.error("Error creating devis:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();

    const { data: devis, error } = await supabase
      .from("devis")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(devis);
  } catch (error) {
    console.error("Error fetching devis:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createSupabaseServerClient();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    // @ts-expect-error - Supabase query builder typing issue with eq() method
    const { error } = await supabase
      .from("devis")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Devis deleted successfully" });
  } catch (error) {
    console.error("Error deleting devis:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
