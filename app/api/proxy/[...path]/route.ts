import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stork-helpers-api.onrender.com/api';

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

async function proxy(req: NextRequest, path: string[]) {
  const targetUrl = `${BACKEND_URL}/${path.join('/')}`;
  
  // Копіюємо всі заголовки з оригінального запиту
  const requestHeaders = new Headers(req.headers);

  requestHeaders.delete('host');
  requestHeaders.delete('connection');
  requestHeaders.set('X-Forwarded-Proto', 'https');

  // Перевіряємо, чи бачить проксі куки взагалі
  const rawCookies = req.headers.get('cookie');
  if (rawCookies) {
    requestHeaders.set('cookie', rawCookies);
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers: requestHeaders,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer(),
      cache: 'no-store',
      // @ts-ignore
      duplex: 'half',
    });

    // ... (решта коду обробки Set-Cookie, який ви вже мали, він правильний)
    const responseData = await backendRes.arrayBuffer();
    const res = new NextResponse(responseData, {
      status: backendRes.status,
      statusText: backendRes.statusText,
    });

    // Обов'язково додаємо обробку Set-Cookie
    const setCookies = backendRes.headers.getSetCookie();
    setCookies.forEach(cookie => {
      const cleanCookie = cookie
        .replace(/Domain=[^;]+;?/, '')
        .replace(/Secure;?/, '')
        .replace(/SameSite=None/gi, 'SameSite=Lax')
        .trim();
      
      const finalCookie = cleanCookie.includes('Path=') 
        ? cleanCookie.replace(/Path=[^;]+/, 'Path=/')
        : `${cleanCookie}; Path=/`;

      res.headers.append('Set-Cookie', finalCookie);
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Proxy failed' }, { status: 502 });
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) { return proxy(req, (await params).path); }
export async function POST(req: NextRequest, { params }: RouteParams) { return proxy(req, (await params).path); }
export async function PATCH(req: NextRequest, { params }: RouteParams) { return proxy(req, (await params).path); }
export async function PUT(req: NextRequest, { params }: RouteParams) { return proxy(req, (await params).path); }
export async function DELETE(req: NextRequest, { params }: RouteParams) { return proxy(req, (await params).path); }