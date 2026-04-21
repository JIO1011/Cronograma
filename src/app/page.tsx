import { Settings2 } from 'lucide-react';
import { ScheduleTable } from '@/features/schedule/components/ScheduleTable';
import { fetchScheduleAction } from '@/features/schedule/actions';
import Link from 'next/link';

export default async function Home() {
  // Fetch logic executed entirely on the server
  const schedule = await fetchScheduleAction();

  return (
    <div className="min-h-screen h-screen bg-[#f4f5f7] flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-[1vh] md:py-2 px-4 md:px-6 flex items-center justify-between shrink-0 shadow-sm z-10 relative [@media(max-height:400px)]:hidden">
        <div className="flex items-center gap-4 w-1/3">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images.png" 
              alt="Logo Universidad Politécnica Salesiana" 
              className="h-8 md:h-12 w-auto object-contain [@media(max-height:550px)]:h-6" 
            />
          </div>
        </div>

        <div className="w-1/3 flex justify-center">
          <h1 className="text-sm md:text-xl font-bold text-[#1e233a] truncate px-2">
            Horarios Prácticas de Laboratorio
          </h1>
        </div>

        <div className="w-1/3 flex justify-end">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-1.5 bg-[#5b4cfa] hover:bg-[#4a3ce0] text-white rounded-lg transition-colors font-medium shadow-sm text-sm"
          >
            <Settings2 size={16} />
            Administrar
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-0">
        <ScheduleTable schedule={schedule} />
      </main>

      {/* Footer */}
      <footer className="bg-[#232845] text-gray-300 py-[0.5vh] md:py-3 text-center text-[10px] md:text-xs shrink-0 font-medium [@media(max-height:450px)]:hidden">
        © 2025 JIO - Sistema de Horarios UPS
      </footer>
    </div>
  );
}
