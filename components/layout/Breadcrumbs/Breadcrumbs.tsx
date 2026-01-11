'use client'

import { usePathname, useParams } from 'next/navigation'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { DiaryEntry } from '@/interfaces/diary'
import styles from './Breadcrumbs.module.scss'

const routeMap: Record<string, string> = {
  '': 'Мій день',
  journey: 'Подорож',
  diary: 'Щоденник',
  profile: 'Профіль',
  auth: 'Авторизація',
  login: 'Вхід',
  register: 'Реєстрація',
  // Add other route mappings as needed
}

export const Breadcrumbs = () => {
  const pathname = usePathname()
  const params = useParams()
  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null)
  const entryIdFromUrl = params.entryId as string
  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchEntryTitle = async () => {
      if (entryIdFromUrl && pathname.includes('/diary/')) {
        try {
          const { data } = await axios.get<DiaryEntry[]>(`${API_BASE}/api/diaries/me`, {
            withCredentials: true,
          })
          const currentEntry = data.find((e: DiaryEntry) => e._id === entryIdFromUrl)
          if (currentEntry) {
            setDynamicTitle(currentEntry.title)
          }
        } catch (error) {
          console.error('Breadcrumbs: помилка завантаження заголовка', error)
        }
      } else {
        setDynamicTitle(null)
      }
    }

    fetchEntryTitle()
  }, [entryIdFromUrl, pathname, API_BASE])

  const isAuthPage = pathname?.startsWith('/auth')
  if (isAuthPage) return null

  const pathSegments = pathname?.split('/').filter(Boolean) || []

  const breadcrumbs = [
    { label: routeMap[''] || 'Мій день', href: '/' },
    ...pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`

      let label = routeMap[segment] || segment

      if (segment === entryIdFromUrl && dynamicTitle) {
        label = dynamicTitle
      }

      return { label, href }
    }),
  ]

  return (
    <div className={styles.breadcrumbs}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1
        return (
          <Fragment key={crumb.href}>
            {index > 0 && <span className={styles.separator}>/</span>}
            {isLast ? (
              <span className={styles.current}>{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className={styles.link}>
                {crumb.label}
              </Link>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
