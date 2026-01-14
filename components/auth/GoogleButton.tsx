'use client'

export const GoogleButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google'
  }

  return (
    <button type="button" onClick={handleGoogleLogin}>
      Увійти через Google
    </button>
  )
}
