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

// Get the document type ID for a specific document type
// Commented out as it's currently unused
/* async function getDocumentTypeId(documentType: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("document_types")
    .select("id")
    .eq("name", documentType)
    .single();

  if (error || !data) {
    console.error(`Error fetching ${documentType} document type:`, error);
    throw new Error(`Failed to fetch ${documentType} document type`);
  }

  return data.id;
} */

// Upload PDF for a document
export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const documentId = formData.get("documentId") as string;
    const documentType = formData.get("documentType") as string;
    const file = formData.get("file") as File;

    // Validate inputs
    if (!documentId || !documentType || !file) {
      return NextResponse.json(
        { error: "Missing required fields: documentId, documentType, or file" },
        { status: 400 }
      );
    }

    // Validate file is a PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Generate a unique file name
    const fileExt = "pdf";
    const fileName = `${documentType}_${documentId}_${uuidv4()}.${fileExt}`;
    const filePath = `${documentType}/${fileName}`;

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Generate a signed URL for the file
    const { data: signedUrlData } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

    // Update the document based on document type
    let updateResult;
    
    if (documentType === "expense") {
      updateResult = await supabase
        .from("depenses")
        .update({
          justificatif_url: signedUrlData?.signedUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId);
    } else if (documentType === "invoice") {
      updateResult = await supabase
        .from("factures")
        .update({
          pdf_url: signedUrlData?.signedUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId);
    } else if (documentType === "quote") {
      updateResult = await supabase
        .from("devis")
        .update({
          pdf_url: signedUrlData?.signedUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId);
    } else {
      // Generic document handling
      updateResult = await supabase
        .from("documents")
        .update({
          file_path: filePath,
          file_name: fileName,
          file_size: file.size,
          file_type: file.type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId);
    }

    if (updateResult.error) {
      console.error("Error updating document record:", updateResult.error);
      
      // Try to delete the uploaded file if the record update failed
      await supabase.storage.from("documents").remove([filePath]);
      
      return NextResponse.json(
        { error: "Failed to update document record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      file: {
        name: fileName,
        path: filePath,
        size: file.size,
        type: file.type,
        url: signedUrlData?.signedUrl,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    console.error("Error in PDF upload:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Get PDF for a document
export async function GET(request: Request) {
  try {
    const supabase = getSupabaseClient();
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse the URL to get query parameters
    const url = new URL(request.url);
    const documentId = url.searchParams.get("documentId");
    const documentType = url.searchParams.get("documentType");
    const expenseId = url.searchParams.get("expenseId"); // For backward compatibility

    // Handle backward compatibility
    let finalDocumentId = documentId;
    let finalDocumentType = documentType;
    
    if (!finalDocumentId && expenseId) {
      finalDocumentId = expenseId;
      finalDocumentType = "expense";
    }

    // Validate inputs
    if (!finalDocumentId || !finalDocumentType) {
      return NextResponse.json(
        { error: "Missing required parameters: documentId/expenseId or documentType" },
        { status: 400 }
      );
    }

    // Get document data based on document type
    let documentData;
    let fileUrl;
    
    if (finalDocumentType === "expense") {
      const { data, error } = await supabase
        .from("depenses")
        .select("justificatif_url")
        .eq("id", finalDocumentId)
        .single();
        
      if (error || !data) {
        return NextResponse.json(
          { error: "Expense not found" },
          { status: 404 }
        );
      }
      
      fileUrl = data.justificatif_url;
      documentData = data;
    } else if (finalDocumentType === "invoice") {
      const { data, error } = await supabase
        .from("factures")
        .select("pdf_url")
        .eq("id", finalDocumentId)
        .single();
        
      if (error || !data) {
        return NextResponse.json(
          { error: "Invoice not found" },
          { status: 404 }
        );
      }
      
      fileUrl = data.pdf_url;
      documentData = data;
    } else if (finalDocumentType === "quote") {
      const { data, error } = await supabase
        .from("devis")
        .select("pdf_url")
        .eq("id", finalDocumentId)
        .single();
        
      if (error || !data) {
        return NextResponse.json(
          { error: "Quote not found" },
          { status: 404 }
        );
      }
      
      fileUrl = data.pdf_url;
      documentData = data;
    } else {
      // Generic document handling
      const { data, error } = await supabase
        .from("documents")
        .select("file_path, file_name, file_size, file_type")
        .eq("id", finalDocumentId)
        .single();
        
      if (error || !data) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        );
      }
      
      // Generate a signed URL for the file
      if (data.file_path) {
        const { data: signedUrlData } = await supabase.storage
          .from("documents")
          .createSignedUrl(data.file_path, 60 * 60); // 1 hour expiry
          
        fileUrl = signedUrlData?.signedUrl;
      }
      
      documentData = data;
    }

    // Check if document has a file URL
    if (!fileUrl) {
      return NextResponse.json(
        { error: "Document has no attached PDF" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      file: {
        url: fileUrl,
        ...documentData
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    console.error("Error in PDF download:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Delete PDF for a document
export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseClient();
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse the URL to get query parameters
    const url = new URL(request.url);
    const documentId = url.searchParams.get("documentId");
    const documentType = url.searchParams.get("documentType");
    const expenseId = url.searchParams.get("expenseId"); // For backward compatibility

    // Handle backward compatibility
    let finalDocumentId = documentId;
    let finalDocumentType = documentType;
    
    if (!finalDocumentId && expenseId) {
      finalDocumentId = expenseId;
      finalDocumentType = "expense";
    }

    // Validate inputs
    if (!finalDocumentId || !finalDocumentType) {
      return NextResponse.json(
        { error: "Missing required parameters: documentId/expenseId or documentType" },
        { status: 400 }
      );
    }

    // Handle document deletion based on document type
    if (finalDocumentType === "expense") {
      // Get the current file URL
      const { data: expense, error: fetchError } = await supabase
        .from("depenses")
        .select("justificatif_url")
        .eq("id", finalDocumentId)
        .single();
        
      if (fetchError || !expense || !expense.justificatif_url) {
        return NextResponse.json(
          { error: "Expense PDF not found" },
          { status: 404 }
        );
      }
      
      // Update the expense record to remove the file URL
      const { error: updateError } = await supabase
        .from("depenses")
        .update({
          justificatif_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", finalDocumentId);
        
      if (updateError) {
        console.error("Error updating expense record:", updateError);
        return NextResponse.json(
          { error: "Failed to update expense record" },
          { status: 500 }
        );
      }
    } else if (finalDocumentType === "invoice") {
      // Get the current file URL
      const { data: invoice, error: fetchError } = await supabase
        .from("factures")
        .select("pdf_url")
        .eq("id", finalDocumentId)
        .single();
        
      if (fetchError || !invoice || !invoice.pdf_url) {
        return NextResponse.json(
          { error: "Invoice PDF not found" },
          { status: 404 }
        );
      }
      
      // Update the invoice record to remove the file URL
      const { error: updateError } = await supabase
        .from("factures")
        .update({
          pdf_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", finalDocumentId);
        
      if (updateError) {
        console.error("Error updating invoice record:", updateError);
        return NextResponse.json(
          { error: "Failed to update invoice record" },
          { status: 500 }
        );
      }
    } else if (finalDocumentType === "quote") {
      // Get the current file URL
      const { data: quote, error: fetchError } = await supabase
        .from("devis")
        .select("pdf_url")
        .eq("id", finalDocumentId)
        .single();
        
      if (fetchError || !quote || !quote.pdf_url) {
        return NextResponse.json(
          { error: "Quote PDF not found" },
          { status: 404 }
        );
      }
      
      // Update the quote record to remove the file URL
      const { error: updateError } = await supabase
        .from("devis")
        .update({
          pdf_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", finalDocumentId);
        
      if (updateError) {
        console.error("Error updating quote record:", updateError);
        return NextResponse.json(
          { error: "Failed to update quote record" },
          { status: 500 }
        );
      }
    } else {
      // Generic document handling
      const { data: document, error: fetchError } = await supabase
        .from("documents")
        .select("file_path")
        .eq("id", finalDocumentId)
        .single();
        
      if (fetchError || !document || !document.file_path) {
        return NextResponse.json(
          { error: "Document PDF not found" },
          { status: 404 }
        );
      }
      
      // Delete the file from storage
      const { error: deleteError } = await supabase.storage
        .from("documents")
        .remove([document.file_path]);
        
      if (deleteError) {
        console.error("Error deleting file from storage:", deleteError);
        return NextResponse.json(
          { error: "Failed to delete file from storage" },
          { status: 500 }
        );
      }
      
      // Update the document record to remove file information
      const { error: updateError } = await supabase
        .from("documents")
        .update({
          file_path: null,
          file_name: null,
          file_size: null,
          file_type: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", finalDocumentId);
        
      if (updateError) {
        console.error("Error updating document record:", updateError);
        return NextResponse.json(
          { error: "Failed to update document record" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "PDF deleted successfully",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    console.error("Error in PDF deletion:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
