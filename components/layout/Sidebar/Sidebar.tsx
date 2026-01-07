'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';
import { useAuthStore } from '@/store/auth.store';
import { UserBar } from '../UserBar/UserBar';
import { AuthBar } from '../AuthBar/AuthBar';
import {
    HomeOutlined,
    HeartOutlined,
    BookOutlined,
    UserOutlined
} from '@ant-design/icons';

const NAV_ITEMS = [
    { label: 'Мій день', href: '/', icon: <HomeOutlined /> },
    { label: 'Подорож', href: '/journey', icon: <HeartOutlined /> },
    { label: 'Щоденник', href: '/diary', icon: <BookOutlined /> },
    { label: 'Профіль', href: '/profile', icon: <UserOutlined /> },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const { user } = useAuthStore();

    const isAuthPage = pathname?.startsWith('/auth');
    if (isAuthPage) return null;

    return (
        <aside className={styles.sidebar}>
            <Link href="/" className={styles.sidebar__logo}>
                Stork Helpers
            </Link>

            <nav className={styles.sidebar__nav}>
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={user ? item.href : '/auth/login'}
                        className={`${styles.sidebar__link} ${pathname === item.href ? styles.active : ''}`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className={styles.sidebar__footer}>
                {user ? <UserBar /> : <AuthBar />}
            </div>
        </aside>
    );
};
