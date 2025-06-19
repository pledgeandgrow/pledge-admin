import { NextResponse } from 'next/server';
import { fileStorage } from '@/utils/fileStorage';

export async function GET() {
  const projects = fileStorage.readClientProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const projects = fileStorage.readClientProjects();
  const newProject = await request.json();
  
  // Add new project with ID
  const projectWithId = {
    ...newProject,
    id: Date.now().toString()
  };
  projects.push(projectWithId);
  
  fileStorage.writeClientProjects(projects);
  return NextResponse.json(projectWithId);
}

export async function PUT(request: Request) {
  const projects = fileStorage.readClientProjects();
  const updatedProject = await request.json();
  
  const index = projects.findIndex((p: { id: string }) => p.id === updatedProject.id);
  if (index !== -1) {
    projects[index] = updatedProject;
    fileStorage.writeClientProjects(projects);
    return NextResponse.json(updatedProject);
  }
  
  return NextResponse.json({ error: 'Project not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  
  const projects = fileStorage.readClientProjects();
  const filteredProjects = projects.filter((p: { id: string }) => p.id !== id);
  
  if (filteredProjects.length === projects.length) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  
  fileStorage.writeClientProjects(filteredProjects);
  return NextResponse.json({ success: true });
}
