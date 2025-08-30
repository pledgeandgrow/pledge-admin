import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventType = searchParams.get('event_type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Start building the query
    let query = supabase
      .from('events')
      .select('*');
    
    // Apply filters if provided
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (startDate) {
      query = query.gte('start_datetime', startDate);
    }
    
    if (endDate) {
      query = query.lte('end_datetime', endDate);
    }
    
    // Execute the query
    const { data, error } = await query.order('start_datetime', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ events: data });
  } catch (error) {
    console.error('Unexpected error in events GET route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the event data from the request body
    const eventData = await request.json();
    
    // Validate required fields
    if (!eventData.title || !eventData.start_datetime || !eventData.end_datetime) {
      return NextResponse.json(
        { error: 'Missing required fields: title, start_datetime, end_datetime' }, 
        { status: 400 }
      );
    }
    
    // Add timestamps
    const dataToInsert = {
      ...eventData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insert the new event
    const { data, error } = await supabase
      .from('events')
      .insert(dataToInsert)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ event: data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in events POST route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
