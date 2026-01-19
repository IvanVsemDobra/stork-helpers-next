import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://stork-helpers-api.onrender.com/api';

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function proxy(req: NextRequest, path: string[]) {
  const targetUrl = `${BACKEND_URL}/${path.join('/')}`;
  const requestHeaders = new Headers(req.headers);

  // Очищаємо небажані заголовки
  requestHeaders.delete('host');
  requestHeaders.delete('connection');
  requestHeaders.set('X-Forwarded-Proto', 'https');

  // Проксіюємо cookies з клієнта
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
      // @ts-expect-error — підтримка стрімінгу тіла запиту
      duplex: hasBody ? 'half' : undefined,
    });

    const responseData = await backendRes.arrayBuffer();

    const res = new NextResponse(responseData, {
      status: backendRes.status,
      statusText: backendRes.statusText,
    });

    // Проксіюємо заголовки (крім заборонених)
    backendRes.headers.forEach((value, key) => {
      const lowKey = key.toLowerCase();
      if (
        ![
          'content-encoding',
          'content-length',
          'transfer-encoding',
          'set-cookie',
        ].includes(lowKey)
      ) {
        res.headers.set(key, value);
      }
    });

    // Коректно проксіюємо cookies
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
  } catch (error: unknown) {
    console.error('🔴 Помилка проксі статусу задачі:', error);

    return NextResponse.json(
      {
        error: 'Не вдалося змінити статус задачі',
        details:
          error instanceof Error
            ? error.message
            : 'Невідома помилка',
      },
      { status: 502 }
    );
  }
}

// PATCH /api/tasks/[id]/status
export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  return proxy(req, ['tasks', id, 'status']);
}

