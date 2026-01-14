import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: new URL('/api/auth/google/callback', req.url).toString(),
    response_type: 'code',
    scope: 'openid email profile',
  })

  const googleAuthURL = 'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString()

  return NextResponse.redirect(googleAuthURL)
}
