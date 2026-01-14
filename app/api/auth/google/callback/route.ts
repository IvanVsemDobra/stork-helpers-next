import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const codeParam = searchParams.get('code')

  if (!codeParam) {
    return NextResponse.redirect(new URL('/auth/login?error=google', req.url))
  }

  try {
    // 1️⃣ Обмін code → token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code: codeParam,
        grant_type: 'authorization_code',
        redirect_uri: new URL('/api/auth/google/callback', req.url).toString(),
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed')
    }

    const tokenData = await tokenResponse.json()

    // 2️⃣ Отримання профілю користувача ✅
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Google user profile')
    }

    const googleUser = await userResponse.json()

    console.log('Google user:', googleUser)

    // 3️⃣ Тут має бути:
    // - реєстрація або логін
    // - створення сесії / cookie

    const response = NextResponse.redirect(new URL('/', req.url))

    response.cookies.set('auth', 'true', {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (error) {
    console.error('Google OAuth error:', error)

    return NextResponse.redirect(new URL('/auth/login?error=google', req.url))
  }
}
