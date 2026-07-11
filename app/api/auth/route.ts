import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = {
    id: `user-${Date.now()}`,
    name: body.name ?? 'Guest',
    email: body.email ?? 'guest@example.com',
    role: 'household-member',
    createdAt: new Date().toISOString(),
  };

  return Response.json({ user, token: `token-${Date.now()}` }, { status: 201 });
}
