'use client';

import { Drawer } from 'antd';
import { useUiStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './BurgerMenu.module.scss';
import { UserBar } from '../UserBar/UserBar';
import { AuthBar } from '../AuthBar/AuthBar';

const NAV_ITEMS = [
    { label: 'Мій день', href: '/', icon: '/icons/calendar.svg' },
    { label: 'Подорож', href: '/journey', icon: '/icons/journey.svg' },
    { label: 'Щоденник', href: '/diary', icon: '/icons/diary.svg' },
    { label: 'Профіль', href: '/profile', icon: '/icons/profile.svg' },
];

export const BurgerMenu = () => {
    const { isBurgerMenuOpen, closeBurgerMenu } = useUiStore();
    const { user } = useAuthStore();
    const pathname = usePathname();

    return (
        <Drawer
            title="Меню"
            placement="left"
            onClose={closeBurgerMenu}
            open={isBurgerMenuOpen}
            width={280}
        >
            <nav className={styles.nav}>
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={user ? item.href : '/auth/login'}
                        className={`${styles.link} ${pathname === item.href ? styles.active : ''}`}
                        onClick={closeBurgerMenu}
                    >
                        <Image src={item.icon} alt={item.label} width={24} height={24} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className={styles.footer}>
                {user ? <UserBar /> : <AuthBar />}
            </div>
        </Drawer>
    );
};
