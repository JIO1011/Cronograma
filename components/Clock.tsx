'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function Clock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center pt-16 pb-8">
        <div className="text-[160px] font-bold text-[#1a1d2d] leading-none tracking-tight font-sans">
          --:--:--
        </div>
        <div className="text-[40px] text-[#6b7280] font-medium mt-4 capitalize">
          Cargando...
        </div>
      </div>
    );
  }

  // Format: 12:23:33
  const timeString = format(time, 'HH:mm:ss');
  
  // Format: Miércoles, 15 De Abril De 2026
  const rawDateString = format(time, "EEEE, d 'De' MMMM 'De' yyyy", { locale: es });
  const dateString = rawDateString.replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-12 shrink-0">
      <div className="text-[160px] font-bold text-[#1a1d2d] leading-none tracking-tight font-sans">
        {timeString}
      </div>
      <div className="text-[40px] text-[#6b7280] font-medium mt-4">
        {dateString}
      </div>
    </div>
  );
}
