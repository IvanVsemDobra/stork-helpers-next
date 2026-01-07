'use client';

import Image from 'next/image';

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
                <Image src="/logo.svg" alt="Stork Helpers Logo" width={40} height={40} />
                <span>Лелека</span>
            </Link>

            <button className={styles.header__burger} onClick={openBurgerMenu}>
                <MenuOutlined />
            </button>
        </header>
    );
};
