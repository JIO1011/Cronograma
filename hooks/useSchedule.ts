import { useState, useEffect, useCallback } from 'react';
import { ScheduleItem } from '@/lib/types';

export function useSchedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchSchedule = useCallback(async () => {
    try {
      const res = await fetch('/api/horarios');
      if (res.ok) {
        const data = await res.json();
        setSchedule(data);
      }
    } catch (e) {
      console.error('Failed to fetch schedule', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();

    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchSchedule();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchSchedule]);

  const saveSchedule = async (newSchedule: ScheduleItem[]) => {
    try {
      const res = await fetch('/api/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule),
      });
      
      if (res.ok) {
        setSchedule(newSchedule);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to save schedule', e);
      return false;
    }
  };

  const addDaySchedule = async (day: string, items: Omit<ScheduleItem, 'id' | 'dia'>[]) => {
    const newItems: ScheduleItem[] = items.map((item, index) => ({
      ...item,
      id: `${day}-${Date.now()}-${index}`,
      dia: day,
    }));

    const filteredSchedule = schedule.filter((item) => item.dia !== day);
    const updatedSchedule = [...filteredSchedule, ...newItems];
    
    return await saveSchedule(updatedSchedule);
  };

  const clearSchedule = async () => {
    return await saveSchedule([]);
  };

  return {
    schedule,
    isLoaded,
    addDaySchedule,
    clearSchedule,
    saveSchedule,
    refreshSchedule: fetchSchedule
  };
}
