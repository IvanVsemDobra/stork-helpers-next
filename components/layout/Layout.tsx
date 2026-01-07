'use client'

import { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* Header */}
      {/* Sidebar */}
      {/* Breadcrumbs */}
      <main>{children}</main>
    </div>
  )
}