'use client'

import { useAuthStore } from '@/store/auth.store'
import styles from './GreetingBlock.module.scss'

export const GreetingBlock = () => {
  const user = useAuthStore(state => state.user)

  return (
    <section className={styles.block}>
      <h2 className={styles.title}>
        Вітаю
        {user?.name && (
          <>
            , <span className={styles.name}>{user.name}</span>
          </>
        )}
        !
      </h2>
    </section>
  )
}
