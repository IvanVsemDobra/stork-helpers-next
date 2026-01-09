'use client'

import React, { useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import styles from './add-diary-entry-modal.module.scss'

interface AddDiaryEntryModalProps {
  isOpen?: boolean
  onClose: () => void
  isEdit?: boolean
}

export const AddDiaryEntryModal: React.FC<AddDiaryEntryModalProps> = ({
  isOpen = true,
  onClose,
  isEdit = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <CloseOutlined />
        </button>

        <h2 className={styles.title}>
          {isEdit ? 'Редагувати запис' : 'Новий запис'}
        </h2>
      </div>
    </div>
  );
}