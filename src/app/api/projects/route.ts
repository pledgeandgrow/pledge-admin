import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    
    if (error) throw error;
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const newProject = await request.json();
    
    // Remove id if provided to let the database generate it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...projectData } = newProject;
    
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createClient();
    const updatedProject = await request.json();
    
    if (!updatedProject.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const { id, ...projectData } = updatedProject;
    
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
