'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import { Header } from './Header/Header';
import { Breadcrumbs } from './Breadcrumbs/Breadcrumbs';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import styles from './Layout.module.scss';
import { usePathname } from 'next/navigation';

export function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <div className={styles.layout}>
      <Sidebar />
      <BurgerMenu />

      <div className={isAuthPage ? styles.authContent : styles.content}>
        <Header />
        <Breadcrumbs />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
