import { NextRequest, NextResponse } from 'next/server'
import axios, { AxiosError } from 'axios'
import setCookie from 'set-cookie-parser'

interface BackendErrorResponse {
  message?: string
  error?: string
}

const API_URL = process.env.API_URL

if (!API_URL) {
  throw new Error('API_URL is not defined')
}

function normalizeSameSite(
  sameSite?: string
): 'lax' | 'strict' | 'none' | undefined {
  if (!sameSite) return undefined

  const value = sameSite.toLowerCase()

  if (value === 'lax') return 'lax'
  if (value === 'strict') return 'strict'
  if (value === 'none') return 'none'

  return undefined
}

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie') || ''

    const apiRes = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          cookie: cookieHeader,
        },
        withCredentials: true,
        validateStatus: () => true,
      }
    )

    const res = NextResponse.json(apiRes.data, { status: apiRes.status })

    const setCookieHeader = apiRes.headers['set-cookie']

    if (setCookieHeader) {
      const cookies = setCookie.parse(setCookieHeader)

      cookies.forEach(cookie => {
        if (!cookie.name) return

        res.cookies.set(cookie.name, '', {
          path: cookie.path ?? '/',
          httpOnly: cookie.httpOnly,
          secure: cookie.secure ?? process.env.NODE_ENV === 'production',
          sameSite: normalizeSameSite(cookie.sameSite) ?? 'lax',
          maxAge: 0,
          expires: new Date(0),
          domain: cookie.domain,
        })
      })
    }

    return res
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<BackendErrorResponse>

      console.error('🔴 Logout API Error:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      })

      return NextResponse.json(
        {
          error:
            axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            axiosError.message,
        },
        { status: axiosError.response?.status ?? 500 }
      )
    }

    console.error('🔴 Unexpected Logout Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
