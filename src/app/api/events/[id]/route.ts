import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: cookies
      }
    );
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the event by ID
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('event_id', eventId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      console.error('Error fetching event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ event: data });
  } catch (error) {
    console.error('Unexpected error in event GET route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: cookies
      }
    );
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the event data from the request body
    const eventData = await request.json();
    
    // Add updated_at timestamp
    const dataToUpdate = {
      ...eventData,
      updated_at: new Date().toISOString()
    };
    
    // Update the event
    const { data, error } = await supabase
      .from('events')
      .update(dataToUpdate)
      .eq('event_id', eventId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ event: data });
  } catch (error) {
    console.error('Unexpected error in event PUT route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: cookies
      }
    );
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete the event
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('event_id', eventId);
    
    if (error) {
      console.error('Error deleting event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in event DELETE route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
