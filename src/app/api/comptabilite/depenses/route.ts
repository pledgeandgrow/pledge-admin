import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define types for the document-based structure
interface ExpenseMetadata {
  description: string;
  date: string;
  amount: number;
  category: string;
  payment_method?: string;
  beneficiary: string;
  project_id?: string;
  receipt_url?: string;
  notes?: string;
  status: "draft" | "submitted" | "approved" | "rejected" | "reimbursed";
  expense_status?: string;
  expense_number?: string;
  due_date?: string;
  total?: number;
  subtotal?: number;
  tax_rate?: number;
  tax_amount?: number;
  payment_date?: string;
  currency?: string;
  language?: string;
  project_reference?: string;
  items?: ExpenseItem[];
}

interface ExpenseItem {
  description: string;
  amount: number;
  quantity?: number;
  receipt_url?: string;
  category?: string;
  date?: string;
}

// Create a Supabase client with the cookies
function getSupabaseClient() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
  return supabase;
}

// Get the document type ID for expenses
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

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const documentTypeId = await getExpenseDocumentTypeId();
    const { searchParams } = new URL(request.url);
    
    // Extract filter parameters
    const id = searchParams.get("id");
    const project_id = searchParams.get("project_id");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const from_date = searchParams.get("from_date");
    const to_date = searchParams.get("to_date");
    const amount_min = searchParams.get("amount_min");
    const amount_max = searchParams.get("amount_max");
    const sort = searchParams.get("sort") || "date";
    const order = searchParams.get("order") || "desc";
    
    // Start building the query
    let query = supabase
      .from('documents')
      .select(`
        id, title, description, status, file_path, file_name, metadata, 
        created_at, updated_at, project_id, contact_id,
        projects:project_id (id, name)
      `)
      .eq('document_type_id', documentTypeId)
      .neq('status', 'deleted');
    
    // Apply filters conditionally
    if (id) {
      query = query.eq('id', id);
    }
    
    if (project_id) {
      query = query.eq("project_id", project_id);
    }
    
    // Filters that apply to the metadata JSON field
    if (status) {
      query = query.filter('metadata->expense_status', 'eq', status);
    }
    
    if (category) {
      query = query.filter('metadata->category', 'eq', category);
    }
    
    if (from_date) {
      query = query.filter('metadata->date', 'gte', from_date);
    }
    
    if (to_date) {
      query = query.filter('metadata->date', 'lte', to_date);
    }
    
    if (amount_min) {
      query = query.filter('metadata->total', 'gte', parseFloat(amount_min));
    }
    
    if (amount_max) {
      query = query.filter('metadata->total', 'lte', parseFloat(amount_max));
    }
    
    // Apply sorting
    if (sort === 'date') {
      query = query.order('metadata->date', { ascending: order === 'asc' });
    } else if (sort === 'amount' || sort === 'total') {
      query = query.order('metadata->total', { ascending: order === 'asc' });
    } else {
      // Default sort by created_at
      query = query.order('created_at', { ascending: order === 'asc' });
    }
    
    // Execute the query
    const { data: documents, error } = await query;
    
    if (error) {
      console.error("Error fetching expense documents:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Define document type for proper typing
    interface DocumentWithMetadata {
      id: string;
      title: string;
      description?: string;
      status: string;
      metadata: ExpenseMetadata;
      created_at: string;
      updated_at: string;
      created_by?: string;
      project_id?: string;
      project_name?: string;
      file_path?: string;
      file_name?: string;
      projects?: { id: string; name: string }[];
    }
    
    // Transform documents to match the Expense interface for backward compatibility
    const expenses = documents.map((doc: DocumentWithMetadata) => {
      const metadata = doc.metadata as ExpenseMetadata;
      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        expense_number: metadata?.expense_number || '',
        date: metadata?.date || '',
        due_date: metadata?.due_date || '',
        status: metadata?.expense_status || 'draft',
        beneficiary: metadata?.beneficiary || '',
        amount: metadata?.total || 0,
        tax_rate: metadata?.tax_rate || 0,
        tax_amount: metadata?.tax_amount || 0,
        total: metadata?.total || 0,
        notes: metadata?.notes || '',
        payment_method: metadata?.payment_method || '',
        payment_date: metadata?.payment_date || '',
        category: metadata?.category || '',
        receipt_url: metadata?.items?.[0]?.receipt_url || '',
        project_id: doc.project_id,
        project_name: doc.projects && doc.projects.length > 0 ? doc.projects[0].name : '',
        currency: metadata?.currency || 'EUR',
        created_at: doc.created_at,
        updated_at: doc.updated_at
      };
    });
    
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error in expenses API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const expense = await request.json();
    
    // Validate required fields
    if (!expense.date || !expense.description || !expense.amount || !expense.category || !expense.beneficiary) {
      return NextResponse.json(
        { error: "Missing required fields: date, description, amount, category, and beneficiary are required" },
        { status: 400 }
      );
    }
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get the document type ID for expenses
    const documentTypeId = await getExpenseDocumentTypeId();

    // Create expense item
    const expenseItem: ExpenseItem = {
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      receipt_url: expense.receipt_url || ''
    };

    // Extract metadata from expense for document table
    const metadata: ExpenseMetadata = {
      description: expense.description || '',
      amount: expense.amount || 0,
      status: (expense.status as "draft" | "submitted" | "approved" | "rejected" | "reimbursed") || 'draft',
      expense_number: expense.expense_number || `EXP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      date: expense.date,
      due_date: expense.due_date || '',
      expense_status: expense.status || 'draft',
      items: [expenseItem],
      subtotal: expense.amount || 0,
      tax_rate: expense.tax_rate || 0,
      tax_amount: expense.tax_amount || 0,
      total: expense.total || expense.amount || 0,
      notes: expense.notes || '',
      payment_method: expense.payment_method || '',
      payment_date: expense.payment_date || '',
      currency: expense.currency || 'EUR',
      language: expense.language || 'fr',
      beneficiary: expense.beneficiary || '',
      category: expense.category || '',
      project_reference: expense.project_reference || ''
    };

    // Create the document
    const { data: document, error: insertError } = await supabase
      .from('documents')
      .insert({
        title: expense.title || `Expense ${metadata.expense_number}`,
        description: expense.description,
        document_type_id: documentTypeId,
        status: 'active',
        project_id: expense.project_id || null,
        contact_id: expense.contact_id || null,
        created_by: user.id,
        last_modified_by: user.id,
        metadata
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating expense document:', insertError);
      return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
    }

    // Return the created document with transformed data to match Expense interface
    const project = document.project_id ? 
      await supabase.from('projects').select('name').eq('id', document.project_id).single().then(res => res.data) : 
      null;

    return NextResponse.json({
      id: document.id,
      title: document.title,
      description: document.description,
      expense_number: metadata.expense_number,
      date: metadata.date,
      due_date: metadata.due_date,
      status: metadata.expense_status,
      beneficiary: metadata.beneficiary,
      amount: metadata.total,
      tax_rate: metadata.tax_rate,
      tax_amount: metadata.tax_amount,
      total: metadata.total,
      notes: metadata.notes,
      payment_method: metadata.payment_method,
      payment_date: metadata.payment_date,
      category: metadata.category,
      receipt_url: metadata.items?.[0]?.receipt_url || '',
      project_id: document.project_id,
      project_name: project?.name || '',
      currency: metadata.currency,
      created_at: document.created_at,
      updated_at: document.updated_at
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const expense = await request.json();
    
    if (!expense.id) {
      return NextResponse.json(
        { error: "ID is required for updating expense records" },
        { status: 400 }
      );
    }
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // First, fetch the existing document to get its metadata
    const { data: existingDoc, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', expense.id)
      .single();
    
    if (fetchError || !existingDoc) {
      console.error('Error fetching expense document:', fetchError);
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    // Create expense item from the updated data
    const expenseItem: ExpenseItem = {
      description: expense.description,
      amount: expense.amount || existingDoc.metadata?.total || 0,
      category: expense.category,
      date: expense.date,
      receipt_url: expense.receipt_url || existingDoc.metadata?.items?.[0]?.receipt_url || ''
    };

    // Merge the existing metadata with the updated fields
    const updatedMetadata: ExpenseMetadata = {
      ...existingDoc.metadata as ExpenseMetadata,
      expense_number: expense.expense_number || existingDoc.metadata?.expense_number,
      date: expense.date || existingDoc.metadata?.date,
      due_date: expense.due_date || existingDoc.metadata?.due_date,
      expense_status: expense.status || existingDoc.metadata?.expense_status,
      items: [expenseItem],
      subtotal: expense.amount || existingDoc.metadata?.subtotal || 0,
      tax_rate: expense.tax_rate || existingDoc.metadata?.tax_rate || 0,
      tax_amount: expense.tax_amount || existingDoc.metadata?.tax_amount || 0,
      total: expense.total || expense.amount || existingDoc.metadata?.total || 0,
      notes: expense.notes || existingDoc.metadata?.notes,
      payment_method: expense.payment_method || existingDoc.metadata?.payment_method,
      payment_date: expense.payment_date || existingDoc.metadata?.payment_date,
      currency: expense.currency || existingDoc.metadata?.currency || 'EUR',
      beneficiary: expense.beneficiary || existingDoc.metadata?.beneficiary,
      category: expense.category || existingDoc.metadata?.category
    };

    // Update the document
    const { data: updatedDoc, error: updateError } = await supabase
      .from('documents')
      .update({
        title: expense.title || existingDoc.title,
        description: expense.description || existingDoc.description,
        status: expense.document_status || existingDoc.status,
        project_id: expense.project_id || existingDoc.project_id,
        contact_id: expense.contact_id || existingDoc.contact_id,
        last_modified_by: user.id,
        metadata: updatedMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', expense.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating expense document:', updateError);
      return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
    }

    // Return the updated document with transformed data to match Expense interface
    const project = updatedDoc.project_id ? 
      await supabase.from('projects').select('name').eq('id', updatedDoc.project_id).single().then(res => res.data) : 
      null;

    return NextResponse.json({
      id: updatedDoc.id,
      title: updatedDoc.title,
      description: updatedDoc.description,
      expense_number: updatedMetadata.expense_number,
      date: updatedMetadata.date,
      due_date: updatedMetadata.due_date,
      status: updatedMetadata.expense_status,
      beneficiary: updatedMetadata.beneficiary,
      amount: updatedMetadata.total,
      tax_rate: updatedMetadata.tax_rate,
      tax_amount: updatedMetadata.tax_amount,
      total: updatedMetadata.total,
      notes: updatedMetadata.notes,
      payment_method: updatedMetadata.payment_method,
      payment_date: updatedMetadata.payment_date,
      category: updatedMetadata.category,
      receipt_url: updatedMetadata.items?.[0]?.receipt_url || '',
      project_id: updatedDoc.project_id,
      project_name: project?.name || '',
      currency: updatedMetadata.currency,
      created_at: updatedDoc.created_at,
      updated_at: updatedDoc.updated_at
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID is required for deleting expense records" },
        { status: 400 }
      );
    }
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Soft delete by updating the status to 'deleted'
    const { error: deleteError } = await supabase
      .from('documents')
      .update({
        status: 'deleted',
        updated_at: new Date().toISOString(),
        last_modified_by: user.id
      })
      .eq('id', id);
      
    if (deleteError) {
      console.error('Error deleting expense document:', deleteError);
      return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
    }

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
