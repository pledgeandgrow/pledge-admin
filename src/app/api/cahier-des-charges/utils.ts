import { SpecificationType } from '@/components/informatique/cahier-des-charges/types';
import * as fs from 'fs';
import * as path from 'path';

export const SPECIFICATIONS_FILE = path.join(process.cwd(), 'data', 'cahier-des-charges.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(SPECIFICATIONS_FILE))) {
  fs.mkdirSync(path.dirname(SPECIFICATIONS_FILE), { recursive: true });
}

// Ensure the specifications file exists
if (!fs.existsSync(SPECIFICATIONS_FILE)) {
  fs.writeFileSync(SPECIFICATIONS_FILE, '[]', 'utf-8');
}

// Helper functions
export const readSpecifications = (): SpecificationType[] => {
  try {
    const data = fs.readFileSync(SPECIFICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading specifications:', error);
    return [];
  }
};

export const writeSpecifications = (specifications: SpecificationType[]) => {
  try {
    fs.writeFileSync(SPECIFICATIONS_FILE, JSON.stringify(specifications, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing specifications:', error);
    throw new Error('Failed to write specifications');
  }
};
