import { NextResponse } from 'next/server';
import { USERS } from '@/lib/mock-data';
import type { User } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
      // In a real app, you would create a session/JWT here.
      // For this prototype, we'll just return success and user info.
      const userToReturn: Partial<User> = { id: user.id, username: user.username, role: user.role };
      return NextResponse.json({ success: true, user: userToReturn });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'An internal server error occurred' }, { status: 500 });
  }
}
