import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProxyContext {
  params: Promise<{
    path: string[];
  }>;
}

async function proxy(req: NextRequest, path: string[]) {
  if (!BACKEND_URL) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_API_URL is missing' }, { status: 500 });
  }

  const targetUrl = `${BACKEND_URL}/${path.join('/')}`;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.delete('host');
  requestHeaders.delete('connection');
  requestHeaders.delete('accept-encoding'); 
  
  try {
    const body = ['GET', 'HEAD'].includes(req.method) 
      ? undefined 
      : await req.arrayBuffer();

    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers: requestHeaders,
      body,
      credentials: 'include',
    });

    const responseData = await backendRes.arrayBuffer();

    const res = new NextResponse(responseData, {
      status: backendRes.status,
      statusText: backendRes.statusText,
    });

    backendRes.headers.forEach((value, key) => {
      if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.headers.append(key, value);
      }
    });

    return res;
  } catch (error: unknown) {
    console.error('🔴 Proxy Error:', error);
    return NextResponse.json(
      { message: 'Proxy failed', error: error instanceof Error ? error.message : 'Unknown' },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, ctx: ProxyContext) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: ProxyContext) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PUT(req: NextRequest, ctx: ProxyContext) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function DELETE(req: NextRequest, ctx: ProxyContext) {
  const { path } = await ctx.params;
  return proxy(req, path);
}