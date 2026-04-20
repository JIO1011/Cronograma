'use client';

import { useState, useEffect } from 'react';
import { DayOfWeek, ScheduleItem } from '../types';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AdminCSVUploader } from './AdminCSVUploader';
import { AdminEditorTable } from './AdminEditorTable';

const DAYS: DayOfWeek[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

interface AdminClientProps {
  initialSchedule: ScheduleItem[];
}

export function AdminClient({ initialSchedule }: AdminClientProps) {
  const router = useRouter();
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Lunes');

  // Default to today
  useEffect(() => {
    const today = new Date().getDay();
    const daysMap: DayOfWeek[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    if (today > 0 && today < 6) {
      setSelectedDay(daysMap[today] as DayOfWeek);
    }
  }, []);

  // Sync initialSchedule updates
  useEffect(() => {
    setSchedule(initialSchedule);
  }, [initialSchedule]);

  const handleLogout = () => {
    document.cookie = 'admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  const currentDaySchedule = schedule.filter(s => s.dia === selectedDay);

  return (
    <div className="min-h-screen bg-[#f4f5f7] p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#232845] p-6 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">Administración de Horarios</h1>
          <div className="flex items-center gap-6">
            <button onClick={() => router.push('/')} className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors text-sm">
              <ArrowLeft size={16} /> Volver
            </button>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors text-sm">
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Selecciona el Día</h2>
            <div className="flex flex-wrap gap-3">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedDay === day 
                      ? 'bg-[#5b4cfa] text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedDay === day 
                      ? 'bg-[#5b4cfa] text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Input */}
            <AdminCSVUploader selectedDay={selectedDay} />

            {/* Right: Preview */}
            <AdminEditorTable currentDaySchedule={currentDaySchedule} selectedDay={selectedDay} />
          </div>
        </div>
      </div>
    </div>
  );
}
