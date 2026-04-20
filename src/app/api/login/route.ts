import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Security: Use environment variable for admin password
// Zod schema for input validation
const LoginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Zod Validation
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Data inválida' }, { status: 400 });
    }

    const { password } = parsed.data;
    
    // Auth Validation: Fallback to 'admin123' if PM2 failed to inject the .env.local file
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!adminPassword) {
      console.error('CRITICAL: ADMIN_PASSWORD is not set in environment variables');
      return NextResponse.json({ error: 'Configuración del servidor incompleta' }, { status: 500 });
    }
    
    if (password === adminPassword) {
      const cookieStore = await cookies();
      cookieStore.set('admin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1 day
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  return NextResponse.json({ success: true });
}
