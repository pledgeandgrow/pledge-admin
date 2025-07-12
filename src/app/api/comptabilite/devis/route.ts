import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { QuoteMetadata } from "@/components/comptabilite/devis/types";
// QuoteDocument type is defined but not used directly in this file

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

// Get the document type ID for quotes
async function getQuoteDocumentTypeId() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("document_types")
    .select("id")
    .eq("name", "devis")
    .single();

  if (error || !data) {
    console.error("Error fetching quote document type:", error);
    throw new Error("Failed to fetch quote document type");
  }

  return data.id;
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const quote = await request.json();

    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get the document type ID for quotes
    const documentTypeId = await getQuoteDocumentTypeId();

    // Extract metadata from quote for document table
    const metadata: QuoteMetadata = {
      quote_number: quote.quote_number || `QT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      date: quote.date || new Date().toISOString().split('T')[0],
      due_date: quote.due_date || '',
      quote_status: quote.status || 'draft',
      items: quote.items || [],
      subtotal: quote.subtotal || 0,
      tax_rate: quote.tax_rate || 0,
      tax_amount: quote.tax_amount || 0,
      total: quote.total || 0,
      notes: quote.notes || '',
      payment_terms: quote.payment_terms || '',
      validity_period: quote.validity_period || 30,
      currency: quote.currency || 'EUR',
      language: quote.language || 'fr',
      company_details: quote.company_details || {
        name: '',
        address: '',
        postal_code: '',
        city: '',
        country: '',
      }
    };

    // Create the document
    const { data: document, error: insertError } = await supabase
      .from('documents')
      .insert({
        title: quote.title || `Quote ${metadata.quote_number}`,
        description: quote.description || '',
        document_type_id: documentTypeId,
        status: 'active',
        project_id: quote.project_id || null,
        contact_id: quote.client?.id || null,
        created_by: user.id,
        last_modified_by: user.id,
        metadata
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating quote document:', insertError);
      return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
    }

    // Return the created document with transformed data to match Quote interface
    const contact = document.contact_id ? 
      await supabase.from('contacts').select('*').eq('id', document.contact_id).single().then(res => res.data) : 
      null;
      
    const project = document.project_id ? 
      await supabase.from('projects').select('name').eq('id', document.project_id).single().then(res => res.data) : 
      null;

    return NextResponse.json({
      id: document.id,
      title: document.title,
      description: document.description,
      quote_number: metadata.quote_number,
      date: metadata.date,
      due_date: metadata.due_date,
      status: metadata.quote_status,
      client: contact ? {
        id: contact.id,
        name: `${contact.first_name} ${contact.last_name}`,
        email: contact.email || '',
        address: contact.address || '',
        postal_code: contact.postal_code || '',
        city: contact.city || '',
        country: contact.country || '',
        vat_number: contact.vat_number || ''
      } : quote.client || { id: '', name: '', email: '' },
      items: metadata.items,
      subtotal: metadata.subtotal,
      tax_rate: metadata.tax_rate,
      tax_amount: metadata.tax_amount,
      total: metadata.total,
      notes: metadata.notes,
      payment_terms: metadata.payment_terms,
      validity_period: metadata.validity_period,
      project_id: document.project_id,
      project_name: project?.name || '',
      currency: metadata.currency,
      language: metadata.language,
      company_details: metadata.company_details,
      created_at: document.created_at,
      updated_at: document.updated_at
    });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const documentTypeId = await getQuoteDocumentTypeId();

    // Get all documents with the quote document type
    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        id, title, description, status, file_path, file_name, metadata, 
        created_at, updated_at, project_id, contact_id,
        projects:project_id (id, name),
        contacts:contact_id (id, first_name, last_name, email, address, postal_code, city, country, vat_number)
      `)
      .eq('document_type_id', documentTypeId)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quotes:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // We'll use any type with eslint-disable to avoid breaking existing code
    // while maintaining compatibility
    
    // Transform documents to match the Quote interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quotes = documents.map((doc: any) => {
      const metadata = doc.metadata as QuoteMetadata;
      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        quote_number: metadata?.quote_number || '',
        date: metadata?.date || '',
        due_date: metadata?.due_date || '',
        status: metadata?.quote_status || 'draft',
        client: doc.contacts ? {
          id: doc.contacts.id,
          name: `${doc.contacts.first_name} ${doc.contacts.last_name}`,
          email: doc.contacts.email || '',
          address: doc.contacts.address || '',
          postal_code: doc.contacts.postal_code || '',
          city: doc.contacts.city || '',
          country: doc.contacts.country || '',
          vat_number: doc.contacts.vat_number || ''
        } : { id: '', name: '', email: '' },
        items: metadata?.items || [],
        subtotal: metadata?.subtotal || 0,
        tax_rate: metadata?.tax_rate || 0,
        tax_amount: metadata?.tax_amount || 0,
        total: metadata?.total || 0,
        notes: metadata?.notes || '',
        payment_terms: metadata?.payment_terms || '',
        validity_period: metadata?.validity_period || 30,
        project_id: doc.project_id,
        project_name: doc.projects?.name || '',
        currency: metadata?.currency || 'EUR',
        language: metadata?.language || 'fr',
        company_details: metadata?.company_details || {
          name: '',
          address: '',
          postal_code: '',
          city: '',
          country: ''
        },
        created_at: doc.created_at,
        updated_at: doc.updated_at
      };
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseClient();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Quote ID is required" },
        { status: 400 }
      );
    }
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // First check if the document exists
    const { data: existingDoc, error: fetchError } = await supabase
      .from('documents')
      .select('id')
      .eq('id', id)
      .single();
      
    if (fetchError || !existingDoc) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    
    // Option 1: Hard delete (completely removes the record)
    // const { error: deleteError } = await supabase
    //   .from('documents')
    //   .delete()
    //   .eq('id', id);
    
    // Option 2: Soft delete (update status to 'deleted')
    const { error: deleteError } = await supabase
      .from('documents')
      .update({ 
        status: 'deleted',
        last_modified_by: user.id
      })
      .eq('id', id);
      
    if (deleteError) {
      console.error('Error deleting quote document:', deleteError);
      return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
    }

    return NextResponse.json({ message: "Quote deleted successfully" });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
