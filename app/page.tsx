'use client';

import { Settings2, Globe } from 'lucide-react';
import { Clock } from '@/components/Clock';
import { ScheduleTable } from '@/components/ScheduleTable';
import { useSchedule } from '@/hooks/useSchedule';

export default function Home() {
  const { schedule, isLoaded } = useSchedule();

  if (!isLoaded) {
    return <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen h-screen bg-[#f4f5f7] flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-4 w-1/3">
          {/* Logo Placeholder */}
          <div className="flex items-center gap-2">
            <div className="text-[#003b7a]">
              <Globe size={40} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[#003b7a] font-bold text-[10px] leading-none tracking-wider">UNIVERSIDAD POLITÉCNICA</span>
              <span className="text-[#003b7a] font-black text-2xl leading-none tracking-tight">SALESIANA</span>
              <span className="text-[#003b7a] text-[8px] leading-none text-right tracking-widest mt-0.5">ECUADOR</span>
            </div>
          </div>
        </div>

        <div className="w-1/3 flex justify-center">
          <h1 className="text-2xl font-bold text-[#1e233a]">
            Horarios Prácticas de Laboratorio
          </h1>
        </div>

        <div className="w-1/3 flex justify-end">
          <button
            onClick={() => window.open('/admin', '_blank')}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#5b4cfa] hover:bg-[#4a3ce0] text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            <Settings2 size={18} />
            Administrar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-0">
        <Clock />
        <ScheduleTable schedule={schedule} />
      </main>

      {/* Footer */}
      <footer className="bg-[#232845] text-gray-300 py-5 text-center text-sm shrink-0">
        © 2025 JIO - Sistema de Horarios UPS
      </footer>
    </div>
  );
}
