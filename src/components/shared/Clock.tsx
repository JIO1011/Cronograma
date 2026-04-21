'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClockProps {
  rowCount?: number;
}

export function Clock({ rowCount = 0 }: ClockProps) {
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

  const isEmpty = rowCount === 0;

  const getClockScale = () => {
    if (isEmpty) return { pt: 'py-6 md:py-12 lg:py-16', time: 'text-[clamp(4rem,15vh,180px)]', date: 'text-[clamp(1.5rem,4vh,46px)]', mt: 'mt-4' };
    if (rowCount >= 9) return { pt: 'py-1 md:py-2', time: 'text-[clamp(2.5rem,8vh,85px)]', date: 'text-[clamp(1rem,2vh,20px)]', mt: 'mt-0' };
    if (rowCount === 8) return { pt: 'py-2 md:py-3', time: 'text-[clamp(3rem,9vh,110px)]', date: 'text-[clamp(1.2rem,2.5vh,24px)]', mt: 'mt-1' };
    if (rowCount === 7) return { pt: 'py-3 md:py-5', time: 'text-[clamp(3.5rem,10vh,125px)]', date: 'text-[clamp(1.3rem,3vh,28px)]', mt: 'mt-2' };
    return { pt: 'py-4 md:py-8', time: 'text-[clamp(4rem,12vh,140px)]', date: 'text-[clamp(1.5rem,3.5vh,32px)]', mt: 'mt-2' };
  };

  const scale = getClockScale();

  if (!mounted) {
    return (
      <div className={`flex flex-col items-center justify-center shrink-0 transition-all duration-500 ${scale.pt}`}>
        <div className={`${scale.time} font-bold text-[#1a1d2d] leading-none tracking-tight font-sans transition-all duration-500`}>
          --:--:--
        </div>
        <div className={`${scale.date} text-[#6b7280] font-medium ${scale.mt} capitalize transition-all duration-500`}>
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
    <div className={`flex flex-col items-center justify-center shrink-0 transition-all duration-500 ${scale.pt}`}>
      <div className={`${scale.time} font-bold text-[#1a1d2d] leading-none tracking-tight font-sans transition-all duration-500`}>
        {timeString}
      </div>
      <div className={`${scale.date} text-[#6b7280] font-medium ${scale.mt} transition-all duration-500`}>
        {dateString}
      </div>
    </div>
  );
}
