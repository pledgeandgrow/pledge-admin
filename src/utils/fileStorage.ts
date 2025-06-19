import fs from 'fs';
import path from 'path';

// Define interfaces for the data structures
interface BaseProject {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface InternalProject extends BaseProject {
  department: string;
  priority: string;
  assignedTo: string[];
}

interface ClientProject extends BaseProject {
  clientName: string;
  budget: number;
  deadline: string;
  contactPerson: string;
}

interface Specification {
  id: string;
  projectId: string;
  content: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const INTERNAL_PROJECTS_FILE = path.join(DATA_DIR, 'internal-projects.json');
const CLIENT_PROJECTS_FILE = path.join(DATA_DIR, 'client-projects.json');
const SPECIFICATIONS_FILE = path.join(DATA_DIR, 'specifications.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
[INTERNAL_PROJECTS_FILE, CLIENT_PROJECTS_FILE, SPECIFICATIONS_FILE].forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
  }
});

export const fileStorage = {
  readInternalProjects: (): InternalProject[] => {
    try {
      const data = fs.readFileSync(INTERNAL_PROJECTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading internal projects:', error);
      return [];
    }
  },

  writeInternalProjects: (projects: InternalProject[]): void => {
    try {
      fs.writeFileSync(INTERNAL_PROJECTS_FILE, JSON.stringify(projects, null, 2));
    } catch (error) {
      console.error('Error writing internal projects:', error);
    }
  },

  readClientProjects: (): ClientProject[] => {
    try {
      const data = fs.readFileSync(CLIENT_PROJECTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading client projects:', error);
      return [];
    }
  },

  writeClientProjects: (projects: ClientProject[]): void => {
    try {
      fs.writeFileSync(CLIENT_PROJECTS_FILE, JSON.stringify(projects, null, 2));
    } catch (error) {
      console.error('Error writing client projects:', error);
    }
  },

  readSpecifications: (): Specification[] => {
    try {
      const data = fs.readFileSync(SPECIFICATIONS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading specifications:', error);
      return [];
    }
  },

  writeSpecifications: (specifications: Specification[]): void => {
    try {
      fs.writeFileSync(SPECIFICATIONS_FILE, JSON.stringify(specifications, null, 2));
    } catch (error) {
      console.error('Error writing specifications:', error);
    }
  }
};
