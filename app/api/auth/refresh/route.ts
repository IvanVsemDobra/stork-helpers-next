import { NextRequest, NextResponse } from 'next/server'
import { api } from '../../../../services/api'
import setCookie from 'set-cookie-parser'
import { isAxiosError } from 'axios'

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
    const body = await req.json()
    const cookieHeader = req.headers.get('cookie') || ''

    console.log('📩 Отримані дані реєстрації:', body)

    const apiRes = await api.post('/auth/register', body, {
      headers: {
        cookie: cookieHeader,
      },
      withCredentials: true,
      validateStatus: () => true,
    })

    console.log('📤 Відповідь бекенду:', apiRes.data)

    const res = NextResponse.json(apiRes.data, {
      status: apiRes.status,
    })

    const setCookieHeader = apiRes.headers['set-cookie']

    if (setCookieHeader) {
      const cookies = setCookie.parse(setCookieHeader)

      cookies.forEach(cookie => {
        if (!cookie.name || cookie.value === undefined) return

        res.cookies.set(cookie.name, cookie.value, {
          path: cookie.path ?? '/',
          httpOnly: cookie.httpOnly,
          secure: cookie.secure ?? process.env.NODE_ENV === 'production',
          sameSite: normalizeSameSite(cookie.sameSite) ?? 'lax',
          maxAge: cookie.maxAge,
          expires: cookie.expires,
          domain: cookie.domain,
        })
      })
    }

    return res
  } catch (error) {
    console.error('🔴 Помилка проксі реєстрації:', error)

    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Помилка під час реєстрації',
        },
        { status: error.response?.status ?? 500 }
      )
    }

    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
}