'use client'

import Image from 'next/image'

import Link from 'next/link'
import styles from './Header.module.scss'
import { MenuOutlined } from '@ant-design/icons'
import { useUiStore } from '@/store/ui.store'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { logout } from '@/utils/logout'

export const Header = () => {
  const { openBurgerMenu } = useUiStore()
  const pathname = usePathname()

  const user = useAuthStore(s => s.user)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const hydrated = useAuthStore(s => s.hydrated)

  const isAuthPage = pathname?.startsWith('/auth')
  if (isAuthPage) return null

  if (!hydrated) return null

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.header__logo}>
        <Image src="/logo.svg" alt="Stork Helpers Logo" width={40} height={40} />
        <span>Лелека</span>
      </Link>
      <div className={styles.header__right}>
        {isAuthenticated ? (
          <>
            {user?.avatar && (
              <Image
                src={user.avatar}
                alt={user.email}
                width={32}
                height={32}
                className={styles.header__avatar}
              />
            )}

            <button onClick={logout} className={styles.header__logout}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth/login" className={styles.header__login}>
            Увійти
          </Link>
        )}

        <button className={styles.header__burger} onClick={openBurgerMenu}>
          <MenuOutlined />
        </button>
      </div>
    </header>
  )
}
