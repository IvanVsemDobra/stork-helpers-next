'use client';

import { useAuthStore } from '@/store/auth.store';
import { AuthService } from '@/services/auth.service';
import { Button, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './UserBar.module.scss';
// Note: Created a separate scss file for modularity, will create content shortly.

export const UserBar = () => {
    const { user, setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await AuthService.logout();
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className={styles.userBar}>
            <div className={styles.userBar__info}>
                <Avatar icon={<UserOutlined />} />
                <div className={styles.userBar__details}>
                    <span className={styles.userBar__name}>{user.name}</span>
                    <span className={styles.userBar__email}>{user.email}</span>
                </div>
            </div>
            <Button
                type="text"
                icon={<LogoutOutlined />}
                loading={isLoading}
                onClick={handleLogout}
                danger
            >
                Вихід
            </Button>
        </div>
    );
};
