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
