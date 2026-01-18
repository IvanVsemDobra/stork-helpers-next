import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stork-helpers-api.onrender.com/api';

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

async function proxy(req: NextRequest, path: string[]) {
  const targetUrl = `${BACKEND_URL}/${path.join('/')}`;
  const requestHeaders = new Headers(req.headers);

  // Очищаємо заголовки хоста
  requestHeaders.delete('host');
  requestHeaders.delete('connection');
  
  // КРИТИЧНО для Render/Express: емулюємо HTTPS для коректної роботи сесій
  requestHeaders.set('X-Forwarded-Proto', 'https');

  // Передаємо куки з браузера на бекенд
  const rawCookies = req.headers.get('cookie');
  if (rawCookies) {
    requestHeaders.set('cookie', rawCookies);
  }

  try {
    const method = req.method;
    const hasBody = !['GET', 'HEAD'].includes(method);
    const body = hasBody ? await req.arrayBuffer() : undefined;

    const backendRes = await fetch(targetUrl, {
      method,
      headers: requestHeaders,
      body,
      cache: 'no-store',
      // @ts-ignore - для передачі Buffer у Next.js
      duplex: hasBody ? 'half' : undefined,
    });

    const responseData = await backendRes.arrayBuffer();
    const res = new NextResponse(responseData, {
      status: backendRes.status,
      statusText: backendRes.statusText,
    });

    // 1. Копіюємо всі заголовки крім службових
    backendRes.headers.forEach((value, key) => {
      const lowKey = key.toLowerCase();
      if (!['content-encoding', 'content-length', 'transfer-encoding', 'set-cookie'].includes(lowKey)) {
        res.headers.set(key, value);
      }
    });

    // 2. ОБРОБЛЯЄМО КУКИ (Set-Cookie)
    const setCookies = backendRes.headers.getSetCookie();
    
    setCookies.forEach(cookie => {
      // ОЧИЩЕННЯ:
      // - Видаляємо Domain (щоб браузер прив'язав до localhost)
      // - Видаляємо Secure (щоб працювало на http)
      // - Ставимо SameSite=Lax (None не працює без Secure)
      const cleanCookie = cookie
        .replace(/Domain=[^;]+;?/, '')
        .replace(/Secure;?/, '')
        .replace(/SameSite=None/gi, 'SameSite=Lax')
        .trim();
      
      // Примусово робимо куку доступною для всього сайту
      const finalCookie = cleanCookie.includes('Path=') 
        ? cleanCookie.replace(/Path=[^;]+/, 'Path=/')
        : `${cleanCookie}; Path=/`;

      res.headers.append('Set-Cookie', finalCookie);
    });

    return res;
  } catch (error: unknown) {
    console.error('🔴 Proxy Error:', error);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 502 });
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) { return proxy(req, (await params).path); }
export async function POST(req: NextRequest, { params }: RouteParams) { return proxy(req, (await params).path); }
export async function PATCH(req: NextRequest, { params }: RouteParams) { return proxy(req, (await params).path); }
export async function PUT(req: NextRequest, { params }: RouteParams) { return proxy(req, (await params).path); }
export async function DELETE(req: NextRequest, { params }: RouteParams) { return proxy(req, (await params).path); }