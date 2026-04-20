import { ScheduleItem } from './types';
import fs from 'fs';
import path from 'path';

// Local storage file path (Persists across PM2 restarts)
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'horarios.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dir = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const getSchedule = (): ScheduleItem[] => {
  ensureDataDir();
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data) as ScheduleItem[];
  } catch (error) {
    console.error('Error reading schedule from file:', error);
    return [];
  }
};

export const setSchedule = (newSchedule: ScheduleItem[]) => {
  ensureDataDir();
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(newSchedule, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing schedule to file:', error);
  }
};
