'use client';

import { useState, useEffect } from 'react';
import { ScheduleItem } from '../types';
import { differenceInMinutes, parse } from 'date-fns';
import { Clock } from '@/components/shared/Clock';

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
        return 'bg-emerald-100/70 hover:bg-emerald-100 border-l-4 border-emerald-500'; // Green: Ingreso habilitado (-7 min)
      } else if (diffMins <= 0 && diffMins >= -7) {
        return 'bg-amber-100/70 hover:bg-amber-100 border-l-4 border-amber-500'; // Orange: Iniciando ahora (0-7 min)
      } else if (diffMins < -7) {
        return 'bg-red-100/70 hover:bg-red-100 border-l-4 border-red-500'; // Red: En curso o finalizada
      }
      return 'bg-white hover:bg-gray-50 border-l-4 border-transparent'; // Future
    } catch (e) {
      return 'bg-white border-l-4 border-transparent';
    }
  };

  // Adaptive Density Logic
  const rowCount = todaySchedule.length;
  const getAdaptiveClasses = () => {
    if (rowCount >= 9) {
      return {
        headerPad: 'p-1.5 pl-4',
        headerText: 'text-[11px]',
        rowPad: 'p-1.5 pl-3',
        rowText: 'text-[12px]',
        gap: 'gap-1',
      };
    } else if (rowCount === 8) {
      return {
        headerPad: 'p-2 pl-5',
        headerText: 'text-xs',
        rowPad: 'p-2 pl-4',
        rowText: 'text-[13px]',
        gap: 'gap-2',
      };
    } else if (rowCount === 7) {
      return {
        headerPad: 'p-3 pl-6',
        headerText: 'text-[13px]',
        rowPad: 'p-3 pl-5',
        rowText: 'text-[14px]',
        gap: 'gap-3',
      };
    } else {
      return {
        headerPad: 'p-4 pl-8',
        headerText: 'text-sm',
        rowPad: 'p-4 pl-6',
        rowText: 'text-[15px]',
        gap: 'gap-4',
      };
    }
  };

  const density = getAdaptiveClasses();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-8 flex-1 flex flex-col justify-center overflow-hidden pb-4">
      <Clock rowCount={rowCount} />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col shrink-0">
        {/* Table Header */}
        <div className={`bg-[#232845] text-white grid grid-cols-[120px_1.5fr_1.5fr_1.5fr_100px_1.5fr] font-semibold tracking-wider ${density.gap} ${density.headerPad} ${density.headerText}`}>
          <div>DÍA</div>
          <div>MATERIA</div>
          <div>PROFESOR</div>
          <div>LABORATORIO</div>
          <div>HORA</div>
          <div>ENCARGADO</div>
        </div>

        {/* Table Body */}
        <div className="overflow-hidden bg-white">
          {todaySchedule.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 p-8 text-lg font-medium">
              No hay actividades próximas en este momento.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {todaySchedule.map((item) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-[120px_1.5fr_1.5fr_1.5fr_100px_1.5fr] items-center transition-colors text-gray-800 ${density.gap} ${density.rowPad} ${density.rowText} ${getStatusColor(item.hora)}`}
                >
                  <div className="font-semibold capitalize text-[#1e233a]">{item.dia}</div>
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-2 p-3 flex items-center justify-center gap-8 shrink-0">
        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
          <span>Ingreso habilitado (-7 min)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span>Iniciando ahora (0-7 min)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span>En curso o finalizada</span>
        </div>
      </div>
    </div>
  );
}
