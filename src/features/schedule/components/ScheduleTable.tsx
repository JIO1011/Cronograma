'use client';

import { useState, useEffect } from 'react';
import { ScheduleItem, FULL_WEEK } from '../types';
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

  const currentDayName = FULL_WEEK[currentTime.getDay()];

  const normalizeString = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Filter schedule for today, map diffMins once, and sort by time
  const todaySchedule = schedule
    .filter(item => normalizeString(item.dia) === normalizeString(currentDayName))
    .map(item => {
      try {
        const classTime = parse(item.hora, 'HH:mm', new Date());
        return { ...item, diffMins: differenceInMinutes(classTime, currentTime) };
      } catch (e) {
        return { ...item, diffMins: 9999 };
      }
    })
    .filter(item => item.diffMins >= -20 && item.diffMins <= 120)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const getStatusColor = (diffMins: number) => {
    if (diffMins > 0 && diffMins <= 7) return 'bg-green-100/90 hover:bg-green-200 border-l-[5px] border-green-600';
    if (diffMins <= 0 && diffMins >= -7) return 'bg-amber-100/70 hover:bg-amber-100 border-l-[4px] border-amber-500';
    if (diffMins < -7) return 'bg-red-100/70 hover:bg-red-100 border-l-[4px] border-red-500';
    return 'bg-white hover:bg-gray-50 border-l-4 border-transparent';
  };

  // Adaptive Density Logic
  const rowCount = todaySchedule.length;
  const getAdaptiveClasses = () => {
    if (rowCount >= 9) {
      return {
        headerPad: 'p-1.5 pl-2 md:pl-4',
        headerText: 'text-[clamp(9px,1.2vh,11px)]',
        rowPad: 'py-1 px-2 md:pl-3',
        rowText: 'text-[clamp(10px,1.5vh,12px)]',
        gap: 'gap-1',
      };
    } else if (rowCount === 8) {
      return {
        headerPad: 'p-2 pl-3 md:pl-5',
        headerText: 'text-[clamp(10px,1.5vh,12px)]',
        rowPad: 'py-1.5 px-3 md:pl-4',
        rowText: 'text-[clamp(11px,1.8vh,13px)]',
        gap: 'gap-1 md:gap-2',
      };
    } else if (rowCount === 7) {
      return {
        headerPad: 'p-2 md:p-3 pl-4 md:pl-6',
        headerText: 'text-[clamp(11px,1.8vh,13px)]',
        rowPad: 'py-2 px-4 md:pl-5',
        rowText: 'text-[clamp(12px,2vh,14px)]',
        gap: 'gap-2 md:gap-3',
      };
    } else {
      return {
        headerPad: 'p-3 md:p-4 pl-4 md:pl-8',
        headerText: 'text-[clamp(12px,2vh,14px)]',
        rowPad: 'py-2 md:py-3 px-4 md:pl-6',
        rowText: 'text-[clamp(13px,2.5vh,15px)]',
        gap: 'gap-2 md:gap-4',
      };
    }
  };

  const density = getAdaptiveClasses();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 flex-1 flex flex-col justify-start mt-2 mb-auto overflow-hidden pb-4">
      <Clock rowCount={rowCount} />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0 w-full overflow-x-auto">
        {/* Table Header */}
        <div className={`bg-[#232845] text-white grid grid-cols-[80px_1fr_1fr_1fr_80px_1fr] md:grid-cols-[120px_1.5fr_1.5fr_1.5fr_100px_1.5fr] font-semibold tracking-wider min-w-[700px] md:min-w-0 ${density.gap} ${density.headerPad} ${density.headerText}`}>
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
                  className={`grid grid-cols-[80px_1fr_1fr_1fr_80px_1fr] md:grid-cols-[120px_1.5fr_1.5fr_1.5fr_100px_1.5fr] min-w-[700px] md:min-w-0 items-center transition-colors text-gray-800 ${density.gap} ${density.rowPad} ${density.rowText} ${getStatusColor(item.diffMins)}`}
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-2 p-2 flex flex-wrap items-center justify-center gap-4 md:gap-8 shrink-0">
        <div className="flex items-center gap-2 text-[clamp(10px,1.5vh,12px)] text-gray-600 font-medium">
          <div className="w-3 h-3 rounded-full bg-green-600" />
          <span>Ingreso habilitado (-7 min)</span>
        </div>
        <div className="flex items-center gap-2 text-[clamp(10px,1.5vh,12px)] text-gray-600 font-medium">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span>Iniciando ahora (0-7 min)</span>
        </div>
        <div className="flex items-center gap-2 text-[clamp(10px,1.5vh,12px)] text-gray-600 font-medium">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span>En curso o finalizada</span>
        </div>
      </div>
    </div>
  );
}
