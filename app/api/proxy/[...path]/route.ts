import { NextRequest, NextResponse } from 'next/server'
import { api } from '@/services/api'
import { isAxiosError } from 'axios'

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params.path)
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params.path)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params.path)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params.path)
}

// --------------------

async function proxyRequest(req: NextRequest, path: string[]) {
  try {
    const url = '/' + path.join('/')

    const body =
      req.method === 'GET' || req.method === 'DELETE'
        ? undefined
        : await req.json()

    const apiRes = await api.request({
      url,
      method: req.method,
      data: body,
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    })

    const res = NextResponse.json(apiRes.data, {
      status: apiRes.status,
    })

    // прокидуємо set-cookie (refresh flow)
    const setCookie = apiRes.headers['set-cookie']
    if (setCookie) {
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]
      cookies.forEach(cookie =>
        res.headers.append('Set-Cookie', cookie)
      )
    }

    return res
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error ?? error.message },
        { status: error.response?.status ?? 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}