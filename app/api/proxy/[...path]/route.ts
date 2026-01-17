import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stork-helpers-api.onrender.com/api';

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

async function proxy(req: NextRequest, path: string[]) {
  const targetUrl = `${BACKEND_URL}/${path.join('/')}`;
  const requestHeaders = new Headers(req.headers);

  requestHeaders.delete('host');
  requestHeaders.delete('connection');

  //+added 2 lines
  const cookieStore = await cookies();
  requestHeaders.set('cookie', cookieStore.toString());

  try {
    const body = ['GET', 'HEAD'].includes(req.method)
      ? undefined
      : await req.arrayBuffer();

    console.log(`🚀 Proxying ${req.method} to: ${targetUrl}`);

    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers: requestHeaders,
      body,
      cache: 'no-store',
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
    console.error('🔴 Proxy Error Detail:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown proxy error';

    return NextResponse.json(
      { error: 'Proxy failed', details: errorMessage },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  return proxy(req, resolvedParams.path);
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  return proxy(req, resolvedParams.path);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  return proxy(req, resolvedParams.path);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  return proxy(req, resolvedParams.path);
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  return proxy(req, resolvedParams.path);
}