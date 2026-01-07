'use client';

import Link from 'next/link';
import styles from './AuthBar.module.scss';
import { Button } from 'antd';

export const AuthBar = () => {
    return (
        <div className={styles.authBar}>
            <Link href="/auth/login" style={{ width: '100%' }}>
                <Button block type="default">Увійти</Button>
            </Link>
            <Link href="/auth/register" style={{ width: '100%' }}>
                <Button block type="primary">Зареєструватися</Button>
            </Link>
        </div>
    );
};
