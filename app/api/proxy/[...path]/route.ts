import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

type ProxyContext = {
  params: Promise<{
    path: string[];
  }>;
};

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

// --------------------

async function proxy(req: NextRequest, path: string[]) {
  if (!path?.length) {
    return NextResponse.json(
      { message: 'Invalid proxy path' },
      { status: 400 }
    );
  }

  const url = `${BACKEND_URL}/${path.join('/')}`;

  const body =
    req.method === 'GET' || req.method === 'DELETE'
      ? undefined
      : await req.text();

  const backendRes = await fetch(url, {
    method: req.method,
    body,
    headers: {
      'Content-Type': 'application/json',
      cookie: req.headers.get('cookie') || '',
    },
    credentials: 'include',
  });

  const resBody = await backendRes.text();

  const res = new NextResponse(resBody, {
    status: backendRes.status,
  });

  const setCookie = backendRes.headers.get('set-cookie');
  if (setCookie) {
    res.headers.append('set-cookie', setCookie);
  }

  return res;
}