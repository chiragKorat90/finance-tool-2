import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || 'unknown';
    const sessionId = request.cookies.get('session_id')?.value || 'unknown';
    const userAgent = request.headers.get('user-agent') || '-';

    const logData = {
      event_type: 'client_event',
      timestamp: new Date().toISOString(),
      ip,
      session_id: sessionId,
      user_agent: userAgent,
      js_verified: true,
      client_event_type: data.type || 'unknown',
      url: data.url || '-',
    };

    console.log('[TRAFFIC_LOG_CLIENT]', JSON.stringify(logData));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
