import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Create a Supabase client with the cookies
function getSupabaseClient() {
  const cookieStore = cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  );
  return supabase;
}

// Get the document type ID for expenses
// Function defined but not used - keeping for future reference
/*
async function getExpenseDocumentTypeId() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("document_types")
    .select("id")
    .eq("name", "depense")
    .single();

  if (error || !data) {
    console.error("Error fetching expense document type:", error);
    throw new Error("Failed to fetch expense document type");
  }

  return data.id;
}
*/

// Upload PDF for an expense
export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data with the PDF file and expense ID
    const formData = await request.formData();
    const expenseId = formData.get("expenseId") as string;
    const file = formData.get("file") as File;

    if (!expenseId || !file) {
      return NextResponse.json(
        { error: "Expense ID and file are required" },
        { status: 400 }
      );
    }

    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Get the expense document
    const { data: expense, error: expenseError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", expenseId)
      .single();

    if (expenseError || !expense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    // Convert file to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Create a unique file path
    const filePath = `expenses/${expenseId}/${uuidv4()}.pdf`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading PDF:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload PDF" },
        { status: 500 }
      );
    }

    // Update the expense document with file information
    const { data: updatedExpense, error: updateError } = await supabase
      .from("documents")
      .update({
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        last_modified_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", expenseId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating expense with PDF info:", updateError);
      return NextResponse.json(
        { error: "Failed to update expense with PDF info" },
        { status: 500 }
      );
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = await supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      expense: updatedExpense,
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        path: filePath,
        url: publicUrlData.publicUrl,
      },
    });
  } catch (error) {
    console.error("Error handling PDF upload:", error);
    return NextResponse.json(
      { error: "Failed to process PDF upload" },
      { status: 500 }
    );
  }
}

// Get PDF for an expense
export async function GET(request: Request) {
  try {
    const supabase = getSupabaseClient();
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get expense ID from URL
    const url = new URL(request.url);
    const expenseId = url.searchParams.get("expenseId");

    if (!expenseId) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    // Get the expense document
    const { data: expense, error: expenseError } = await supabase
      .from("documents")
      .select("file_path, file_name")
      .eq("id", expenseId)
      .single();

    if (expenseError || !expense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    if (!expense.file_path) {
      return NextResponse.json(
        { error: "No PDF file associated with this expense" },
        { status: 404 }
      );
    }

    // Generate a signed URL for the file (valid for 60 seconds)
    const { data: urlData, error: urlError } = await supabase.storage
      .from("documents")
      .createSignedUrl(expense.file_path, 60);

    if (urlError) {
      console.error("Error generating signed URL:", urlError);
      return NextResponse.json(
        { error: "Failed to generate download URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      file: {
        name: expense.file_name,
        url: urlData.signedUrl,
      },
    });
  } catch (error) {
    console.error("Error handling PDF download:", error);
    return NextResponse.json(
      { error: "Failed to process PDF download" },
      { status: 500 }
    );
  }
}

// Delete PDF for an expense
export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseClient();
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get expense ID from URL
    const url = new URL(request.url);
    const expenseId = url.searchParams.get("expenseId");

    if (!expenseId) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    // Get the expense document
    const { data: expense, error: expenseError } = await supabase
      .from("documents")
      .select("file_path")
      .eq("id", expenseId)
      .single();

    if (expenseError || !expense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    if (!expense.file_path) {
      return NextResponse.json(
        { error: "No PDF file associated with this expense" },
        { status: 404 }
      );
    }

    // Delete the file from storage
    const { error: deleteError } = await supabase.storage
      .from("documents")
      .remove([expense.file_path]);

    if (deleteError) {
      console.error("Error deleting PDF:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete PDF" },
        { status: 500 }
      );
    }

    // Update the expense document to remove file information
    const { error: updateError } = await supabase
      .from("documents")
      .update({
        file_path: null,
        file_name: null,
        file_size: null,
        file_type: null,
        last_modified_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", expenseId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating expense after PDF deletion:", updateError);
      return NextResponse.json(
        { error: "Failed to update expense after PDF deletion" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "PDF deleted successfully",
    });
  } catch (error) {
    console.error("Error handling PDF deletion:", error);
    return NextResponse.json(
      { error: "Failed to process PDF deletion" },
      { status: 500 }
    );
  }
}
