import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // Skip static files and Next.js internal requests
  if (
    url.startsWith('/_next') ||
    url.startsWith('/api') ||
    url.match(/\.(ico|png|jpg|jpeg|svg|css|js|html)$/)
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Create or get session ID
  let sessionId = request.cookies.get('session_id')?.value;
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
  }

  // Extract IPs and Headers
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || '-';
  const referer = request.headers.get('referer') || '-';
  const method = request.method;
  const geoCountry = request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country') || 'unknown';

  // Build structured log object
  const logData = {
    event_type: 'page_request',
    timestamp: new Date().toISOString(),
    ip,
    session_id: sessionId,
    url,
    method,
    user_agent: userAgent,
    referer,
    geo_country: geoCountry,
    cookie_enabled: !!request.cookies.get('session_id'), // if they sent it back, it's enabled
  };

  // In a real production app, you might send this to a database or external logging service (like Datadog, ELK, or a custom API)
  console.log('[TRAFFIC_LOG]', JSON.stringify(logData));

  return response;
}
