// 'use client'

// import Image from 'next/image'

// import Link from 'next/link'
// import styles from './Header.module.scss'
// import { MenuOutlined } from '@ant-design/icons'
// import { useUiStore } from '@/store/ui.store'
// import { usePathname } from 'next/navigation'
// import { useAuthStore } from '@/store/auth.store'
// import { logout } from '@/utils/logout'

// export const Header = () => {
//   const { openBurgerMenu } = useUiStore()
//   const pathname = usePathname()

//   const user = useAuthStore(s => s.user)
//   const isAuthenticated = useAuthStore(s => s.isAuthenticated)
//   const hydrated = useAuthStore(s => s.hydrated)

//   const isAuthPage = pathname?.startsWith('/auth')
//   if (isAuthPage) return null

//   if (!hydrated) return null

//   return (
//     <header className={styles.header}>
//       <Link href="/" className={styles.header__logo}>
//         <Image src="/logo.svg" alt="Stork Helpers Logo" width={40} height={40} />
//         <span>Лелека</span>
//       </Link>
//       <div className={styles.header__right}>
//         {isAuthenticated ? (
//           <>
//             {user?.avatar && (
//               <Image
//                 src={user.avatar}
//                 alt={user.email}
//                 width={32}
//                 height={32}
//                 className={styles.header__avatar}
//               />
//             )}

//             <button onClick={logout} className={styles.header__logout}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <Link href="/auth/login" className={styles.header__login}>
//             Увійти
//           </Link>
//         )}

//         <button className={styles.header__burger} onClick={openBurgerMenu}>
//           <MenuOutlined />
//         </button>
//       </div>
//     </header>
//   )
// }
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { MenuOutlined } from '@ant-design/icons'

import styles from './Header.module.scss'
import { useUiStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { AuthService } from '@/services/auth.service'

export const Header = () => {
  const router = useRouter()
  const pathname = usePathname()

  const openBurgerMenu = useUiStore(s => s.openBurgerMenu)

  const user = useAuthStore(s => s.user)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const hydrated = useAuthStore(s => s.hydrated)
  const setUser = useAuthStore(s => s.setUser)

  // ❗ не показуємо Header на auth-сторінках
  const isAuthPage = pathname?.startsWith('/auth')
  if (isAuthPage) return null

  // ❗ чекаємо hydration
  if (!hydrated) return null

  const handleLogout = async () => {
    try {
      await AuthService.logout()
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      // 🔑 очищаємо фронтовий стан
      setUser(null)
      router.replace('/auth/login')
    }
  }

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.header__logo}>
        <Image src="/logo.svg" alt="Leleka logo" width={40} height={40} priority />
        <span>Лелека</span>
      </Link>

      <div className={styles.header__right}>
        {isAuthenticated && user ? (
          <div className={styles.header__user}>
            {user.avatar && (
              <Image
                src={user.avatar}
                alt={user.email}
                width={32}
                height={32}
                className={styles.header__avatar}
              />
            )}

            <button onClick={handleLogout} className={styles.header__logout} type="button">
              Вийти
            </button>
          </div>
        ) : (
          <Link href="/auth/login" className={styles.header__login}>
            Увійти
          </Link>
        )}

        <button className={styles.header__burger} onClick={openBurgerMenu} aria-label="Open menu">
          <MenuOutlined />
        </button>
      </div>
    </header>
  )
}
