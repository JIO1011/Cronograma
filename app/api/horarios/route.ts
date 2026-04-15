import { NextResponse } from 'next/server';
import { getSchedule, setSchedule } from '@/lib/store';
import { cookies } from 'next/headers';

export async function GET() {
  return NextResponse.json(getSchedule());
}

export async function POST(request: Request) {
  // Simple auth check
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_auth');
  
  if (authCookie?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (Array.isArray(body)) {
      setSchedule(body);
      return NextResponse.json({ success: true, count: body.length });
    }
    return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
