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
    if (isEmpty) return { pt: 'py-[10vh] md:py-[15vh]', time: 'text-[clamp(5rem,35vh,220px)]', date: 'text-[clamp(1.5rem,8vh,54px)]', mt: 'mt-[4vh]' };
    
    if (rowCount >= 10) return { pt: 'py-[0.2vh]', time: 'text-[clamp(2rem,7vh,70px)]', date: 'text-[clamp(0.7rem,1.5vh,16px)]', mt: 'mt-0' };
    if (rowCount >= 8) return { pt: 'py-[0.5vh]', time: 'text-[clamp(2.5rem,12vh,90px)]', date: 'text-[clamp(0.8rem,2vh,20px)]', mt: 'mt-0' };
    if (rowCount >= 6) return { pt: 'py-[1vh]', time: 'text-[clamp(3.5rem,18vh,120px)]', date: 'text-[clamp(1.1rem,2.5vh,24px)]', mt: 'mt-0' };
    if (rowCount >= 4) return { pt: 'py-[2vh]', time: 'text-[clamp(4.5rem,24vh,140px)]', date: 'text-[clamp(1.3rem,3vh,28px)]', mt: 'mt-[1vh]' };
    if (rowCount >= 2) return { pt: 'py-[3vh]', time: 'text-[clamp(5.5rem,28vh,160px)]', date: 'text-[clamp(1.5rem,4vh,36px)]', mt: 'mt-[1.5vh]' };
    
    return { pt: 'py-[4vh]', time: 'text-[clamp(6rem,32vh,200px)]', date: 'text-[clamp(1.8rem,5vh,44px)]', mt: 'mt-[2vh]' };
  };

  const scale = getClockScale();

  return (
    <div className={`flex flex-col items-center justify-center shrink-0 transition-all duration-500 ${scale.pt}`}>
      <div 
        suppressHydrationWarning
        className={`${scale.time} font-bold text-[#1a1d2d] leading-none tracking-tight font-sans transition-all duration-500`}
      >
        {mounted ? format(time, 'HH:mm:ss') : '--:--:--'}
      </div>
      <div 
        suppressHydrationWarning
        className={`${scale.date} text-[#6b7280] font-medium ${scale.mt} capitalize transition-all duration-500`}
      >
        {mounted ? format(time, "EEEE, d 'de' MMMM", { locale: es }) : 'Cargando...'}
      </div>
    </div>
  );
}
