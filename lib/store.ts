import { ScheduleItem } from './types';

// In-memory store for the schedule. 
// In a production environment with multiple instances, this should be replaced by a database (like Firebase, Postgres, or Redis).
// For a single Cloud Run instance, this will persist until the container restarts.
let globalSchedule: ScheduleItem[] = [];

export const getSchedule = () => globalSchedule;

export const setSchedule = (newSchedule: ScheduleItem[]) => {
  globalSchedule = newSchedule;
};
