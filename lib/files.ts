import { dirname, resolve } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

const getFilePath = (path: string): string => {
  return resolve(process.cwd(), path);
};

export const saveToFile = (path: string, content: string) => {
  try {
    const fullPath = getFilePath(path);
    const dir = dirname(fullPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(fullPath, content, 'utf8');
    console.log(`File saved to ${path}`);
  } catch (error) {
    console.error(`Failed to save file to ${path}:`, error);
  }
};

export const loadFromFile = (path: string): string | null => {
  try {
    const fullPath = getFilePath(path);
    return readFileSync(fullPath, 'utf8');
  } catch (error) {
    console.error(`Failed to load file from ${path}:`, error);
    return null;
  }
};