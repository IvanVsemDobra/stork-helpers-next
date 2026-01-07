'use client';

import { Drawer } from 'antd';
import { useUiStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeOutlined,
    HeartOutlined,
    BookOutlined,
    UserOutlined
} from '@ant-design/icons';
import styles from './BurgerMenu.module.scss';
import { UserBar } from '../UserBar/UserBar';
import { AuthBar } from '../AuthBar/AuthBar';

const NAV_ITEMS = [
    { label: 'Мій день', href: '/', icon: <HomeOutlined /> },
    { label: 'Подорож', href: '/journey', icon: <HeartOutlined /> },
    { label: 'Щоденник', href: '/diary', icon: <BookOutlined /> },
    { label: 'Профіль', href: '/profile', icon: <UserOutlined /> },
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
                        {item.icon}
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
