export interface ScheduleItem {
  id: string;
  dia: string;
  materia: string;
  profesor: string;
  laboratorio: string;
  hora: string;
  encargado: string;
}

export type DayOfWeek = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';

export const FULL_WEEK: DayOfWeek[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
export const WORKING_DAYS: DayOfWeek[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
