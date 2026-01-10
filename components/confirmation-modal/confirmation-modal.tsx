'use client'

import React, { useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { useLogoutRedirect } from '@/hooks/useLogoutRedirect'
import styles from './confirmation-modal.module.scss'

interface ConfirmationModalProps {
  onConfirm: () => void
  onCancel: () => void
  isOpen?: boolean
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onConfirm,
  onCancel,
  isOpen = true,
}) => {
  const { handleConfirmClick } = useLogoutRedirect(onConfirm)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onCancel}>
          <CloseOutlined />
        </button>
        <h2 className={styles.title}>Ви точно хочете вийти?</h2>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.cancel}`} onClick={onCancel}>
            Ні
          </button>
          <button className={`${styles.btn} ${styles.confirm}`} onClick={handleConfirmClick}>
            Так
          </button>
        </div>
      </div>
    </div>
  );
}
