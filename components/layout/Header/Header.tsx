'use client';

import Link from 'next/link';
import styles from './Header.module.scss';
import { MenuOutlined } from '@ant-design/icons';
import { useUiStore } from '@/store/ui.store';
import { usePathname } from 'next/navigation';

export const Header = () => {
    const { openBurgerMenu } = useUiStore();
    const pathname = usePathname();

    const isAuthPage = pathname?.startsWith('/auth');
    if (isAuthPage) return null;

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.header__logo}>
                Stork Helpers
            </Link>

            <button className={styles.header__burger} onClick={openBurgerMenu}>
                <MenuOutlined />
            </button>
        </header>
    );
};
