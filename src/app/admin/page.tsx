import { fetchScheduleAction } from '@/features/schedule/actions';
import { AdminClient } from '@/features/schedule/components/AdminClient';

export default async function AdminPage() {
  // Fetch initial data securely on the server
  const schedule = await fetchScheduleAction();

  return <AdminClient initialSchedule={schedule} />;
}
