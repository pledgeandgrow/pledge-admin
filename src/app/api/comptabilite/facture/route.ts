import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { InvoiceMetadata } from "@/components/comptabilite/facture/types";
// InvoiceDocument type is defined but not used directly in this file

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

// Get the document type ID for invoices
async function getInvoiceDocumentTypeId() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("document_types")
    .select("id")
    .eq("name", "facture")
    .single();

  if (error || !data) {
    console.error("Error fetching invoice document type:", error);
    throw new Error("Failed to fetch invoice document type");
  }

  return data.id;
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const invoiceTypeId = await getInvoiceDocumentTypeId();
    
    // Get all documents of type 'facture'
    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        id,
        title,
        description,
        document_type_id,
        file_path,
        file_name,
        status,
        project_id,
        contact_id,
        created_by,
        last_modified_by,
        metadata,
        tags,
        created_at,
        updated_at,
        projects:project_id (name),
        contacts:contact_id (id, first_name, last_name, email, address, postal_code, city, country, vat_number)
      `)
      .eq('document_type_id', invoiceTypeId);

    if (error) {
      console.error('Error fetching invoices:', error);
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }

    // Transform documents to match the Invoice interface
    const invoices = documents.map(doc => {
      const metadata = doc.metadata as InvoiceMetadata;
      // Define proper types instead of using any
      interface Contact {
        id?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        address?: string;
        postal_code?: string;
        city?: string;
        country?: string;
        vat_number?: string;
      }
      
      interface Project {
        id?: string;
        name?: string;
      }
      
      // Get the first contact and project from arrays if they exist
      const contact = doc.contacts && Array.isArray(doc.contacts) && doc.contacts.length > 0 
        ? doc.contacts[0] as Contact 
        : null;
      
      const project = doc.projects && Array.isArray(doc.projects) && doc.projects.length > 0 
        ? doc.projects[0] as Project 
        : null;
      
      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        document_type_id: doc.document_type_id,
        file_path: doc.file_path,
        file_name: doc.file_name,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        // Invoice specific fields from metadata
        invoice_number: metadata?.invoice_number || '',
        date: metadata?.date || '',
        due_date: metadata?.due_date || '',
        status: metadata?.invoice_status || 'draft',
        client: {
          id: contact?.id || '',
          name: contact ? `${contact.first_name || ''} ${contact.last_name || ''}` : '',
          email: contact?.email || '',
          address: contact?.address || '',
          postal_code: contact?.postal_code || '',
          city: contact?.city || '',
          country: contact?.country || '',
          vat_number: contact?.vat_number || ''
        },
        items: metadata?.items || [],
        subtotal: metadata?.subtotal || 0,
        tax_rate: metadata?.tax_rate || 0,
        tax_amount: metadata?.tax_amount || 0,
        total: metadata?.total || 0,
        notes: metadata?.notes || '',
        payment_terms: metadata?.payment_terms || '',
        payment_method: metadata?.payment_method || '',
        paid_at: metadata?.paid_at || '',
        project_id: doc.project_id || '',
        project_name: project?.name || '',
        currency: metadata?.currency || 'EUR',
        language: (metadata?.language as 'fr' | 'en') || 'fr',
        company_details: metadata?.company_details || {
          name: '',
          address: '',
          postal_code: '',
          city: '',
          country: '',
        }
      };
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const invoice = await request.json();
    const supabase = getSupabaseClient();
    const invoiceTypeId = await getInvoiceDocumentTypeId();
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Extract metadata from invoice for document table
    const metadata: InvoiceMetadata = {
      invoice_number: invoice.invoice_number || '',
      date: invoice.date || new Date().toISOString().split('T')[0],
      due_date: invoice.due_date || '',
      invoice_status: invoice.status || 'draft',
      items: invoice.items || [],
      subtotal: invoice.subtotal || 0,
      tax_rate: invoice.tax_rate || 0,
      tax_amount: invoice.tax_amount || 0,
      total: invoice.total || 0,
      notes: invoice.notes || '',
      payment_terms: invoice.payment_terms || '',
      payment_method: invoice.payment_method || '',
      paid_at: invoice.paid_at || null,
      currency: invoice.currency || 'EUR',
      language: invoice.language || 'fr',
      company_details: invoice.company_details || {
        name: '',
        address: '',
        postal_code: '',
        city: '',
        country: '',
      }
    };
    
    // Create the document record
    const { data: newDocument, error } = await supabase
      .from('documents')
      .insert({
        title: invoice.title || `Facture ${metadata.invoice_number}`,
        description: invoice.description || '',
        document_type_id: invoiceTypeId,
        custom_type: 'invoice',
        file_name: invoice.file_name || '',
        file_path: invoice.file_path || '',
        status: 'active',
        project_id: invoice.project_id || null,
        contact_id: invoice.client?.id || null,
        created_by: user.id,
        last_modified_by: user.id,
        metadata,
        tags: ['invoice', 'comptabilite']
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating invoice document:', error);
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }
    
    // Return the newly created document with transformed data to match Invoice interface
    return NextResponse.json({
      id: newDocument.id,
      title: newDocument.title,
      description: newDocument.description,
      document_type_id: newDocument.document_type_id,
      file_path: newDocument.file_path,
      file_name: newDocument.file_name,
      created_at: newDocument.created_at,
      updated_at: newDocument.updated_at,
      ...metadata,
      project_id: newDocument.project_id,
      client: invoice.client || { id: '', name: '', email: '' }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const invoice = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // First check if the document exists
    const { data: existingDoc, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError || !existingDoc) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    // Extract metadata from invoice for document table
    const metadata: InvoiceMetadata = {
      ...(existingDoc.metadata as InvoiceMetadata || {}),
      invoice_number: invoice.invoice_number || (existingDoc.metadata as InvoiceMetadata)?.invoice_number || '',
      date: invoice.date || (existingDoc.metadata as InvoiceMetadata)?.date || '',
      due_date: invoice.due_date || (existingDoc.metadata as InvoiceMetadata)?.due_date || '',
      invoice_status: invoice.status || (existingDoc.metadata as InvoiceMetadata)?.invoice_status || 'draft',
      items: invoice.items || (existingDoc.metadata as InvoiceMetadata)?.items || [],
      subtotal: invoice.subtotal || (existingDoc.metadata as InvoiceMetadata)?.subtotal || 0,
      tax_rate: invoice.tax_rate || (existingDoc.metadata as InvoiceMetadata)?.tax_rate || 0,
      tax_amount: invoice.tax_amount || (existingDoc.metadata as InvoiceMetadata)?.tax_amount || 0,
      total: invoice.total || (existingDoc.metadata as InvoiceMetadata)?.total || 0,
      notes: invoice.notes || (existingDoc.metadata as InvoiceMetadata)?.notes || '',
      payment_terms: invoice.payment_terms || (existingDoc.metadata as InvoiceMetadata)?.payment_terms || '',
      payment_method: invoice.payment_method || (existingDoc.metadata as InvoiceMetadata)?.payment_method || '',
      paid_at: invoice.paid_at || (existingDoc.metadata as InvoiceMetadata)?.paid_at || null,
      currency: invoice.currency || (existingDoc.metadata as InvoiceMetadata)?.currency || 'EUR',
      language: invoice.language || (existingDoc.metadata as InvoiceMetadata)?.language || 'fr',
      company_details: invoice.company_details || (existingDoc.metadata as InvoiceMetadata)?.company_details || {
        name: '',
        address: '',
        postal_code: '',
        city: '',
        country: '',
      }
    };
    
    // Update the document
    const { data: updatedDoc, error: updateError } = await supabase
      .from('documents')
      .update({
        title: invoice.title || existingDoc.title,
        description: invoice.description || existingDoc.description,
        file_name: invoice.file_name || existingDoc.file_name,
        file_path: invoice.file_path || existingDoc.file_path,
        project_id: invoice.project_id || existingDoc.project_id,
        contact_id: invoice.client?.id || existingDoc.contact_id,
        last_modified_by: user.id,
        metadata,
      })
      .eq('id', id)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error updating invoice document:', updateError);
      return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }
    
    // Return the updated document with transformed data to match Invoice interface
    const contact = updatedDoc.contact_id ? 
      await supabase.from('contacts').select('*').eq('id', updatedDoc.contact_id).single().then(res => res.data) : 
      null;
      
    const project = updatedDoc.project_id ? 
      await supabase.from('projects').select('name').eq('id', updatedDoc.project_id).single().then(res => res.data) : 
      null;
    
    return NextResponse.json({
      id: updatedDoc.id,
      title: updatedDoc.title,
      description: updatedDoc.description,
      document_type_id: updatedDoc.document_type_id,
      file_path: updatedDoc.file_path,
      file_name: updatedDoc.file_name,
      created_at: updatedDoc.created_at,
      updated_at: updatedDoc.updated_at,
      ...metadata,
      project_id: updatedDoc.project_id,
      project_name: project?.name || '',
      client: contact ? {
        id: contact.id,
        name: `${contact.first_name} ${contact.last_name}`,
        email: contact.email || '',
        address: contact.address || '',
        postal_code: contact.postal_code || '',
        city: contact.city || '',
        country: contact.country || '',
        vat_number: contact.vat_number || ''
      } : invoice.client || { id: '', name: '', email: '' }
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    
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
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    // Delete the document
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
      console.error('Error deleting invoice document:', deleteError);
      return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
