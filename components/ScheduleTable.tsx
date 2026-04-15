'use client';

import { useState, useEffect } from 'react';
import { ScheduleItem } from '@/lib/types';
import { differenceInMinutes, parse, isToday } from 'date-fns';

interface ScheduleTableProps {
  schedule: ScheduleItem[];
}

export function ScheduleTable({ schedule }: ScheduleTableProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Update every 10 seconds for status dots
    return () => clearInterval(timer);
  }, []);

  // Get current day name in Spanish to filter
  const daysMap = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  const currentDayName = daysMap[currentTime.getDay()];

  const normalizeString = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Filter schedule for today and sort by time
  const todaySchedule = schedule
    .filter(item => normalizeString(item.dia) === normalizeString(currentDayName))
    .filter(item => {
      try {
        const classTime = parse(item.hora, 'HH:mm', new Date());
        const diffMins = differenceInMinutes(classTime, currentTime);
        // Show classes from 20 mins before they start, up to 120 mins after they start
        // Wait, if class is at 10:00 and now is 10:20, diffMins is -20.
        // If class is at 12:00 and now is 10:00, diffMins is +120.
        return diffMins >= -20 && diffMins <= 120;
      } catch (e) {
        return false;
      }
    })
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const getStatusColor = (timeStr: string) => {
    try {
      const classTime = parse(timeStr, 'HH:mm', new Date());
      // diffMins = classTime - currentTime
      // If class is at 10:00 and now is 09:55, diff is +5
      // If class is at 10:00 and now is 10:05, diff is -5
      const diffMins = differenceInMinutes(classTime, currentTime);

      if (diffMins > 0 && diffMins <= 7) {
        return 'bg-[#10b981]'; // Green: Ingreso habilitado (-7 min)
      } else if (diffMins <= 0 && diffMins >= -7) {
        return 'bg-[#f59e0b]'; // Orange: Iniciando ahora (0-7 min)
      } else if (diffMins < -7) {
        return 'bg-[#ef4444]'; // Red: En curso o finalizada
      }
      return 'bg-gray-200'; // Future
    } catch (e) {
      return 'bg-transparent';
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-8 flex-1 flex flex-col overflow-hidden pb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1">
        {/* Table Header */}
        <div className="bg-[#232845] text-white grid grid-cols-[auto_120px_1.5fr_1.5fr_1.5fr_100px_1.5fr] gap-4 p-5 text-sm font-semibold tracking-wider">
          <div className="w-8"></div> {/* Spacer for status dot */}
          <div>DÍA</div>
          <div>MATERIA</div>
          <div>PROFESOR</div>
          <div>LABORATORIO</div>
          <div>HORA</div>
          <div>ENCARGADO</div>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto flex-1 bg-white">
          {todaySchedule.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 p-8 text-lg font-medium">
              No hay actividades próximas en este momento.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {todaySchedule.map((item) => (
                <div 
                  key={item.id} 
                  className="grid grid-cols-[auto_120px_1.5fr_1.5fr_1.5fr_100px_1.5fr] gap-4 p-5 items-center hover:bg-gray-50 transition-colors text-gray-700 text-[15px]"
                >
                  <div className="w-8 flex justify-center">
                    <div className={`w-3.5 h-3.5 rounded-full ${getStatusColor(item.hora)}`} />
                  </div>
                  <div className="font-medium capitalize">{item.dia}</div>
                  <div>{item.materia}</div>
                  <div>{item.profesor}</div>
                  <div>{item.laboratorio}</div>
                  <div className="font-bold text-[#1e233a]">{item.hora}</div>
                  <div>{item.encargado}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-6 flex items-center justify-center gap-8 shrink-0">
        <div className="flex items-center gap-2 text-[15px] text-gray-600 font-medium">
          <div className="w-4 h-4 rounded-full bg-[#10b981]" />
          <span>Ingreso habilitado (-7 min)</span>
        </div>
        <div className="flex items-center gap-2 text-[15px] text-gray-600 font-medium">
          <div className="w-4 h-4 rounded-full bg-[#f59e0b]" />
          <span>Iniciando ahora (0-7 min)</span>
        </div>
        <div className="flex items-center gap-2 text-[15px] text-gray-600 font-medium">
          <div className="w-4 h-4 rounded-full bg-[#ef4444]" />
          <span>En curso o finalizada</span>
        </div>
      </div>
    </div>
  );
}
