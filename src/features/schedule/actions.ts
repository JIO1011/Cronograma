'use server';

import { z } from 'zod';
import { getSchedule, setSchedule } from './store';
import { ScheduleItem } from './types';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Schema for creating a new Schedule Item (dia and id are added by the server)
const CreateScheduleItemSchema = z.object({
  materia: z.string(),
  profesor: z.string(),
  laboratorio: z.string(),
  hora: z.string(),
  encargado: z.string(),
});

const CreateScheduleArraySchema = z.array(CreateScheduleItemSchema);

// ---------------------------------------------------------
// Helper: Authentication
// ---------------------------------------------------------
async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_auth');
  if (authCookie?.value !== 'authenticated') {
    throw new Error('Unauthorized');
  }
}

// ---------------------------------------------------------
// Helper: Error Handling
// ---------------------------------------------------------
function handleActionError(error: any) {
  if (error?.message === 'Unauthorized') {
    return { error: 'Unauthorized' };
  }
  if (error?.errors) {
    return { error: `Validation Error: ${error.errors.map((e: any) => e.message).join(', ')}` };
  }
  return { error: error.message || 'Operation failed' };
}

// ---------------------------------------------------------
// Actions
// ---------------------------------------------------------
export async function fetchScheduleAction(): Promise<ScheduleItem[]> {
  try {
    return getSchedule();
  } catch (e) {
    console.error('Error fetching schedule:', e);
    return [];
  }
}

export async function clearScheduleAction() {
  try {
    await verifyAdminAuth();
    setSchedule([]);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function addDayScheduleAction(day: string, rawItems: unknown[]) {
  try {
    await verifyAdminAuth();
    const items = CreateScheduleArraySchema.parse(rawItems);
    
    const newItems: ScheduleItem[] = items.map((item, index) => ({
      ...item,
      id: `${day}-${Date.now()}-${index}`,
      dia: day,
    }));

    const currentSchedule = getSchedule();
    const filteredSchedule = currentSchedule.filter((item) => item.dia !== day);
    const updatedSchedule = [...filteredSchedule, ...newItems];
    
    setSchedule(updatedSchedule);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function deleteScheduleItemAction(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    await verifyAdminAuth();

    const currentSchedule = getSchedule();
    const updatedSchedule = currentSchedule.filter((item) => item.id !== id);
    
    if (currentSchedule.length === updatedSchedule.length) {
      throw new Error('Item not found');
    }

    setSchedule(updatedSchedule);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateScheduleItemAction(
  id: string,
  updatedData: Partial<ScheduleItem>
): Promise<{ success?: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const validData = CreateScheduleItemSchema.parse(updatedData);

    const currentSchedule = getSchedule();
    const itemIndex = currentSchedule.findIndex((item) => item.id === id);
    
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    currentSchedule[itemIndex] = {
      ...currentSchedule[itemIndex],
      ...validData,
    };

    setSchedule(currentSchedule);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return handleActionError(error);
  }
}
