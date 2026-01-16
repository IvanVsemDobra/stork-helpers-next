'use client'

import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import styles from './styles.module.css'

const antIcon = <LoadingOutlined style={{ fontSize: 48, color: '#FEF1DB' }} spin />

export default function Loading() {
  return (
    <div className={styles.loaderContainer}>
      <Spin indicator={antIcon} tip="Завантажуємо запис..." />
    </div>
  )
}
