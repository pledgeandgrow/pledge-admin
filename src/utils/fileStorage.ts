import fs from 'fs';
import path from 'path';

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
  readInternalProjects: (): any[] => {
    try {
      const data = fs.readFileSync(INTERNAL_PROJECTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading internal projects:', error);
      return [];
    }
  },

  writeInternalProjects: (projects: any[]): void => {
    try {
      fs.writeFileSync(INTERNAL_PROJECTS_FILE, JSON.stringify(projects, null, 2));
    } catch (error) {
      console.error('Error writing internal projects:', error);
    }
  },

  readClientProjects: (): any[] => {
    try {
      const data = fs.readFileSync(CLIENT_PROJECTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading client projects:', error);
      return [];
    }
  },

  writeClientProjects: (projects: any[]): void => {
    try {
      fs.writeFileSync(CLIENT_PROJECTS_FILE, JSON.stringify(projects, null, 2));
    } catch (error) {
      console.error('Error writing client projects:', error);
    }
  },

  readSpecifications: (): any[] => {
    try {
      const data = fs.readFileSync(SPECIFICATIONS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading specifications:', error);
      return [];
    }
  },

  writeSpecifications: (specifications: any[]): void => {
    try {
      fs.writeFileSync(SPECIFICATIONS_FILE, JSON.stringify(specifications, null, 2));
    } catch (error) {
      console.error('Error writing specifications:', error);
    }
  }
};
